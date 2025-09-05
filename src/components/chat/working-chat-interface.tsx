'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Ticket, MessageCircleQuestion, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import type { Message, TicketOrder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble } from './chat-bubble';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { TicketSummary } from './ticket-summary';
import { PaymentDialog } from './payment-dialog';
import { DigitalTicket } from './digital-ticket';
import { states, events, getEventsByStateAndCity, getCitiesByState } from '@/lib/events-data';

const translations = {
  en: {
    welcome: "नमस्ते! मैं TicketBharat का सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    welcomeBooking: 'Welcome to TicketBharat! Let\'s find the perfect event for you. Please select a state to begin.',
    welcomeFaq: 'Ask me anything about events, shows, booking, or entertainment in India!',
    bookingMode: 'Book Tickets',
    faqMode: 'Ask Questions',
    askMeAnything: 'Ask about movies, concerts, shows...',
    selectState: 'Great! Please select a state to see available events.',
    selectCity: 'Awesome! Please select a city.',
    selectEvent: 'Perfect! Here are the available events:',
    selectDate: 'Great choice! Please select a date for your visit.',
    selectTime: 'Excellent! Please select a time slot.',
    selectQuantity: 'How many tickets do you need?',
    regular: 'Regular',
    premium: 'Premium',
    proceedToPayment: 'Proceed to Payment',
    orderSummary: 'Here is your order summary:',
    paymentSuccessful: 'Payment successful! 🎉',
    ticketIssued: 'Your digital ticket is ready! Enjoy the show! 🎊',
    noEventsFound: 'No events found for this location. Try another city.',
    movie: 'Movies',
    concert: 'Concerts', 
    sports: 'Sports',
    theater: 'Theater',
    comedy: 'Comedy Shows',
  },
  hi: {
    welcome: 'नमस्ते! मैं TicketBharat का सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    welcomeBooking: 'TicketBharat में आपका स्वागत है! आइए आपके लिए सही इवेंट खोजते हैं। शुरू करने के लिए कृपया एक राज्य चुनें।',
    welcomeFaq: 'भारत में इवेंट्स, शो, बुकिंग या मनोरंजन के बारे में मुझसे कुछ भी पूछें!',
    bookingMode: 'टिकट बुक करें',
    faqMode: 'सवाल पूछें',
    askMeAnything: 'फिल्में, कॉन्सर्ट, शो के बारे में पूछें...',
    selectState: 'बहुत बढ़िया! उपलब्ध इवेंट्स देखने के लिए कृपया एक राज्य चुनें।',
    selectCity: 'शानदार! कृपया एक शहर चुनें।',
    selectEvent: 'बहुत बढ़िया! यहाँ उपलब्ध इवेंट्स हैं:',
    selectDate: 'बेहतरीन चुनाव! कृपया अपनी यात्रा के लिए एक तारीख चुनें।',
    selectTime: 'बहुत बढ़िया! कृपया एक समय चुनें।',
    selectQuantity: 'आपको कितने टिकट चाहिए?',
    regular: 'नियमित',
    premium: 'प्रीमियम',
    proceedToPayment: 'भुगतान के लिए आगे बढ़ें',
    orderSummary: 'यह आपके आदेश का सारांश है:',
    paymentSuccessful: 'भुगतान सफल! 🎉',
    ticketIssued: 'आपका डिजिटल टिकट तैयार है! शो का आनंद लें! 🎊',
    noEventsFound: 'इस स्थान के लिए कोई इवेंट नहीं मिला। दूसरा शहर आज़माएं।',
    movie: 'फिल्में',
    concert: 'कॉन्सर्ट',
    sports: 'खेल',
    theater: 'रंगमंच',
    comedy: 'कॉमेडी शो',
  },
};

type ChatStep =
  | 'start' | 'select_state' | 'select_city' | 'select_event' | 'select_date' | 'select_time'
  | 'select_quantity' | 'confirm_order' | 'payment' | 'ticket_issued';

type ChatMode = 'booking' | 'faq';

