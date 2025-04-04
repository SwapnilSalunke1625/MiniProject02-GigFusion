import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateQuestions } from "../controllers/questions.controller.js";

const router = Router();

router.route("/generate").post(verifyJWT, generateQuestions);

export default router;
