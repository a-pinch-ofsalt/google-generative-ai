import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { context, questions } = req.body;

      console.log("Processing request");
      
      // Log the environment variable to ensure the API key is being passed correctly
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set");
        throw new Error("Missing GEMINI_API_KEY");
      }

      console.log(`API KEY = ${process.env.GEMINI_API_KEY}`);

      // Initialize the Gemini API
      const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      console.log("Initialized GoogleGenerativeAI");

      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log("Generative model fetched successfully");

      const result = await model.generateContent(`Given the following context, respond to the questions as accurately as you can. Type your responses in the following format: ALOHA{answer 1> answer 2> etc}. Do not deviate from the format, since your responses will be parsed by a script. Please do not put any formatting in your indiviual responses (i.e. newlines or backslashes), as they will be shown directly to the user. And PLEASE PLEASE PLEASE if you don't know an answer and it's not provided in the context, just put Unknown for the respective response. Context: ${context}\n\n\nQuestions: ${questions}`);
      // Send the questions and log the result
      console.log("Conversation result:", result.response.text());

      // Safely access the response text
      res.status(200).json({ answer: result.response.text() });
    } catch (error) {
      console.error("Error caught in try block:", error.message);
      res.status(500).json({ error: `Failed to process the request: ${error.message}` });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
