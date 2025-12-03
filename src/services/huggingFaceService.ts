import { HfInference } from '@huggingface/inference';

export class HuggingFaceService {
    private client: HfInference | null = null;
    private apiKey: string | undefined;

    constructor() {
        this.loadApiKey();
    }

    private loadApiKey() {
        const env = import.meta.env;
        // Check for VITE_HUGGING_FACE_API_KEY
        if (env.VITE_HUGGING_FACE_API_KEY) {
            this.apiKey = env.VITE_HUGGING_FACE_API_KEY;
            this.client = new HfInference(this.apiKey);
        } else {
            console.warn('Hugging Face API Key not found. Fallback will not work.');
        }
    }

    async generateResponse(message: string, systemPrompt: string): Promise<string> {
        if (!this.client) {
            throw new Error('Hugging Face client not initialized (Missing API Key)');
        }

        try {
            // Using Mistral-7B-Instruct-v0.2 as it's a good general purpose chat model
            const response = await this.client.textGeneration({
                model: 'mistralai/Mistral-7B-Instruct-v0.2',
                inputs: `<s>[INST] ${systemPrompt}\n\n${message} [/INST]`,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    return_full_text: false,
                }
            });

            return response.generated_text;
        } catch (error) {
            console.error('Hugging Face API Error:', error);
            throw error;
        }
    }
}

export const huggingFaceService = new HuggingFaceService();
