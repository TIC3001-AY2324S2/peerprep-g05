import express from "express";
const router = express.Router();
import { verifyAccessToken } from "../middleware/basic-access-control.js";
import {
    getSessionInfoByHash,
    addSessionInfo
} from "../controller/collab-controller.js";

console.log("collab-service-routes.js");
//adds a new session into session repository, requires hash + questionID in body
//router.post('/api/collab/session', verifyAccessToken, addSessionInfo);
//test version
router.post('/api/collab/session/:hash/qid/:qid', addSessionInfo);

//returns session info by hash, requires hash in body
//router.get('/api/collab/session', verifyAccessToken, getSessionInfoByHash);
router.get('/api/collab/session/:hash', getSessionInfoByHash);

export default router;