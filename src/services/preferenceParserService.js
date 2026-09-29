import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function extractPreferencesFromMessage(message) {
    const response = await openai.responses.create({
        model: "gpt-5.6-luna",
        input: [
            {
                role: "system",
                content: `
Sei un parser di preferenze per ClimbCompare.

Devi estrarre dal messaggio dell'utente solo queste proprietà:

- level: beginner | intermediate | advanced | null
- discipline: bouldering | sport climbing | indoor | null
- footWidth: narrow | medium | wide | null
- preferredStiffness: soft | medium | stiff | null
- budget: number | null

Regole:
- Non inventare informazioni.
- Se un dato non è presente, usa null.
- Se l'utente usa termini equivalenti, normalizzali.
- Restituisci SOLO JSON valido.
- Nessun testo extra.
`
            },
            {
                role: "user",
                content: message
            }
        ]
    });

    const rawText = response.output_text;

    try {
        return JSON.parse(rawText);
    } catch (error) {
        console.error("Invalid AI JSON:", rawText);

        throw new Error("Unable to parse user preferences.");
    }
}