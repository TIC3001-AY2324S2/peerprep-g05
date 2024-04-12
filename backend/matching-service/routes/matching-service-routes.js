import express from "express";

import { cancelMatch, getMatchesForUser, startMatch } from "../controller/matching-controller.js";
import { verifyAccessToken, verifySameEmail } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/start",  verifyAccessToken, verifySameEmail, startMatch);

router.post("/cancel", verifyAccessToken, verifySameEmail, cancelMatch);

router.get("/history/:email", verifyAccessToken, verifySameEmail, getMatchesForUser);

export default router;
