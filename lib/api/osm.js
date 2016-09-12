import express from "express";
import fs from "fs";
import osmtogeojson from "osmtogeojson";
import path from "path";
import request from "request";
import xmldom from "xmldom";

const xmlParser = new xmldom.DOMParser();
const cachedRequest = require("cached-request")(request);
const cacheDirectory = path.resolve(__dirname, "../../tmp");

const OSM_URL = "http://www.openstreetmap.org";
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
            "q": q
        };
        request(
            {
                url: `${OSM_URL}/search`,
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
        url: `${OSM_URL}/api/0.6/relation/${osmId}/full`,
        ttl: 365 * 24 * 60 * 60 * 1000
    }, (err, response, body) => {
        const jsonResult = osmtogeojson(xmlParser.parseFromString(body.toString()));
        res.setHeader("Cache-Control", "max-age=32557600");
        res.send(jsonResult);
    });
});



router.get("/route/:tp", (req, res) => {
    request({
        url: `${MAPZEN_URL}/route?api_key=valhalla-7UikjOk&json=${req.params.tp}`,
        json: true
    }, (err, response, body) => {
        if(body.trip.legs) 
        {
            const polylines = body.trip.legs.map(leg => decodePolyline(leg.shape));
            console.log(polylines);
            res.send(polylines);
        }
    });
});


function decodePolyline(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

export default router;
