import express from "express";
import fs from "fs";
import osmtogeojson from "osmtogeojson";
import path from "path";
import request from "request";
import xmldom from "xmldom";

import util from "./util";

const xmlParser = new xmldom.DOMParser();
const cachedRequest = require("cached-request")(request);
const cacheDirectory = path.resolve(__dirname, "../../tmp");

const NOMINATIM_URL = "http://nominatim.openstreetmap.org";
const MAPZEN_URL = "http://valhalla.mapzen.com";

if (!fs.existsSync(cacheDirectory))
{
    fs.mkdir(cacheDirectory);
}
cachedRequest.setCacheDirectory(cacheDirectory);

const router = express.Router();
router.get("/city", (req, res) => {
    const q = req.query.q;
    if (q)
    {
        const qs = {
            "format": "json",
            "accept-language": "en",
            "polygon_geojson": 1,
            "q": q
        };
        request(
            {
                url: `${NOMINATIM_URL}/search`,
                qs,
                json: true
            }, (err, response, result) => {
                const filteredResult = result.filter(item => item.osm_type === "relation" && (item.type === "city" || item.type === "administrative"))
                    .map(item => ({
                        bounds: [
                            {lat: parseFloat(item.boundingbox[0]), lng: parseFloat(item.boundingbox[2])},
                            {lat: parseFloat(item.boundingbox[1]), lng: parseFloat(item.boundingbox[3])}],
                        centerLocation: {lat: parseFloat(item.lat), lng: parseFloat(item.lon)},
                        displayName: item.display_name,
                        geoJson: item.geojson,
                        osmId: item.osm_id
                    }));
                res.send(filteredResult);
            });
    }
    else
    {
        res.status(422).end("Parameter 'q' is required.")
    }
});


router.get("/route/:tp", (req, res) => {
    request({
        url: `${MAPZEN_URL}/route?api_key=valhalla-7UikjOk&json=${req.params.tp}`,
        json: true
    }, (err, response, body) => {
        if(body.trip && body.trip.legs)
        {
            const polylines = body.trip.legs.map(leg => util.decodePolyline(leg.shape));
            if (req.query.maxage)
            {
                res.setHeader("Cache-Control", `max-age=${req.query.maxage}`);
            }
            res.send(polylines);
        }
        else {
            res.send([]);
        }
    });
});


export default router;
