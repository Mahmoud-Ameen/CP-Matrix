import { Router } from "express";
import { registerOrUpdateUser } from "../controllers/userController.js";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";

const router = Router();

router.post("/login", verifyFirebaseToken, registerOrUpdateUser);

export default router;
