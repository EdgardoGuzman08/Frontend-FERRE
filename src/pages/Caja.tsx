import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Wallet, TrendingUp, TrendingDown, Landmark, ArrowLeftRight,
    Plus, CheckCircle, AlertTriangle, Info
} from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import PageHeader from "@/components/shared/PageHeader";
import FormDialog from "@/components/shared/FormDialog";
import {
    mockMovimientosCaja, mockArqueos, mockCuentasBancarias, mockTransferencias,
    MovimientoCaja, ArqueoCaja, CuentaBancaria, TransferenciaFondo, DenominacionArqueo
} from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

// ── Badge helpers ────────────────────────────────────────────────
const badgeTipo = (tipo: string) => {
    const map: Record<string, string> = {
        ingreso: "bg-success/15 text-success border-success/30",
        egreso: "bg-destructive/15 text-destructive border-destructive/30",
    };
    return <Badge variant="outline" className={`${map[tipo] || ""} capitalize`}>{tipo}</Badge>;
};

const badgeArqueo = (estado: string) => {
    const map: Record<string, string> = {
        cuadrado: "bg-success/15 text-success border-success/30",
        sobrante: "bg-primary/15 text-primary border-primary/30",
        faltante: "bg-destructive/15 text-destructive border-destructive/30",
    };
    return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado}</Badge>;
};

const badgeEstado = (estado: string) => {
    const map: Record<string, string> = {
        completada: "bg-success/15 text-success border-success/30",
        pendiente: "bg-warning/15 text-warning border-warning/30",
        rechazada: "bg-destructive/15 text-destructive border-destructive/30",
        activa: "bg-success/15 text-success border-success/30",
        inactiva: "bg-muted text-muted-foreground border-muted-foreground/30",
    };
    return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado}</Badge>;
};

const labelConcepto: Record<string, string> = {
    venta: "Venta",
    pago_proveedor: "Pago Proveedor",
    gasto_operativo: "Gasto Operativo",
    prestamo: "Préstamo",
    cobro_credito: "Cobro Crédito",
    transferencia: "Transferencia",
    otro: "Otro",
};

// Honduras denominations
const DENOMINACIONES_HNL: { denominacion: number; tipo: "billete" | "moneda"; label: string }[] = [
    { denominacion: 500, tipo: "billete", label: "Billete L500" },
    { denominacion: 200, tipo: "billete", label: "Billete L200" },
    { denominacion: 100, tipo: "billete", label: "Billete L100" },
    { denominacion: 50, tipo: "billete", label: "Billete L50" },
    { denominacion: 20, tipo: "billete", label: "Billete L20" },
    { denominacion: 10, tipo: "billete", label: "Billete L10" },
    { denominacion: 5, tipo: "moneda", label: "Moneda L5" },
    { denominacion: 2, tipo: "moneda", label: "Moneda L2" },
    { denominacion: 1, tipo: "moneda", label: "Moneda L1" },
    { denominacion: 0.50, tipo: "moneda", label: "Moneda 50 ctv" },
    { denominacion: 0.20, tipo: "moneda", label: "Moneda 20 ctv" },
    { denominacion: 0.10, tipo: "moneda", label: "Moneda 10 ctv" },
];

type DialogType = "movimiento" | "arqueo" | "transferencia";

