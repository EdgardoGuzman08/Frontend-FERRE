import { ShoppingCart, Package, Wrench, DollarSign, Clock } from "lucide-react";

const activities = [
  { icon: ShoppingCart, text: "Venta #1042 registrada", time: "Hace 5 min", color: "text-primary" },
  { icon: Package, text: "Recepción de compra #287", time: "Hace 15 min", color: "text-accent" },
  { icon: Wrench, text: "OT-0034 asignada a Carlos M.", time: "Hace 30 min", color: "text-warning" },
  { icon: DollarSign, text: "Pago recibido — Fac. #1038", time: "Hace 1 hr", color: "text-success" },
  { icon: Package, text: "Alerta: Disco de corte bajo mínimo", time: "Hace 2 hr", color: "text-destructive" },
];

export default function RecentActivityCard() {
  return (
    <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Actividad reciente</h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {activities.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{item.text}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
