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
  question: z.string().describe('The user\'s question about the museum.'),
  lang: z.string().describe('The language of the question (e.g., "en", "hi").'),
});
export type FaqInput = z.infer<typeof FaqInputSchema>;

const FaqOutputSchema = z.string().describe("The answer to the user's question, or the special action 'BOOK_TICKETS' if the user wants to book a ticket.");
export type FaqOutput = z.infer<typeof FaqOutputSchema>;

export async function getAnswer(input: FaqInput): Promise<FaqOutput> {
  return faqFlow(input);
}

const prompt = ai.definePrompt(
    {
        name: 'faqPrompt',
        input: { schema: FaqInputSchema },
        output: { schema: FaqOutputSchema.nullable() },
        prompt: `You are a helpful assistant for a museum. A user is asking a question. Your primary goal is to answer their question based on the context of a museum.

However, if the user's question is about booking tickets, purchasing tickets, getting a list of museums, or any other query that implies they want to start the ticket buying process, you should respond with the exact string "BOOK_TICKETS" and nothing else.

Otherwise, answer the following question in the same language it was asked.
        
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
    if (output === null) {
        if (input.lang === 'hi') {
            return 'मुझे आपका सवाल समझ नहीं आया। क्या आप इसे दूसरे तरीके से पूछ सकते हैं?';
        }
        return "I'm sorry, I don't understand your question. Could you please rephrase it?";
    }
    return output;
  }
);
