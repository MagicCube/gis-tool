import express from "express";
import fs from "fs";
import fstream from "fstream";
import Mustache from 'mustache';
import path from "path";
import tar from "tar";
import zlib from "zlib";

const router = express.Router();

router.get("/:id", (req, res) => {
    const blankFile = path.resolve(__dirname, "../../projects/.blank.json");
    const file = path.resolve(__dirname, `../../projects/${req.params.id}.json`);
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
    const file = path.resolve(__dirname, `../../projects/${req.params.id}.json`);
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

let iniTmpl = null;
let wayCsvTmpl = null;
let routeCsvTmpl = null;
router.get("/download/:id", (req, res) => {
    const projectId = req.params.id;
    const outputDir = path.resolve(__dirname, "../../outputs/" + req.params.id);
    const projectFile = path.resolve(__dirname, "../../projects/" + req.params.id + ".json");
    if (fs.existsSync(projectFile))
    {
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        const objectJSON = JSON.parse(fs.readFileSync(projectFile, "utf-8"));
        const ini = generateIni(objectJSON);
        const iniFile = path.resolve(__dirname, `../../outputs/${projectId}/osm_adapter_city.ini`);
        fs.writeFileSync(iniFile, ini);

        const wayKeyLocs = generateWayKeyLocs(objectJSON);
        const wayKeyLocsFile = path.resolve(__dirname, `../../outputs/${projectId}/way_category_filter_key_locs.csv`);
        fs.writeFileSync(wayKeyLocsFile, wayKeyLocs);

        const routeKeyLocs = generateRouteKeyLocs(objectJSON);
        const routeKeyLocsFile = path.resolve(__dirname, `../../outputs/${projectId}/routes_key_locs.csv`);
        fs.writeFileSync(routeKeyLocsFile, routeKeyLocs);

        const gzipFile = compress(projectId);
        // res.setHeader("Content-Type", "application/gz");
        res.download(gzipFile);
    }
    else
    {
        res.status(404).end(`Project file "${file}" not found.`);
    }
});

function generateIni(projectJson)
{
    const view = {
        in_bbox: `${projectJson.city.bounds[0]['lng']}, ${projectJson.city.bounds[0]['lat']}, ${projectJson.city.bounds[1]['lng']}, ${projectJson.city.bounds[1]['lat']}`,
        in_city_name: projectJson.city.displayName,
        in_city_id: projectJson.city.code
    };

    if (!iniTmpl)
    {
        const file = path.resolve(__dirname, "../../templates/osm_adapter_city.ini");
        iniTmpl = fs.readFileSync(file, "utf-8");
    }
    const result = Mustache.render(iniTmpl, view);
    return result;
}

function generateWayKeyLocs(projectJson)
{
    const ways = projectJson.ways;
    ways.forEach((way, i) => {
        way.heading = util.getHeading(way.keyLocations[0], way.keyLocations[1]);
        const locationStr = way.keyLocations
            .map((location, j) => {
                if (j === way.keyLocations.length - 1)
                {
                    location.heading = way.keyLocations[j - 1].heading;
                }
                else
                {
                    location.heading = util.getHeading(location, way.keyLocations[j + 1]);
                }
                return `${location.lat.toFixed(6)} ${location.lng.toFixed(6)} ${parseInt(location.heading)}`;
            })
            .join(",");
        way.keyLocations = `"${locationStr}"`;
        way.name = `"${way.name}"`;
        way.id = i + 1;
        way.direction = parseDirection(way.direction);
    });
    if (!wayCsvTmpl)
    {
        const file = path.resolve(__dirname, "../../templates/way_category_filter_key_locs.csv");
        wayCsvTmpl = fs.readFileSync(file, "utf-8");
    }
    const result = Mustache.render(wayCsvTmpl, { ways });
    return result;
}

function generateRouteKeyLocs(projectJson)
{

}

function parseDirection(degree)
{
    // dir-0: 东西向或南北向, dir-1: 西东向或北南向
    if (degree > 45 && degree <= 225)
    {
        return 1;
    }
    return 0;
}

function compress(projectId)
{
    const inputFolder = path.resolve(__dirname, "../../outputs/" + projectId);
    const outFile = path.resolve(__dirname, "../../outputs/" + projectId + ".gz");
    fstream.Reader({ "path": inputFolder, "type": "Directory" })
        .pipe(tar.Pack())
        .pipe(zlib.Gzip())
        .pipe(fstream.Writer({ "path": outFile }));
    return outFile;
}

export default router;
