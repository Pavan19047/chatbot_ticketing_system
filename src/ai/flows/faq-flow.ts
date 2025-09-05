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
    
    // Fallback responses when AI is not available
    const question = input.question.toLowerCase();
    
    // Only redirect to booking for EXPLICIT booking requests
    if (question.includes('book ticket') || question.includes('buy ticket') || 
        question.includes('purchase ticket') || question.includes('i want to book') ||
        question.includes('टिकट बुक करना') || question.includes('टिकट खरीदना')) {
      return 'BOOK_TICKETS';
    }
    
    // Provide natural responses for common questions
    if (question.includes('hello') || question.includes('hi') || question.includes('नमस्ते')) {
      if (input.lang === 'hi') {
        return 'नमस्ते! मैं TicketBharat का सहायक हूं। मैं फिल्में, कॉन्सर्ट, खेल और अन्य मनोरंजन कार्यक्रमों के बारे में जानकारी दे सकता हूं। आप मुझसे कुछ भी पूछ सकते हैं!';
      }
      return 'Hello! I\'m your TicketBharat assistant. I can provide information about movies, concerts, sports, and entertainment events. Ask me anything!';
    }
    
    if (question.includes('movie') || question.includes('फिल्म')) {
      if (input.lang === 'hi') {
        return 'हमारे पास बॉलीवुड, हॉलीवुड और क्षेत्रीय फिल्में उपलब्ध हैं। आप अपने शहर में चल रही लेटेस्ट फिल्में देख सकते हैं। कोई खास फिल्म के बारे में जानना चाहते हैं?';
      }
      return 'We have Bollywood, Hollywood, and regional movies available. You can check the latest movies playing in your city. Looking for information about any specific movie?';
    }
    
    if (question.includes('concert') || question.includes('कॉन्सर्ट')) {
      if (input.lang === 'hi') {
        return 'हमारे पास शास्त्रीय संगीत, बॉलीवुड कॉन्सर्ट, रॉक शो और अन्य संगीत कार्यक्रम होते रहते हैं। दिल्ली, मुंबई, बैंगलोर में नियमित कॉन्सर्ट होते हैं।';
      }
      return 'We have classical music, Bollywood concerts, rock shows, and other musical events. Regular concerts happen in Delhi, Mumbai, Bangalore, and other major cities.';
    }
    
    if (question.includes('sports') || question.includes('खेल')) {
      if (input.lang === 'hi') {
        return 'हमारे पास क्रिकेट मैच, फुटबॉल गेम्स, कबड्डी लीग और अन्य खेल इवेंट्स की टिकट मिलती हैं। IPL, ISL जैसी लीग्स की टिकट भी उपलब्ध हैं।';
      }
      return 'We have tickets for cricket matches, football games, kabaddi leagues, and other sports events. Tickets for leagues like IPL, ISL are also available.';
    }
    
    if (question.includes('price') || question.includes('cost') || question.includes('कीमत')) {
      if (input.lang === 'hi') {
        return 'टिकट की कीमत इवेंट और सीट के हिसाब से अलग होती है। आमतौर पर फिल्म टिकट ₹150-500, कॉन्सर्ट ₹500-5000, और खेल ₹300-2000 तक होती हैं।';
      }
      return 'Ticket prices vary by event and seating. Typically, movie tickets range ₹150-500, concerts ₹500-5000, and sports events ₹300-2000.';
    }
    
    // Default helpful response
    if (input.lang === 'hi') {
      return 'मैं TicketBharat के बारे में जानकारी दे सकता हूं! आप मुझसे फिल्में, कॉन्सर्ट, खेल, या किसी भी मनोरंजन कार्यक्रम के बारे में पूछ सकते हैं। क्या आप कोई खास चीज़ जानना चाहते हैं?';
    }
    return "I can provide information about TicketBharat! You can ask me about movies, concerts, sports, or any entertainment events. What would you like to know?";
  }
}

const prompt = ai.definePrompt(
    {
        name: 'ticketBharatFaqPrompt',
        input: { schema: FaqInputSchema },
        output: { schema: FaqOutputSchema.nullable() },
        prompt: `You are a helpful assistant for TicketBharat, India's premier event ticketing platform. You help users with information about events, shows, concerts, movies, sports, and cultural events across India.

IMPORTANT: Only respond with exactly "BOOK_TICKETS" if the user explicitly wants to book, purchase, or buy tickets. Examples:
- "I want to book tickets"
- "Book tickets for me"
- "I want to buy tickets"
- "Purchase tickets"
- "Help me book"

For informational questions, provide helpful responses about:
- Popular events and shows in Indian cities
- Different types of entertainment (Bollywood movies, concerts, theater, sports)
- Indian cultural events and festivals
- General information about venues and entertainment
- Ticket prices and availability (informational only)
- Show timings and venues (informational only)

Answer naturally and conversationally. Be culturally aware and mention Indian context when relevant.
Answer in the same language as the question.

Question: {{{question}}}
Language: {{{lang}}}

Keep your answer helpful, informative, and engaging.`,
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
