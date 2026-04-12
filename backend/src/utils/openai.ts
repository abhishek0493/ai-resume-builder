// ──────────────────────────────────────────────────────────────
// OpenAI Client Singleton
// ──────────────────────────────────────────────────────────────
// Centralises the OpenAI SDK configuration.  Every service that
// needs AI capabilities imports this single instance instead of
// creating its own — makes it trivial to swap models or add
// rate-limit wrappers later.
// ──────────────────────────────────────────────────────────────

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
