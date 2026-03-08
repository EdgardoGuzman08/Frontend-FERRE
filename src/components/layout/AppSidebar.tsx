import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  Banknote,
  Wrench,
  BarChart3,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  UserCheck,
  ClipboardList,
  Boxes,
  ArrowLeftRight,
  AlertTriangle,
  Receipt,
  CreditCard,
  FileCheck,
  DollarSign,
  Calendar,
  Shield,
  PiggyBank,
  TrendingUp,
  Bot,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SubItem {
  label: string;
  icon: any;
  path: string;
}

interface Module {
  label: string;
  icon: any;
  path: string;
  children?: SubItem[];
}

const modules: Module[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    label: "Usuarios & Roles",
    icon: ShieldCheck,
    path: "/usuarios",
    children: [
      { label: "Usuarios", icon: Users, path: "/usuarios/usuarios" },
      { label: "Roles y Permisos", icon: Shield, path: "/usuarios/roles" },
    ],
  },
  {
    label: "Datos Maestros",
    icon: Database,
    path: "/maestros",
    children: [
      { label: "Clientes", icon: UserCheck, path: "/maestros/clientes" },
      { label: "Proveedores", icon: Truck, path: "/maestros/proveedores" },
      { label: "Artículos", icon: Package, path: "/maestros/articulos" },
    ],
  },
  {
    label: "Inventario",
    icon: Warehouse,
    path: "/inventario",
    children: [
      { label: "Stock Actual", icon: Boxes, path: "/inventario/stock" },
      { label: "Movimientos", icon: ArrowLeftRight, path: "/inventario/movimientos" },
      { label: "Bajo Mínimo", icon: AlertTriangle, path: "/inventario/bajo-minimo" },
    ],
  },
  {
    label: "Ventas",
    icon: ShoppingCart,
    path: "/ventas",
    children: [
      { label: "Cotizaciones", icon: FileText, path: "/ventas/cotizaciones" },
      { label: "Entregas", icon: Truck, path: "/ventas/entregas" },
      { label: "Facturas", icon: Receipt, path: "/ventas/facturas" },
      { label: "Pagos / CxC", icon: CreditCard, path: "/ventas/pagos" },
    ],
  },
  {
    label: "Compras",
    icon: Truck,
    path: "/compras",
    children: [
      { label: "Solicitudes", icon: ClipboardList, path: "/compras/solicitudes" },
      { label: "Órdenes de Compra", icon: FileText, path: "/compras/ordenes" },
      { label: "Recepciones", icon: FileCheck, path: "/compras/recepciones" },
      { label: "Facturas Proveedor", icon: Receipt, path: "/compras/facturas" },
      { label: "Pagos / CxP", icon: DollarSign, path: "/compras/pagos" },
    ],
  },
  {
    label: "Caja / Tesorería",
    icon: Banknote,
    path: "/caja",
    children: [
      { label: "Movimientos", icon: ArrowLeftRight, path: "/caja/movimientos" },
      { label: "Arqueos", icon: PiggyBank, path: "/caja/arqueos" },
      { label: "Cierres", icon: FileCheck, path: "/caja/cierres" },
    ],
  },
  {
    label: "Taller (OT)",
    icon: Wrench,
    path: "/taller",
    children: [
      { label: "Citas", icon: Calendar, path: "/taller/citas" },
      { label: "Órdenes de Trabajo", icon: ClipboardList, path: "/taller/ordenes" },
      { label: "Garantías", icon: Shield, path: "/taller/garantias" },
    ],
  },
  {
    label: "Reportes & KPIs",
    icon: BarChart3,
    path: "/reportes",
    children: [
      { label: "Ventas", icon: TrendingUp, path: "/reportes/ventas" },
      { label: "Inventario", icon: Warehouse, path: "/reportes/inventario" },
      { label: "Taller", icon: Wrench, path: "/reportes/taller" },
      { label: "Financiero", icon: DollarSign, path: "/reportes/financiero" },
    ],
  },
  {
    label: "Chatbot",
    icon: Bot,
    path: "/chatbot",
  },
];

const bottomLinks: Module[] = [
  { label: "Configuración", icon: Settings, path: "/configuracion" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((m) => {
      if (m.children && location.pathname.startsWith(m.path)) {
        initial[m.path] = true;
      }
    });
    return initial;
  });

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-[68px]" : "w-[272px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Wrench className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="text-sm font-semibold text-sidebar-accent-foreground tracking-tight">FerreTaller</p>
            <p className="text-[10px] text-sidebar-foreground">Sistema ERP</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        {modules.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus[item.path];

          if (hasChildren && !collapsed) {
            return (
              <div key={item.path} className="space-y-0.5">
                <button
                  onClick={() => toggleMenu(item.path)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-3 pl-3 border-l border-sidebar-border space-y-0.5 py-0.5">
                    {item.children!.map((sub, idx) => {
                      const subActive = location.pathname === sub.path;
                      return (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors",
                            subActive
                              ? "bg-sidebar-primary/10 text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <sub.icon className="w-4 h-4 shrink-0 opacity-70" />
                          <span className="truncate">{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={hasChildren ? item.children![0].path : item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border px-2 py-3 space-y-0.5">
        {bottomLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground transition-colors w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] shrink-0" />
          ) : (
            <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
          )}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
