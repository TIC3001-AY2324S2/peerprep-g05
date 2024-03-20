import express from "express";

import { respHelloWorld } from "../controller/matching-controller.js";

const router = express.Router();

router.get("/", respHelloWorld);

export default router;
