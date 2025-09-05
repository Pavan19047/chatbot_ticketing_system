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
<<<<<<< HEAD
  question: z.string().describe("The user's question."),
=======
  question: z.string().describe('The user\'s question about events, shows, or booking tickets.'),
>>>>>>> d280c72c329ef525d71c621831a82a1e89e4dbf6
  lang: z.string().describe('The language of the question (e.g., "en", "hi").'),
});
export type FaqInput = z.infer<typeof FaqInputSchema>;

const FaqOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      "The answer to the user's question. This will be displayed to the user."
    ),
  intent: z
    .enum(['ANSWER', 'SWITCH_TO_BOOKING'])
    .describe(
      "The user's intent. If the user wants to book tickets, this should be 'SWITCH_TO_BOOKING'."
    ),
});

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

<<<<<<< HEAD
const museumData = {
  en: {
    states: {
      Delhi: ['National Museum, New Delhi', 'National Rail Museum, New Delhi', 'Crafts Museum, New Delhi'],
      'West Bengal': ['Indian Museum, Kolkata', 'Victoria Memorial, Kolkata', 'Science City, Kolkata'],
      Telangana: ['Salar Jung Museum, Hyderabad', 'Nizam Museum, Hyderabad', 'Birla Science Museum, Hyderabad'],
      Maharashtra: ['Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai', 'Dr. Bhau Daji Lad Museum, Mumbai', 'Nehru Science Centre, Mumbai'],
      Karnataka: ['Visvesvaraya Industrial & Technological Museum, Bengaluru', 'HAL Aerospace Museum, Bengaluru', 'Karnataka Chitrakala Parishath, Bengaluru'],
      'Tamil Nadu': ['Government Museum, Chennai', 'DakshinaChitra Museum, Chennai', 'Fort St. George Museum, Chennai'],
      Rajasthan: ['Albert Hall Museum, Jaipur', 'City Palace Museum, Udaipur', 'Jaisalmer War Museum, Jaisalmer'],
      'Uttar Pradesh': ['Anand Bhavan Museum, Prayagraj', 'Sarnath Museum, Varanasi', 'Mathura Museum, Mathura'],
      Gujarat: ['Calico Museum of Textiles, Ahmedabad', 'Lalbhai Dalpatbhai Museum, Ahmedabad', 'Kite Museum, Ahmedabad'],
    },
    times: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
  },
  hi: {
    states: {
      दिल्ली: ['राष्ट्रीय संग्रहालय, नई दिल्ली', 'राष्ट्रीय रेल संग्रहालय, नई दिल्ली', 'शिल्प संग्रहालय, नई दिल्ली'],
      'पश्चिम बंगाल': ['भारतीय संग्रहालय, कोलकाता', 'विक्टोरिया मेमोरियल, कोलकाता', 'साइंस सिटी, कोलकाता'],
      तेलंगाना: ['सालार जंग संग्रहालय, हैदराबाद', 'निज़ाम संग्रहालय, हैदराबाद', 'बिड़ला विज्ञान संग्रहालय, हैदराबाद'],
      महाराष्ट्र: ['छत्रपति शिवाजी महाराज वास्तु संग्रहालय, मुंबई', 'डॉ. भाऊ दाजी लाड संग्रहालय, मुंबई', 'नेहरू विज्ञान केंद्र, मुंबई'],
      कर्नाटक: ['विश्वेश्वरैया औद्योगिक और तकनीकी संग्रहालय, बेंगलुरु', 'एचएएल एयरोस्पेस संग्रहालय, बेंगलुरु', 'कर्नाटक चित्रकला परिषद, बेंगलुरु'],
      तमिलनाडु: ['सरकारी संग्रहालय, चेन्नई', 'दक्षिणचित्र संग्रहालय, चेन्नई', 'फोर्ट सेंट जॉर्ज संग्रहालय, चेन्नई'],
      राजस्थान: ['अल्बर्ट हॉल संग्रहालय, जयपुर', 'सिटी पैलेस संग्रहालय, उदयपुर', 'जैसलमेर युद्ध संग्रहालय, जैसलमेर'],
      'उत्तर प्रदेश': ['आनंद भवन संग्रहालय, प्रयागराज', 'सारनाथ संग्रहालय, वाराणसी', 'मथुरा संग्रहालय, मथुरा'],
      गुजरात: ['कैलिको म्यूजियम ऑफ टेक्सटाइल्स, अहमदाबाद', 'लालभाई दलपतभाई संग्रहालय, अहमदाबाद', 'पतंग संग्रहालय, अहमदाबाद'],
    },
    times: ['सुबह 10:00', 'दोपहर 12:00', 'दोपहर 2:00', 'शाम 4:00'],
  },
  bn: {
    states: {
        'দিল্লি': ['জাতীয় জাদুঘর, নতুন দিল্লি', 'জাতীয় রেল জাদুঘর, নতুন দিল্লি', 'কারুশিল্প জাদুঘর, নতুন দিল্লি'],
        'পশ্চিমবঙ্গ': ['ভারতীয় জাদুঘর, কলকাতা', 'ভিক্টোরিয়া মেমোরিয়াল, কলকাতা', 'সায়েন্স সিটি, কলকাতা'],
        'তেলেঙ্গানা': ['সালার জং জাদুঘর, হায়দ্রাবাদ', 'নিজাম জাদুঘর, হায়দ্রাবাদ', 'বিড়লা বিজ্ঞান জাদুঘর, হায়দ্রাবাদ'],
        'মহারাষ্ট্র': ['ছত্রপতি শিবাজী মহারাজ वास्तु সংগ্রহালয়, মুম্বাই', 'ডঃ ভাউ দাজি লাড জাদুঘর, মুম্বাই', 'নেহেরু বিজ্ঞান কেন্দ্র, মুম্বাই'],
        'কর্ণাটক': ['বিশ্বেশ্বরায় শিল্প ও প্রযুক্তিগত জাদুঘর, বেঙ্গালুরু', 'এইচএএল মহাকাশ জাদুঘর, বেঙ্গালুরু', 'কর্নাটক চিত্রকলা পরিষদ, বেঙ্গালুরু'],
        'তামিলনাড়ু': ['সরকারি জাদুঘর, চেন্নাই', 'দক্ষিণচিত্র জাদুঘর, চেন্নাই', 'ফোর্ট সেন্ট জর্জ জাদুঘর, চেন্নাই'],
        'রাজস্থান': ['অ্যালবার্ট হল জাদুঘর, জয়পুর', 'সিটি প্যালেস জাদুঘর, উদয়পুর', 'জয়সলমীর যুদ্ধ জাদুঘর, জয়সলমীর'],
        'উত্তরপ্রদেশ': ['আনন্দ ভবন জাদুঘর, প্রয়াগরাজ', 'সারনাথ জাদুঘর, বারাণসী', 'মথুরা জাদুঘর, মথুরা'],
        'গুজরাট': ['ক্যালিকো টেক্সটাইল মিউজিয়াম, আহমেদাবাদ', 'লালভাই দলপতভাই জাদুঘর, আহমেদাবাদ', 'ঘুড়ি জাদুঘর, আহমেদাবাদ'],
    },
    times: ['সকাল ১০:০০', 'দুপুর ১২:০০', 'দুপুর ২:০০', 'বিকাল ৪:০০'],
  },
  ta: {
    states: {
        'டெல்லி': ['தேசிய அருங்காட்சியகம், புது டெல்லி', 'தேசிய ரயில் அருங்காட்சியகம், புது டெல்லி', 'கைவினை அருங்காட்சியகம், புது டெல்லி'],
        'மேற்கு வங்கம்': ['இந்திய அருங்காட்சியகம், கொல்கத்தா', 'விக்டோரியா நினைவிடம், கொல்கத்தா', 'அறிவியல் நகரம், கொல்கத்தா'],
        'தெலுங்கானா': ['சாலார் ஜங் அருங்காட்சியகம், ஹைதராபாத்', 'நிஜாம் அருங்காட்சியகம், ஹைதராபாத்', 'பிர்லா அறிவியல் அருங்காட்சியகம், ஹைதராபாத்'],
        'மகாராஷ்டிரா': ['சத்ரபதி சிவாஜி மகாராஜ் ವಸ್ತು சங்கராலயா, மும்பை', 'டாக்டர் பாவ் தாஜி லாட் அருங்காட்சியகம், மும்பை', 'நேரு அறிவியல் மையம், மும்பை'],
        'கர்நாடகா': ['விஸ்வேஸ்வரயா தொழில்துறை மற்றும் தொழில்நுட்ப அருங்காட்சியகம், பெங்களூரு', 'எச்ஏஎல் விண்வெளி அருங்காட்சியகம், பெங்களூரு', 'கர்நாடக சித்ரகலா பரிஷத், பெங்களூரு'],
        'தமிழ்நாடு': ['அரசு அருங்காட்சியகம், சென்னை', 'தட்சிணசித்ரா அருங்காட்சியகம், சென்னை', 'புனித ஜார்ஜ் கோட்டை அருங்காட்சியகம், சென்னை'],
        'ராஜஸ்தான்': ['ஆல்பர்ட் ஹால் அருங்காட்சியகம், ஜெய்ப்பூர்', 'நகர அரண்மனை அருங்காட்சியகம், உதய்பூர்', 'ஜெய்சால்மர் போர் அருங்காட்சியகம், ஜெய்சால்மர்'],
        'உத்தரப்பிரதேசம்': ['ஆனந்த பவன் அருங்காட்சியகம், பிரயாக்ராஜ்', 'சாரநாத் அருங்காட்சியகம், வாரணாசி', 'மதுரா அருங்காட்சியகம், மதுரா'],
        'குஜராத்': ['காலிகோ டெக்ஸ்டைல்ஸ் அருங்காட்சியகம், அகமதாபாத்', 'லால்பாய் தல்பத்பாய் அருங்காட்சியகம், அகமதாபாத்', 'காத்தாடி அருங்காட்சியகம், அகமதாபாத்'],
    },
    times: ['காலை 10:00', 'மதியம் 12:00', 'மதியம் 2:00', 'மாலை 4:00'],
  },
  te: {
    states: {
        'ఢిల్లీ': ['జాతీయ మ్యూజియం, న్యూఢిల్లీ', 'నేషనల్ రైల్ మ్యూజియం, న్యూఢిల్లీ', 'క్రాఫ్ట్స్ మ్యూజియం, న్యూఢిల్లీ'],
        'పశ్చిమ బెంగాల్': ['ఇండియన్ మ్యూజియం, కోల్‌కతా', 'విక్టోరియా మెమోరియల్, కోల్‌కతా', 'సైన్స్ సిటీ, కోల్‌కతా'],
        'తెలంగాణ': ['సాలార్ జంగ్ మ్యూజియం, హైదరాబాద్', 'నిజాం మ్యూజియం, హైదరాబాద్', 'బిర్లా సైన్స్ మ్యూజియం, హైదరాబాద్'],
        'మహారాష్ట్ర': ['ఛత్రపతి శివాజీ మహారాజ్ వాస్తు సంగ్రహాలయం, ముంబై', 'డాక్టర్ భావ్ దాజీ లాడ్ మ్యూజియం, ముంబై', 'నెహ్రూ సైన్స్ సెంటర్, ముంబై'],
        'కర్ణాటక': ['విశ్వేశ్వరయ్య ఇండస్ట్రియల్ & టెక్నలాజికల్ మ్యూజియం, బెంగళూరు', 'HAL ఏరోస్పేస్ మ్యూజియం, బెంగళూరు', 'కర్ణాటక చిత్రకళా పరిషత్, బెంగళూరు'],
        'తమిళనాడు': ['ప్రభుత్వ మ్యూజియం, చెన్నై', 'దక్షిణచిత్ర మ్యూజియం, చెన్నై', 'ఫోర్ట్ సెయింట్ జార్జ్ మ్యూజియం, చెన్నై'],
        'రాజస్థాన్': ['ఆల్బర్ట్ హాల్ మ్యూజియం, జైపూర్', 'సిటీ ప్యాలెస్ మ్యూజియం, ఉదయపూర్', 'జైసల్మేర్ వార్ మ్యూజియం, జైసల్మేర్'],
        'ఉత్తర ప్రదేశ్': ['ఆనంద్ భవన్ మ్యూజియం, ప్రయాగ్‌రాజ్', 'సారనాథ్ మ్యూజియం, వారణాసి', 'మధుర మ్యూజియం, మధుర'],
        'గుజరాత్': ['కాలికో మ్యూజియం ఆఫ్ టెక్స్‌టైల్స్, అహ్మదాబాద్', 'లాల్‌భాయ్ దల్పత్‌భాయ్ మ్యూజియం, అహ్మదాబాద్', 'కైట్ మ్యూజియం, అహ్మదాబాద్'],
    },
    times: ['ఉదయం 10:00', 'మధ్యాహ్నం 12:00', 'మధ్యాహ్నం 2:00', 'సాయంత్రం 4:00'],
  },
  kn: {
    states: {
        'ದೆಹಲಿ': ['ರಾಷ್ಟ್ರೀಯ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ನವದೆಹಲಿ', 'ರಾಷ್ಟ್ರೀಯ ರೈಲು ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ನವದೆಹಲಿ', 'ಕರಕುಶಲ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ನವದೆಹಲಿ'],
        'ಪಶ್ಚಿಮ ಬಂಗಾಳ': ['ಭಾರತೀಯ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಕೋಲ್ಕತ್ತಾ', 'ವಿಕ್ಟೋರಿಯಾ ಸ್ಮಾರಕ, ಕೋಲ್ಕತ್ತಾ', 'ವಿಜ್ಞಾನ ನಗರ, ಕೋಲ್ಕತ್ತಾ'],
        'ತೆಲಂಗಾಣ': ['ಸಾಲಾರ್ ಜಂಗ್ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಹೈದರಾಬಾದ್', 'ನಿಜಾಮ್ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಹೈದರಾಬಾದ್', 'ಬಿರ್ಲಾ ವಿಜ್ಞಾನ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಹೈದರಾಬಾದ್'],
        'ಮಹಾರಾಷ್ಟ್ರ': ['ಛತ್ರಪತಿ ಶಿವಾಜಿ ಮಹಾರಾಜ್ ವಸ್ತು ಸಂಗ್ರಹಾಲಯ, ಮುಂಬೈ', 'ಡಾ. ಭಾವು ದಾಜಿ ಲಾಡ್ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಮುಂಬೈ', 'ನೆಹರು ವಿಜ್ಞಾನ ಕೇಂದ್ರ, ಮುಂಬೈ'],
        'ಕರ್ನಾಟಕ': ['ವಿಶ್ವೇಶ್ವರಯ್ಯ ಕೈಗಾರಿಕಾ ಮತ್ತು ತಾಂತ್ರಿಕ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಬೆಂಗಳೂರು', 'ಎಚ್‌ಎಎಲ್ ಏರೋಸ್ಪೇಸ್ ಮ್ಯೂಸಿಯಂ, ಬೆಂಗಳೂರು', 'ಕರ್ನಾಟಕ ಚಿತ್ರಕಲಾ ಪರಿಷತ್, ಬೆಂಗಳೂರು'],
        'ತಮಿಳುನಾಡು': ['ಸರ್ಕಾರಿ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಚೆನ್ನೈ', 'ದಕ್ಷಿಣಚಿತ್ರ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಚೆನ್ನೈ', 'ಫೋರ್ಟ್ ಸೇಂಟ್ ಜಾರ್ಜ್ ಮ್ಯೂಸಿಯಂ, ಚೆನ್ನೈ'],
        'ರಾಜಸ್ಥಾನ': ['ಆಲ್ಬರ್ಟ್ ಹಾಲ್ ಮ್ಯೂಸಿಯಂ, ಜೈಪುರ', 'ಸಿಟಿ ಪ್ಯಾಲೇಸ್ ಮ್ಯೂಸಿಯಂ, ಉದಯಪುರ', 'ಜೈಸಲ್ಮೇರ್ ಯುದ್ಧ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಜೈಸಲ್ಮೇರ್'],
        'ಉತ್ತರ ಪ್ರದೇಶ': ['ಆನಂದ ಭವನ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಪ್ರಯಾಗ್‌ರಾಜ್', 'ಸಾರನಾಥ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ವಾರಣಾಸಿ', 'ಮಥುರಾ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಮಥುರಾ'],
        'ಗುಜರಾತ್': ['ಕ್ಯಾಲಿಕೊ ಮ್ಯೂಸಿಯಂ ಆಫ್ ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್, ಅಹಮದಾಬಾದ್', 'ಲಾಲ್‌ಭಾಯಿ ದಳಪತ್‌ಭಾಯಿ ಮ್ಯೂಸಿಯಂ, ಅಹಮದಾಬಾದ್', 'ಪತಂಗ ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಅಹಮದಾಬಾದ್'],
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
  output: { schema: FaqOutputSchema },
  prompt: `You are a friendly and conversational AI assistant for a museum booking app called "Museum Buddy". Your primary role is to answer user questions.

You have access to the following information about the museums. Use this data to answer questions about museum lists, locations, and timings.

Museum Data:
Museums: {{{museums}}}
Times: {{{times}}}

- If the user's question is about booking or purchasing tickets, or they say "switch to ticket booking", set the intent to 'SWITCH_TO_BOOKING' and provide a short confirmation message in the 'answer' field (e.g., "Switching to ticket booking...").
- For all other questions (including greetings), set the intent to 'ANSWER'.
- If the user asks for a list of museums, provide the list from the data above.
- If the user asks about timings, provide the available time slots.
- For all other general questions (e.g., "what is machine learning?", "who is the president?"), answer them as a general knowledge AI.
- If the user greets you, respond with a friendly greeting.

Answer in the same language as the original question.
        
Question: {{{question}}}
Language: {{{lang}}}
        
Keep your answer concise and helpful.`,
});
=======
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
>>>>>>> d280c72c329ef525d71c621831a82a1e89e4dbf6

const faqFlow = ai.defineFlow(
  {
    name: 'ticketBharatFaqFlow',
    inputSchema: FaqInputSchema,
    outputSchema: FaqOutputSchema,
  },
  async (input) => {
<<<<<<< HEAD
    const langData = museumData[input.lang as keyof typeof museumData] || museumData.en;
    
    const promptInput = {
      ...input,
      museums: JSON.stringify(langData.states),
      times: JSON.stringify(langData.times),
    };

    const { output } = await prompt(promptInput);

    if (output) {
      return output;
    }

    const fallbackMessages = {
      en: "I'm sorry, I don't understand your question. Could you please rephrase it?",
      hi: 'मुझे क्षमा करें, मैं आपके प्रश्न को समझ नहीं पाया। क्या आप कृपया इसे फिर से लिख सकते हैं?',
      bn: 'আমি দুঃখিত, আমি আপনার প্রশ্ন বুঝতে পারিনি। আপনি কি দয়া করে এটি পুনরায় বলতে পারেন?',
      ta: 'மன்னிக்கவும், உங்கள் கேள்வி எனக்குப் புரியவில்லை. தயவுசெய்து அதை வேறுவிதமாகக் கேட்க முடியுமா?',
      te: 'క్షమించండి, మీ ప్రశ్న నాకు అర్థం కాలేదు. దయచేసి దాన్ని మళ్లీ చెప్పగలరా?',
      kn: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅದನ್ನು ಬೇರೆ ರೀತಿಯಲ್ಲಿ ಕೇಳಬಹುದೇ?',
    };

    return {
      answer: fallbackMessages[input.lang as keyof typeof fallbackMessages] || fallbackMessages.en,
      intent: 'ANSWER',
=======
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
>>>>>>> d280c72c329ef525d71c621831a82a1e89e4dbf6
    }
  }
);
