import AppHeader from "@/components/layout/AppHeader";
import { Construction } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  subtitle: string;
}

export default function ModulePlaceholder({ title, subtitle }: ModulePlaceholderProps) {
  return (
    <>
      <AppHeader title={title} subtitle={subtitle} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Módulo en desarrollo</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            El módulo de {title.toLowerCase()} se implementará próximamente.
          </p>
        </div>
      </div>
    </>
  );
}
