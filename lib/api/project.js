import archiver from "archiver";
import express from "express";
import fs from "fs";
import Mustache from 'mustache';
import path from "path";

import util from "./util";

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

router.post("/:id", (req, res) => {
    const file = path.resolve(__dirname, `../../projects/${req.params.id}.json`);
    const json = req.body;
    if (json && json.city)
    {
        json.version = 1;
        json.id = req.params.id;
        fs.writeFileSync(file, JSON.stringify(json));
        res.end();
    }
    else
    {
        res.status(400).end(`Bad request.`);
    }
});


let iniTmpl = null;
let wayCsvTmpl = null;
let routeCsvTmpl = null;
router.get("/download/:id", (req, res) => {
    const projectId = req.params.id;
    const outputDir = path.resolve(__dirname, `../../outputs/${projectId}`);
    const projectFile = path.resolve(__dirname, `../../projects/${projectId}.json`);
    if (!fs.existsSync(path.resolve(__dirname, "../../outputs")))
    {
        fs.mkdirSync(path.resolve(__dirname, "../../outputs"));
    }
    if (fs.existsSync(projectFile))
    {
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        const projectJson = JSON.parse(fs.readFileSync(projectFile, "utf-8"));

        const ini = generateIni(projectJson);
        fs.writeFileSync(`${outputDir}/osm_adapter_city.ini`, ini);

        const wayKeyLocs = generateWayKeyLocs(projectJson);
        fs.writeFileSync(`${outputDir}/way_category_filter_key_locs.csv`, wayKeyLocs);

        const routeKeyLocs = generateRouteKeyLocs(projectJson);
        fs.writeFileSync(`${outputDir}/routes_key_locs.csv`, routeKeyLocs);

        res.attachment(`${projectId}.zip`);
        res.setHeader("Content-Type", "application/zip");
        const archive = compress(outputDir, res);
    }
    else
    {
        res.status(404).end(`Project file "${projectId}" not found.`);
    }
});


function generateIni(projectJson)
{
    const view = {
        timestamp: new Date(),
        in_bbox: `${projectJson.city.bounds[0]['lng']}, ${projectJson.city.bounds[0]['lat']}, ${projectJson.city.bounds[1]['lng']}, ${projectJson.city.bounds[1]['lat']}`,
        in_city_name: projectJson.city.displayName,
        in_city_id: projectJson.city.code
    };

    if (!iniTmpl)
    {
        const file = path.resolve(__dirname, "../../templates/osm_adapter_city.ini");
        iniTmpl = fs.readFileSync(file, "utf-8");
    }
    return Mustache.render(iniTmpl, view);
}

function generateWayKeyLocs(projectJson)
{
    const mapNameToId = {};
    const ways = projectJson.ways.map((way) => {
        way.keyLocations.reduce((prevLocation, curLocation) => {
            const heading = prevLocation.lat && curLocation.lat ? util.getHeading(prevLocation, curLocation) : 0;
            curLocation.heading = prevLocation.heading = heading;
            return curLocation;
        });
        const locationStr = way.keyLocations
            .map(({ lat = 0, lng = 0, heading = 0 } = {}) => {
                return `${lat.toFixed(6)} ${lng.toFixed(6)} ${parseInt(heading)}`;
            })
            .join(",");
        if (!mapNameToId[way.name])
        {
          mapNameToId[way.name] = Object.keys(mapNameToId).length + 1;
        }
        return {
            category: way.category,
            direction: parseDirection(way.direction),
            id: mapNameToId[way.name],
            keyLocations: `"${locationStr}"`,
            name: `"${way.name}"`
        }
    });
    if (!wayCsvTmpl)
    {
        const file = path.resolve(__dirname, "../../templates/way_category_filter_key_locs.csv");
        wayCsvTmpl = fs.readFileSync(file, "utf-8");
    }
    return Mustache.render(wayCsvTmpl, {
      timestamp: new Date(),
      ways
    });
}

function generateRouteKeyLocs(projectJson)
{
    projectJson.corridors.forEach(corridor => {
        corridor.type = 1;
    });
    projectJson.keyRoutes.forEach(keyRoute => {
        keyRoute.type = 2;
    });
    const mapNameToId = {};
    const routes = projectJson.corridors
        .concat(projectJson.keyRoutes)
        .map((route) => {
            route.keyLocations.reduce((prevLocation, curLocation) => {
                const heading = prevLocation.lat && curLocation.lat ? util.getHeading(prevLocation, curLocation) : 0;
                curLocation.heading = prevLocation.heading = heading;
                return curLocation;
            });
            const locationStr = route.keyLocations
                .map(({lat = 0, lng = 0, heading = 0} = {}) => {
                    return `${lat.toFixed(6)} ${lng.toFixed(6)} ${parseInt(heading)}`;
                })
                .join(",");
            if (!mapNameToId[route.name])
            {
              mapNameToId[route.name] = Object.keys(mapNameToId).length + 1;
            }
            return {
                direction: parseDirection(route.direction),
                id: mapNameToId[route.name],
                keyLocations: `"${locationStr}"`,
                name: `"${route.name}"`,
                type: route.type
            }
        });

    if (!routeCsvTmpl)
    {
        const file = path.resolve(__dirname, "../../templates/routes_key_locs.csv");
        routeCsvTmpl = fs.readFileSync(file, "utf-8");
    }
    const result = Mustache.render(routeCsvTmpl, {
      timestamp: new Date(),
      routes
    });
    return result;
}

function parseDirection(degree)
{
    // dir 0: 东西向或南北向
    // dir 1: 西东向或北南向
    if (degree > 45 && degree <= 225)
    {
        return 1;
    }
    return 0;
}

function compress(inputFolder, output)
{
    const archive = archiver("zip");
    archive.pipe(output);
    fs.readdirSync(inputFolder).forEach(fileName => {
        const filePath = `${inputFolder}/${fileName}`;
        archive.file(filePath, { name: fileName });
    })
    archive.finalize();
}

export default router;
