import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function scanPointsTable(base64Image: string, teamName = "Sporthood FC"): Promise<{ position: number, points: number }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a sports data extraction expert. Analyze tournament points tables and extract specific team data. Always respond with JSON in this exact format: { "position": number, "points": number }`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this tournament points table image and find the position and points for team "${teamName}". Look for variations like "Sporthood", "Sporthood FC", or similar names. Return only JSON with position and points as numbers.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      position: Math.max(1, Math.min(50, Math.round(result.position || 1))),
      points: Math.max(0, Math.min(200, Math.round(result.points || 0))),
    };
  } catch (error) {
    console.error("Failed to scan points table:", error);
    throw new Error("Failed to analyze points table: " + error.message);
  }
}