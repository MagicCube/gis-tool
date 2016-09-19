import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/:code", (req, res) => {
    const file = path.resolve(__dirname, "../../projects/" + req.params.code + ".json");
    if (!fs.existsSync(file))
    {
        res.status(404).end(`Project file "${file}" not found.`);
    }
    else
    {
        const json = JSON.parse(fs.readFileSync(file, "utf-8"));
        res.send(json);
    }
});

router.put("/:code", (req, res) => {
    const file = path.resolve(__dirname, "../../projects/" + req.params.code + ".json");
    if (!fs.existsSync(file))
    {
        res.status(404).end(`Project file "${file}" not found.`);
    }
    else
    {
        const json = req.body;
        if (json && json.version && json.city)
        {
            const localJson = JSON.parse(fs.readFileSync(file, "utf-8"));
            if (localJson.version === json.version)
            {
                json.version++;
                fs.writeFileSync(file, JSON.stringify(json));
                res.send({
                    version: json.version
                });
            }
            else
            {
                res.status(420).end(`Bad version.`);
            }
        }
        else
        {
            res.status(400).end(`Bad request.`);
        }
    }
});

export default router;
