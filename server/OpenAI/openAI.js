import OpenAI from "openai";
import {z} from "zod";
import {zodResponseFormat} from "openai/helpers/zod";
import {createLogger} from "../Utils/logger.js"
import {AppError} from "../Utils/AppError.js";
import {fileURLToPath} from 'url';

// Create the equivalent of __filename for ES modules
const __filename = fileURLToPath(import.meta.url);

const logger = createLogger(__filename);

const openai = new OpenAI();

export const sqlResponse = z.object({
    isSelect: z.boolean(),
    sqlStatement: z.string(),
});

export const finalResponse = z.object({
    formattedAnswer: z.string(),
});

export async function generateGPTAnswer(prompt, responseFormat, responseName) {
    try {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: prompt,
            response_format: zodResponseFormat(responseFormat, responseName),
        });

        const response = completion.choices[0].message;

        if (response.refusal) {
            // Custom feedback after disturbing user input
            throw new AppError(
                "GPT model refused to answer due to disturbing user input."
            );
        }
        if (!response.parsed) {
            throw new AppError(`Generated GPT answer is null or undefined.`);
        }

        logger.info("Successfully generated an AI response! ✅");
        return response.parsed;
    } catch (error) {
        logger.error("❌ Error generating GPT answer.");
        throw error;
    }
}
