'use client';

import { Header } from '@/components/header';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';

function ChatLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentLang, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header 
        currentLang={currentLang} 
        onLanguageChange={setLanguage} 
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <ChatLayoutContent>{children}</ChatLayoutContent>
    </LanguageProvider>
  );
}
