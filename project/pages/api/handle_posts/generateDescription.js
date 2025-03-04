import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing Google Gemini API key" });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tạo một đoạn mô tả gồm tiêu đề và mô tả về bài đăng bất động sản dựa trên thông tin sau: ${description}`;

    // Set max tokens here
    const result = await model.generateContent(prompt, {
      generationConfig: {
        maxOutputTokens: 500, // Adjust as needed
      },
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ description: text });
  } catch (error) {
    console.error("Error generating description:", error);
    return res.status(500).json({ error: "Failed to generate description" });
  }
}
