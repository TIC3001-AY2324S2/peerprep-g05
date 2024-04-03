import express from "express";

import { handleIsAdmin, handleLogin, handleReset, handleVerifyToken } from "../controller/auth-controller.js";
import { verifyAccessToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.post("/reset", handleReset);

router.get("/verify", verifyAccessToken, handleVerifyToken);

router.get("/is_admin", verifyAccessToken, handleIsAdmin);


export default router;
