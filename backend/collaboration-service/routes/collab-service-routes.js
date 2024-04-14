import express from "express";
const router = express.Router();
import {
    getSessionInfoByHash,
    addSessionInfo,
    deleteSessionInfoByHash
} from "../controller/collab-controller.js";

//adds a new session into session repository, requires auth in header
//router.post('/api/collab/session', verifyAccessToken, addSessionInfo);
//test version
router.post('/api/collaboration/session/:hash/qid/:qid', addSessionInfo);

//returns session info by hash
//router.get('/api/collab/session', verifyAccessToken, getSessionInfoByHash);
router.get('/api/collaboration/session/:hash', getSessionInfoByHash);

//deletes session info by hash, requires has
router.delete('/api/collaboration/session/:hash', deleteSessionInfoByHash);

export default router;