import express from "express";
import { getRoom, deleteRoom } from "../controller/ongoing-controller.js";

const router = express.Router();

router.get("/", getRoom);
router.delete("/", deleteRoom)


export default router;