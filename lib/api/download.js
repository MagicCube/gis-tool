import express from "express";
import fs from "fs";
import path from "path";
import Mustache from 'mustache';

const router = express.Router();
const iniTemplateFile = path.resolve(__dirname, "../../templates/ini.tmpl");

router.get("/:id", (req, res) => {
    const file = path.resolve(__dirname, "../../projects/" + req.params.id + ".json");
    if (fs.existsSync(file))
    {
        const rawJSON = fs.readFileSync(file, "utf-8");
        const objectJSON = JSON.parse(rawJSON);
        const ini = generateIni(objectJSON);
        res.send(ini);
    }
});

function generateIni(objectJSON)
{
    const view = {
        in_bbox: `${objectJSON.city.bounds[0]['lng']}, ${objectJSON.city.bounds[0]['lat']}, ${objectJSON.city.bounds[1]['lng']}, ${objectJSON.city.bounds[1]['lat']}`,
        in_city_name: objectJSON.city.displayName,
        in_city_id: objectJSON.city.code
    };

    const template = fs.readFileSync(iniTemplateFile, "utf-8");
    const result = Mustache.render(template, view);
    return result;
}

function generateWayCategoryFilterKeyLocs(objectJSON)
{

}

function generateRouteKeyLocs(objectJSON)
{

}

export default router;
