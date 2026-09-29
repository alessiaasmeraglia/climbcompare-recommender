# ClimbCompare Recommender

> A conversational recommendation engine for climbing shoes, combining rule-based matching with AI.

ClimbCompare Recommender is an AI-assisted backend service built for **ClimbCompare**, a climbing shoe comparison platform.

The goal of the project is to help climbers find models that better match their needs by combining structured product data, a deterministic recommendation system and conversational AI.

## Overview

Choosing climbing shoes can be difficult because fit and performance depend on several factors, including:

- climbing discipline
- experience level
- foot width
- preferred stiffness
- budget

ClimbCompare Recommender turns those preferences into structured data, evaluates the available climbing shoes and returns the most compatible options.

AI is used to understand natural-language input and explain the recommendations, while the ranking itself remains grounded in the product data available inside ClimbCompare.

## How It Works

```text
User message
    ↓
AI preference extraction
    ↓
Conversation state
    ↓
Recommendation engine
    ↓
Top matching climbing shoes
    ↓
AI-generated explanation
```

This separation keeps the recommendation logic predictable and prevents the AI layer from freely inventing products or product characteristics.

## Features

- REST API built with Express
- Natural-language preference extraction
- Structured user preferences
- Rule-based recommendation engine
- Product compatibility scoring
- Multi-turn conversational flow
- In-memory conversation state
- AI-generated recommendation explanations
- Separation between recommendation logic and AI services
- Environment-based configuration

## Tech Stack

- Node.js
- Express
- JavaScript
- OpenAI API
- pnpm
- dotenv
- CORS
- nodemon

## Project Structure

```text
climbcompare-recommender/
│
├── src/
│   ├── controllers/
│   │   ├── recommendationController.js
│   │   └── chatRecommendationController.js
│   │
│   ├── data/
│   │   └── climbingShoes.js
│   │
│   ├── routes/
│   │   ├── recommendationRoutes.js
│   │   └── chatRecommendationRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── conversationService.js
│   │   ├── conversationStore.js
│   │   ├── preferenceParserService.js
│   │   └── recommendationService.js
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/alessiaasmeraglia/climbcompare-recommender.git
```

Move into the project directory:

```bash
cd climbcompare-recommender
```

Install the dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
OPENAI_API_KEY=your_api_key
```

The `.env` file must never be committed to GitHub.

The project includes an `.env.example` file that can be used as a reference:

```env
PORT=3001
OPENAI_API_KEY=
```

Make sure `.env` is included in `.gitignore`.

## Running the Project

Start the development server with nodemon:

```bash
pnpm dev
```

Or start the application normally:

```bash
pnpm start
```

By default, the API runs at:

```text
http://localhost:3001
```

## API Endpoints

### Health Check

```http
GET /
```

Example response:

```json
{
  "message": "ClimbCompare AI API is running"
}
```

### Structured Recommendation

```http
POST /api/recommend
```

This endpoint receives already structured preferences and returns the best matching climbing shoes.

Example request:

```json
{
  "level": "intermediate",
  "discipline": "bouldering",
  "footWidth": "wide",
  "preferredStiffness": "soft",
  "budget": 150
}
```

Example response:

```json
{
  "preferences": {
    "level": "intermediate",
    "discipline": "bouldering",
    "footWidth": "wide",
    "preferredStiffness": "soft",
    "budget": 150
  },
  "recommendations": [
    {
      "id": 1,
      "name": "La Sportiva Skwama",
      "brand": "La Sportiva",
      "score": 100
    }
  ],
  "aiExplanation": "The recommended model matches the user's main preferences..."
}
```

### Conversational Recommendation

```http
POST /api/chat/recommend
```

This endpoint accepts a natural-language message and extracts the user's preferences before running the recommendation engine.

Example request:

```json
{
  "message": "I mainly climb boulders around 6B, I have wide feet and prefer soft shoes."
}
```

If the message contains enough information, the API returns recommendations.

If important information is missing, the API asks a follow-up question.

Example response:

```json
{
  "status": "needs_more_information",
  "conversationId": "example-conversation-id",
  "preferences": {
    "level": "intermediate",
    "discipline": "bouldering",
    "footWidth": null,
    "preferredStiffness": "soft",
    "budget": null
  },
  "missingPreferences": [
    "footWidth"
  ],
  "question": "Would you describe your feet as narrow, medium or wide?"
}
```

The returned `conversationId` can be sent with later requests to preserve the current conversation state.

Example:

```json
{
  "conversationId": "example-conversation-id",
  "message": "Wide."
}
```

Once the required information has been collected, the endpoint returns the recommendations together with an AI-generated explanation.

## Recommendation System

The recommendation engine uses a weighted scoring system.

Current weights:

```text
Discipline match       +30
Experience level       +25
Foot width             +20
Preferred stiffness    +15
Budget                  +10
                       ----
