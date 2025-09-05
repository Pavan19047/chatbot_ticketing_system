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

const FaqOutputSchema = z
  .string()
  .describe(
    "The answer to the user's question. If the user wants to book tickets, suggest they use the 'Ticket Booking' mode."
  );
export type FaqOutput = z.infer<typeof FaqOutputSchema>;

export async function getAnswer(input: FaqInput): Promise<FaqOutput> {
  return faqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqPrompt',
  input: { schema: FaqInputSchema },
  prompt: `You are a friendly and conversational AI assistant.

Your primary role is to answer any questions the user has, on any topic. Be helpful, informative, and engaging, like a universal AI assistant such as Gemini.

If the user greets you, respond with a friendly greeting.

If the user's question is about booking or purchasing tickets, you should not try to book the tickets yourself. Instead, politely suggest that they use the "Ticket Booking" mode for that purpose.

For all other questions, provide a comprehensive and helpful answer.

Answer in the same language as the original question.
        
Question: {{{question}}}
Language: {{{lang}}}
        
Keep your answer concise and helpful. If you cannot answer the question or if it is unintelligible, respond with "I'm sorry, I don't understand your question. Could you please rephrase it?" in the user's language.`,
});

const faqFlow = ai.defineFlow(
  {
    name: 'faqFlow',
    inputSchema: FaqInputSchema,
    outputSchema: FaqOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (typeof output === 'string' && output.length > 0) {
      return output;
    }

    if (input.lang === 'hi') {
      return 'मुझे क्षमा करें, मैं आपके प्रश्न को समझ नहीं पाया। क्या आप कृपया इसे फिर से लिख सकते हैं?';
    }
    return "I'm sorry, I don't understand your question. Could you please rephrase it?";
  }
);
