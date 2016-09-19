import express from "express";

import osm from "./osm";
import project from "./project";

const router = express.Router();
router.use("/osm", osm);
router.use("/project", project);
export default router;
