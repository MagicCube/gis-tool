import express from "express";
import fs from "fs";
import path from "path";
import Mustache from 'mustache';

import util from "./util";

let iniTmpl = null;
let wayCsvTmpl = null;
let routeCsvTmpl = null;

const router = express.Router();
router.get("/:id", (req, res) => {
    const outputDir = path.resolve(__dirname, "../../outputs/" + req.params.id);
    const projectFile = path.resolve(__dirname, "../../projects/" + req.params.id + ".json");
    if (fs.existsSync(projectFile))
    {
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }
        const projectJson = JSON.parse(fs.readFileSync(projectFile, "utf-8"));
        fs.writeFileSync(`${outputDir}/osm_adaptor_city.ini`, generateIni(projectJson));
        fs.writeFileSync(`${outputDir}/way_category_filter_key_locs.csv`, generateWayKeyLocs(projectJson));
        fs.writeFileSync(`${outputDir}/routes_key_locs.csv`, generateRouteKeyLocs(projectJson));
        res.download(path.resolve(__dirname, `../../outputs/${req.params.id}/osm_adaptor_city.ini`));
    }
    else
    {
        res.status(404).end(`Project folder "${projectFile}" not found.`);
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
    return Mustache.render(wayCsvTmpl, { ways });
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
    const result = Mustache.render(routeCsvTmpl, { routes });
    return result;
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

export default router;
