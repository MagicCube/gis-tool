import express from "express";
import fs from "fs";
import osmtogeojson from "osmtogeojson";
import path from "path";
import request from "request";
import xmldom from "xmldom";

const xmlParser = new xmldom.DOMParser();
const cachedRequest = require("cached-request")(request);
const cacheDirectory = path.resolve(__dirname, "../../tmp");

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
            "q": q
        };
        request(
            {
                url: `http://nominatim.openstreetmap.org/search`,
                qs,
                json: true
            }, (err, response, result) => {
                const filteredResult = result.filter(item => item.osm_type === "relation" && (item.type === "city" || item.type === "administrative"))
                    .map(item => ({
                        osmId: item.osm_id,
                        bounds: [{lat: item.boundingbox[0], lng: item.boundingbox[2]}, {lat: item.boundingbox[1], lng: item.boundingbox[3]}],
                        centerLocation: {lat: item.lat, lng: item.lon},
                        displayName: item.display_name
                    }));
                res.send(filteredResult);
            });
    }
    else
    {
        res.status(422).end("Parameter 'q' is required.")
    }
});



router.get("/relation/:osmId", (req, res) => {
    const osmId = req.params.osmId;
    cachedRequest({
        url: `http://www.openstreetmap.org/api/0.6/relation/${osmId}/full`,
        ttl: 365 * 24 * 60 * 60 * 1000
    }, (err, response, body) => {
        const jsonResult = osmtogeojson(xmlParser.parseFromString(body.toString()));
        res.setHeader("Cache-Control", "max-age=32557600");
        res.send(jsonResult);
    });
});



router.get("/route/:tp", (req, res) => {
    request({
        url: `http://router.project-osrm.org/route/v1/driving/${req.params.tp}?overview=false&geometries=polyline&steps=true`,
        json: true
    }, (err, response, body) => {
        const locations = body.routes[0].legs[0].steps.map(step => ({
            lat: step.maneuver.location[1],
            lng: step.maneuver.location[0]
        }));
        res.send(locations);
    });
});

export default router;
