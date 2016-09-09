import express from "express";

import osm from "./osm";

const router = express.Router();
router.use("/osm", osm);
export default router;
