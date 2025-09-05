'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Ticket, MessageCircleQuestion } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import type { Message, TicketOrder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble } from './chat-bubble';
import { Calendar } from '../ui/calendar';
import { TicketSummary } from './ticket-summary';
import { PaymentDialog } from './payment-dialog';
import { DigitalTicket } from './digital-ticket';
import { getAnswer } from '@/ai/flows/faq-flow';

const translations = {
  en: {
    welcome: "Hello! I'm Museum Buddy. How can I help you today? You can ask me anything or switch to 'Ticket Booking' to buy tickets.",
    welcomeBooking: 'Welcome to Ticket Booking. Please select a state to begin.',
    welcomeFaq: 'You can ask me anything about museums or general topics.',
    bookingMode: 'Ticket Booking',
    faqMode: 'Ask a Question',
    askMeAnything: 'Ask me anything...',
    selectState: 'Great! Please select a state to see available museums.',
    selectMuseum: 'Awesome! Please select a museum from the list.',
    chooseExperience: 'Great! Which experience are you interested in?',
    generalAdmission: 'General Admission',
    specialExhibition: 'Special Exhibition: "Cosmos"',
    selectDate: 'Please select a date for your visit.',
    selectTime: 'Excellent! Please select a time slot.',
    selectQuantity: 'How many tickets do you need?',
    adult: 'Adult',
    child: 'Child',
    proceedToPayment: 'Proceed to Payment',
    orderSummary: 'Here is your order summary:',
    paymentSuccessful: 'Payment successful! 🎉',
    ticketIssued: 'Your digital ticket is ready. We look forward to seeing you!',
    times: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    states: {
        'Delhi': ['National Museum, New Delhi'],
        'West Bengal': ['Indian Museum, Kolkata'],
        'Telangana': ['Salar Jung Museum, Hyderabad'],
        'Maharashtra': ['Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai'],
        'Karnataka': ['Visvesvaraya Industrial & Technological Museum, Bengaluru'],
        'Tamil Nadu': ['Government Museum, Chennai'],
        'Rajasthan': ['Albert Hall Museum, Jaipur'],
        'Uttar Pradesh': ['Anand Bhavan Museum, Prayagraj'],
        'Gujarat': ['Calico Museum of Textiles, Ahmedabad'],
    },
  },
  hi: {
    welcome: 'नमस्ते! मैं म्यूजियम बडी हूं। मैं आज आपकी कैसे मदद कर सकता हूं? आप मुझसे कुछ भी पूछ सकते हैं या टिकट खरीदने के लिए \'टिकट बुकिंग\' पर स्विच कर सकते हैं।',
    welcomeBooking: 'टिकट बुकिंग में आपका स्वागत है। शुरू करने के लिए कृपया एक राज्य चुनें।',
    welcomeFaq: 'आप मुझसे संग्रहालयों या सामान्य विषयों के बारे में कुछ भी पूछ सकते हैं।',
    bookingMode: 'टिकट बुकिंग',
    faqMode: 'प्रश्न पूछें',
    askMeAnything: 'मुझसे कुछ भी पूछें...',
    selectState: 'बहुत बढ़िया! उपलब्ध संग्रहालयों को देखने के लिए कृपया एक राज्य चुनें।',
    selectMuseum: 'बहुत बढ़िया! कृपया सूची में से एक संग्रहालय चुनें।',
    chooseExperience: 'बढ़िया! आप किस अनुभव में रुचि रखते हैं?',
    generalAdmission: 'सामान्य प्रवेश',
    specialExhibition: 'विशेष प्रदर्शनी: "कॉसमॉस"',
    selectDate: 'कृपया अपनी यात्रा के लिए एक तारीख चुनें।',
    selectTime: 'बहुत बढ़िया! कृपया एक समय स्लॉट चुनें।',
    selectQuantity: 'आपको कितने टिकट चाहिए?',
    adult: 'वयस्क',
    child: 'बच्चा',
    proceedToPayment: 'भुगतान के लिए आगे बढ़ें',
    orderSummary: 'यह आपके आदेश का सारांश है:',
    paymentSuccessful: 'भुगतान सफल! 🎉',
    ticketIssued: 'आपका डिजिटल टिकट तैयार है। हम आपको देखने के लिए उत्सुक हैं!',
    times: ['सुबह 10:00', 'दोपहर 12:00', 'दोपहर 2:00', 'शाम 4:00'],
    states: {
      'दिल्ली': ['राष्ट्रीय संग्रहालय, नई दिल्ली'],
      'पश्चिम बंगाल': ['भारतीय संग्रहालय, कोलकाता'],
      'तेलंगाना': ['सालार जंग संग्रहालय, हैदराबाद'],
      'महाराष्ट्र': ['छत्रपति शिवाजी महाराज वास्तु संग्रहालय, मुंबई'],
      'कर्नाटक': ['विश्वेश्वरैया औद्योगिक और तकनीकी संग्रहालय, बेंगलुरु'],
      'तमिलनाडु': ['सरकारी संग्रहालय, चेन्नई'],
      'राजस्थान': ['अल्बर्ट हॉल संग्रहालय, जयपुर'],
      'उत्तर प्रदेश': ['आनंद भवन संग्रहालय, प्रयागराज'],
      'गुजरात': ['कैलिको म्यूजियम ऑफ टेक्सटाइल्स, अहमदाबाद'],
    }
  },
  bn: {
    welcome: 'নমস্কার! আমি মিউজিয়াম বাডি। আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি? আপনি আমাকে কিছু জিজ্ঞাসা করতে পারেন অথবা টিকিট কেনার জন্য \'টিকিট বুকিং\' এ স্যুইচ করতে পারেন।',
    welcomeBooking: 'টিকিট বুকিংয়ে স্বাগতম। শুরু করতে অনুগ্রহ করে একটি রাজ্য নির্বাচন করুন।',
    welcomeFaq: 'আপনি আমার কাছে জাদুঘর বা সাধারণ বিষয় সম্পর্কে কিছু জিজ্ঞাসা করতে পারেন।',
    bookingMode: 'টিকিট বুকিং',
    faqMode: 'প্রশ্ন জিজ্ঞাসা করুন',
    askMeAnything: 'আমাকে কিছু জিজ্ঞাসা করুন...',
    selectState: 'দারুণ! উপলব্ধ জাদুঘর দেখতে অনুগ্রহ করে একটি রাজ্য নির্বাচন করুন।',
    selectMuseum: 'দারুণ! অনুগ্রহ করে তালিকা থেকে একটি জাদুঘর নির্বাচন করুন।',
    chooseExperience: 'দারুণ! আপনি কোন تجربায় আগ্রহী?',
    generalAdmission: 'সাধারণ ভর্তি',
    specialExhibition: 'বিশেষ প্রদর্শনী: "কসমস"',
    selectDate: 'আপনার পরিদর্শনের জন্য একটি তারিখ নির্বাচন করুন।',
    selectTime: 'চমৎকার! একটি সময় স্লট নির্বাচন করুন।',
    selectQuantity: 'আপনার কতগুলো টিকিট লাগবে?',
    adult: 'প্রাপ্তবয়স্ক',
    child: 'শিশু',
    proceedToPayment: 'পেমেন্টের জন্য এগিয়ে যান',
    orderSummary: 'এখানে আপনার অর্ডারের সারসংক্ষেপ:',
    paymentSuccessful: 'পেমেন্ট সফল! 🎉',
    ticketIssued: 'আপনার ডিজিটাল টিকিট প্রস্তুত। আমরা আপনাকে দেখার জন্য উন্মুখ!',
    times: ['সকাল ১০:০০', 'দুপুর ১২:০০', 'দুপুর ২:০০', 'বিকাল ৪:০০'],
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
    }
  },
  ta: {
    welcome: 'வணக்கம்! நான் மியூசியம் படி. இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் என்னிடம் எதுவும் கேட்கலாம் அல்லது டிக்கெட் வாங்க \'டிக்கெட் முன்பதிவு\' க்கு மாறலாம்.',
    welcomeBooking: 'டிக்கெட் முன்பதிவுக்கு வரவேற்கிறோம். தொடங்க ஒரு மாநிலத்தைத் தேர்ந்தெடுக்கவும்.',
    welcomeFaq: 'அருங்காட்சியகங்கள் அல்லது பொதுவான தலைப்புகள் பற்றி நீங்கள் என்னிடம் எதுவும் கேட்கலாம்.',
    bookingMode: 'டிக்கெட் முன்பதிவு',
    faqMode: 'கேள்வி கேளுங்கள்',
    askMeAnything: 'என்னிடம் எதுவும் கேளுங்கள்...',
    selectState: 'அற்புதம்! அருங்காட்சியகங்களைக் காண ஒரு மாநிலத்தைத் தேர்ந்தெடுக்கவும்.',
    selectMuseum: 'அற்புதம்! பட்டியலிலிருந்து ஒரு அருங்காட்சியகத்தைத் தேர்ந்தெடுக்கவும்.',
    chooseExperience: 'அருமை! நீங்கள் எந்த அனுபவத்தில் ஆர்வமாக உள்ளீர்கள்?',
    generalAdmission: 'பொது அனுமதி',
    specialExhibition: 'சிறப்பு கண்காட்சி: "காஸ்மோஸ்"',
    selectDate: 'உங்கள் வருகைக்கான தேதியைத் தேர்ந்தெடுக்கவும்.',
    selectTime: 'அருமை! நேரத்தைத் தேர்ந்தெடுக்கவும்.',
    selectQuantity: 'உங்களுக்கு எத்தனை டிக்கெட்டுகள் தேவை?',
    adult: 'பெரியவர்',
    child: 'குழந்தை',
    proceedToPayment: 'பணம் செலுத்த தொடரவும்',
    orderSummary: 'உங்கள் ஆர்டர் சுருக்கம் இதோ:',
    paymentSuccessful: 'பணம் செலுத்துதல் வெற்றி! 🎉',
    ticketIssued: 'உங்கள் டிஜிட்டல் டிக்கெட் தயாராக உள்ளது. உங்களை சந்திப்பதை நாங்கள் ஆவலுடன் எதிர்பார்க்கிறோம்!',
    times: ['காலை 10:00', 'மதியம் 12:00', 'மதியம் 2:00', 'மாலை 4:00'],
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
    }
  },
  te: {
    welcome: 'నమస్కారం! నేను మ్యూజియం బడ్డీని. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను? మీరు నన్ను ఏదైనా అడగవచ్చు లేదా టిక్కెట్లు కొనడానికి \'టికెట్ బుకింగ్\'కు మారవచ్చు.',
    welcomeBooking: 'టికెట్ బుకింగ్‌కు స్వాగతం. ప్రారంభించడానికి దయచేసి ఒక రాష్ట్రాన్ని ఎంచుకోండి.',
    welcomeFaq: 'మీరు మ్యూజియంలు లేదా సాధారణ అంశాల గురించి నన్ను ఏదైనా అడగవచ్చు.',
    bookingMode: 'టికెట్ బుకింగ్',
    faqMode: 'ప్రశ్న అడగండి',
    askMeAnything: 'నన్ను ఏదైనా అడగండి...',
    selectState: 'అద్భుతం! అందుబాటులో ఉన్న మ్యూజియంలను చూడటానికి దయచేసి ఒక రాష్ట్రాన్ని ఎంచుకోండి.',
    selectMuseum: 'అద్భుతం! దయచేసి జాబితా నుండి ఒక మ్యూజియంను ఎంచుకోండి.',
    chooseExperience: 'అద్భుతం! మీరు ఏ అనుభవంలో ఆసక్తిగా ఉన్నారు?',
    generalAdmission: 'సాధారణ ప్రవేశం',
    specialExhibition: 'ప్రత్యేక ప్రదర్శన: "కాస్మోస్"',
    selectDate: 'మీ సందర్శన కోసం దయచేసి ఒక తేదీని ఎంచుకోండి.',
    selectTime: 'అద్భుతం! దయచేసి ఒక సమయ స్లాట్‌ను ఎంచుకోండి.',
    selectQuantity: 'మీకు ఎన్ని టిక్కెట్లు కావాలి?',
    adult: 'పెద్దలు',
    child: 'పిల్లలు',
    proceedToPayment: 'చెల్లింపుకు కొనసాగండి',
    orderSummary: 'ఇదిగో మీ ఆర్డర్ సారాంశం:',
    paymentSuccessful: 'చెల్లింపు విజయవంతమైంది! 🎉',
    ticketIssued: 'మీ డిజిటల్ టికెట్ సిద్ధంగా ఉంది. మిమ్మల్ని చూడటానికి మేము ఎదురుచూస్తున్నాము!',
    times: ['ఉదయం 10:00', 'మధ్యాహ్నం 12:00', 'మధ్యాహ్నం 2:00', 'సాయంత్రం 4:00'],
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
    }
  },
  kn: {
    welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಮ್ಯೂಸಿಯಂ ಬಡ್ಡಿ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ನೀವು ನನ್ನನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಬಹುದು ಅಥವಾ ಟಿಕೆಟ್ ಖರೀದಿಸಲು \'ಟಿಕೆಟ್ ಬುಕಿಂಗ್\'ಗೆ ಬದಲಾಯಿಸಬಹುದು.',
    welcomeBooking: 'ಟಿಕೆಟ್ ಬುಕಿಂಗ್‌ಗೆ ಸುಸ್ವಾಗತ. ಪ್ರಾರಂಭಿಸಲು ದಯವಿಟ್ಟು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    welcomeFaq: 'ವಸ್ತುಸಂಗ್ರಹಾಲಯಗಳು ಅಥವಾ ಸಾಮಾನ್ಯ ವಿಷಯಗಳ ಬಗ್ಗೆ ನೀವು ನನ್ನನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಬಹುದು.',
    bookingMode: 'ಟಿಕೆಟ್ ಬುಕಿಂಗ್',
    faqMode: 'ಪ್ರಶ್ನೆ ಕೇಳಿ',
    askMeAnything: 'ನನ್ನನ್ನು ಏನು ಬೇಕಾದರೂ ಕೇಳಿ...',
    selectState: 'ಅದ್ಭುತ! ಲಭ್ಯವಿರುವ ವಸ್ತುಸಂಗ್ರಹಾಲಯಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    selectMuseum: 'ಅದ್ಭುತ! ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ವಸ್ತುಸಂಗ್ರಹಾಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    chooseExperience: 'ಅದ್ಭುತ! ನೀವು ಯಾವ ಅನುಭವದಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ?',
    generalAdmission: 'ಸಾಮಾನ್ಯ ಪ್ರವೇಶ',
    specialExhibition: 'ವಿಶೇಷ ಪ್ರದರ್ಶನ: "ಬ್ರಹ್ಮಾಂಡ"',
    selectDate: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭೇಟಿಗಾಗಿ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    selectTime: 'ಅತ್ಯುತ್ತಮ! ದಯವಿಟ್ಟು ಸಮಯದ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ.',
    selectQuantity: 'ನಿಮಗೆ ಎಷ್ಟು ಟಿಕೆಟ್‌ಗಳು ಬೇಕು?',
    adult: 'ವಯಸ್ಕ',
    child: 'ಮಗು',
    proceedToPayment: 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ',
    orderSummary: 'ನಿಮ್ಮ ಆದೇಶದ ಸಾರಾಂಶ ಇಲ್ಲಿದೆ:',
    paymentSuccessful: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! 🎉',
    ticketIssued: 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಟಿಕೆಟ್ ಸಿದ್ಧವಾಗಿದೆ. ನಿಮ್ಮನ್ನು ನೋಡಲು ನಾವು ಎದುರು ನೋಡುತ್ತಿದ್ದೇವೆ!',
    times: ['ಬೆಳಿಗ್ಗೆ 10:00', 'ಮಧ್ಯಾಹ್ನ 12:00', 'ಮಧ್ಯಾಹ್ನ 2:00', 'ಸಂಜೆ 4:00'],
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
    }
  },
};

