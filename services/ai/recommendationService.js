require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function explainSchemes(userProfile, schemes) {
  const prompt = `
    You are SahayakAI.

    Your job is to explain government schemes in simple English.

    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Eligible Schemes:
    ${JSON.stringify(schemes, null, 2)}

    For every eligible scheme provide:

    ## Scheme Name

    Why Eligible

    Benefits

    Required Documents

    Official Website

    Application Steps

    Important Notes

    Instructions:
    - Format the response using clean Markdown.
    - Use headings, bullet lists, and numbered lists where appropriate.
    - Keep the language simple and easy to understand.
    - Do not include unnecessary introductions or conclusions.
    - Ensure the information is well-structured and readable.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "No AI recommendation available.";
}

module.exports = {
  explainSchemes,
};
