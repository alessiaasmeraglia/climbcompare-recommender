import { extractPreferencesFromMessage } from "../services/preferenceParserService.js";
import { getRecommendations } from "../services/recommendationService.js";
import { generateRecommendationExplanation } from "../services/aiService.js";

import {
    getMissingPreferences,
    generateFollowUpQuestion
} from "../services/conversationService.js";

import {
    createConversation,
    getConversation,
    updateConversationPreferences
} from "../services/conversationStore.js";

export async function chatRecommendShoes(req, res) {
    try {
        const {
            message,
            conversationId
        } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required."
            });
        }

        let conversation;

        if (conversationId) {
            conversation = getConversation(conversationId);
        }

        if (!conversation) {
            conversation = createConversation();
        }

        const extractedPreferences =
            await extractPreferencesFromMessage(message);

        conversation =
            updateConversationPreferences(
                conversation.id,
                extractedPreferences
            );

        const preferences =
            conversation.preferences;

        const missingPreferences =
            getMissingPreferences(preferences);

        if (missingPreferences.length > 0) {
            return res.json({
                status: "needs_more_information",

                conversationId:
                    conversation.id,

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

            conversationId:
                conversation.id,

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