import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onOptionSelect?: (option: string) => void;
}

export const ChatMessage = ({ message, onOptionSelect }: ChatMessageProps) => {
  const isBot = message.type === 'bot';

  return (
    <div className={cn("flex gap-3 mb-6", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <Avatar className="w-8 h-8 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[80%] space-y-2", !isBot && "order-first")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-soft",
            isBot
              ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground border border-card-border"
              : "bg-chat-bubble-user text-chat-bubble-user-foreground"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.options && message.options.length > 0 && (
          <div className="flex flex-col gap-2">
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onOptionSelect?.(option)}
                className="justify-start text-left text-sm h-auto py-3 px-4 hover:bg-accent transition-colors"
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