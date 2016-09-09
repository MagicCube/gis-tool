import express from "express";
import request from "request-promise";
import osmtogeojson from "osmtogeojson";

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
            `http://nominatim.openstreetmap.org/search`,
            { json: true, qs }).then(result => {
                const filteredResult = result.filter(item => item.osm_type === "relation" && (item.type === "city" || item.type === "administrative"))
                    .map(item => ({
                        osmId: item.osm_id,
                        boundingbox: item.boundingbox,
                        lat: item.lat,
                        lon: item.lon,
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
    request(`http://www.openstreetmap.org/api/0.6/relation/${osmId}/full`).then(xmlString => {
        const jsonResult = osmtogeojson(xmlString);
        res.send(jsonResult);
    });
});

export default router;
