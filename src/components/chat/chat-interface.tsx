'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
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

const translations = {
  en: {
    welcome: "Hello! I'm Museum Buddy. How can I help you today?",
    bookTickets: 'Book Tickets',
    askQuestion: 'Ask a Question',
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
    showTimes: 'Showtimes',
    prices: 'Ticket Prices',
    faqResponse: 'You can find information about our hours, location, and current exhibitions on our website.',
    invalidSelection: "Sorry, I didn't understand that. Please choose one of the options.",
    times: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
  },
  hi: {
    welcome: 'नमस्ते! मैं म्यूजियम बडी हूं। मैं आज आपकी कैसे मदद कर सकता हूं?',
    bookTickets: 'टिकट बुक करें',
    askQuestion: 'प्रश्न पूछें',
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
    showTimes: 'शो के समय',
    prices: 'टिकट की कीमतें',
    faqResponse: 'आप हमारी वेबसाइट पर हमारे घंटे, स्थान और वर्तमान प्रदर्शनियों के बारे में जानकारी पा सकते हैं।',
    invalidSelection: 'माफ़ कीजिए, मैं यह समझ नहीं पाया। कृपया विकल्पों में से एक चुनें।',
    times: ['सुबह 10:00', 'दोपहर 12:00', 'दोपहर 2:00', 'शाम 4:00'],
  },
  bn: {
    welcome: 'নমস্কার! আমি মিউজিয়াম বাডি। আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?',
    bookTickets: 'টিকিট বুক করুন',
    askQuestion: 'প্রশ্ন জিজ্ঞাসা করুন',
    chooseExperience: 'দারুণ! আপনি কোন অভিজ্ঞতায় আগ্রহী?',
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
    showTimes: 'প্রদর্শনের সময়',
    prices: 'টিকিটের মূল্য',
    faqResponse: 'আপনি আমাদের ওয়েবসাইটে আমাদের সময়, অবস্থান এবং বর্তমান প্রদর্শনী সম্পর্কে তথ্য পেতে পারেন।',
    invalidSelection: 'দুঃখিত, আমি বুঝতে পারিনি। বিকল্পগুলো থেকে একটি বেছে নিন।',
    times: ['সকাল ১০:০০', 'দুপুর ১২:০০', 'দুপুর ২:০০', 'বিকাল ৪:০০'],
  },
  ta: {
    welcome: 'வணக்கம்! நான் மியூசியம் படி. இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    bookTickets: 'டிக்கெட்டுகளை முன்பதிவு செய்யுங்கள்',
    askQuestion: 'கேள்வி கேளுங்கள்',
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
    showTimes: 'காட்சி நேரங்கள்',
    prices: 'டிக்கெட் விலைகள்',
    faqResponse: 'எங்கள் வலைத்தளத்தில் எங்கள் நேரம், இடம் மற்றும் தற்போதைய கண்காட்சிகள் பற்றிய தகவல்களை நீங்கள் காணலாம்.',
    invalidSelection: 'மன்னிக்கவும், எனக்குப் புரியவில்லை. விருப்பங்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்.',
    times: ['காலை 10:00', 'மதியம் 12:00', 'மதியம் 2:00', 'மாலை 4:00'],
  },
  te: {
    welcome: 'నమస్కారం! నేను మ్యూజియం బడ్డీని. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?',
    bookTickets: 'టిక్కెట్లను బుక్ చేయండి',
    askQuestion: 'ప్రశ్న అడగండి',
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
    showTimes: 'ప్రదర్శన సమయాలు',
    prices: 'టికెట్ ధరలు',
    faqResponse: 'మీరు మా గంటలు, ప్రదేశం మరియు ప్రస్తుత ప్రదర్శనల గురించి మా వెబ్‌సైట్‌లో సమాచారాన్ని కనుగొనవచ్చు.',
    invalidSelection: 'క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి ఎంపికలలో ఒకదాన్ని ఎంచుకోండి.',
    times: ['ఉదయం 10:00', 'మధ్యాహ్నం 12:00', 'మధ్యాహ్నం 2:00', 'సాయంత్రం 4:00'],
  },
  kn: {
    welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಮ್ಯೂಸಿಯಂ ಬಡ್ಡಿ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    bookTickets: 'ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ',
    askQuestion: 'ಪ್ರಶ್ನೆ ಕೇಳಿ',
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
    showTimes: 'ಪ್ರದರ್ಶನ ಸಮಯಗಳು',
    prices: 'ಟಿಕೆಟ್ ದರಗಳು',
    faqResponse: 'ನೀವು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನಮ್ಮ ಸಮಯ, ಸ್ಥಳ ಮತ್ತು ಪ್ರಸ್ತುತ ಪ್ರದರ್ಶನಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿಯನ್ನು ಕಾಣಬಹುದು.',
    invalidSelection: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ.',
    times: ['ಬೆಳಿಗ್ಗೆ 10:00', 'ಮಧ್ಯಾಹ್ನ 12:00', 'ಮಧ್ಯಾಹ್ನ 2:00', 'ಸಂಜೆ 4:00'],
  },
};

