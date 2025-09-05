'use server';
/**
 * @fileoverview A flow that answers user questions about the museum.
 *
 * - getAnswer - A function that handles the question answering process.
 * - FaqInput - The input type for the getAnswer function.
 * - FaqOutput - The return type for the getAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FaqInputSchema = z.object({
  question: z.string().describe("The user's question."),
  lang: z.string().describe('The language of the question (e.g., "en", "hi").'),
});
export type FaqInput = z.infer<typeof FaqInputSchema>;

const FaqOutputSchema = z.string().describe("The answer to the user's question. If the user wants to book tickets, respond with the special action 'BOOK_TICKETS'.");
export type FaqOutput = z.infer<typeof FaqOutputSchema>;

export async function getAnswer(input: FaqInput): Promise<FaqOutput> {
  return faqFlow(input);
}

const prompt = ai.definePrompt(
    {
        name: 'faqPrompt',
        input: { schema: FaqInputSchema },
        output: { schema: FaqOutputSchema.nullable() },
        prompt: `You are a friendly and conversational assistant for "Museum Buddy".

Your primary role is to answer any questions the user has, on any topic. Be helpful, informative, and engaging, like a universal AI assistant.

If the user greets you, respond with a friendly greeting.

If the user's question is about booking tickets, purchasing tickets, getting a ticket, or any other query that implies they want to start the ticket buying process, you must respond with the exact string "BOOK_TICKETS" and nothing else.

For all other questions, provide a comprehensive and helpful answer.

Answer in the same language as the original question.
        
Question: {{{question}}}
Language: {{{lang}}}
        
Keep your answer concise and helpful.`,
    }
)

const faqFlow = ai.defineFlow(
  {
    name: 'faqFlow',
    inputSchema: FaqInputSchema,
    outputSchema: FaqOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        if (input.lang === 'hi') {
            return 'मुझे आपका सवाल समझ नहीं आया। क्या आप इसे दूसरे तरीके से पूछ सकते हैं?';
        }
        return "I'm sorry, I don't understand your question. Could you please rephrase it?";
    }
    return output;
  }
);
