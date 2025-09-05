'use server';
/**
 * @fileoverview A flow that answers user questions about TicketBharat events and shows.
 *
 * - getAnswer - A function that handles the question answering process.
 * - FaqInput - The input type for the getAnswer function.
 * - FaqOutput - The return type for the getAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FaqInputSchema = z.object({
  question: z.string().describe('The user\'s question about events, shows, or booking tickets.'),
  lang: z.string().describe('The language of the question (e.g., "en", "hi").'),
});
export type FaqInput = z.infer<typeof FaqInputSchema>;

const FaqOutputSchema = z.string().describe("The answer to the user's question, or the special action 'BOOK_TICKETS' if the user wants to book a ticket.");
export type FaqOutput = z.infer<typeof FaqOutputSchema>;

export async function getAnswer(input: FaqInput): Promise<FaqOutput> {
  try {
    return await faqFlow(input);
  } catch (error) {
    console.error('Error in FAQ flow:', error);
    if (input.lang === 'hi') {
      return 'मुझे खुशी होगी कि मैं आपकी मदद कर सकूं! आप टिकट बुकिंग, शो की जानकारी या किसी भी अन्य सवाल के बारे में पूछ सकते हैं।';
    }
    return "I'd be happy to help you! You can ask about ticket booking, show information, or any other questions.";
  }
}

const prompt = ai.definePrompt(
    {
        name: 'ticketBharatFaqPrompt',
        input: { schema: FaqInputSchema },
        output: { schema: FaqOutputSchema.nullable() },
        prompt: `You are a helpful assistant for TicketBharat, India's premier event ticketing platform. You help users with information about events, shows, concerts, movies, sports, and cultural events across India.

IMPORTANT: If the user's question is about booking tickets, purchasing tickets, checking show timings, seat availability, or anything related to making a purchase, you must respond with exactly "BOOK_TICKETS" and nothing else.

For other questions, provide helpful information about:
- Popular events and shows in Indian cities
- Different types of entertainment (Bollywood movies, concerts, theater, sports)
- Indian cultural events and festivals
- General information about venues and entertainment

Examples of questions that should trigger "BOOK_TICKETS":
- "I want to book tickets"
- "Show me movies playing"
- "Book seats for tomorrow"
- "Check availability"
- "How much do tickets cost"

Answer in the same language as the question. Be culturally aware and mention Indian context when relevant.

Question: {{{question}}}
Language: {{{lang}}}

Keep your answer helpful and concise.`,
    }
)

const faqFlow = ai.defineFlow(
  {
    name: 'ticketBharatFaqFlow',
    inputSchema: FaqInputSchema,
    outputSchema: FaqOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (output === null) {
          if (input.lang === 'hi') {
              return 'मुझे आपका सवाल समझ नहीं आया। क्या आप इसे दूसरे तरीके से पूछ सकते हैं? आप टिकट बुकिंग के बारे में भी पूछ सकते हैं।';
          }
          return "I'm sorry, I don't understand your question. Could you please rephrase it? You can also ask about ticket booking.";
      }
      return output;
    } catch (error) {
      console.error('Error in prompt execution:', error);
      if (input.lang === 'hi') {
        return 'मुझे आपकी सहायता करने में खुशी होगी! कृपया अपना प्रश्न पूछें।';
      }
      return "I'd be happy to help you! Please ask your question.";
    }
  }
);
