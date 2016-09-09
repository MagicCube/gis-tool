import express from "express";
import request from "request-promise";

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
                res.send(citySearch(result));
            });
    }
    else
    {
        res.status(422).end("Parameter 'q' is required.")
    }
});

function citySearch(items) {
    return items.filter(item => item.osm_type === "relation" && (item.type === "city" || item.type === "administrative"))
        .map(item => ({
            osmId: item.osm_id,
            boundingbox: item.boundingbox,
            lat: item.lat,
            lon: item.lon,
            displayName: item.display_name
        }));
}

export default router;
