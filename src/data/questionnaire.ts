import { Question } from '@/types/chat';

export const questions: Question[] = [
  {
    id: 1,
    text: "¿Su empresa cuenta con certificaciones de calidad (ISO, BPM, BPA, etc.)?",
    options: [
      "Sí, tenemos certificaciones vigentes",
      "Estamos en proceso de certificación",
      "No, pero planeamos obtenerlas",
      "No tenemos certificaciones"
    ],
    explanation: "Las certificaciones de calidad como ISO 9001, Buenas Prácticas de Manufactura (BPM) o Buenas Prácticas Agrícolas (BPA) son fundamentales para acceder a mercados internacionales.",
    category: "Calidad y Certificaciones"
  },
  {
    id: 2,
    text: "¿Qué experiencia tiene su empresa en comercio internacional?",
    options: [
      "Exportamos regularmente",
      "Hemos exportado ocasionalmente",
      "Exportación indirecta (a través de intermediarios)",
      "Nunca hemos exportado"
    ],
    explanation: "La exportación indirecta se refiere a vender a intermediarios nacionales que posteriormente exportan el producto.",
    category: "Experiencia Internacional"
  },
  {
    id: 3,
    text: "¿Su empresa tiene capacidad de producción adicional para mercados de exportación?",
    options: [
      "Sí, tenemos capacidad ociosa significativa",
      "Podemos aumentar capacidad con inversión moderada",
      "Necesitaríamos inversión considerable",
      "No tenemos capacidad adicional"
    ],
    explanation: "La capacidad productiva es crucial para cumplir con pedidos internacionales que suelen ser de mayor volumen.",
    category: "Capacidad Productiva"
  },
  {
    id: 4,
    text: "¿Cuenta su empresa con personal que maneje idiomas extranjeros?",
    options: [
      "Sí, varios empleados manejan idiomas",
      "Tenemos al menos una persona bilingüe",
      "Contratamos servicios de traducción",
      "No tenemos personal con idiomas extranjeros"
    ],
    explanation: "El manejo de idiomas facilita la comunicación con clientes internacionales y la comprensión de regulaciones.",
    category: "Recursos Humanos"
  },
  {
    id: 5,
    text: "¿Su producto requiere adaptaciones específicas para mercados internacionales?",
    options: [
      "No requiere adaptaciones",
      "Requiere adaptaciones menores (etiquetado, empaque)",
      "Requiere adaptaciones moderadas",
      "Requiere adaptaciones significativas"
    ],
    explanation: "Muchos productos necesitan adaptaciones en etiquetado, empaque, certificaciones o características técnicas.",
    category: "Adaptación de Producto"
  }
];

export const contactFields = [
  { key: 'name', label: 'Nombre completo', placeholder: 'Ingrese su nombre completo' },
  { key: 'company', label: 'Empresa', placeholder: 'Nombre de su empresa' },
  { key: 'nit', label: 'NIT', placeholder: 'Número de identificación tributaria' },
  { key: 'email', label: 'Email', placeholder: 'correo@empresa.com' },
  { key: 'phone', label: 'Teléfono', placeholder: 'Número de contacto' },
  { key: 'city', label: 'Ciudad', placeholder: 'Ciudad donde opera' }
] as const;