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
        res.send({
            version: json.version
        });
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

        compress(projectId).then(zipFile => {
            setTimeout(() => {
                res.setHeader("Content-Type", "application/zip");
                res.download(zipFile, `${projectId}.zip`);
            })
        }).catch(reason => {
            res.status(500).end(reason);
        })
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
    const ways = projectJson.ways.map((way, i) => {
        way.keyLocations.reduce((prevLocation, curLocation) => {
            const heading = prevLocation.lat && curLocation.lat ? util.getHeading(prevLocation, curLocation) : 0;
            curLocation.heading = prevLocation.heading = heading;
            return curLocation;
        });
        const locationStr = way.keyLocations
            .map(({lat = 0, lng = 0, heading = 0} = {}) => {
                return `${lat.toFixed(6)} ${lng.toFixed(6)} ${parseInt(heading)}`;
            })
            .join(",");
        return {
            category: way.category,
            direction: parseDirection(way.direction),
            id: i + 1,
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
    const routes = projectJson.corridors
        .concat(projectJson.keyRoutes)
        .map((route, i) => {
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
            return {
                direction: parseDirection(route.direction),
                id: i + 1,
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

function compress(projectId)
{
    const inputFolder = path.resolve(__dirname, "../../outputs/" + projectId);
    const outputFile = path.resolve(__dirname, "../../outputs/" + projectId + ".zip");
    const archive = archiver("zip");

    return new Promise((resolve, reject) => {
        archive.on("finish", () => {
            resolve(outputFile);
        });
        archive.on("error", error => {
            reject(error);
        });
        archive.pipe(fs.createWriteStream(outputFile));
        fs.readdirSync(inputFolder).forEach(name => {
            const path = `${inputFolder}/${name}`;
            archive.append(fs.createReadStream(path), { name });
        })
        archive.finish();
    });
}

export default router;