type ChatStep =
  | 'start' | 'select_experience' | 'select_date' | 'select_time'
  | 'select_quantity' | 'confirm_order' | 'payment' | 'ticket_issued' | 'faq';

export default function ChatInterface({ lang }: { lang: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'kn' }) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<ChatStep>('start');
  const [order, setOrder] = useState<TicketOrder>({
    type: null,
    date: null,
    time: null,
    tickets: { adult: 1, child: 0 },
  });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const addMessage = (sender: 'user' | 'bot', content: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender, content }]);
    setIsBotTyping(sender === 'user');
  };
  
  const handleBotResponse = (callback: () => void) => {
    setTimeout(() => {
      setIsBotTyping(false);
      callback();
    }, 1000 + Math.random() * 500);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  useEffect(() => {
    addMessage('bot', t.welcome);
    handleBotResponse(() => setStep('start'));
  }, []);

  const handleStartSelection = (selection: 'book' | 'faq') => {
    addMessage('user', selection === 'book' ? t.bookTickets : t.askQuestion);
    handleBotResponse(() => {
      if (selection === 'book') {
        addMessage('bot', t.chooseExperience);
        setStep('select_experience');
      } else {
        addMessage('bot', t.faqResponse);
        setStep('start');
      }
    });
  };

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

  const renderInput = () => {
    switch (step) {
      case 'start':
        return (
          <div className="flex gap-2 p-2">
            <Button onClick={() => handleStartSelection('book')} className="w-full neubrutalist-border neubrutalist-shadow-sm">{t.bookTickets}</Button>
            <Button onClick={() => handleStartSelection('faq')} variant="secondary" className="w-full neubrutalist-border neubrutalist-shadow-sm">{t.askQuestion}</Button>
          </div>
        );
      case 'select_experience':
        return (
          <div className="flex gap-2 p-2">
            <Button onClick={() => handleExperienceSelection('general')} className="w-full neubrutalist-border neubrutalist-shadow-sm">{t.generalAdmission}</Button>
            <Button onClick={() => handleExperienceSelection('special')} className="w-full neubrutalist-border neubrutalist-shadow-sm">{t.specialExhibition}</Button>
          </div>
        );
      case 'select_date':
          return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><Calendar mode="single" onSelect={handleDateSelection} className="m-4 neubrutalist-border" selected={order.date ?? undefined} /></motion.div>
      case 'select_time':
        return (
          <div className="grid grid-cols-2 gap-2 p-2">
            {t.times.map(time => <Button key={time} onClick={() => handleTimeSelection(time)} className="neubrutalist-border neubrutalist-shadow-sm">{time}</Button>)}
          </div>
        );
      case 'select_quantity':
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-md neubrutalist-border bg-white p-4">
                <div className="flex items-center justify-between">
                    <span className="font-medium">{t.adult}</span>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="neubrutalist-border" onClick={() => handleQuantityChange('adult', order.tickets.adult - 1)}>-</Button>
                        <span className="w-8 text-center">{order.tickets.adult}</span>
                        <Button size="icon" variant="outline" className="neubrutalist-border" onClick={() => handleQuantityChange('adult', order.tickets.adult + 1)}>+</Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="font-medium">{t.child}</span>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="neubrutalist-border" onClick={() => handleQuantityChange('child', order.tickets.child - 1)}>-</Button>
                        <span className="w-8 text-center">{order.tickets.child}</span>
                        <Button size="icon" variant="outline" className="neubrutalist-border" onClick={() => handleQuantityChange('child', order.tickets.child + 1)}>+</Button>
                    </div>
                </div>
                <Button onClick={handleConfirmQuantity} className="w-full neubrutalist-border neubrutalist-shadow-sm">{t.proceedToPayment}</Button>
            </motion.div>
        );
      case 'confirm_order':
          return <div className="p-2"><Button onClick={handlePayment} className="w-full neubrutalist-border neubrutalist-shadow-sm">{t.proceedToPayment}</Button></div>;
      case 'payment':
          return <PaymentDialog open={true} onPaymentSuccess={handlePaymentSuccess} onOpenChange={() => setStep('confirm_order')} />;

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
            {isBotTyping && <ChatBubble sender="bot">...</ChatBubble>}
        </AnimatePresence>
      </div>
      <div className="neubrutalist-border border-t-2 bg-background p-2">
        {renderInput()}
      </div>
    </div>
  );
}
