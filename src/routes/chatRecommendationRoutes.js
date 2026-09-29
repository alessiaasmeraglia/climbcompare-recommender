import express from "express";
import { chatRecommendShoes } from "../controllers/chatRecommendationController.js";

const router = express.Router();

router.post("/", chatRecommendShoes);

export default router;