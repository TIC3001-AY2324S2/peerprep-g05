import express from "express";

import { respHelloWorld, findMatch, getMatchRecord } from "../controller/matching-controller.js";

const router = express.Router();

router.get("/", respHelloWorld);

router.post("/find", findMatch);

router.get("/find", getMatchRecord);

export default router;
