import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { context, questions } = req.body;

      console.log("Processing request");

        // Initialize the Gemini API
        console.log(`API KEY = ${process.env.GEMINI_API_KEY}`)
        const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = gemini.getGenerativeModel({ model: 'gemini-pro' });

        // Start a conversation with the Gemini API
    const conversation = model.startChat({
        history: [
            { role: 'user', parts: [`You will be given some questions based on the following context: ${context}`] },
            { role: 'user', parts: ["Respond to the questions as accurately as you can. Type your responses in the following format: ALOHA{answer 1> answer 2> etc}. Your responses will be separated by a script using this format, so don't deviate from it. Each answer will be shown to the user directly, so any formatting (such as newlines) will be extremely confusing."] },
          ],
          generationConfig: { maxOutputTokens: 300 },
    });

        // Get the result and return the answer
        const result = await conversation.sendMessage(questions);
        const responseText = result?.response?.text() || "No response text";

        res.status(200).json({ answer: responseText });
      }
     catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process the request" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}