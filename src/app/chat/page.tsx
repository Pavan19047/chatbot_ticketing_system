'use client';

import ChatInterface from '@/components/chat/enhanced-chat-interface';
import { useLanguage } from '@/contexts/language-context';

export default function ChatPage() {
  const { currentLang } = useLanguage();
  
  return (
    <div className="container mx-auto max-w-4xl">
      <ChatInterface lang={currentLang} />
    </div>
  );
}
