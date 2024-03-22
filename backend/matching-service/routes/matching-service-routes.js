import express from "express";

import { respHelloWorld, findMatch } from "../controller/matching-controller.js";

const router = express.Router();

router.get("/", respHelloWorld);

router.post("/find", findMatch);

export default router;
