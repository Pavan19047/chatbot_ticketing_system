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
  es: {
    welcome: '¡Hola! Soy Museum Buddy. ¿Cómo puedo ayudarte hoy?',
    bookTickets: 'Reservar Entradas',
    askQuestion: 'Hacer una Pregunta',
    chooseExperience: '¡Genial! ¿En qué experiencia estás interesado?',
    generalAdmission: 'Admisión General',
    specialExhibition: 'Exhibición Especial: "Cosmos"',
    selectDate: 'Por favor, selecciona una fecha para tu visita.',
    selectTime: '¡Excelente! Por favor, selecciona un horario.',
    selectQuantity: '¿Cuántas entradas necesitas?',
    adult: 'Adulto',
    child: 'Niño',
    proceedToPayment: 'Proceder al Pago',
    orderSummary: 'Aquí tienes el resumen de tu pedido:',
    paymentSuccessful: '¡Pago exitoso! 🎉',
    ticketIssued: 'Tu entrada digital está lista. ¡Esperamos verte pronto!',
    showTimes: 'Horarios',
    prices: 'Precios de Entradas',
    faqResponse: 'Puedes encontrar información sobre nuestros horarios, ubicación y exhibiciones actuales en nuestro sitio web.',
    invalidSelection: 'Lo siento, no entendí eso. Por favor, elige una de las opciones.',
    times: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
  },
};

type ChatStep =
  | 'start' | 'select_experience' | 'select_date' | 'select_time'
  | 'select_quantity' | 'confirm_order' | 'payment' | 'ticket_issued' | 'faq';

export default function ChatInterface({ lang }: { lang: 'en' | 'es' }) {
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
