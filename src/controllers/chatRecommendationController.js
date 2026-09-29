import { extractPreferencesFromMessage } from "../services/preferenceParserService.js";
import { getRecommendations } from "../services/recommendationService.js";
import { generateRecommendationExplanation } from "../services/aiService.js";

export async function chatRecommendShoes(req, res) {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const preferences = await extractPreferencesFromMessage(message);

        const recommendations = getRecommendations(preferences);

        const aiExplanation =
            await generateRecommendationExplanation(
                preferences,
                recommendations
            );

        res.json({
            message,
            preferences,
            recommendations,
            aiExplanation
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to process recommendation request."
        });
    }
}