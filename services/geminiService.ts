import { GoogleGenAI, ChatSession, GenerativeModel } from "@google/genai";
import { PersonaConfig } from "../types";

let chatSession: ChatSession | null = null;
let currentModel: GenerativeModel | null = null;

export const initializeChat = async (apiKey: string, persona: PersonaConfig) => {
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';
  
  // We don't create the session here immediately because we might need to handle history manually
  // or use the chat helper. For this app, we'll use the Chat helper.
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: persona.systemInstruction,
    }
  });

  chatSession = chat;
  return chat;
};

export const sendMessageToGemini = async (text: string) => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  const result = await chatSession.sendMessage({
    message: text
  });

  return result.text;
};

export const mockNLPSteps = (text: string) => {
    // This helper just generates dynamic steps based on input length for visualization
    const tokens = text.split(' ').length;
    return [
        { id: '1', label: 'Input Analysis', details: `Tokenizing ${tokens} words...`, state: 'active' },
        { id: '2', label: 'Context Retrieval', details: 'Accessing short-term memory...', state: 'idle' },
        { id: '3', label: 'Intent Recognition', details: 'Classifying user intent...', state: 'idle' },
        { id: '4', label: 'Safety Check', details: 'Scanning against safety guidelines...', state: 'idle' },
        { id: '5', label: 'Response Generation', details: 'Predicting next tokens...', state: 'idle' },
    ];
};