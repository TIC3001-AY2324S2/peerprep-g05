import express from "express";

import { createMatchRecord, getMatchRecord } from "../controller/matching-controller.js";
import { verifyIfRecordExists } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/find", verifyIfRecordExists, createMatchRecord);

router.get("/find", getMatchRecord);

export default router;
