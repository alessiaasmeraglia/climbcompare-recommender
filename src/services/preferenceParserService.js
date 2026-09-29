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
Sei il parser delle preferenze di ClimbCompare.

Estrai esclusivamente le informazioni presenti nel messaggio.

Regole:
- Non inventare dati mancanti.
- Normalizza i valori secondo lo schema fornito.
- Un grado come 4, 5A o 5C corrisponde indicativamente a beginner.
- Un grado come 6A, 6B o 6C corrisponde indicativamente a intermediate.
- Dal 7A in poi puoi usare advanced.
- Se il dato non è presente, restituisci null.
`
            },
            {
                role: "user",
                content: message
            }
        ],

        text: {
            format: {
                type: "json_schema",
                name: "climbing_shoe_preferences",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        level: {
                            type: ["string", "null"],
                            enum: [
                                "beginner",
                                "intermediate",
                                "advanced",
                                null
                            ]
                        },

                        discipline: {
                            type: ["string", "null"],
                            enum: [
                                "bouldering",
                                "sport climbing",
                                "indoor",
                                null
                            ]
                        },

                        footWidth: {
                            type: ["string", "null"],
                            enum: [
                                "narrow",
                                "medium",
                                "wide",
                                null
                            ]
                        },

                        preferredStiffness: {
                            type: ["string", "null"],
                            enum: [
                                "soft",
                                "medium",
                                "stiff",
                                null
                            ]
                        },

                        budget: {
                            type: ["number", "null"]
                        }
                    },

                    required: [
                        "level",
                        "discipline",
                        "footWidth",
                        "preferredStiffness",
                        "budget"
                    ],

                    additionalProperties: false
                }
            }
        }
    });

    return JSON.parse(response.output_text);
}