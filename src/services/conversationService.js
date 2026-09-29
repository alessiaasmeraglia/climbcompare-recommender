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
    if (missingPreferences.includes("level")) {
        return "Che livello hai attualmente in arrampicata?";
    }

    if (missingPreferences.includes("discipline")) {
        return "Pratichi principalmente boulder, arrampicata sportiva o indoor?";
    }

    if (missingPreferences.includes("footWidth")) {
        return "Diresti di avere un piede stretto, medio o largo?";
    }

    return null;
}