// Simple chatbot function without external AI dependency
function getSimpleAnswer(question: string, lang: 'en' | 'hi'): string {
  const q = question.toLowerCase();
  
  // Check for booking keywords
  if (q.includes('book') || q.includes('ticket') || q.includes('movie') || 
      q.includes('concert') || q.includes('show') || q.includes('event') ||
      q.includes('buy') || q.includes('purchase') || q.includes('टिकट') || 
      q.includes('बुक') || q.includes('फिल्म')) {
    return 'BOOK_TICKETS';
  }
  
  // Greetings
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || 
      q.includes('नमस्ते') || q.includes('हैलो')) {
    return lang === 'hi' 
      ? 'नमस्ते! मैं TicketBharat का सहायक हूं। मैं आपको टिकट बुक करने में मदद कर सकता हूं!'
      : 'Hello! I\'m your TicketBharat assistant. I can help you book tickets for movies, concerts, and events!';
  }
  
  // Questions about events
  if (q.includes('event') || q.includes('show') || q.includes('movie') || q.includes('concert')) {
    return lang === 'hi'
      ? 'हमारे पास फिल्में, कॉन्सर्ट, खेल, रंगमंच और कॉमेडी शो उपलब्ध हैं। टिकट बुक करने के लिए "टिकट बुक करें" कहें!'
      : 'We have movies, concerts, sports, theater and comedy shows available! Say "book tickets" to get started!';
  }
  
  // Default response
  return lang === 'hi'
    ? 'मैं आपकी मदद करने के लिए यहाँ हूं! टिकट बुक करने के लिए "टिकट बुक करें" कहें या कोई भी सवाल पूछें।'
    : 'I\'m here to help you! Say "book tickets" to start booking or ask me any questions about entertainment!';
}

