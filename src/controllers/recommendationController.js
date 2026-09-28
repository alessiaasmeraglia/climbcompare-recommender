import { getRecommendations } from "../services/recommendationService.js";

export function recommendShoes(req, res) {
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

    res.json({
        preferences,
        recommendations
    });
}