import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lun", ventas: 12400, compras: 8200 },
  { name: "Mar", ventas: 18300, compras: 6100 },
  { name: "Mié", ventas: 15700, compras: 9400 },
  { name: "Jue", ventas: 22100, compras: 7800 },
  { name: "Vie", ventas: 28500, compras: 12300 },
  { name: "Sáb", ventas: 31200, compras: 5600 },
  { name: "Dom", ventas: 8900, compras: 2100 },
];

export default function QuickStatsChart() {
  return (
    <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Ventas vs Compras</h3>
          <p className="text-xs text-muted-foreground">Últimos 7 días</p>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 15%, 88%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`C$ ${value.toLocaleString()}`, ""]}
            />
            <Bar dataKey="ventas" fill="hsl(215, 65%, 42%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="compras" fill="hsl(175, 55%, 38%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
