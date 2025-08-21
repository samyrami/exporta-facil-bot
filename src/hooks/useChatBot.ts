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

Este cuestionario te ayudará a **evaluar la preparación y capacidad exportadora** de tu empresa. La información que proporciones será utilizada únicamente para diagnóstico y orientación general.

> 📋 El proceso incluye:
> - Recolección de datos básicos
> - Cuestionario de 5 preguntas clave  
> - Diagnóstico personalizado con recomendaciones

¿Estás listo para empezar?`;

    addMessage(welcomeMessage, 'bot', ['Sí, comenzar cuestionario', 'Necesito más información']);
  }, [addMessage]);

  const startContactCollection = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentStep: 'contact', 
      currentField: 'name' 
    }));
    
    addMessage(
      '**📝 Datos de Contacto**\n\nPerfecto, comencemos recopilando tus datos de contacto.\n\n¿Cuál es tu **nombre completo**?',
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
      
      addMessage(`Gracias **${input}**. Ahora, ¿cuál es ${nextField.label.toLowerCase()}?`, 'bot');
    } else {
      // Contact collection complete
      setState(prev => ({ 
        ...prev, 
        currentStep: 'questionnaire', 
        currentField: undefined 
      }));
      
      addMessage(
        '✅ **¡Excelente!** Ya tengo todos tus datos de contacto.\n\nAhora comenzaremos con el **cuestionario de evaluación exportadora**.\n\n> 💡 **Instrucciones:** Responde cada pregunta seleccionando la opción que mejor describa la situación actual de tu empresa.',
        'bot'
      );
      
      setTimeout(() => {
        const firstQuestion = questions[0];
        addMessage(
          `**Pregunta ${firstQuestion.id}/5** - *${firstQuestion.category}*\n\n${firstQuestion.text}`,
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
          `**Pregunta ${nextQuestion.id}/5** - *${nextQuestion.category}*\n\n${nextQuestion.text}`,
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
      '🎯 **¡Perfecto!** Has completado todo el cuestionario.\n\n⏳ Ahora voy a generar tu **diagnóstico personalizado**...',
      'bot'
    );

    setTimeout(() => {
      const diagnosis = `# 📊 DIAGNÓSTICO DE CAPACIDAD EXPORTADORA

## 👤 **Datos de la Evaluación**
- **Empresa:** ${state.contactInfo.company}
- **Responsable:** ${state.contactInfo.name}  
- **Ciudad:** ${state.contactInfo.city}
- **Fecha:** ${new Date().toLocaleDateString('es-CO')}

---

## ✅ **FORTALEZAS IDENTIFICADAS**

### 🏢 Preparación Institucional
Tu empresa muestra **interés genuino** en la internacionalización, lo cual es el primer paso fundamental para el éxito exportador.

### 📋 Compromiso con la Evaluación  
Has completado exitosamente el proceso de evaluación, demostrando **seriedad** en el proceso de diagnóstico.

---

## ⚠️ **ÁREAS DE MEJORA IDENTIFICADAS**

### 🏆 Certificaciones de Calidad
Es **altamente recomendable** implementar sistemas de gestión de calidad reconocidos internacionalmente como:
- ISO 9001 (Gestión de Calidad)
- Certificaciones específicas del sector
- Buenas Prácticas de Manufactura (BPM)

### 🏭 Capacidad Productiva
Evalúa la posibilidad de **aumentar tu capacidad de producción** para atender demanda internacional que suele requerir volúmenes superiores.

### 🌍 Conocimiento de Mercados
Desarrollar **inteligencia de mercados** para identificar oportunidades específicas por país y sector.

---

## 🎯 **RECOMENDACIONES ESTRATÉGICAS**

### 1. 📜 **Certificaciones y Calidad**
- Implementar ISO 9001 como base
- Considerar certificaciones específicas de tu sector  
- Establecer procesos de mejora continua

### 2. 🔍 **Investigación de Mercados**
- Realizar estudios de mercado por país objetivo
- Identificar canales de distribución apropiados
- Analizar competencia internacional

### 3. 👥 **Capacitación del Equipo**  
- Formación en comercio internacional
- Desarrollo de competencias en idiomas
- Conocimiento de logística internacional

### 4. 🤝 **Alianzas Estratégicas**
- Partnerships con empresas exportadoras experimentadas
- Asociaciones gremiales de exportadores
- Participación en misiones comerciales

### 5. 📈 **Planificación Financiera**
- Evaluación de costos de internacionalización
- Acceso a instrumentos financieros para exportación
- Gestión de riesgos cambiarios

---

## 📞 **PRÓXIMOS PASOS**

El **Laboratorio de Comercio Internacional de la Universidad de La Sabana** ofrece:

- 🎓 **Programas especializados** en comercio internacional
- 🔬 **Servicios de consultoría** para exportadores  
- 📚 **Capacitaciones** en preparación exportadora
- 🌐 **Inteligencia de mercados** y oportunidades comerciales

> **Contacto:** Laboratorio de Comercio Internacional  
> Universidad de La Sabana  
> 📧 Email: [comercio.internacional@unisabana.edu.co](mailto:comercio.internacional@unisabana.edu.co)

---

## 🙏 **AGRADECIMIENTOS**

¡**Gracias** por participar en esta evaluación! Este diagnóstico puede servir como base para tomar decisiones estratégicas sobre la **internacionalización de tu empresa**.

*Desarrollado por el Laboratorio de Comercio Internacional - Universidad de La Sabana © 2024*`;

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
            '📖 **Más Información sobre el Termómetro Exportador**\n\nEl Termómetro Exportador es una **herramienta de diagnóstico especializada** que evalúa diferentes aspectos críticos de tu empresa:\n\n### 🔍 **Aspectos Evaluados:**\n- 🏆 **Certificaciones de calidad** (ISO, BPM, BPA)\n- 🌍 **Experiencia internacional** \n- 🏭 **Capacidad productiva**\n- 👥 **Recursos humanos especializados**\n- 📦 **Adaptación de productos**\n\n### 📊 **Beneficios del Diagnóstico:**\n- Identificación de **fortalezas** y **oportunidades de mejora**\n- **Recomendaciones estratégicas** personalizadas\n- **Hoja de ruta** para la internacionalización\n\nCuando estés listo, selecciona "Sí, comenzar cuestionario".',
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
          `💡 **Explicación**\n\n${currentQuestion.explanation}\n\n---\n\n**Pregunta ${currentQuestion.id}/5** - *${currentQuestion.category}*\n\n${currentQuestion.text}`,
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