import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart, Wrench,
    Users, Package, BarChart3, FileText, Star, Calendar
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import {
    mockVentas, mockPagos, mockFacturas, mockOrdenesCompra, mockFacturasCompra,
    mockPagosCompra, mockOTs, mockArqueos, mockMovimientosCaja, mockArticulos,
    mockClientes, mockMovimientos
} from "@/lib/mock-data";

// ── Period selector ────────────────────────────────────────────
type Periodo = "semana" | "mes" | "año";

// ── Helpers ────────────────────────────────────────────────────
const lps = (n: number) => `L${n.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`;

const KpiCard = ({
    label, value, sub, icon: Icon, color = "text-primary", trend
}: { label: string; value: string; sub?: string; icon: React.ElementType; color?: string; trend?: number }) => (
    <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-xl font-bold ${color} leading-tight`}>{value}</p>
            {sub && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{sub}</p>}
            {trend !== undefined && (
                <p className={`text-xs font-medium flex items-center gap-0.5 mt-1 ${trend >= 0 ? "text-success" : "text-destructive"}`}>
                    {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend >= 0 ? "+" : ""}{trend.toFixed(1)}% vs mes anterior
                </p>
            )}
        </div>
    </div>
);

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
    </div>
);

const SimpleTable = ({ headers, rows, emptyMsg = "Sin datos" }: {
    headers: string[];
    rows: (string | React.ReactNode)[][];
    emptyMsg?: string;
}) => (
    <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full caption-bottom text-sm">
            <thead>
                <tr className="bg-muted/50 border-b">
                    {headers.map((h, i) => (
                        <th key={i} className="h-9 px-3 text-left align-middle font-medium text-muted-foreground text-xs">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={headers.length} className="p-4 text-center text-muted-foreground text-sm">{emptyMsg}</td>
                    </tr>
                ) : rows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 align-middle">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function ReportesPage() {
    const [periodo, setPeriodo] = useState<Periodo>("mes");
    const [activeTab, setActiveTab] = useState("resumen");

    // ── Pre-computed metrics ───────────────────────────────────────
    const totalVentas = mockVentas.reduce((s, v) => s + v.total, 0);
    const totalPagosRecibidos = mockPagos.filter(p => p.estado === "completado").reduce((s, p) => s + p.monto, 0);
    const facturasVencidas = mockFacturas.filter(f => f.estado === "vencida").length;
    const ventasAprobadas = mockVentas.filter(v => v.estado === "aprobada" || v.estado === "facturada").length;

    const totalCompras = mockOrdenesCompra.reduce((s, o) => s + o.total, 0);
    const cxpTotal = mockFacturasCompra.filter(f => f.estado === "pendiente").reduce((s, f) => s + f.total, 0);

    const otsCompletadas = mockOTs.filter(o => o.estado === "listo" || o.estado === "entregado" || o.estado === "facturado").length;
    const ingresosOT = mockOTs.reduce((s, o) => s + o.total, 0);

    const saldoCaja = 12750.00 + mockMovimientosCaja.filter(m => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0)
        - mockMovimientosCaja.filter(m => m.tipo === "egreso").reduce((s, m) => s + m.monto, 0);

    const stockBajo = mockArticulos.filter(a => a.stock < a.minimo).length;
    const totalClientes = mockClientes.filter(c => c.estado === "activo").length;

    // Ventas por vendedor
    const vendedores: Record<string, number> = {};
    mockVentas.forEach(v => { vendedores[v.vendedor] = (vendedores[v.vendedor] ?? 0) + v.total; });
    const topVendedores = Object.entries(vendedores).sort((a, b) => b[1] - a[1]);

    // Top clientes por saldo/deuda
    const topClientes = [...mockClientes].sort((a, b) => b.saldo - a.saldo).slice(0, 5);

    // Gastos por concepto caja
    const gastosPorConcepto: Record<string, number> = {};
    mockMovimientosCaja
        .filter(m => m.tipo === "egreso")
        .forEach(m => {
            const label = m.concepto.replace("_", " ");
            gastosPorConcepto[label] = (gastosPorConcepto[label] ?? 0) + m.monto;
        });
    const topGastos = Object.entries(gastosPorConcepto).sort((a, b) => b[1] - a[1]);

    // Movimientos inventario resumen
    const movInv = mockMovimientos;
    const entradas = movInv.filter(m => m.tipo === "entrada").reduce((s, m) => s + m.cantidad, 0);
    const salidas = movInv.filter(m => m.tipo === "salida").reduce((s, m) => s + m.cantidad, 0);

    // Flujo eficiencia OT
    const avgOT = mockOTs.reduce((s, o) => s + o.total, 0) / (mockOTs.length || 1);

    return (
        <div className="flex-1 overflow-auto p-6">
            <PageHeader title="Reportes &amp; KPIs" subtitle="Análisis integral del negocio — Ferretaller S.A. de C.V.">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {(["semana", "mes", "año"] as Periodo[]).map(p => (
                        <Button
                            key={p}
                            size="sm"
                            variant={periodo === p ? "default" : "outline"}
                            className="h-7 px-3 text-xs capitalize"
                            onClick={() => setPeriodo(p)}
                        >
                            {p === "semana" ? "Esta Semana" : p === "mes" ? "Este Mes" : "Este Año"}
                        </Button>
                    ))}
                </div>
            </PageHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="resumen">1. Resumen Ejecutivo</TabsTrigger>
                    <TabsTrigger value="ventas">2. Ventas & Cobranza</TabsTrigger>
                    <TabsTrigger value="compras">3. Compras & Gastos</TabsTrigger>
                    <TabsTrigger value="taller">4. Taller</TabsTrigger>
                    <TabsTrigger value="flujo">5. Flujo de Caja</TabsTrigger>
                </TabsList>

                {/* ══════════════════════════════════════════════════════════
            TAB 1 – RESUMEN EJECUTIVO
        ══════════════════════════════════════════════════════════ */}
                <TabsContent value="resumen" className="mt-4 space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <KpiCard label="Ventas Totales (Mes)" value={lps(totalVentas)} icon={DollarSign} color="text-primary" trend={12.4} sub={`${ventasAprobadas} órdenes activas`} />
                        <KpiCard label="Pagos Recibidos" value={lps(totalPagosRecibidos)} icon={TrendingUp} color="text-success" trend={8.1} sub="Efectivo + transferencias" />
                        <KpiCard label="Facturas Vencidas" value={`${facturasVencidas} FAC`} icon={FileText} color="text-destructive" trend={-15.0} sub="Requieren gestión de cobro" />
                        <KpiCard label="Saldo Caja + Bancos" value={lps(saldoCaja + 125450 + 48200)} icon={BarChart3} color="text-warning" sub="Posición de liquidez total" />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <KpiCard label="OTs Completadas" value={`${otsCompletadas} / ${mockOTs.length}`} icon={Wrench} color="text-primary" trend={5.0} sub="Taller este período" />
                        <KpiCard label="Ingresos Taller" value={lps(ingresosOT)} icon={Star} color="text-success" sub="Servicios + repuestos" />
                        <KpiCard label="Artículos Stock Bajo" value={`${stockBajo} ítems`} icon={Package} color="text-destructive" sub="Requieren reorden urgente" />
                        <KpiCard label="Clientes Activos" value={`${totalClientes}`} icon={Users} color="text-primary" sub="Con cuenta activa en el sistema" />
                    </div>

                    {/* Margen bruto estimado */}
                    <div className="rounded-lg border bg-card p-5">
                        <SectionTitle icon={BarChart3} title="Indicadores de Rentabilidad (Período Actual)" />
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: "Margen Bruto Estimado", value: "38%", sub: "(Venta - Costo directo) / Venta", color: "text-success" },
                                { label: "Cuentas x Cobrar", value: lps(mockClientes.reduce((s, c) => s + c.saldo, 0)), sub: "Saldo total de clientes", color: "text-warning" },
                                { label: "Cuentas x Pagar", value: lps(cxpTotal), sub: "Facturas proveedor pendientes", color: "text-destructive" },
                            ].map((item, i) => (
                                <div key={i} className="border-l-4 border-primary pl-4">
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                    <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top vendedores preview */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={Users} title="Top Vendedores" />
                            <SimpleTable
                                headers={["Vendedor", "Ventas Totales", "Part."]}
                                rows={topVendedores.map(([v, t]) => [
                                    <span className="font-medium text-sm">{v}</span>,
                                    <span className="font-mono text-sm font-semibold text-primary">{lps(t)}</span>,
                                    <Badge variant="outline" className="text-xs">{((t / totalVentas) * 100).toFixed(0)}%</Badge>
                                ])}
                            />
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={Users} title="Clientes con Mayor Saldo" />
                            <SimpleTable
                                headers={["Cliente", "Tipo", "Saldo CxC"]}
                                rows={topClientes.map(c => [
                                    <span className="font-medium text-sm">{c.nombre}</span>,
                                    <Badge variant="outline" className="text-xs capitalize">{c.tipo}</Badge>,
                                    <span className={`font-mono text-sm font-bold ${c.saldo > 0 ? "text-destructive" : "text-success"}`}>{lps(c.saldo)}</span>
                                ])}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* ══════════════════════════════════════════════════════════
            TAB 2 – VENTAS & COBRANZA
        ══════════════════════════════════════════════════════════ */}
                <TabsContent value="ventas" className="mt-4 space-y-5">
                    <div className="grid grid-cols-4 gap-4">
                        <KpiCard label="Total Facturado" value={lps(mockFacturas.reduce((s, f) => s + f.total, 0))} icon={FileText} color="text-primary" />
                        <KpiCard label="Cobrado" value={lps(totalPagosRecibidos)} icon={TrendingUp} color="text-success" />
                        <KpiCard label="Pendiente de Cobro" value={lps(mockFacturas.filter(f => f.estado === "pendiente").reduce((s, f) => s + f.total, 0))} icon={DollarSign} color="text-warning" />
                        <KpiCard label="Facturas Vencidas" value={lps(mockFacturas.filter(f => f.estado === "vencida").reduce((s, f) => s + f.total, 0))} icon={TrendingDown} color="text-destructive" />
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <SectionTitle icon={FileText} title="Facturas Emitidas — Detalle" />
                        <SimpleTable
                            headers={["No. Factura", "Cliente", "Fecha Emisión", "Vencimiento", "CAI", "Total", "Estado"]}
                            rows={mockFacturas.map(f => [
                                <span className="font-mono text-xs font-semibold">{f.numeroFactura}</span>,
                                <span className="font-medium text-sm">{f.cliente}</span>,
                                <span className="text-xs">{f.fechaEmision}</span>,
                                <span className="text-xs">{f.fechaVencimiento}</span>,
                                <span className="font-mono text-[10px] text-muted-foreground">{f.cai}</span>,
                                <span className="font-mono font-bold text-sm">{lps(f.total)}</span>,
                                <Badge variant="outline" className={`text-xs capitalize ${f.estado === "pagada" ? "bg-success/15 text-success border-success/30" : f.estado === "vencida" ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-warning/15 text-warning border-warning/30"}`}>{f.estado}</Badge>
                            ])}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={Users} title="Ventas por Vendedor" />
                            <SimpleTable
                                headers={["Vendedor", "# Órdenes", "Total"]}
                                rows={topVendedores.map(([v, t]) => {
                                    const cnt = mockVentas.filter(o => o.vendedor === v).length;
                                    return [
                                        <span className="font-medium">{v}</span>,
                                        <span className="text-center">{cnt}</span>,
                                        <span className="font-mono font-bold text-primary">{lps(t)}</span>
                                    ];
                                })}
                            />
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={DollarSign} title="Pagos Recibidos" />
                            <SimpleTable
                                headers={["ID Pago", "Cliente", "Método", "Monto", "Estado"]}
                                rows={mockPagos.map(p => [
                                    <span className="font-mono text-xs">{p.id}</span>,
                                    <span className="text-sm">{p.cliente}</span>,
                                    <span className="capitalize text-xs">{p.metodo}</span>,
                                    <span className="font-mono font-semibold text-success">{lps(p.monto)}</span>,
                                    <Badge variant="outline" className={`text-xs ${p.estado === "completado" ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"}`}>{p.estado}</Badge>
                                ])}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* ══════════════════════════════════════════════════════════
            TAB 3 – COMPRAS & GASTOS
        ══════════════════════════════════════════════════════════ */}
                <TabsContent value="compras" className="mt-4 space-y-5">
                    <div className="grid grid-cols-4 gap-4">
                        <KpiCard label="Total OC Emitidas" value={lps(totalCompras)} icon={ShoppingCart} color="text-primary" />
                        <KpiCard label="CxP Pendiente" value={lps(cxpTotal)} icon={FileText} color="text-warning" />
                        <KpiCard label="Pagado Proveedores" value={lps(mockPagosCompra.filter(p => p.estado === "completado").reduce((s, p) => s + p.monto, 0))} icon={TrendingUp} color="text-success" />
                        <KpiCard label="OCs Activas" value={`${mockOrdenesCompra.filter(o => o.estado === "emitida" || o.estado === "recibida_parcial").length}`} icon={Package} color="text-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={ShoppingCart} title="Órdenes de Compra" />
                            <SimpleTable
                                headers={["OC", "Proveedor", "Comprador", "Total", "Estado"]}
                                rows={mockOrdenesCompra.map(o => [
                                    <span className="font-mono text-xs font-semibold">{o.id}</span>,
                                    <span className="font-medium text-sm">{o.proveedor}</span>,
                                    <span className="text-xs text-muted-foreground">{o.comprador}</span>,
                                    <span className="font-mono font-bold text-primary">{lps(o.total)}</span>,
                                    <Badge variant="outline" className="text-xs capitalize">{o.estado.replace("_", " ")}</Badge>
                                ])}
                            />
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={DollarSign} title="Gastos por Concepto (Caja)" />
                            <SimpleTable
                                headers={["Concepto", "Total Egresado"]}
                                rows={topGastos.map(([concepto, total]) => [
                                    <span className="capitalize text-sm">{concepto}</span>,
                                    <span className="font-mono font-semibold text-destructive">{lps(total)}</span>
                                ])}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <SectionTitle icon={FileText} title="Facturas de Proveedores" />
                        <SimpleTable
                            headers={["Factura", "Proveedor", "Emisión", "Vencimiento", "Total", "Estado"]}
                            rows={mockFacturasCompra.map(f => [
                                <span className="font-mono text-xs">{f.numeroFactura}</span>,
                                <span className="font-medium text-sm">{f.proveedor}</span>,
                                <span className="text-xs">{f.fechaEmision}</span>,
                                <span className="text-xs">{f.fechaVencimiento}</span>,
                                <span className="font-mono font-bold">{lps(f.total)}</span>,
                                <Badge variant="outline" className={`text-xs capitalize ${f.estado === "pagada" ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"}`}>{f.estado}</Badge>
                            ])}
                        />
                    </div>
                </TabsContent>

                {/* ══════════════════════════════════════════════════════════
            TAB 4 – TALLER
        ══════════════════════════════════════════════════════════ */}
                <TabsContent value="taller" className="mt-4 space-y-5">
                    <div className="grid grid-cols-4 gap-4">
                        <KpiCard label="OTs Este Período" value={`${mockOTs.length}`} icon={Wrench} color="text-primary" />
                        <KpiCard label="OTs Completadas" value={`${otsCompletadas}`} icon={TrendingUp} color="text-success" />
                        <KpiCard label="Ingresos de Taller" value={lps(ingresosOT)} icon={DollarSign} color="text-success" trend={18.5} />
                        <KpiCard label="Ticket Promedio OT" value={lps(avgOT)} icon={BarChart3} color="text-primary" sub="Mano de obra + repuestos" />
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <SectionTitle icon={Wrench} title="Órdenes de Trabajo — Detalle" />
                        <SimpleTable
                            headers={["OT", "Cliente", "Equipo", "Técnico", "M. Obra", "Repuestos", "Total", "Estado"]}
                            rows={mockOTs.map(o => {
                                const estadoColor: Record<string, string> = {
                                    ingresado: "bg-muted text-muted-foreground border-muted-foreground/30",
                                    en_diagnostico: "bg-warning/15 text-warning border-warning/30",
                                    en_reparacion: "bg-primary/15 text-primary border-primary/30",
                                    listo: "bg-success/15 text-success border-success/30",
                                    entregado: "bg-success/15 text-success border-success/30",
                                    facturado: "bg-success/15 text-success border-success/30",
                                    esperando_repuestos: "bg-destructive/15 text-destructive border-destructive/30",
                                };
                                return [
                                    <span className="font-mono text-xs font-semibold">{o.id}</span>,
                                    <span className="font-medium text-sm">{o.cliente}</span>,
                                    <span className="text-xs text-muted-foreground">{o.equipo}</span>,
                                    <span className="text-xs">{o.tecnicoAsignado ?? "—"}</span>,
                                    <span className="font-mono text-sm">{lps(o.totalManoObra)}</span>,
                                    <span className="font-mono text-sm">{lps(o.totalRepuestos)}</span>,
                                    <span className="font-mono font-bold text-primary">{lps(o.total)}</span>,
                                    <Badge variant="outline" className={`text-xs capitalize ${estadoColor[o.estado] ?? ""}`}>{o.estado.replace(/_/g, " ")}</Badge>
                                ];
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={Users} title="Eficiencia por Técnico" />
                            {(() => {
                                const tecnicosMap: Record<string, { ots: number; ingresos: number }> = {};
                                mockOTs.forEach(o => {
                                    const tec = o.tecnicoAsignado ?? "Sin asignar";
                                    if (!tecnicosMap[tec]) tecnicosMap[tec] = { ots: 0, ingresos: 0 };
                                    tecnicosMap[tec].ots += 1;
                                    tecnicosMap[tec].ingresos += o.total;
                                });
                                return (
                                    <SimpleTable
                                        headers={["Técnico", "# OTs", "Ingresos Generados"]}
                                        rows={Object.entries(tecnicosMap).map(([t, d]) => [
                                            <span className="font-medium">{t}</span>,
                                            <Badge variant="outline">{d.ots}</Badge>,
                                            <span className="font-mono font-bold text-success">{lps(d.ingresos)}</span>
                                        ])}
                                    />
                                );
                            })()}
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={Package} title="Movimientos de Inventario" />
                            <SimpleTable
                                headers={["Tipo", "Cantidad Total", "Ref. Ejemplo"]}
                                rows={[
                                    ["Entradas", <span className="font-mono font-bold text-success">{entradas} uds</span>, "OC-0043, 0044, 0045"],
                                    ["Salidas", <span className="font-mono font-bold text-destructive">{salidas} uds</span>, "FAC-1230, 1234"],
                                    ["Ajustes", <span className="font-mono font-bold text-warning">{mockMovimientos.filter(m => m.tipo === "ajuste").reduce((s, m) => s + Math.abs(m.cantidad), 0)} uds</span>, "AJ-0012"],
                                    ["Transferencias", <span className="font-mono font-bold text-primary">10 uds</span>, "TRA-0003"],
                                ]}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* ══════════════════════════════════════════════════════════
            TAB 5 – FLUJO DE CAJA
        ══════════════════════════════════════════════════════════ */}
                <TabsContent value="flujo" className="mt-4 space-y-5">
                    <div className="grid grid-cols-4 gap-4">
                        {(() => {
                            const totalIng = mockMovimientosCaja.filter(m => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
                            const totalEgr = mockMovimientosCaja.filter(m => m.tipo === "egreso").reduce((s, m) => s + m.monto, 0);
                            const neto = totalIng - totalEgr;
                            return [
                                <KpiCard label="Total Ingresos" value={lps(totalIng)} icon={TrendingUp} color="text-success" />,
                                <KpiCard label="Total Egresos" value={lps(totalEgr)} icon={TrendingDown} color="text-destructive" />,
                                <KpiCard label="Flujo Neto" value={lps(neto)} icon={BarChart3} color={neto >= 0 ? "text-success" : "text-destructive"} />,
                                <KpiCard label="Último Arqueo" value={mockArqueos[0] ? `${mockArqueos[0].estado}` : "—"} icon={mockArqueos[0]?.estado === "cuadrado" ? TrendingUp : TrendingDown} color={mockArqueos[0]?.estado === "cuadrado" ? "text-success" : "text-destructive"} sub={mockArqueos[0]?.fecha} />,
                            ];
                        })()}
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <SectionTitle icon={DollarSign} title="Detalle Movimientos de Caja" />
                        <SimpleTable
                            headers={["ID", "Fecha", "Tipo", "Concepto", "Descripción", "Método", "Monto"]}
                            rows={[...mockMovimientosCaja].sort((a, b) => b.fecha.localeCompare(a.fecha)).map(m => [
                                <span className="font-mono text-xs">{m.id}</span>,
                                <span className="text-xs">{m.fecha}</span>,
                                <Badge variant="outline" className={`text-xs ${m.tipo === "ingreso" ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>{m.tipo}</Badge>,
                                <span className="text-xs capitalize">{m.concepto.replace("_", " ")}</span>,
                                <span className="text-xs">{m.descripcion}{m.referencia ? <span className="font-mono text-primary ml-1">[{m.referencia}]</span> : null}</span>,
                                <span className="capitalize text-xs text-muted-foreground">{m.metodo}</span>,
                                <span className={`font-mono font-semibold text-sm ${m.tipo === "ingreso" ? "text-success" : "text-destructive"}`}>
                                    {m.tipo === "ingreso" ? "+" : "-"}{lps(m.monto)}
                                </span>
                            ])}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={BarChart3} title="Ingresos por Método de Pago" />
                            {(() => {
                                const metodosIng: Record<string, number> = {};
                                mockMovimientosCaja.filter(m => m.tipo === "ingreso").forEach(m => {
                                    metodosIng[m.metodo] = (metodosIng[m.metodo] ?? 0) + m.monto;
                                });
                                const total = Object.values(metodosIng).reduce((s, v) => s + v, 0);
                                return (
                                    <SimpleTable
                                        headers={["Método", "Total Ingresado", "% Part."]}
                                        rows={Object.entries(metodosIng).sort((a, b) => b[1] - a[1]).map(([metodo, monto]) => [
                                            <span className="capitalize font-medium">{metodo}</span>,
                                            <span className="font-mono font-bold text-success">{lps(monto)}</span>,
                                            <span className="font-mono text-sm text-muted-foreground">{((monto / total) * 100).toFixed(1)}%</span>
                                        ])}
                                    />
                                );
                            })()}
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <SectionTitle icon={TrendingDown} title="Egresos por Método de Pago" />
                            {(() => {
                                const metodosEgr: Record<string, number> = {};
                                mockMovimientosCaja.filter(m => m.tipo === "egreso").forEach(m => {
                                    metodosEgr[m.metodo] = (metodosEgr[m.metodo] ?? 0) + m.monto;
                                });
                                const total = Object.values(metodosEgr).reduce((s, v) => s + v, 0);
                                return (
                                    <SimpleTable
                                        headers={["Método", "Total Egresado", "% Part."]}
                                        rows={Object.entries(metodosEgr).sort((a, b) => b[1] - a[1]).map(([metodo, monto]) => [
                                            <span className="capitalize font-medium">{metodo}</span>,
                                            <span className="font-mono font-bold text-destructive">{lps(monto)}</span>,
                                            <span className="font-mono text-sm text-muted-foreground">{((monto / total) * 100).toFixed(1)}%</span>
                                        ])}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