export default function ChatInterface({ lang = 'en' }: { lang?: 'en' | 'hi' }) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<ChatStep>('start');
  const [mode, setMode] = useState<ChatMode>('booking');
  const [order, setOrder] = useState<TicketOrder>({
    state: null,
    city: null,
    event: null,
    date: null,
    time: null,
    tickets: { regular: 1, premium: 0 },
  });
  const [availableEvents, setAvailableEvents] = useState(events);
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
    setOrder({
      state: null,
      city: null,
      event: null,
      date: null,
      time: null,
      tickets: { regular: 1, premium: 0 },
    });
    
    if (newMode === 'booking') {
        addMessage('bot', t.welcomeBooking);
        setStep('select_state');
    } else {
        addMessage('bot', t.welcomeFaq);
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
  
  const handleFaqQuestion = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    if (!question) return;

    addMessage('user', question);
    e.currentTarget.reset();
    
    handleBotResponse(() => {
      const answer = getSimpleAnswer(question, lang);
      if (answer === 'BOOK_TICKETS') {
        addMessage('bot', "It looks like you want to book tickets. I'll switch you to booking mode.");
        setTimeout(() => handleModeChange('booking'), 1500);
      } else {
        addMessage('bot', answer);
      }
    });
  }
  
  const handleStateSelection = (state: string) => {
    addMessage('user', state);
    setOrder(prev => ({ ...prev, state }));
    handleBotResponse(() => {
      addMessage('bot', t.selectCity);
      setStep('select_city');
    });
  };

  const handleCitySelection = (city: string) => {
    addMessage('user', city);
    setOrder(prev => ({ ...prev, city }));
    const cityEvents = getEventsByStateAndCity(order.state!, city);
    setAvailableEvents(cityEvents);
    
    handleBotResponse(() => {
      if (cityEvents.length > 0) {
        addMessage('bot', t.selectEvent);
        setStep('select_event');
      } else {
        addMessage('bot', t.noEventsFound);
        setStep('select_city');
      }
    });
  };

  const handleEventSelection = (eventId: string) => {
    const selectedEvent = events.find(e => e.id === eventId);
    if (!selectedEvent) return;
    
    addMessage('user', selectedEvent.name);
    setOrder(prev => ({ 
      ...prev, 
      event: {
        id: selectedEvent.id,
        name: selectedEvent.name,
        type: selectedEvent.type,
        venue: selectedEvent.venue
      }
    }));
    
    handleBotResponse(() => {
      addMessage('bot', t.selectDate);
      setStep('select_date');
    });
  }

  const handleDateSelection = (date: Date | undefined) => {
    if (!date) return;
    addMessage('user', date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN'));
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
  
  const handleQuantityChange = (type: 'regular' | 'premium', value: number) => {
    setOrder(prev => ({ ...prev, tickets: { ...prev.tickets, [type]: Math.max(0, value) }}));
  }

  const calculateTotal = () => {
    const selectedEvent = events.find(e => e.id === order.event?.id);
    if (!selectedEvent) return 0;
    
    return (order.tickets.regular * selectedEvent.prices.regular) + 
           (order.tickets.premium * selectedEvent.prices.premium);
  };

  const handleConfirmQuantity = () => {
    const total = calculateTotal();
    setOrder(prev => ({ ...prev, totalAmount: total }));
    addMessage('user', `${order.tickets.regular} ${t.regular}, ${order.tickets.premium} ${t.premium}`);
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
                <Ticket className="mr-2 h-4 w-4" />{t.bookingMode}
            </Button>
            <Button 
                variant={mode === 'faq' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('faq')}
                className={cn('rounded-full', {'shadow-sm': mode === 'faq'})}
            >
                <MessageCircleQuestion className="mr-2 h-4 w-4" />{t.faqMode}
            </Button>
        </div>
    </div>
  );

  const getSelectedEventDetails = () => {
    return events.find(e => e.id === order.event?.id);
  };

  const renderInput = () => {
    if (mode === 'faq') {
        return (
            <form onSubmit={handleFaqQuestion} className="flex gap-2 p-2">
                <Input name="question" placeholder={t.askMeAnything} className="flex-1" />
                <Button type="submit" size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        );
    }
    
    switch (step) {
      case 'select_state':
        return (
          <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3">
            {Object.keys(states).map(state => (
              <Button key={state} variant="secondary" onClick={() => handleStateSelection(state)} className="text-center">{state}</Button>
            ))}
          </div>
        );
        
      case 'select_city':
        const cities = order.state ? getCitiesByState(order.state) : [];
        return (
          <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2">
            {cities.map(city => (
              <Button key={city} variant="secondary" onClick={() => handleCitySelection(city)} className="text-center">
                <MapPin className="mr-2 h-4 w-4" />{city}
              </Button>
            ))}
          </div>
        );
        
      case 'select_event':
        return (
          <div className="space-y-2 p-2">
            {availableEvents.map(event => (
              <Button 
                key={event.id} 
                variant="outline" 
                onClick={() => handleEventSelection(event.id)} 
                className="w-full justify-start text-left h-auto p-4"
              >
                <div className="flex flex-col items-start">
                  <div className="font-semibold">{event.name}</div>
                  <div className="text-sm text-muted-foreground">{event.venue} • {t[event.type]}</div>
                  <div className="text-sm text-green-600">₹{event.prices.regular} onwards</div>
                </div>
              </Button>
            ))}
          </div>
        );
        
      case 'select_date':
        const selectedEvent = getSelectedEventDetails();
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <CalendarComponent 
              mode="single" 
              onSelect={handleDateSelection} 
              className="m-4 rounded-lg border" 
              selected={order.date ?? undefined}
              disabled={(date) => {
                const dateStr = date.toISOString().split('T')[0];
                return !selectedEvent?.dates.includes(dateStr);
              }}
            />
          </motion.div>
        );
        
      case 'select_time':
        const eventForTimes = getSelectedEventDetails();
        return (
          <div className="grid grid-cols-2 gap-2 p-2">
            {eventForTimes?.times.map(time => (
              <Button key={time} variant="secondary" onClick={() => handleTimeSelection(time)} className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />{time}
              </Button>
            ))}
          </div>
        );
        
      case 'select_quantity':
        const eventForPricing = getSelectedEventDetails();
        if (!eventForPricing) return null;
        
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-md border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{t.regular}</span>
                      <p className="text-sm text-muted-foreground">₹{eventForPricing.prices.regular}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('regular', order.tickets.regular - 1)}>-</Button>
                        <span className="w-8 text-center">{order.tickets.regular}</span>
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('regular', order.tickets.regular + 1)}>+</Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{t.premium}</span>
                      <p className="text-sm text-muted-foreground">₹{eventForPricing.prices.premium}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('premium', order.tickets.premium - 1)}>-</Button>
                        <span className="w-8 text-center">{order.tickets.premium}</span>
                        <Button size="icon" variant="outline" onClick={() => handleQuantityChange('premium', order.tickets.premium + 1)}>+</Button>
                    </div>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
                <Button onClick={handleConfirmQuantity} className="w-full">
                  <Users className="mr-2 h-4 w-4" />{t.proceedToPayment}
                </Button>
            </motion.div>
        );
        
      case 'confirm_order':
          return <div className="p-2"><Button onClick={handlePayment} className="w-full">{t.proceedToPayment}</Button></div>;
          
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
            {isBotTyping && (
              <motion.div key="typing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <ChatBubble sender="bot">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </ChatBubble>
              </motion.div>
            )}
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
