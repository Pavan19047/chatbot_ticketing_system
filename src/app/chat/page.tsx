import ChatInterface from '@/components/chat/chat-interface';
import { Suspense } from 'react';

function ChatPageContent({ lang }: { lang?: string }) {
  const validLang = lang === 'es' ? 'es' : 'en';
  return <ChatInterface lang={validLang} />;
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams?: { [key: 'string']: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent lang={searchParams?.lang as string} />
    </Suspense>
  );
}
