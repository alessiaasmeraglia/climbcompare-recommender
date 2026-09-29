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
Sei l'assistente di ClimbCompare.

Devi aiutare l'utente a capire quale delle scarpette selezionate
dal recommendation engine sia più adatta alle sue preferenze.

Regole:
- Usa esclusivamente i modelli forniti.
- Non inventare prodotti o caratteristiche.
- Non modificare il ranking ricevuto.
- Non ripetere tutte le specifiche tecniche.
- Le caratteristiche complete saranno mostrate separatamente nelle card.
- Spiega il risultato in massimo 2-3 frasi.
- Evidenzia il modello più compatibile e il motivo principale.
- Se esiste un compromesso importante, segnalalo.
- Non dichiarare che una scarpetta è sicuramente perfetta.
- Rispondi in italiano.
- Non usare titoli.
- Non usare liste numerate.

Preferenze:
${JSON.stringify(preferences, null, 2)}

Modelli selezionati:
${JSON.stringify(shoes, null, 2)}
`;

    const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input: prompt
    });

    return response.output_text;
}