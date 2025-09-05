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

const museumData = {
    'Andhra Pradesh': ['Salar Jung Museum, Hyderabad (shared with Telangana)'],
    'Arunachal Pradesh': ['Jawaharlal Nehru Museum, Itanagar'],
    'Assam': ['Assam State Museum, Guwahati'],
    'Bihar': ['Bihar Museum, Patna'],
    'Chhattisgarh': ['Mahant Ghasidas Memorial Museum, Raipur'],
    'Goa': ['Goa State Museum, Panaji'],
    'Gujarat': ['Calico Museum of Textiles, Ahmedabad'],
    'Haryana': ['Heritage Transport Museum, Gurgaon'],
    'Himachal Pradesh': ['Shimla State Museum, Shimla'],
    'Jharkhand': ['Ranchi Science Centre, Ranchi'],
    'Karnataka': ['Visvesvaraya Industrial & Technological Museum, Bengaluru'],
    'Kerala': ['Napier Museum, Thiruvananthapuram'],
    'Madhya Pradesh': ['State Museum, Bhopal'],
    'Maharashtra': ['Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai'],
    'Manipur': ['Manipur State Museum, Imphal'],
    'Meghalaya': ['Don Bosco Centre for Indigenous Cultures, Shillong'],
    'Mizoram': ['Mizoram State Museum, Aizawl'],
    'Nagaland': ['Nagaland State Museum, Kohima'],
    'Odisha': ['Odisha State Museum, Bhubaneswar'],
    'Punjab': ['Virasat-e-Khalsa, Anandpur Sahib'],
    'Rajasthan': ['Albert Hall Museum, Jaipur'],
    'Sikkim': ['Namgyal Institute of Tibetology, Gangtok'],
    'Tamil Nadu': ['Government Museum, Chennai'],
    'Telangana': ['Salar Jung Museum, Hyderabad'],
    'Tripura': ['Tripura State Museum, Agartala'],
    'Uttar Pradesh': ['Anand Bhavan Museum, Prayagraj'],
    'Uttarakhand': ['Forest Research Institute, Dehradun'],
    'West Bengal': ['Indian Museum, Kolkata'],
    'Delhi': ['National Museum, New Delhi']
};

const prompt = ai.definePrompt(
    {
        name: 'faqPrompt',
        input: { schema: FaqInputSchema },
        output: { schema: FaqOutputSchema.nullable() },
        prompt: `You are a friendly and conversational assistant for "Museum Buddy".

Your primary role is to answer questions.

If the user greets you, respond with a friendly greeting.

If the user asks for a list of museums or which museums are available, you should list them from the data provided below. After listing them, you can ask if they would like to book a ticket.

If the user's question is about booking tickets, purchasing tickets, or any other query that implies they want to start the ticket buying process (but not just asking for a list), you must respond with the exact string "BOOK_TICKETS" and nothing else.

If the question is about a specific museum from the list, answer it in a helpful and concise way.

If the question is a general knowledge question, answer it accurately.

Answer in the same language as the original question.
        
Here is the list of available museums you know about:
${JSON.stringify(museumData, null, 2)}
        
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
