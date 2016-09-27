import express from "express";
import fs from "fs";
import fstream from "fstream";
import path from "path";
import tar from "tar";
import zlib from "zlib";

const router = express.Router();

router.get("/:id", (req, res) => {
    const blankFile = path.resolve(__dirname, "../../projects/.blank.json");
    const file = path.resolve(__dirname, "../../projects/" + req.params.id + ".json");
    if (!fs.existsSync(file))
    {
        if (req.params.id === "default")
        {
            const rawJSON = fs.readFileSync(blankFile, "utf-8");
            fs.writeFileSync(file, rawJSON);
        }
        else
        {
            res.status(404).end(`Project file "${file}" not found.`);
            return;
        }
    }
    const json = JSON.parse(fs.readFileSync(file, "utf-8"));
    res.send(json);
});

router.put("/:id", (req, res) => {
    const file = path.resolve(__dirname, "../../projects/" + req.params.id + ".json");
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

function compress(projectName)
{
    const inputFolder = path.resolve(__dirname, "../../outputs/" + projectName);
    const outFile = path.resolve(__dirname, "../../outputs/" + projectName + ".gz");
    fstream.Reader({ "path": inputFolder, "type": "Directory" })
        .pipe(tar.Pack())
        .pipe(zlib.Gzip())
        .pipe(fstream.Writer({ "path": outFile }));
    return outFile;
}

export default router;
