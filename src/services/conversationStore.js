import crypto from "crypto";

const conversations = new Map();

export function createConversation() {
    const id = crypto.randomUUID();

    const conversation = {
        id,
        preferences: {
            level: null,
            discipline: null,
            footWidth: null,
            preferredStiffness: null,
            budget: null
        }
    };

    conversations.set(id, conversation);

    return conversation;
}

export function getConversation(id) {
    return conversations.get(id);
}

export function updateConversationPreferences(id, newPreferences) {
    const conversation = conversations.get(id);

    if (!conversation) {
        return null;
    }

    conversation.preferences = {
        ...conversation.preferences,
        ...Object.fromEntries(
            Object.entries(newPreferences).filter(
                ([, value]) => value !== null && value !== undefined
            )
        )
    };

    conversations.set(id, conversation);

    return conversation;
}