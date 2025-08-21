import { useState, useCallback } from 'react';
import { Message, QuestionnaireState, ContactInfo } from '@/types/chat';
import { questions, contactFields } from '@/data/questionnaire';

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<QuestionnaireState>({
    currentStep: 'welcome',
    currentQuestionIndex: 0,
    contactInfo: {},
    answers: {}
  });

  const addMessage = useCallback((content: string, type: 'user' | 'bot', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const initializeBot = useCallback(() => {
    const welcomeMessage = `¡Hola! Soy el asistente del **Termómetro Exportador**, desarrollado por el **Laboratorio de Comercio Internacional de la Universidad de La Sabana**.

Este cuestionario te ayudará a evaluar la preparación y capacidad exportadora de tu empresa. La información que proporciones será utilizada únicamente para diagnóstico y orientación general.

Para comenzar, necesito recopilar algunos datos básicos de contacto. ¿Estás listo para empezar?`;

    addMessage(welcomeMessage, 'bot', ['Sí, comenzar cuestionario', 'Necesito más información']);
  }, [addMessage]);

  const startContactCollection = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentStep: 'contact', 
      currentField: 'name' 
    }));
    
    addMessage(
      'Perfecto, comencemos recopilando tus datos de contacto.\n\n¿Cuál es tu **nombre completo**?',
      'bot'
    );
  }, [addMessage]);

  const handleContactInput = useCallback((input: string) => {
    const currentField = state.currentField!;
    const fieldIndex = contactFields.findIndex(f => f.key === currentField);
    
    setState(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [currentField]: input
      }
    }));

    addMessage(input, 'user');

    if (fieldIndex < contactFields.length - 1) {
      const nextField = contactFields[fieldIndex + 1];
      setState(prev => ({ ...prev, currentField: nextField.key }));
      
      addMessage(`Gracias. Ahora, ¿cuál es ${nextField.label.toLowerCase()}?`, 'bot');
    } else {
      // Contact collection complete
      setState(prev => ({ 
        ...prev, 
        currentStep: 'questionnaire', 
        currentField: undefined 
      }));
      
      addMessage(
        'Excelente, ya tengo todos tus datos de contacto. Ahora comenzaremos con el cuestionario de evaluación exportadora.\n\nResponde cada pregunta seleccionando la opción que mejor describa la situación actual de tu empresa.',
        'bot'
      );
      
      setTimeout(() => {
        const firstQuestion = questions[0];
        addMessage(
          `**Pregunta 1:** ${firstQuestion.text}`,
          'bot',
          firstQuestion.options
        );
      }, 1000);
    }
  }, [state.currentField, addMessage]);

  const handleQuestionAnswer = useCallback((answer: string) => {
    const currentQuestion = questions[state.currentQuestionIndex];
    
    // Save answer
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer
      }
    }));

    addMessage(answer, 'user');

    if (state.currentQuestionIndex < questions.length - 1) {
      // Next question
      setState(prev => ({ 
        ...prev, 
        currentQuestionIndex: prev.currentQuestionIndex + 1 
      }));
      
      setTimeout(() => {
        const nextQuestion = questions[state.currentQuestionIndex + 1];
        addMessage(
          `**Pregunta ${state.currentQuestionIndex + 2}:** ${nextQuestion.text}`,
          'bot',
          nextQuestion.options
        );
      }, 1000);
    } else {
      // Generate diagnosis
      setState(prev => ({ ...prev, currentStep: 'diagnosis' }));
      generateDiagnosis();
    }
  }, [state.currentQuestionIndex, addMessage]);

  const generateDiagnosis = useCallback(() => {
    addMessage(
      'Perfecto, has completado todo el cuestionario. Ahora voy a generar tu diagnóstico personalizado...',
      'bot'
    );

    setTimeout(() => {
      const diagnosis = `## 📊 **DIAGNÓSTICO DE CAPACIDAD EXPORTADORA**

### 👤 **Datos de la Evaluación**
- **Empresa:** ${state.contactInfo.company}
- **Responsable:** ${state.contactInfo.name}
- **Ciudad:** ${state.contactInfo.city}

### ✅ **FORTALEZAS IDENTIFICADAS**

**Preparación Institucional:** Tu empresa muestra interés genuino en la internacionalización, lo cual es el primer paso fundamental para el éxito exportador.

### ⚠️ **ÁREAS DE MEJORA**

**Certificaciones de Calidad:** Es recomendable implementar sistemas de gestión de calidad reconocidos internacionalmente.

**Capacidad Productiva:** Evalúa la posibilidad de aumentar tu capacidad de producción para atender demanda internacional.

### 🎯 **RECOMENDACIONES ESTRATÉGICAS**

1. **Certificaciones:** Considera obtener certificaciones ISO 9001 o específicas de tu sector.

2. **Investigación de Mercados:** Realiza estudios de mercado para identificar oportunidades específicas.

3. **Capacitación:** Invierte en formación de tu equipo en comercio internacional.

4. **Alianzas:** Explora partnerships con empresas exportadoras experimentadas.

### 📞 **Próximos Pasos**

El **Laboratorio de Comercio Internacional de la Universidad de La Sabana** ofrece programas especializados para fortalecer tu capacidad exportadora.

¡Gracias por participar en esta evaluación! Este diagnóstico puede servir como base para tomar decisiones estratégicas sobre la internacionalización de tu empresa.`;

      addMessage(diagnosis, 'bot');
    }, 2000);
  }, [state.contactInfo, addMessage]);

  const handleUserMessage = useCallback((message: string) => {
    switch (state.currentStep) {
      case 'welcome':
        addMessage(message, 'user');
        if (message.includes('comenzar') || message.includes('Sí')) {
          startContactCollection();
        } else {
          addMessage(
            'El Termómetro Exportador es una herramienta de diagnóstico que evalúa diferentes aspectos de tu empresa como certificaciones, experiencia internacional, capacidad productiva, recursos humanos y adaptación de productos.\n\nCuando estés listo, selecciona "Sí, comenzar cuestionario".',
            'bot',
            ['Sí, comenzar cuestionario']
          );
        }
        break;

      case 'contact':
        handleContactInput(message);
        break;

      case 'questionnaire':
        handleQuestionAnswer(message);
        break;
    }
  }, [state, addMessage, startContactCollection, handleContactInput, handleQuestionAnswer]);

  const requestExplanation = useCallback(() => {
    if (state.currentStep === 'questionnaire') {
      const currentQuestion = questions[state.currentQuestionIndex];
      if (currentQuestion.explanation) {
        addMessage(
          `💡 **Explicación:** ${currentQuestion.explanation}`,
          'bot',
          currentQuestion.options
        );
      }
    }
  }, [state, addMessage]);

  return {
    messages,
    state,
    handleUserMessage,
    initializeBot,
    requestExplanation
  };
};