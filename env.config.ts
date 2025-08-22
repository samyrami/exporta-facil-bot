// Configuración de variables de entorno
export const envConfig = {
  // OpenAI
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  
  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Termómetro Exportador',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Verificar configuración
  isOpenAIConfigured: () => !!import.meta.env.VITE_OPENAI_API_KEY,
  
  // Obtener API key con fallback
  getOpenAIKey: () => {
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey) return envKey;
    
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) return storedKey;
    
    return null;
  }
};
