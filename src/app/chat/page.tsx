'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat/enhanced-chat-interface';
import { Header } from '@/components/header';

export default function ChatPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header currentLang={currentLang} onLanguageChange={(lang) => setCurrentLang(lang as 'en' | 'hi')} />
      <div className="container mx-auto max-w-4xl">
        <ChatInterface lang={currentLang} />
      </div>
    </div>
  );
}
