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

const FaqOutputSchema = z.string().describe('The answer to the user\'s question.');
export type FaqOutput = z.infer<typeof FaqOutputSchema>;

export async function getAnswer(input: FaqInput): Promise<FaqOutput> {
  return faqFlow(input);
}

const prompt = ai.definePrompt(
    {
        name: 'faqPrompt',
        input: { schema: FaqInputSchema },
        output: { schema: FaqOutputSchema },
        prompt: `You are a helpful assistant for a museum. A user is asking a question. 
        
        Answer the following question in the same language it was asked.
        
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
    return output!;
  }
);
