import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Sparkles, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onOptionSelect?: (option: string) => void;
}

export const ChatMessage = ({ message, onOptionSelect }: ChatMessageProps) => {
  const isBot = message.type === 'bot';

  return (
    <div className={cn("flex gap-3 mb-6", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light shadow-soft">
          <AvatarFallback className="bg-transparent text-primary-foreground">
            <Sparkles className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[80%] space-y-2", !isBot && "order-first")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-soft animate-fade-in",
            isBot
              ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground border border-card-border"
              : "bg-chat-bubble-user text-chat-bubble-user-foreground"
          )}
        >
          {isBot ? (
            <MarkdownRenderer 
              content={message.content} 
              className="text-chat-bubble-bot-foreground [&_strong]:text-primary [&_p]:mb-2 [&_p:last-child]:mb-0"
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        {message.options && message.options.length > 0 && (
          <div className="flex flex-col gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onOptionSelect?.(option)}
                className="justify-start text-left text-sm h-auto py-3 px-4 hover:bg-accent hover:scale-[1.02] transition-all duration-200"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {!isBot && (
        <Avatar className="w-8 h-8 bg-secondary">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};