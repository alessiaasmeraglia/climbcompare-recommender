import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateRecommendationExplanation(
    preferences,
    recommendations
) {
    if (!recommendations.length) {
        return "Non ho trovato modelli compatibili con le preferenze indicate.";
    }

    const shoes = recommendations.map((shoe) => ({
        name: shoe.name,
        brand: shoe.brand,
        disciplines: shoe.disciplines,
        level: shoe.level,
        footWidth: shoe.footWidth,
        stiffness: shoe.stiffness,
        downturn: shoe.downturn,
        price: shoe.price,
        score: shoe.score
    }));

    const prompt = `
Sei l'assistente di ClimbCompare, un comparatore di scarpette da arrampicata.

Usa esclusivamente i modelli forniti.
Non inventare prodotti o caratteristiche.
Considera il punteggio come indicatore di compatibilità.
Spiega brevemente perché ogni modello può essere adatto.
Rispondi in italiano.

Preferenze:
${JSON.stringify(preferences, null, 2)}

Modelli:
${JSON.stringify(shoes, null, 2)}
`;

    const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input: prompt
    });

    return response.output_text;
}