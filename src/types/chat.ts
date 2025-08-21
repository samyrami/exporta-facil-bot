export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
}

export interface ContactInfo {
  name: string;
  company: string;
  nit: string;
  email: string;
  phone: string;
  city: string;
}

export interface QuestionnaireState {
  currentStep: 'welcome' | 'contact' | 'questionnaire' | 'diagnosis';
  currentField?: keyof ContactInfo;
  currentQuestionIndex: number;
  contactInfo: Partial<ContactInfo>;
  answers: Record<number, string>;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  explanation?: string;
  category: string;
}