import climbingShoes from "../data/climbingShoes.js";

function calculateScore(shoe, preferences) {
    let score = 0;

    if (
        preferences.discipline &&
        shoe.disciplines.includes(preferences.discipline)
    ) {
        score += 30;
    }

    if (
        preferences.level &&
        shoe.level.includes(preferences.level)
    ) {
        score += 25;
    }

    if (
        preferences.footWidth &&
        shoe.footWidth === preferences.footWidth
    ) {
        score += 20;
    }

    if (
        preferences.preferredStiffness &&
        shoe.stiffness === preferences.preferredStiffness
    ) {
        score += 15;
    }

    if (
        preferences.budget &&
        shoe.price <= preferences.budget
    ) {
        score += 10;
    }

    return score;
}

export function getRecommendations(preferences) {
    return climbingShoes
        .map((shoe) => ({
            ...shoe,
            score: calculateScore(shoe, preferences)
        }))
        .filter((shoe) => shoe.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}