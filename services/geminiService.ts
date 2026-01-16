
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Word, QuizQuestion } from "../types";

// Fix: Strictly follow SDK initialization using named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WORD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    term: { type: Type.STRING },
    meaning: { type: Type.STRING },
    partOfSpeech: { type: Type.STRING },
    example: { type: Type.STRING },
    synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
    antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["term", "meaning", "partOfSpeech", "example", "synonyms", "antonyms"]
};

export const generateWord = async (difficulty: Difficulty): Promise<Word> => {
  const prompt = `Generate a unique English word for a ${difficulty} level learner. Provide meaning, part of speech, an example sentence, 3 synonyms, and 3 antonyms.`;
  
  // Fix: Use correct model naming and content generation pattern
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: WORD_SCHEMA
    }
  });

  // Fix: Access .text property directly as recommended
  const data = JSON.parse(response.text || "{}");
  return {
    ...data,
    id: Math.random().toString(36).substring(7),
    difficulty,
    savedAt: Date.now()
  };
};

export const generateQuiz = async (words: Word[]): Promise<QuizQuestion[]> => {
  const wordsList = words.map(w => w.term).join(", ");
  const prompt = `Create a 5-question multiple choice quiz based on these words: ${wordsList}. Each question should test meaning or synonyms. For each question, provide 4 options, the correct answer, and a brief explanation.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  // Fix: Access .text property directly as recommended
  return JSON.parse(response.text || "[]");
};

export const getMotivationalQuote = async (): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide a short, powerful motivational quote for a student learning English vocabulary. Return only the quote text.",
  });
  // Fix: Access .text property directly as recommended
  return response.text || "Every word you learn is a new window to the world.";
};