export default function CajaPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>("movimiento");
    const [activeTab, setActiveTab] = useState("movimientos");

    // Form state – movimiento
    const [formMov, setFormMov] = useState({
        tipo: "ingreso" as "ingreso" | "egreso",
        concepto: "venta" as MovimientoCaja["concepto"],
        descripcion: "",
        monto: 0,
        metodo: "efectivo" as MovimientoCaja["metodo"],
        referencia: "",
        nota: "",
    });

    // Form state – arqueo (cantidades por denominación)
    const [cantidades, setCantidades] = useState<Record<number, number>>({});
    const [turno, setTurno] = useState<"mañana" | "tarde" | "nocturno">("tarde");
    const [obsArqueo, setObsArqueo] = useState("");

    // Form state – transferencia
    const [formTrf, setFormTrf] = useState({ origen: "", destino: "", monto: 0, concepto: "", referencia: "" });

    // Data states with localStorage persistence
    const [movimientos, setMovimientos] = useState<MovimientoCaja[]>(() => {
        const saved = localStorage.getItem("movimientos_caja");
        return saved ? JSON.parse(saved) : mockMovimientosCaja;
    });
    const [arqueos, setArqueos] = useState<ArqueoCaja[]>(() => {
        const saved = localStorage.getItem("arqueos_caja");
        return saved ? JSON.parse(saved) : mockArqueos;
    });
    const [cuentas] = useState<CuentaBancaria[]>(mockCuentasBancarias);
    const [transferencias, setTransferencias] = useState<TransferenciaFondo[]>(() => {
        const saved = localStorage.getItem("transferencias_caja");
        return saved ? JSON.parse(saved) : mockTransferencias;
    });

    useEffect(() => { localStorage.setItem("movimientos_caja", JSON.stringify(movimientos)); }, [movimientos]);
    useEffect(() => { localStorage.setItem("arqueos_caja", JSON.stringify(arqueos)); }, [arqueos]);
    useEffect(() => { localStorage.setItem("transferencias_caja", JSON.stringify(transferencias)); }, [transferencias]);

    // ── KPI calculations ──────────────────────────────────────────
    const hoy = "2026-03-07";
    const movHoy = movimientos.filter(m => m.fecha.startsWith(hoy));
    const ingresosHoy = movHoy.filter(m => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
    const egresosHoy = movHoy.filter(m => m.tipo === "egreso").reduce((s, m) => s + m.monto, 0);
    const saldoCaja = cuentas.find(c => c.tipoCuenta === "caja_chica")?.saldo ?? 0;
    const ultimoArqueo = arqueos[0];

    // ── Total contado del arqueo en formulario ────────────────────
    const totalContado = DENOMINACIONES_HNL.reduce((sum, d) => {
        return sum + (cantidades[d.denominacion] ?? 0) * d.denominacion;
    }, 0);

    // ── Columns ───────────────────────────────────────────────────
    const colsMovimientos: Column<MovimientoCaja>[] = [
        { key: "id", label: "ID", className: "font-mono text-xs w-[100px]" },
        { key: "fecha", label: "Fecha", className: "text-xs w-[140px]" },
        { key: "tipo", label: "Tipo", render: (r) => badgeTipo(r.tipo) },
        { key: "concepto", label: "Concepto", render: (r) => <span className="text-xs">{labelConcepto[r.concepto]}</span> },
        { key: "descripcion", label: "Descripción", render: (r) => <span>{r.descripcion}{r.referencia ? <span className="ml-2 font-mono text-xs text-primary">{r.referencia}</span> : null}</span> },
        { key: "metodo", label: "Método", render: (r) => <span className="capitalize text-xs text-muted-foreground">{r.metodo}</span> },
        { key: "usuario", label: "Usuario", className: "text-xs text-muted-foreground" },
        {
            key: "monto", label: "Monto", render: (r) => (
                <span className={`font-mono font-semibold ${r.tipo === "ingreso" ? "text-success" : "text-destructive"}`}>
                    {r.tipo === "egreso" ? "-" : "+"}L{r.monto.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                </span>
            )
        },
    ];

    const colsArqueos: Column<ArqueoCaja>[] = [
        { key: "id", label: "ID Arqueo", className: "font-mono text-xs w-[100px]" },
        { key: "fecha", label: "Fecha/Hora", className: "text-xs w-[140px]" },
        { key: "turno", label: "Turno", render: (r) => <span className="capitalize">{r.turno}</span> },
        { key: "cajero", label: "Cajero", render: (r) => <span className="font-medium">{r.cajero}</span> },
        { key: "saldoEsperado", label: "Esperado", render: (r) => <span className="font-mono text-sm">L{r.saldoEsperado.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</span> },
        { key: "saldoContado", label: "Contado", render: (r) => <span className="font-mono font-semibold text-sm">L{r.saldoContado.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</span> },
        {
            key: "diferencia", label: "Diferencia", render: (r) => (
                <span className={`font-mono font-bold ${r.diferencia === 0 ? "text-success" : r.diferencia > 0 ? "text-primary" : "text-destructive"}`}>
                    {r.diferencia >= 0 ? "+" : ""}L{r.diferencia.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                </span>
            )
        },
        { key: "estado", label: "Estado", render: (r) => badgeArqueo(r.estado) },
    ];

    const colsCuentas: Column<CuentaBancaria>[] = [
        { key: "id", label: "ID", className: "font-mono text-xs w-[90px]" },
        { key: "banco", label: "Banco", render: (r) => <span className="font-semibold">{r.banco}</span> },
        { key: "tipoCuenta", label: "Tipo", render: (r) => <span className="capitalize text-sm">{r.tipoCuenta.replace("_", " ")}</span> },
        { key: "numeroCuenta", label: "No. Cuenta", className: "font-mono text-xs" },
        { key: "moneda", label: "Moneda", render: (r) => <Badge variant="outline" className="text-xs">{r.moneda}</Badge> },
        {
            key: "saldo", label: "Saldo", render: (r) => (
                <span className="font-mono font-bold text-success text-base">
                    {r.moneda === "USD" ? "$" : "L"}{r.saldo.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                </span>
            )
        },
        { key: "ultimoMovimiento", label: "Últ. Movimiento", className: "text-xs text-muted-foreground" },
        { key: "estado", label: "Estado", render: (r) => badgeEstado(r.estado) },
    ];

    const colsTransferencias: Column<TransferenciaFondo>[] = [
        { key: "id", label: "ID", className: "font-mono text-xs w-[100px]" },
        { key: "fecha", label: "Fecha", className: "text-xs w-[140px]" },
        { key: "cuentaOrigen", label: "Origen", className: "text-sm" },
        { key: "cuentaDestino", label: "Destino", className: "text-sm" },
        { key: "concepto", label: "Concepto", className: "text-xs text-muted-foreground" },
        { key: "monto", label: "Monto", render: (r) => <span className="font-mono font-bold text-primary">L{r.monto.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</span> },
        { key: "usuario", label: "Autoriza", className: "text-xs text-muted-foreground" },
        { key: "estado", label: "Estado", render: (r) => badgeEstado(r.estado) },
    ];

    // ── Handle open dialog ─────────────────────────────────────────
    const openDialog = (type: DialogType) => {
        setDialogType(type);
        setFormMov({ tipo: "ingreso", concepto: "venta", descripcion: "", monto: 0, metodo: "efectivo", referencia: "", nota: "" });
        setCantidades({});
        setTurno("tarde");
        setObsArqueo("");
        setFormTrf({ origen: "", destino: "", monto: 0, concepto: "", referencia: "" });
        setDialogOpen(true);
    };

    // ── Form submit ────────────────────────────────────────────────
    const handleSubmit = () => {
        const randId = Math.floor(1000 + Math.random() * 9000);
        const timeNow = "2026-03-07 " + new Date().toTimeString().slice(0, 5);

        if (dialogType === "movimiento") {
            const nuevo: MovimientoCaja = {
                id: `MC-${randId}`,
                fecha: timeNow,
                tipo: formMov.tipo,
                concepto: formMov.concepto,
                descripcion: formMov.descripcion || "Sin descripción",
                monto: formMov.monto,
                metodo: formMov.metodo,
                referencia: formMov.referencia || undefined,
                usuario: "Usuario Actual",
                nota: formMov.nota || undefined,
            };
            setMovimientos([nuevo, ...movimientos]);
            toast({ title: `${formMov.tipo === "ingreso" ? "Ingreso" : "Egreso"} registrado`, description: `L${formMov.monto.toFixed(2)} — ${formMov.descripcion}` });

        } else if (dialogType === "arqueo") {
            const denoms: DenominacionArqueo[] = DENOMINACIONES_HNL
                .filter(d => (cantidades[d.denominacion] ?? 0) > 0)
                .map(d => ({
                    denominacion: d.denominacion,
                    tipo: d.tipo,
                    cantidad: cantidades[d.denominacion] ?? 0,
                    subtotal: (cantidades[d.denominacion] ?? 0) * d.denominacion,
                }));
            const ingEstimados = movimentos_hoy_ingresos();
            const egEstimados = movimentos_hoy_egresos();
            const esperado = saldoCaja + ingEstimados - egEstimados;
            const diferencia = totalContado - esperado;
            const nuevoArqueo: ArqueoCaja = {
                id: `ARQ-${randId}`,
                fecha: timeNow,
                turno,
                cajero: "Usuario Actual",
                saldoInicio: saldoCaja,
                totalIngresos: ingEstimados,
                totalEgresos: egEstimados,
                saldoEsperado: esperado,
                saldoContado: totalContado,
                diferencia,
                estado: diferencia === 0 ? "cuadrado" : diferencia > 0 ? "sobrante" : "faltante",
                denominaciones: denoms,
                observaciones: obsArqueo || undefined,
            };
            setArqueos([nuevoArqueo, ...arqueos]);
            toast({ title: "Arqueo registrado", description: `Diferencia: ${diferencia >= 0 ? "+" : ""}L${diferencia.toFixed(2)}` });

        } else if (dialogType === "transferencia") {
            const nueva: TransferenciaFondo = {
                id: `TRF-F-${randId}`,
                fecha: timeNow,
                cuentaOrigen: formTrf.origen,
                cuentaDestino: formTrf.destino,
                monto: formTrf.monto,
                concepto: formTrf.concepto,
                referencia: formTrf.referencia || undefined,
                usuario: "Usuario Actual",
                estado: "pendiente",
            };
            setTransferencias([nueva, ...transferencias]);
            toast({ title: "Transferencia registrada", description: `L${formTrf.monto.toFixed(2)} hacia ${formTrf.destino}` });
        }

        setDialogOpen(false);
    };

    const movimentos_hoy_ingresos = () => movimientos.filter(m => m.fecha.startsWith(hoy) && m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
    const movimentos_hoy_egresos = () => movimientos.filter(m => m.fecha.startsWith(hoy) && m.tipo === "egreso").reduce((s, m) => s + m.monto, 0);

    const getDialogTitle = () => {
        if (dialogType === "movimiento") return "Nuevo Movimiento de Caja";
        if (dialogType === "arqueo") return "Realizar Arqueo de Caja";
        return "Nueva Transferencia de Fondos";
    };

    return (
        <div className="flex-1 overflow-auto p-6">
            <PageHeader title="Caja / Tesorería" subtitle="Movimientos, arqueos, cuentas bancarias y transferencias de fondos">
                <Badge variant="outline" className="bg-success/15 text-success border-success/30 gap-1">
                    <Wallet className="w-3 h-3" /> Caja Abierta
                </Badge>
            </PageHeader>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Saldo Caja (Efectivo)", value: `L${saldoCaja.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`,
                        icon: Wallet, color: "text-primary", sub: "Caja Central física"
                    },
                    {
                        label: "Ingresos Hoy", value: `L${ingresosHoy.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`,
                        icon: TrendingUp, color: "text-success", sub: `${movHoy.filter(m => m.tipo === "ingreso").length} movimientos`
                    },
                    {
                        label: "Egresos Hoy", value: `L${egresosHoy.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`,
                        icon: TrendingDown, color: "text-destructive", sub: `${movHoy.filter(m => m.tipo === "egreso").length} movimientos`
                    },
                    {
                        label: "Último Arqueo",
                        value: ultimoArqueo
                            ? `${ultimoArqueo.diferencia >= 0 ? "+" : ""}L${ultimoArqueo.diferencia.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`
                            : "Sin arqueos",
                        icon: ultimoArqueo?.estado === "cuadrado" ? CheckCircle : AlertTriangle,
                        color: ultimoArqueo?.estado === "cuadrado" ? "text-success" : "text-destructive",
                        sub: ultimoArqueo ? `${ultimoArqueo.fecha} – ${ultimoArqueo.cajero}` : "Realice el primer arqueo"
                    },
                ].map((s, i) => (
                    <div key={i} className="rounded-lg border bg-card p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total bancos */}
            <div className="mb-6 rounded-lg border bg-card px-5 py-3 flex items-center gap-4">
                <Landmark className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex flex-wrap gap-6 flex-1">
                    {cuentas.map(c => (
                        <div key={c.id} className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground">{c.banco} · {c.tipoCuenta.replace("_", " ")}</span>
                            <span className="font-mono font-semibold text-sm">
                                {c.moneda === "USD" ? "$" : "L"}{c.saldo.toLocaleString("es-HN", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">Posición bancaria consolidada</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="movimientos">1. Movimientos</TabsTrigger>
                    <TabsTrigger value="arqueos">2. Arqueos</TabsTrigger>
                    <TabsTrigger value="cuentas">3. Cuentas &amp; Bancos</TabsTrigger>
                    <TabsTrigger value="transferencias">4. Transferencias</TabsTrigger>
                </TabsList>

                {/* ── Tab 1: Movimientos ── */}
                <TabsContent value="movimientos" className="mt-4">
                    <DataTable
                        columns={colsMovimientos}
                        data={movimientos}
                        searchPlaceholder="Buscar movimiento..."
                        searchKey="descripcion"
                        onAdd={() => openDialog("movimiento")}
                        addLabel="Registrar Movimiento"
                    />
                </TabsContent>

                {/* ── Tab 2: Arqueos ── */}
                <TabsContent value="arqueos" className="mt-4">
                    <DataTable
                        columns={colsArqueos}
                        data={arqueos}
                        searchPlaceholder="Buscar arqueo..."
                        searchKey="cajero"
                        onAdd={() => openDialog("arqueo")}
                        addLabel="Realizar Arqueo"
                    />
                    {arqueos[0] && (
                        <div className="mt-4 rounded-lg border bg-card p-4">
                            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" /> Detalle Denominaciones — {arqueos[0].id}
                            </p>
                            <div className="grid grid-cols-6 gap-2">
                                {arqueos[0].denominaciones.map(d => (
                                    <div key={d.denominacion} className="text-center rounded border p-2 bg-muted/30">
                                        <p className="text-xs text-muted-foreground">{d.tipo === "billete" ? "L" : "¢"}{d.denominacion}</p>
                                        <p className="font-bold text-sm">{d.cantidad}</p>
                                        <p className="text-xs text-primary font-mono">L{d.subtotal.toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* ── Tab 3: Cuentas ── */}
                <TabsContent value="cuentas" className="mt-4">
                    <DataTable
                        columns={colsCuentas}
                        data={cuentas}
                        searchPlaceholder="Buscar cuenta o banco..."
                    />
                </TabsContent>

                {/* ── Tab 4: Transferencias ── */}
                <TabsContent value="transferencias" className="mt-4">
                    <DataTable
                        columns={colsTransferencias}
                        data={transferencias}
                        searchPlaceholder="Buscar transferencia..."
                        onAdd={() => openDialog("transferencia")}
                        addLabel="Nueva Transferencia"
                    />
                </TabsContent>
            </Tabs>

            {/* ── FormDialog ── */}
            <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={getDialogTitle()} onSubmit={handleSubmit}>
                <div className="max-w-2xl space-y-4">

                    {/* ─ Movimiento form ─ */}
                    {dialogType === "movimiento" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo *</Label>
                                    <Select value={formMov.tipo} onValueChange={(v) => setFormMov({ ...formMov, tipo: v as "ingreso" | "egreso" })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ingreso">Ingreso</SelectItem>
                                            <SelectItem value="egreso">Egreso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Concepto *</Label>
                                    <Select value={formMov.concepto} onValueChange={(v) => setFormMov({ ...formMov, concepto: v as MovimientoCaja["concepto"] })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(labelConcepto).map(([k, v]) => (
                                                <SelectItem key={k} value={k}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción *</Label>
                                <Input
                                    value={formMov.descripcion}
                                    onChange={e => setFormMov({ ...formMov, descripcion: e.target.value })}
                                    placeholder="Ej: Cobro Factura 001-001-00001100"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Monto (L) *</Label>
                                    <Input
                                        type="number" min={0} step={0.01}
                                        value={formMov.monto || ""}
                                        onChange={e => setFormMov({ ...formMov, monto: Number(e.target.value) })}
                                        className="font-mono font-bold text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Método de Pago *</Label>
                                    <Select value={formMov.metodo} onValueChange={(v) => setFormMov({ ...formMov, metodo: v as MovimientoCaja["metodo"] })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="efectivo">Efectivo</SelectItem>
                                            <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Referencia (Opcional)</Label>
                                    <Input
                                        value={formMov.referencia}
                                        onChange={e => setFormMov({ ...formMov, referencia: e.target.value })}
                                        placeholder="Ej: FAC-1001, OC-0045..."
                                        className="font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nota (Opcional)</Label>
                                    <Input
                                        value={formMov.nota}
                                        onChange={e => setFormMov({ ...formMov, nota: e.target.value })}
                                        placeholder="Observaciones..."
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ─ Arqueo form ─ */}
                    {dialogType === "arqueo" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Turno</Label>
                                    <Select value={turno} onValueChange={(v) => setTurno(v as typeof turno)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mañana">Mañana</SelectItem>
                                            <SelectItem value="tarde">Tarde</SelectItem>
                                            <SelectItem value="nocturno">Nocturno</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Saldo Inicial en Caja</Label>
                                    <Input value={`L${saldoCaja.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`} disabled className="font-mono bg-muted" />
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-muted/20">
                                <h4 className="font-semibold mb-3 text-sm">Conteo de Denominaciones (Lempiras Hondureños)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {DENOMINACIONES_HNL.map(d => (
                                        <div key={d.denominacion} className="flex items-center gap-2 p-2 rounded border bg-card">
                                            <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{d.label}</span>
                                            <Input
                                                type="number" min={0}
                                                value={cantidades[d.denominacion] ?? ""}
                                                onChange={e => setCantidades({ ...cantidades, [d.denominacion]: Number(e.target.value) })}
                                                className="h-7 text-sm w-20 font-mono"
                                                placeholder="0"
                                            />
                                            <span className="text-xs font-mono text-primary ml-auto w-20 text-right">
                                                L{((cantidades[d.denominacion] ?? 0) * d.denominacion).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t flex justify-end gap-12">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Total Contado</p>
                                        <p className="font-mono font-bold text-xl text-primary">L{totalContado.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Observaciones</Label>
                                <Input
                                    value={obsArqueo}
                                    onChange={e => setObsArqueo(e.target.value)}
                                    placeholder="Diferencias encontradas, notas del cierre..."
                                />
                            </div>
                        </>
                    )}

                    {/* ─ Transferencia form ─ */}
                    {dialogType === "transferencia" && (
                        <>
                            <div className="space-y-2">
                                <Label>Cuenta Origen *</Label>
                                <Select value={formTrf.origen} onValueChange={v => setFormTrf({ ...formTrf, origen: v })}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar cuenta origen..." /></SelectTrigger>
                                    <SelectContent>
                                        {cuentas.map(c => (
                                            <SelectItem key={c.id} value={`${c.banco} – ${c.tipoCuenta.replace("_", " ")}`}>
                                                {c.banco} — {c.tipoCuenta.replace("_", " ")} ({c.moneda})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Cuenta Destino *</Label>
                                <Select value={formTrf.destino} onValueChange={v => setFormTrf({ ...formTrf, destino: v })}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar cuenta destino..." /></SelectTrigger>
                                    <SelectContent>
                                        {cuentas.map(c => (
                                            <SelectItem key={c.id} value={`${c.banco} – ${c.tipoCuenta.replace("_", " ")}`}>
                                                {c.banco} — {c.tipoCuenta.replace("_", " ")} ({c.moneda})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Monto (L) *</Label>
                                    <Input
                                        type="number" min={0} step={0.01}
                                        value={formTrf.monto || ""}
                                        onChange={e => setFormTrf({ ...formTrf, monto: Number(e.target.value) })}
                                        className="font-mono font-bold text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Referencia Bancaria</Label>
                                    <Input
                                        value={formTrf.referencia}
                                        onChange={e => setFormTrf({ ...formTrf, referencia: e.target.value })}
                                        placeholder="No. de transacción..."
                                        className="font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Concepto *</Label>
                                <Input
                                    value={formTrf.concepto}
                                    onChange={e => setFormTrf({ ...formTrf, concepto: e.target.value })}
                                    placeholder="Ej: Depósito diario de recaudo"
                                />
                            </div>
                        </>
                    )}

                </div>
            </FormDialog>
        </div>
    );
}
