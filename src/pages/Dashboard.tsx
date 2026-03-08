import {
  DollarSign,
  Package,
  ShoppingCart,
  Wrench,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import QuickStatsChart from "@/components/dashboard/QuickStatsChart";

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" subtitle="Resumen general del sistema" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Ventas del día"

            value="L 45,230"

            value="C$ 45,230"

            value="L 45,230"
            change="+12.5%"
            trend="up"
            icon={DollarSign}
          />
          <KpiCard
            title="Artículos en stock"
            value="3,842"
            change="-2.1%"
            trend="down"
            icon={Package}
          />
          <KpiCard
            title="OT Abiertas"
            value="18"
            change="+3"
            trend="neutral"
            icon={Wrench}
          />
          <KpiCard
            title="Bajo mínimo"
            value="24"
            change="Alerta"
            trend="warning"
            icon={AlertTriangle}
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <QuickStatsChart />
          </div>
          <RecentActivityCard />
        </div>
      </div>
    </>
  );
}
