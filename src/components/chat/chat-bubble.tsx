import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bot, User } from 'lucide-react';

type ChatBubbleProps = {
  sender: 'user' | 'bot';
  children: React.ReactNode;
};

export function ChatBubble({ sender, children }: ChatBubbleProps) {
  const isBot = sender === 'bot';
  return (
    <div
      className={cn('flex items-start gap-3', {
        'justify-end': !isBot,
        'justify-start': isBot,
      })}
    >
      {isBot && (
        <Avatar className="neubrutalist-border h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs rounded-lg p-3 sm:max-w-md md:max-w-lg',
          'neubrutalist-border',
          {
            'bg-accent text-accent-foreground': !isBot,
            'bg-white': isBot,
          }
        )}
      >
        <div className="text-sm">{children}</div>
      </div>
       {!isBot && (
        <Avatar className="neubrutalist-border h-10 w-10">
          <AvatarFallback className="bg-secondary">
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
