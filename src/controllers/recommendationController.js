import { getRecommendations } from "../services/recommendationService.js";
import { generateRecommendationExplanation } from "../services/aiService.js";

export async function recommendShoes(req, res) {
    try {
        const {
            level,
            discipline,
            footWidth,
            preferredStiffness,
            budget
        } = req.body;

        if (!level || !discipline) {
            return res.status(400).json({
                error: "Level and discipline are required."
            });
        }

        const preferences = {
            level,
            discipline,
            footWidth,
            preferredStiffness,
            budget
        };

        const recommendations = getRecommendations(preferences);

        const aiExplanation =
            await generateRecommendationExplanation(
                preferences,
                recommendations
            );

        res.json({
            preferences,
            recommendations,
            aiExplanation
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to generate recommendations."
        });
    }
}