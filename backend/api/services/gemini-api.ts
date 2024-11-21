import axios from 'axios';

const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

/**
 * Summarize sprint data using the Google Generative AI API.
 *
 * @param prompt The formatted data to be summarized.
 * @returns The summarized version of the sprint data.
 */
export async function summarizeWithGoogleAI(prompt: string): Promise<string> {
    try {
        const response = await axios.post(GOOGLE_AI_API_URL, {
            prompt: prompt,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GOOGLE_AI_API_KEY}`,
            },
        });

        return response.data.summary;
    } catch (error) {
        console.error('Error summarizing with Google Generative AI API:', error);
        throw error;
    }
}