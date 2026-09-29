import { extractPreferencesFromMessage } from "../services/preferenceParserService.js";
import { getRecommendations } from "../services/recommendationService.js";
import { generateRecommendationExplanation } from "../services/aiService.js";

import {
    getMissingPreferences,
    generateFollowUpQuestion
} from "../services/conversationService.js";

export async function chatRecommendShoes(req, res) {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        const preferences =
            await extractPreferencesFromMessage(message);

        const missingPreferences =
            getMissingPreferences(preferences);

        if (missingPreferences.length > 0) {
            return res.json({
                status: "needs_more_information",

                preferences,

                missingPreferences,

                question:
                    generateFollowUpQuestion(
                        missingPreferences
                    )
            });
        }

        const recommendations =
            getRecommendations(preferences);

        const aiExplanation =
            await generateRecommendationExplanation(
                preferences,
                recommendations
            );

        return res.json({
            status: "complete",
            preferences,
            recommendations,
            aiExplanation
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Unable to process recommendation request."
        });
    }
}