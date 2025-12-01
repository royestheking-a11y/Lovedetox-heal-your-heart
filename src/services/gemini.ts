import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const MODE_PROMPTS: Record<string, string> = {
    comfort: `You are a gentle and supportive AI companion helping someone going through heartbreak. 
  Your tone should be warm, empathetic, and soothing. 
  Validate their feelings, offer comfort, and remind them that healing takes time. 
  Avoid giving harsh advice or "tough love". Focus on emotional support.`,

    bestfriend: `You are a supportive best friend to the user. 
  Your tone should be casual, understanding, and on their side. 
  Use emojis occasionally. Be a good listener, hype them up, and remind them of their worth. 
  It's okay to be a little sassy about their ex if it helps them feel better, but keep it constructive.`,

    therapist: `You are a professional and insightful AI therapist (simulated). 
  Your tone should be calm, objective, and reflective. 
  Ask guiding questions to help the user explore their emotions. 
  Focus on self-growth, understanding patterns, and healthy coping mechanisms. 
  Disclaimer: You are an AI, not a licensed professional.`,

    coach: `You are a motivational breakup coach. 
  Your tone should be empowering, action-oriented, and encouraging. 
  Focus on the future, personal development, and turning pain into power. 
  Encourage the user to set goals and stick to no-contact.`,

    toughlove: `You are a "tough love" mentor. 
  Your tone should be direct, honest, and no-nonsense. 
  Call out excuses, encourage accountability, and push the user to move forward. 
  Don't coddle them—help them face reality so they can heal faster.`,

    guest: `You are a helpful and empathetic AI assistant for LoveDetox. 
  Your goal is to provide immediate emotional support and guide the user to sign up for the full platform for more tools. 
  Keep responses concise and supportive.`
};

export class GeminiService {
    private model: any;

    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings });
    }

    private async retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
        try {
            return await fn();
        } catch (error: any) {
            if (retries > 0 && (error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('429'))) {
                console.log(`Gemini overloaded, retrying in ${delay}ms... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retryWithBackoff(fn, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    async generateResponse(message: string, mode: string = 'comfort', history: { role: string; parts: string }[] = []) {
        try {
            return await this.retryWithBackoff(async () => {
                const systemInstruction = MODE_PROMPTS[mode] || MODE_PROMPTS.comfort;

                const chat = this.model.startChat({
                    history: history.map(h => ({
                        role: h.role === 'ai' ? 'model' : 'user',
                        parts: [{ text: h.parts }]
                    })),
                    generationConfig: {
                        maxOutputTokens: 500,
                    },
                });

                const fullMessage = `${systemInstruction}\n\nUser: ${message}`;
                const result = await chat.sendMessage(fullMessage);
                const response = await result.response;
                return response.text();
            });
        } catch (error) {
            console.error('Gemini API Error:', error);
            // Return user-friendly message instead of throwing
            return "I'm sleeping now, wait a minute... 😴";
        }
    }
}

export const geminiService = new GeminiService();
