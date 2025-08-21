import { Globe } from 'lucide-react';
import unisabanaLogo from '@/assets/unisabana-logo.png';

export const UniversityBranding = () => {
  return (
    <div className="text-center mb-6 p-6 bg-card border border-card-border rounded-2xl shadow-soft animate-fade-in">
      <div className="flex items-center justify-center gap-4 mb-4">
        <img 
          src={unisabanaLogo} 
          alt="Universidad de La Sabana" 
          className="w-12 h-12 object-contain"
        />
        <Globe className="w-6 h-6 text-secondary" />
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">
        Termómetro Exportador
      </h1>
      <p className="text-sm text-muted-foreground">
        <strong>Laboratorio de Comercio Internacional</strong><br />
        Universidad de La Sabana
      </p>
      <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-3"></div>
    </div>
  );
};