type ChatStep =
  | 'start' | 'select_state' | 'select_museum' | 'select_experience' | 'select_date' | 'select_time'
  | 'select_quantity' | 'confirm_order' | 'payment' | 'ticket_issued';

type ChatMode = 'booking' | 'faq';

export default function ChatInterface({ lang }: { lang: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'kn' }) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<ChatStep>('start');
  const [mode, setMode] = useState<ChatMode>('faq');
  const [order, setOrder] = useState<TicketOrder>({
    state: null,
    museum: null,
    type: null,
    date: null,
    time: null,
    tickets: { adult: 1, child: 0 },
  });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const addMessage = (sender: 'user' | 'bot', content: React.ReactNode) => {
    const id = `${Date.now()}-${Math.random()}`;
    setMessages(prev => [...prev, { id, sender, content }]);
    if (sender === 'user') {
      setIsBotTyping(true);
    }
  };
  
  const handleBotResponse = (callback: () => void, delay?: number) => {
    setTimeout(() => {
      setIsBotTyping(false);
      callback();
    }, delay ?? 1000 + Math.random() * 500);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);
  
  const resetChat = (newMode: ChatMode) => {
    setMessages([]);
    if (newMode === 'booking') {
        addMessage('bot', t.welcomeBooking);
        setStep('select_state');
    } else {
        if (messages.length === 0) {
            addMessage('bot', t.welcome);
        }
        setStep('start');
    }
  }

  useEffect(() => {
    resetChat(mode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, lang]);

  const handleModeChange = (newMode: ChatMode) => {
    if (mode !== newMode) {
      setMode(newMode);
    }
  };
  
  const handleFaqQuestion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    if (!question) return;

    addMessage('user', question);
    e.currentTarget.reset();
    
    handleBotResponse(async () => {
      const result = await getAnswer({question, lang});
      if (result.intent === 'SWITCH_TO_BOOKING') {
        addMessage('bot', result.answer);
        handleBotResponse(() => handleModeChange('booking'));
      } else {
        addMessage('bot', result.answer);
      }
    }, 0);
  }
  
  const handleStateSelection = (state: string) => {
    addMessage('user', state);
    setOrder(prev => ({ ...prev, state }));
    handleBotResponse(() => {
      addMessage('bot', t.selectMuseum);
      setStep('select_museum');
    });
  };

  const handleMuseumSelection = (museum: string) => {
    addMessage('user', museum);
    setOrder(prev => ({ ...prev, museum }));
    handleBotResponse(() => {
        addMessage('bot', t.chooseExperience);
        setStep('select_experience');
    });
  }

  const handleExperienceSelection = (selection: 'general' | 'special') => {
    const experienceText = selection === 'general' ? t.generalAdmission : t.specialExhibition;
    addMessage('user', experienceText);
    setOrder(prev => ({ ...prev, type: selection === 'general' ? 'General Admission' : 'Special Exhibition: "Cosmos"' }));
    handleBotResponse(() => {
      addMessage('bot', t.selectDate);
      setStep('select_date');
    });
  };

  const handleDateSelection = (date: Date | undefined) => {
    if (!date) return;
    addMessage('user', date.toLocaleDateString(lang));
    setOrder(prev => ({ ...prev, date }));
    handleBotResponse(() => {
      addMessage('bot', t.selectTime);
      setStep('select_time');
    });
  };

  const handleTimeSelection = (time: string) => {
    addMessage('user', time);
    setOrder(prev => ({ ...prev, time }));
    handleBotResponse(() => {
      addMessage('bot', t.selectQuantity);
      setStep('select_quantity');
    });
  };
  
  const handleQuantityChange = (type: 'adult' | 'child', value: number) => {
    setOrder(prev => ({ ...prev, tickets: { ...prev.tickets, [type]: Math.max(0, value) }}));
  }

  const handleConfirmQuantity = () => {
    addMessage('user', `${order.tickets.adult} ${t.adult}, ${order.tickets.child} ${t.child}`);
    handleBotResponse(() => {
      addMessage('bot', <div><p>{t.orderSummary}</p><TicketSummary order={order} lang={lang} /></div>);
      setStep('confirm_order');
    });
  }
  
  const handlePayment = () => {
    addMessage('user', t.proceedToPayment);
    handleBotResponse(() => setStep('payment'));
  }
  
  const handlePaymentSuccess = () => {
    addMessage('bot', t.paymentSuccessful);
    handleBotResponse(() => {
        addMessage('bot', <div><p>{t.ticketIssued}</p><DigitalTicket order={order} lang={lang} /></div>);
        setStep('ticket_issued');
    });
  }
  
  const renderModeToggle = () => (
    <div className="flex justify-center p-2">
        <div className="flex items-center gap-1 rounded-full border bg-card p-1">
            <Button 
                variant={mode === 'booking' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('booking')}
                className={cn('rounded-full', {'shadow-sm': mode === 'booking'})}
            >
                <Ticket className="mr-2" />{t.bookingMode}
            </Button>
            <Button 
                variant={mode === 'faq' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('faq')}
                className={cn('rounded-full', {'shadow-sm': mode === 'faq'})}
            >
                <MessageCircleQuestion className="mr-2" />{t.faqMode}
            </Button>
        </div>
    </div>
  );

  const renderInput = () => {
    if (mode === 'faq') {
        return (
            <form onSubmit={handleFaqQuestion} className="flex gap-2 p-2">
                <Input name="question" placeholder={t.askMeAnything} className="flex-1" />
                <Button type="submit" size="icon" className="soft-shadow">
                    <Send />
                </Button>
            </form>
        );
    }
    
    switch (step) {
      case 'select_state':
        return (
          <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3">
            {Object.keys(t.states).map(state => (
              <Button key={state} variant="secondary" onClick={() => handleStateSelection(state)} className="soft-shadow text-center">{state}</Button>
            ))}
          </div>
        );
      case 'select_museum':
        const museums = order.state ? t.states[order.state as keyof typeof t.states] : [];
        return (
          <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-1">
            {museums.map(museum => <Button key={museum} variant="secondary" onClick={() => handleMuseumSelection(museum)} className="soft-shadow text-center">{museum}</Button>)}
          </div>
        );
      case 'select_experience':
        return (
          <div className="flex gap-2 p-2">
            <Button onClick={() => handleExperienceSelection('general')} className="w-full soft-shadow">{t.generalAdmission}</Button>
            <Button onClick={() => handleExperienceSelection('special')} variant="secondary" className="w-full soft-shadow">{t.specialExhibition}</Button>
          </div>
        );
      case 'select_date':
          return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center"><Calendar mode="single" onSelect={handleDateSelection} className="m-4 rounded-lg border card-shadow" selected={order.date ?? undefined} /></motion.div>
      case 'select_time':
        return (
          <div className="grid grid-cols-2 gap-2 p-2">
            {t.times.map(time => <Button key={time} variant="secondary" onClick={() => handleTimeSelection(time)} className="soft-shadow">{time}</Button>)}
          </div>
        );
      case 'select_quantity':
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-md border bg-card p-4 card-shadow">
                <div className="flex items-center justify-between">
                    <span className="font-medium">{t.adult}</span>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('adult', order.tickets.adult - 1)}>-</Button>
                        <span className="w-8 text-center">{order.tickets.adult}</span>
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('adult', order.tickets.adult + 1)}>+</Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="font-medium">{t.child}</span>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('child', order.tickets.child - 1)}>-</Button>
                        <span className="w-8 text-center">{order.tickets.child}</span>
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('child', order.tickets.child + 1)}>+</Button>
                    </div>
                </div>
                <Button onClick={handleConfirmQuantity} className="w-full soft-shadow">{t.proceedToPayment}</Button>
            </motion.div>
        );
      case 'confirm_order':
          return <div className="p-2"><Button onClick={handlePayment} className="w-full soft-shadow">{t.proceedToPayment}</Button></div>;
      case 'payment':
          return <PaymentDialog open={true} onPaymentSuccess={handlePaymentSuccess} onOpenChange={() => setStep('confirm_order')} />;
      case 'ticket_issued':
          return <div className="p-2 text-center text-sm text-muted-foreground">You can switch modes or start a new booking.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
            {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <ChatBubble sender={msg.sender}>{msg.content}</ChatBubble>
                </motion.div>
            ))}
            {isBotTyping && <motion.div key="typing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><ChatBubble sender="bot">...</ChatBubble></motion.div>}
        </AnimatePresence>
      </div>
      <div className="border-t bg-background">
        {renderModeToggle()}
        <div className="p-2">
            {renderInput()}
        </div>
      </div>
    </div>
  );
}
