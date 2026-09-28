import express from "express";
import { recommendShoes } from "../controllers/recommendationController.js";

const router = express.Router();

router.post("/", recommendShoes);

export default router;