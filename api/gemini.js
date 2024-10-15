import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { context, questions } = req.body;

      console.log("Processing request");

      // Initialize the Gemini API
      console.log(`API KEY = ${process.env.GEMINI_API_KEY}`);
      const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = gemini.getGenerativeModel({ model: 'gemini-pro' });

      // Start a conversation with the Gemini API
      const conversation = await model.startChat({
        history: [
          { role: 'user', parts: [`Content: ${context}`] },
          { role: 'user', parts: ["Respond to the questions as accurately as you can. Type your responses in the following format: ALOHA{answer 1> answer 2> etc}."] }
        ],
        generationConfig: { maxOutputTokens: 300 },
      });

      // Log the result to check the structure
      const result = await conversation.sendMessage(questions);
      console.log("Conversation result:", result);

      // Safely access the response text
      const responseText = result?.response?.text ? result.response.text() : "No response text available";

      res.status(200).json({ answer: responseText });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process the request" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
