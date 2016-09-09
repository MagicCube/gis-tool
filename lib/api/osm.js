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
                res.send(result);
            });
    }
    else
    {
        res.status(422).end("Parameter 'q' is required.")
    }
});

export default router;