Maximum score           100
```

Each climbing shoe is evaluated against the user's preferences.

The results are sorted by score and the highest-scoring models are returned.

The scoring logic is intentionally independent from the AI layer.

## AI Layer

The AI layer currently has two main responsibilities.

### Preference Extraction

Natural-language messages are converted into structured data.

Example:

```text
"I mainly climb boulders, I'm around 6B, I have wide feet
and I prefer soft shoes under €150."
```

becomes:

```json
{
  "level": "intermediate",
  "discipline": "bouldering",
  "footWidth": "wide",
  "preferredStiffness": "soft",
  "budget": 150
}
```

Missing information is represented as `null` instead of being invented.

### Recommendation Explanation

After the recommendation engine identifies the best matches, the AI receives only those products and generates a concise explanation of why they may fit the user's needs.

The AI does not independently choose arbitrary products outside the ClimbCompare dataset.

## Conversation State

The conversational endpoint supports multi-turn interactions.

For example:

```text
User:
I need shoes for bouldering.

Assistant:
What is your current climbing level?

User:
Around 6B.

Assistant:
Would you describe your feet as narrow, medium or wide?

User:
Wide.

Assistant:
[recommendation results]
```

The application currently stores conversation state in memory using a `Map`.

This is intentionally simple for the development phase.

Restarting the server clears all active conversations.

## Product Data

The current version uses a small local dataset of climbing shoes for development and testing.

Each model can include attributes such as:

```js
{
  id: 1,
  name: "La Sportiva Skwama",
  brand: "La Sportiva",
  disciplines: ["bouldering", "sport climbing"],
  level: ["intermediate", "advanced"],
  footWidth: "wide",
  stiffness: "soft",
  downturn: "aggressive",
  price: 150
}
```

The final version is planned to use the full ClimbCompare product database.

## Current Limitations

The project is still under active development.

Current limitations include:

- a limited local climbing shoe dataset
- conversation state stored only in memory
- no persistent user sessions
- no authentication
- no direct connection to the main ClimbCompare database yet
- an initial rule-based scoring model
- no sizing recommendation system yet

## Planned Improvements

Future development includes:

- integration with the main ClimbCompare product database
- richer climbing shoe attributes
- persistent conversation storage
- improved recommendation weighting
- smarter fit and sizing recommendations
- user feedback on recommendation quality
- integration with the ClimbCompare React frontend
- dedicated conversational assistant UI
- recommendation cards linked to product detail pages
- improved handling of incomplete or ambiguous user preferences

## Related Project

ClimbCompare Recommender is being developed as an extension of **ClimbCompare**, a React application for browsing, saving and comparing climbing shoes.

The long-term goal is to evolve ClimbCompare from a comparison interface into a smarter decision-support tool for climbers.

## Security

API keys are stored in environment variables and must never be committed to the repository.

The OpenAI API key is used only on the backend and is never exposed directly to the frontend.

## Author

**Alessia Smeraglia**

Frontend Developer  
UX / UI & Web Development