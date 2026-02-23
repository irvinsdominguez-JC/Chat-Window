import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const chatModel = ai.chats.create({
  model: "gemini-3-flash-preview",
  config: {
    systemInstruction: `You are Joan S., an AI assistant for Jonas Chorum's property management solutions. 
    Your tone should be professional, helpful, and efficient. 
    Always identify yourself as Joan S. if asked. 
    You help users with property management software issues, folio questions, and general support.`,
  },
});

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
