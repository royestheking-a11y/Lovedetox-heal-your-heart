import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Safety settings for the model
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
    private apiKeys: string[] = [];

    constructor() {
        this.loadApiKeys();
    }

    private loadApiKeys() {
        const env = import.meta.env;

        // 1. Add the main key
        if (env.VITE_GEMINI_API_KEY) {
            this.apiKeys.push(env.VITE_GEMINI_API_KEY);
        }

        // 2. Add numbered keys (VITE_GEMINI_API_KEY_1 to VITE_GEMINI_API_KEY_20)
        // This allows the user to add up to 20 additional keys for load balancing
        for (let i = 1; i <= 20; i++) {
            const key = env[`VITE_GEMINI_API_KEY_${i}`];
            if (key) {
                this.apiKeys.push(key);
            }
        }

        // Remove duplicates
        this.apiKeys = [...new Set(this.apiKeys)];

        if (this.apiKeys.length === 0) {
            console.error('CRITICAL: No Gemini API Keys found! AI features will not work.');
        } else {
            console.log(`✅ Loaded ${this.apiKeys.length} Gemini API keys for load balancing.`);
        }
    }

    private getRandomKey(): string {
        if (this.apiKeys.length === 0) {
            throw new Error('No API Keys configured');
        }
        const randomIndex = Math.floor(Math.random() * this.apiKeys.length);
        return this.apiKeys[randomIndex];
    }

    async generateResponse(message: string, mode: string = 'comfort', history: { role: string; parts: string }[] = []) {
        try {
            // Get a random key for this request to distribute load
            const apiKey = this.getRandomKey();

            // Initialize the client with the selected key
            const genAI = new GoogleGenerativeAI(apiKey);

            // Use gemini-1.5-flash for better performance and reliability
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', safetySettings });

            const systemInstruction = MODE_PROMPTS[mode] || MODE_PROMPTS.comfort;

            const chat = model.startChat({
                history: history.map(h => ({
                    role: h.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: h.parts }]
                })),
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });

            // Prepend system instruction to the message
            const fullMessage = `${systemInstruction}\n\nUser: ${message}`;

            const result = await chat.sendMessage(fullMessage);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini API Error:', error);

            // If it's a rate limit error (429), we could potentially retry with another key here
            // For now, we just throw, but the random key selection on next try helps.
            if (error.message?.includes('429') || error.status === 429) {
                console.warn('Rate limit hit. The next request will likely use a different key.');
            }

            throw error;
        }
    }
}

export const geminiService = new GeminiService();
