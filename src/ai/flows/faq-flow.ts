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

const museumData = {
  en: {
    states: {
      Delhi: ['National Museum, New Delhi'],
      'West Bengal': ['Indian Museum, Kolkata'],
      Telangana: ['Salar Jung Museum, Hyderabad'],
      Maharashtra: ['Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai'],
      Karnataka: ['Visvesvaraya Industrial & Technological Museum, Bengaluru'],
      'Tamil Nadu': ['Government Museum, Chennai'],
      Rajasthan: ['Albert Hall Museum, Jaipur'],
      'Uttar Pradesh': ['Anand Bhavan Museum, Prayagraj'],
      Gujarat: ['Calico Museum of Textiles, Ahmedabad'],
    },
    times: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
  },
  hi: {
    states: {
      दिल्ली: ['राष्ट्रीय संग्रहालय, नई दिल्ली'],
      'पश्चिम बंगाल': ['भारतीय संग्रहालय, कोलकाता'],
      तेलंगाना: ['सालार जंग संग्रहालय, हैदराबाद'],
      महाराष्ट्र: ['छत्रपति शिवाजी महाराज वास्तु संग्रहालय, मुंबई'],
      कर्नाटक: ['विश्वेश्वरैया औद्योगिक और तकनीकी संग्रहालय, बेंगलुरु'],
      तमिलनाडु: ['सरकारी संग्रहालय, चेन्नई'],
      राजस्थान: ['अल्बर्ट हॉल संग्रहालय, जयपुर'],
      'उत्तर प्रदेश': ['आनंद भवन संग्रहालय, प्रयागराज'],
      गुजरात: ['कैलिको म्यूजियम ऑफ टेक्सटाइल्स, अहमदाबाद'],
    },
    times: ['सुबह 10:00', 'दोपहर 12:00', 'दोपहर 2:00', 'शाम 4:00'],
  },
  bn: {
    states: {
        'দিল্লি': ['জাতীয় জাদুঘর, নতুন দিল্লি'],
        'পশ্চিমবঙ্গ': ['ভারতীয় জাদুঘর, কলকাতা'],
        'তেলেঙ্গানা': ['সালার জং জাদুঘর, হায়দ্রাবাদ'],
        'মহারাষ্ট্র': ['ছত্রপতি শিবাজী মহারাজ वास्तु সংগ্রহালয়, মুম্বাই'],
        'কর্ণাটক': ['বিশ্বেশ্বরায় শিল্প ও প্রযুক্তিগত জাদুঘর, বেঙ্গালুরু'],
        'তামিলনাড়ু': ['সরকারি জাদুঘর, চেন্নাই'],
        'রাজস্থান': ['অ্যালবার্ট হল জাদুঘর, জয়পুর'],
        'উত্তরপ্রদেশ': ['আনন্দ ভবন জাদুঘর, প্রয়াগরাজ'],
        'গুজরাট': ['ক্যালিকো টেক্সটাইল মিউজিয়াম, আহমেদাবাদ'],
    },
    times: ['সকাল ১০:০০', 'দুপুর ১২:০০', 'দুপুর ২:০০', 'বিকাল ৪:০০'],
  },
  ta: {
    states: {
        'டெல்லி': ['தேசிய அருங்காட்சியகம், புது டெல்லி'],
        'மேற்கு வங்கம்': ['இந்திய அருங்காட்சியகம், கொல்கத்தா'],
        'தெலுங்கானா': ['சாலார் ஜங் அருங்காட்சியகம், ஹைதராபாத்'],
        'மகாராஷ்டிரா': ['சத்ரபதி சிவாஜி மகாராஜ் ವಸ್ತು சங்கராலயா, மும்பை'],
        'கர்நாடகா': ['விஸ்வேஸ்வரயா தொழில்துறை மற்றும் தொழில்நுட்ப அருங்காட்சியகம், பெங்களூரு'],
        'தமிழ்நாடு': ['அரசு அருங்காட்சியகம், சென்னை'],
        'ராஜஸ்தான்': ['ஆல்பர்ட் ஹால் அருங்காட்சியகம், ஜெய்ப்பூர்'],
        'உத்தரப்பிரதேசம்': ['ஆனந்த பவன் அருங்காட்சியகம், பிரயாக்ராஜ்'],
        'குஜராத்': ['காலிகோ டெக்ஸ்டைல்ஸ் அருங்காட்சியகம், அகமதாபாத்'],
    },
    times: ['காலை 10:00', 'மதியம் 12:00', 'மதியம் 2:00', 'மாலை 4:00'],
  },
  te: {
    states: {
        'ఢిల్లీ': ['జాతీయ మ్యూజియం, న్యూఢిల్లీ'],
        'పశ్చిమ బెంగాల్': ['ఇండియన్ మ్యూజియం, కోల్‌కతా'],
        'తెలంగాణ': ['సాలార్ జంగ్ మ్యూజియం, హైదరాబాద్'],
        'మహారాష్ట్ర': ['ఛత్రపతి శివాజీ మహారాజ్ వాస్తు సంగ్రహాలయం, ముంబై'],
        'కర్ణాటక': ['విశ్వేశ్వరయ్య ఇండస్ట్రియల్ & టెక్నలాజికల్ మ్యూజియం, బెంగళూరు'],
        'తమిళనాడు': ['ప్రభుత్వ మ్యూజియం, చెన్నై'],
        'రాజస్థాన్': ['ఆల్బర్ట్ హాల్ మ్యూజియం, జైపూర్'],
        'ఉత్తర ప్రదేశ్': ['ఆనంద్ భవన్ మ్యూజియం, ప్రయాగ్‌రాజ్'],
        'గుజరాత్': ['కాలికో మ్యూజియం ఆఫ్ టెక్స్‌టైల్స్, అహ్మదాబాద్'],
    },
    times: ['ఉదయం 10:00', 'మధ్యాహ్నం 12:00', 'మధ్యాహ్నం 2:00', 'సాయంత్రం 4:00'],
  },
  kn: {
    states: {
        'ದೆಹಲಿ': ['ರಾಷ್ಟ್ರೀಯ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ನವದೆಹಲಿ'],
        'ಪಶ್ಚಿಮ ಬಂಗಾಳ': ['ಭಾರತೀಯ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಕೋಲ್ಕತ್ತಾ'],
        'ತೆಲಂಗಾಣ': ['ಸಾಲಾರ್ ಜಂಗ್ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಹೈದರಾಬಾದ್'],
        'ಮಹಾರಾಷ್ಟ್ರ': ['ಛತ್ರಪತಿ ಶಿವಾಜಿ ಮಹಾರಾಜ್ ವಸ್ತು ಸಂಗ್ರಹಾಲಯ, ಮುಂಬೈ'],
        'ಕರ್ನಾಟಕ': ['ವಿಶ್ವೇಶ್ವರಯ್ಯ ಕೈಗಾರಿಕಾ ಮತ್ತು ತಾಂತ್ರಿಕ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಬೆಂಗಳೂರು'],
        'ತಮಿಳುನಾಡು': ['ಸರ್ಕಾರಿ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಚೆನ್ನೈ'],
        'ರಾಜಸ್ಥಾನ': ['ಆಲ್ಬರ್ಟ್ ಹಾಲ್ ಮ್ಯೂಸಿಯಂ, ಜೈಪುರ'],
        'ಉತ್ತರ ಪ್ರದೇಶ': ['ಆನಂದ ಭವನ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಪ್ರಯಾಗ್‌ರಾಜ್'],
        'ಗುಜರಾತ್': ['ಕ್ಯಾಲಿಕೊ ಮ್ಯೂಸಿಯಂ ಆಫ್ ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್, ಅಹಮದಾಬಾದ್'],
    },
    times: ['ಬೆಳಿಗ್ಗೆ 10:00', 'ಮಧ್ಯಾಹ್ನ 12:00', 'ಮಧ್ಯಾಹ್ನ 2:00', 'ಸಂಜೆ 4:00'],
  },
};

