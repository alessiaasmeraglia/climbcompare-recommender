export function getMissingPreferences(preferences) {
    const missing = [];

    if (!preferences.level) {
        missing.push("level");
    }

    if (!preferences.discipline) {
        missing.push("discipline");
    }

    if (!preferences.footWidth) {
        missing.push("footWidth");
    }

    return missing;
}

export function generateFollowUpQuestion(missingPreferences) {
    const next = missingPreferences[0];

    const questions = {
        level:
            "Che livello hai attualmente in arrampicata?",

        discipline:
            "Pratichi principalmente boulder, arrampicata sportiva o indoor?",

        footWidth:
            "Diresti di avere un piede stretto, medio o largo?"
    };

    return questions[next] ?? null;
}