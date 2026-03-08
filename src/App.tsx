import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import UsuariosPage from "@/pages/Usuarios";
import MaestrosPage from "@/pages/MaestrosPage";
import InventarioPage from "@/pages/Inventario";


import VentasPage from "@/pages/Ventas";
import ComprasPage from "@/pages/Compras";
import TallerPage from "@/pages/Taller";
import CajaPage from "@/pages/Caja";
import ReportesPage from "@/pages/Reportes";


import VentasPage from "@/pages/Ventas";
import ComprasPage from "@/pages/Compras";
import TallerPage from "@/pages/Taller";

import ModulePlaceholder from "@/components/shared/ModulePlaceholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* App layout with sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/maestros" element={<MaestrosPage />} />
            <Route path="/inventario" element={<InventarioPage />} />

            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/caja" element={<CajaPage />} />
            <Route path="/taller" element={<TallerPage />} />

            <Route path="/reportes" element={<ReportesPage />} />

            <Route path="/usuarios" element={<Navigate to="/usuarios/usuarios" replace />} />
            <Route path="/usuarios/:tab" element={<UsuariosPage />} />
            <Route path="/maestros" element={<Navigate to="/maestros/clientes" replace />} />
            <Route path="/maestros/:tab" element={<MaestrosPage />} />
            <Route path="/inventario" element={<Navigate to="/inventario/stock" replace />} />
            <Route path="/inventario/:tab" element={<InventarioPage />} />
            <Route path="/ventas" element={<Navigate to="/ventas/cotizaciones" replace />} />
            <Route path="/ventas/:tab" element={<VentasPage />} />
            <Route path="/compras" element={<Navigate to="/compras/solicitudes" replace />} />
            <Route path="/compras/:tab" element={<ComprasPage />} />
            <Route path="/caja" element={<ModulePlaceholder title="Caja / Tesorería" subtitle="Movimientos de caja, arqueos y cierres" />} />
            <Route path="/caja/:tab" element={<ModulePlaceholder title="Caja / Tesorería" subtitle="Movimientos de caja, arqueos y cierres" />} />
            <Route path="/taller" element={<Navigate to="/taller/citas" replace />} />
            <Route path="/taller/:tab" element={<TallerPage />} />
            <Route path="/reportes" element={<ModulePlaceholder title="Reportes & KPIs" subtitle="Análisis, dashboards y métricas de negocio" />} />
            <Route path="/reportes/:tab" element={<ModulePlaceholder title="Reportes & KPIs" subtitle="Análisis, dashboards y métricas de negocio" />} />
            <Route path="/chatbot" element={<ModulePlaceholder title="Chatbot Analítico" subtitle="Consultas en lenguaje natural sobre datos del negocio" />} />
            <Route path="/configuracion" element={<ModulePlaceholder title="Configuración" subtitle="Parámetros del sistema, sucursales y ajustes" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
