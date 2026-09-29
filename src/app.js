import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import recommendationRoutes from "./routes/recommendationRoutes.js";
import chatRecommendationRoutes from "./routes/chatRecommendationRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "ClimbCompare AI API is running"
    });
});

app.use("/api/recommend", recommendationRoutes);
app.use("/api/chat/recommend", chatRecommendationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});