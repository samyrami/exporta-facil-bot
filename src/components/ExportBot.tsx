import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { UniversityBranding } from './UniversityBranding';
import { useChatBot } from '@/hooks/useChatBot';
import { Button } from '@/components/ui/button';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ExportBot = () => {
  const { 
    messages, 
    state, 
    handleUserMessage, 
    initializeBot, 
    requestExplanation 
  } = useChatBot();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeBot();
  }, [initializeBot]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const canRequestExplanation = state.currentStep === 'questionnaire' && messages.length > 0;
  const isWaitingForInput = state.currentStep === 'contact' || 
    (state.currentStep === 'questionnaire' && !messages[messages.length - 1]?.options);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <UniversityBranding />
        
        <div className="bg-card border border-card-border rounded-2xl shadow-strong overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-primary-foreground font-semibold text-lg">
                  Asistente Exportador
                </h2>
                <p className="text-primary-foreground/80 text-sm">
                  {state.currentStep === 'welcome' && 'Iniciando evaluación...'}
                  {state.currentStep === 'contact' && 'Recopilando datos de contacto'}
                  {state.currentStep === 'questionnaire' && `Pregunta ${state.currentQuestionIndex + 1} de ${5}`}
                  {state.currentStep === 'diagnosis' && 'Generando diagnóstico...'}
                </p>
              </div>
              <div className="flex gap-2">
                {canRequestExplanation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestExplanation}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Explicación
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="h-[600px] flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="message-enter">
                    <ChatMessage
                      message={message}
                      onOptionSelect={handleUserMessage}
                    />
                  </div>
                ))}
                
                {state.currentStep !== 'diagnosis' && messages.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-chat-bubble-bot border border-card-border rounded-2xl px-4 py-3 shadow-soft">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {isWaitingForInput && (
              <div className="p-4 border-t border-card-border bg-chat-background">
                <ChatInput
                  onSendMessage={handleUserMessage}
                  placeholder={
                    state.currentStep === 'contact' 
                      ? "Escriba su respuesta..." 
                      : "Seleccione una opción o escriba su respuesta..."
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Desarrollado por el <strong>Laboratorio de Comercio Internacional</strong><br />
            Universidad de La Sabana © 2024
          </p>
        </div>
      </div>
    </div>
  );
};