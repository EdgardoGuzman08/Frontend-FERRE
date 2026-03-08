import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral" | "warning";
  icon: LucideIcon;
}

export default function KpiCard({ title, value, change, trend, icon: Icon }: KpiCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            trend === "up" && "bg-success/10 text-success",
            trend === "down" && "bg-destructive/10 text-destructive",
            trend === "neutral" && "bg-primary/10 text-primary",
            trend === "warning" && "bg-warning/10 text-warning"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-success" />}
        {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
        <span
          className={cn(
            "text-xs font-medium",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-primary",
            trend === "warning" && "text-warning"
          )}
        >
          {change}
        </span>
        <span className="text-xs text-muted-foreground">vs ayer</span>
      </div>
    </div>
  );
}
