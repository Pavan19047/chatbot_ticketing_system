import ChatInterface from '@/components/chat/chat-interface';
import { Suspense } from 'react';

function ChatPageContent({ lang }: { lang?: string }) {
  const validLangs = ['en', 'hi', 'bn', 'ta', 'te'];
  const validLang = lang && validLangs.includes(lang) ? lang as 'en' | 'hi' | 'bn' | 'ta' | 'te' : 'en';
  return <ChatInterface lang={validLang} />;
}

export default function ChatPage({
  searchParams,
}: {
  searchParams: { [key: 'string']: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent lang={searchParams?.lang as string} />
    </Suspense>
  );
}