const prompt = ai.definePrompt({
  name: 'faqPrompt',
  input: {
    schema: z.object({
      ...FaqInputSchema.shape,
      museums: z.string(),
      times: z.string(),
    }),
  },
  prompt: `You are a friendly and conversational AI assistant for a museum booking app called "Museum Buddy". Your primary role is to answer user questions.

You have access to the following information about the museums. Use this data to answer questions about museum lists, locations, and timings.

Museum Data:
Museums: {{{museums}}}
Times: {{{times}}}

- If the user asks for a list of museums, provide the list from the data above.
- If the user asks about timings, provide the available time slots.
- For all other general questions (e.g., "what is machine learning?", "who is the president?"), answer them as a general knowledge AI.
- If the user greets you, respond with a friendly greeting.
- If the user's question is about booking or purchasing tickets, you should not try to book the tickets yourself. Instead, politely suggest that they use the "Ticket Booking" mode for that purpose.

Answer in the same language as the original question.
        
Question: {{{question}}}
Language: {{{lang}}}
        
Keep your answer concise and helpful.`,
});

const faqFlow = ai.defineFlow(
  {
    name: 'faqFlow',
    inputSchema: FaqInputSchema,
    outputSchema: FaqOutputSchema,
  },
  async (input) => {
    const langData = museumData[input.lang as keyof typeof museumData] || museumData.en;
    
    const promptInput = {
      ...input,
      museums: JSON.stringify(langData.states),
      times: JSON.stringify(langData.times),
    };

    const { output } = await prompt(promptInput);

    // Validate the output to ensure it's a non-empty string.
    if (typeof output === 'string' && output.length > 0) {
      return output;
    }

    // Fallback message if the AI returns a null or empty response.
    const fallbackMessages = {
      en: "I'm sorry, I don't understand your question. Could you please rephrase it?",
      hi: 'मुझे क्षमा करें, मैं आपके प्रश्न को समझ नहीं पाया। क्या आप कृपया इसे फिर से लिख सकते हैं?',
      bn: 'আমি দুঃখিত, আমি আপনার প্রশ্ন বুঝতে পারিনি। আপনি কি দয়া করে এটি পুনরায় বলতে পারেন?',
      ta: 'மன்னிக்கவும், உங்கள் கேள்வி எனக்குப் புரியவில்லை. தயவுசெய்து அதை வேறுவிதமாகக் கேட்க முடியுமா?',
      te: 'క్షమించండి, మీ ప్రశ్న నాకు అర్థం కాలేదు. దయచేసి దాన్ని మళ్లీ చెప్పగలరా?',
      kn: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅದನ್ನು ಬೇರೆ ರೀತಿಯಲ್ಲಿ ಕೇಳಬಹುದೇ?',
    };

    return fallbackMessages[input.lang as keyof typeof fallbackMessages] || fallbackMessages.en;
  }
);
