import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Calendar, FileCheck, ShieldCheck, ArrowRight, Trash2, Plus, Clock, FileText } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import PageHeader from "@/components/shared/PageHeader";
import FormDialog from "@/components/shared/FormDialog";
import { useToast } from "@/hooks/use-toast";
import {
    mockCitas, mockOTs, mockGarantias, mockClientes, mockArticulos, mockUsers,
    Cita, OrdenTrabajo, Garantia, ServicioManoObra, DetalleDocumento, Factura
} from "@/lib/mock-data";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

export default function TallerPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useTabFromUrl("/taller", "citas", ["citas", "ordenes", "facturas", "garantias"]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formType, setFormType] = useState<"cita" | "ot" | "factura">("cita");

    const [formData, setFormData] = useState<any>({});

    // Specific OT arrays
    const [formManoObra, setFormManoObra] = useState<ServicioManoObra[]>([]);
    const [formRepuestos, setFormRepuestos] = useState<DetalleDocumento[]>([]);

    // Picker inputs
    const [laborDesc, setLaborDesc] = useState("");
    const [laborHours, setLaborHours] = useState(1);
    const [laborRate, setLaborRate] = useState(250);
    const [selectedArticleId, setSelectedArticleId] = useState("");
    const [addQuantity, setAddQuantity] = useState(1);

    // Storage
    const [citas, setCitas] = useState<Cita[]>(() => {
        const saved = localStorage.getItem('citas');
        return saved ? JSON.parse(saved) : mockCitas;
    });
    const [ots, setOts] = useState<OrdenTrabajo[]>(() => {
        const saved = localStorage.getItem('ots');
        return saved ? JSON.parse(saved) : mockOTs;
    });
    const [garantias, setGarantias] = useState<Garantia[]>(() => {
        const saved = localStorage.getItem('garantias');
        return saved ? JSON.parse(saved) : mockGarantias;
    });
    const [facturas, setFacturas] = useState<Factura[]>(() => {
        const saved = localStorage.getItem('facturasOT');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => { localStorage.setItem('citas', JSON.stringify(citas)); }, [citas]);
    useEffect(() => { localStorage.setItem('facturasOT', JSON.stringify(facturas)); }, [facturas]);
    useEffect(() => { localStorage.setItem('ots', JSON.stringify(ots)); }, [ots]);
    useEffect(() => { localStorage.setItem('garantias', JSON.stringify(garantias)); }, [garantias]);

    const tecnicos = mockUsers.filter(u => u.rol === "Mecánico" || u.rol === "Jefe de Taller");

    const handleEntityAction = (type: "cita" | "ot" | "factura", entity?: any) => {
        setFormType(type);

        if (entity) {
            if (type === "ot" && entity.fechaHora) { // Coming from Cita
                setFormData({
                    citaId: entity.id, cliente: entity.cliente, equipo: entity.equipo, problemaReportado: entity.motivo
                });
                setFormManoObra([]); setFormRepuestos([]);
            } else if (type === "ot") { // Editing existing OT
                setFormData({
                    citaId: entity.citaId, cliente: entity.cliente, equipo: entity.equipo, problemaReportado: entity.problemaReportado,
                    diagnostico: entity.diagnostico, tecnicoAsignado: entity.tecnicoAsignado, estado: entity.estado
                });
                setFormManoObra([...entity.manoObra]); setFormRepuestos([...entity.repuestos]);
            } else if (type === "factura") {
                setFormData({
                    otId: entity.id, cliente: entity.cliente, totalManoObra: entity.totalManoObra, totalRepuestos: entity.totalRepuestos,
                    subtotal: entity.subtotal, impuestos: entity.impuestos, total: entity.total
                });
            } else {
                setFormData({}); setFormManoObra([]); setFormRepuestos([]);
            }
        } else {
            setFormData({}); setFormManoObra([]); setFormRepuestos([]);
        }

        setDialogOpen(true);
    };

    const handleAddLabor = () => {
        if (!laborDesc || laborHours <= 0 || laborRate <= 0) return;
        const newLabor: ServicioManoObra = {
            id: `MO-${Date.now()}`,
            descripcion: laborDesc,
            horas: laborHours,
            tarifaHora: laborRate,
            subtotal: laborHours * laborRate
        };
        setFormManoObra([...formManoObra, newLabor]);
        setLaborDesc("");
    };

    const handleAddPart = () => {
        if (!selectedArticleId || addQuantity <= 0) return;
        const article = mockArticulos.find(a => a.id === selectedArticleId);
        if (!article) return;
        const newDetalle: DetalleDocumento = {
            id: `REP-${Date.now()}`,
            articuloId: article.id,
            sku: article.sku,
            descripcion: article.nombre,
            cantidad: addQuantity,
            precioUnitario: article.precioVenta,
            subtotal: addQuantity * article.precioVenta,
        };
        setFormRepuestos([...formRepuestos, newDetalle]);
        setSelectedArticleId(""); setAddQuantity(1);
    };

    const estadoBadge = (estado: string) => {
        const map: Record<string, string> = {
            agendada: "bg-blue-100 text-blue-700 border-blue-200",
            en_taller: "bg-warning/15 text-warning border-warning/30",
            ingresado: "bg-blue-100 text-blue-700 border-blue-200",
            en_diagnostico: "bg-purple-100 text-purple-700 border-purple-200",
            esperando_repuestos: "bg-orange-100 text-orange-700 border-orange-200",
            en_reparacion: "bg-warning/15 text-warning border-warning/30",
            listo: "bg-success/15 text-success border-success/30",
            entregado: "bg-primary/15 text-primary border-primary/30",
            cancelada: "bg-destructive/15 text-destructive border-destructive/30",
            completada: "bg-success/15 text-success border-success/30",
            facturado: "bg-muted text-muted-foreground",
            activa: "bg-success/15 text-success border-success/30",
            vencida: "bg-destructive/15 text-destructive border-destructive/30",
        };
        return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado.replace('_', ' ')}</Badge>;
    };

    const columnsCitas: Column<Cita>[] = [
        { key: "fechaHora", label: "Fecha/Hora", className: "font-mono text-xs w-[130px]" },
        { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
        { key: "equipo", label: "Equipo / Vehículo" },
        { key: "estado", label: "Estado", render: (r) => estadoBadge(r.estado) },
        { key: "motivo", label: "Motivo", className: "text-muted-foreground text-xs" },
        {
            key: "id", label: "Acciones", render: (r) => (
                r.estado === "agendada" ?
                    <Button variant="ghost" size="sm" onClick={() => handleEntityAction("ot", r)} className="h-8 text-primary">
                        Ingresar a OT <ArrowRight className="w-3 h-3 ml-1" />
                    </Button> : null
            )
        }
    ];

    const columnsOTs: Column<OrdenTrabajo>[] = [
        { key: "id", label: "OT N°", className: "font-mono text-xs font-semibold text-primary" },
        { key: "fechaIngreso", label: "Ingreso", className: "text-xs" },
        { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
        { key: "equipo", label: "Equipo", className: "text-xs" },
        { key: "estado", label: "Estado", render: (r) => estadoBadge(r.estado) },
        { key: "tecnicoAsignado", label: "Técnico", className: "text-muted-foreground text-xs" },
        { key: "total", label: "Costo Total", render: (r) => <span className="font-mono font-semibold">L{r.total.toFixed(2)}</span> },
        {
            key: "id", label: "Acciones", render: (r) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEntityAction("ot", r)} className="h-8">Gestionar</Button>
                    {r.estado === "listo" && (
                        <Button variant="ghost" size="sm" onClick={() => handleEntityAction("factura", r)} className="h-8 text-success">
                            Facturar <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const columnsGarantias: Column<Garantia>[] = [
        { key: "id", label: "ID Gar.", className: "font-mono text-xs" },
        { key: "otId", label: "Ref. OT", className: "font-mono text-xs text-muted-foreground" },
        { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
        { key: "equipo", label: "Equipo" },
        { key: "fechaVencimiento", label: "Vence", className: "text-xs font-mono" },
        { key: "estado", label: "Estado", render: (r) => estadoBadge(r.estado) },
    ];

    const columnsFacturas: Column<Factura>[] = [
        { key: "numeroFactura", label: "N° Factura", className: "font-mono text-xs" },
        { key: "fechaEmision", label: "Emisión", className: "text-xs" },
        { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
        { key: "ventaId", label: "Ref. OT", className: "font-mono text-xs text-muted-foreground" },
        { key: "estado", label: "Estado", render: (r) => estadoBadge(r.estado) },
        { key: "total", label: "Total", render: (r) => <span className="font-mono font-semibold text-success">L{r.total.toFixed(2)}</span> },
    ];

    const handleFormSubmit = () => {
        const timeNow = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const randId = Math.floor(1000 + Math.random() * 9000);

        if (formType === "cita") {
            const nuevaCita: Cita = {
                id: `CIT-${randId}`, fechaHora: formData.fechaHora || timeNow,
                cliente: formData.cliente || "Cliente", clienteId: "C999",
                equipo: formData.equipo, motivo: formData.problemaReportado, estado: "agendada"
            };
            setCitas([nuevaCita, ...citas]);
        } else if (formType === "ot") {
            const tLabor = formManoObra.reduce((s, a) => s + a.subtotal, 0);
            const tParts = formRepuestos.reduce((s, a) => s + a.subtotal, 0);
            const sTotal = tLabor + tParts;

            const newOT: OrdenTrabajo = {
                id: formData.otId || `OT-${randId}`, fechaIngreso: timeNow, citaId: formData.citaId,
                cliente: formData.cliente, clienteId: "C999", equipo: formData.equipo,
                problemaReportado: formData.problemaReportado, diagnostico: formData.diagnostico,
                tecnicoAsignado: formData.tecnicoAsignado, estado: formData.estado || "ingresado",
                manoObra: formManoObra, repuestos: formRepuestos,
                totalManoObra: tLabor, totalRepuestos: tParts, subtotal: sTotal, impuestos: sTotal * 0.15, total: sTotal * 1.15
            };

            if (formData.otId) { // Edit
                setOts(ots.map(o => o.id === formData.otId ? newOT : o));
            } else { // Create
                setOts([newOT, ...ots]);
                if (formData.citaId) setCitas(citas.map(c => c.id === formData.citaId ? { ...c, estado: "en_taller" } : c));
            }
        } else if (formType === "factura") {
            const nuevaFactura: Factura = {
                id: `FAC-OT-${randId}`, fechaEmision: timeNow.split(' ')[0], cai: "CAI-TALLER",
                ventaId: formData.otId, numeroFactura: `002-001-${randId.toString().padStart(8, '0')}`,
                cliente: formData.cliente, clienteId: "C999", subtotal: formData.subtotal,
                impuestos: formData.impuestos, total: formData.total, estado: "pendiente",
                fechaVencimiento: timeNow.split(' ')[0], detalles: []
            };
            setFacturas([nuevaFactura, ...facturas]);
            toast({ title: "OT Facturada", description: `Se ha generado la Factura N° ${nuevaFactura.numeroFactura} por L${formData.total.toFixed(2)}` });
            setOts(ots.map(o => o.id === formData.otId ? { ...o, estado: "facturado" } : o));
        }

        setDialogOpen(false);
        if (formType === 'cita') setActiveTab('citas');
        if (formType === 'ot') setActiveTab('ordenes');
    };

    const getSubtotalOT = () => {
        const mo = formManoObra.reduce((s, a) => s + a.subtotal, 0);
        const rep = formRepuestos.reduce((s, a) => s + a.subtotal, 0);
        return { mo, rep, total: (mo + rep) * 1.15, tax: (mo + rep) * 0.15 };
    };

    return (
        <div className="flex-1 overflow-auto p-6">
            <PageHeader title="Taller y Órdenes de Trabajo" subtitle="Gestión de servicios, diagnósticos y garantías">
                <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 gap-1">
                    {ots.filter(o => o.estado !== "entregado" && o.estado !== "facturado").length} OTs Activas
                </Badge>
            </PageHeader>

            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: "OTs Activas", value: ots.filter(o => o.estado !== "entregado" && o.estado !== "facturado").length, icon: Wrench, color: "text-primary" },
                    { label: "Citas Pendientes", value: citas.filter(c => c.estado === "agendada").length, icon: Calendar, color: "text-warning" },
                    { label: "Listos para Facturar", value: ots.filter(o => o.estado === "listo").length, icon: FileCheck, color: "text-success" },
                    { label: "Garantías Activas", value: garantias.filter(g => g.estado === "activa").length, icon: ShieldCheck, color: "text-blue-600" },
                ].map((s, i) => (
                    <div key={i} className="rounded-lg border bg-card p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color || "text-primary"}`} /></div>
                        <div>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                            <p className={`text-lg font-bold ${s.color || ""}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="citas">Citas y Agenda</TabsTrigger>
                    <TabsTrigger value="ordenes">Órdenes de Trabajo</TabsTrigger>
                    <TabsTrigger value="facturas">Facturas Emitidas</TabsTrigger>
                    <TabsTrigger value="garantias">Garantías</TabsTrigger>
                </TabsList>

                <TabsContent value="citas">
                    <DataTable columns={columnsCitas} data={citas} searchPlaceholder="Buscar cita..." searchKey="cliente" onAdd={() => handleEntityAction("cita")} addLabel="Agendar Cita" />
                </TabsContent>

                <TabsContent value="ordenes">
                    <DataTable columns={columnsOTs} data={ots} searchPlaceholder="Buscar OT o Cliente..." searchKey="cliente" onAdd={() => handleEntityAction("ot")} addLabel="Ingreso Directo a Taller" />
                </TabsContent>

                <TabsContent value="facturas">
                    <DataTable columns={columnsFacturas} data={facturas} searchPlaceholder="Buscar factura..." searchKey="numeroFactura" />
                </TabsContent>

                <TabsContent value="garantias">
                    <DataTable columns={columnsGarantias} data={garantias} searchPlaceholder="Buscar garantía..." searchKey="cliente" />
                </TabsContent>
            </Tabs>

            <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={formType === "cita" ? "Agendar Cita" : formType === "factura" ? "Liquidar Orden" : "Gestión de OT"} onSubmit={handleFormSubmit}>
                <div className="max-w-4xl">
                    <div className="grid grid-cols-2 gap-4">

                        {/* Common Header Info */}
                        <div className="space-y-2">
                            <Label>Cliente *</Label>
                            {formType === "cita" ? (
                                <Select value={formData.cliente} onValueChange={(v) => setFormData({ ...formData, cliente: v })}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                                    <SelectContent>{mockClientes.map(c => <SelectItem key={c.id} value={c.nombre}>{c.documento} - {c.nombre}</SelectItem>)}</SelectContent>
                                </Select>
                            ) : (
                                <Input value={formData.cliente || ""} readOnly className="bg-muted" />
                            )}
                        </div>

                        {formType === "cita" && (
                            <div className="space-y-2"><Label>Fecha/Hora Reservada</Label><Input type="datetime-local" value={formData.fechaHora || ""} onChange={e => setFormData({ ...formData, fechaHora: e.target.value })} /></div>
                        )}

                        {(formType === "cita" || formType === "ot") && (
                            <>
                                <div className="space-y-2"><Label>Equipo / Vehículo *</Label><Input value={formData.equipo || ""} onChange={e => setFormData({ ...formData, equipo: e.target.value })} placeholder="Ej: Taladro DeWalt 20V, Toyota Corolla..." readOnly={formType !== "cita" && !formData.citaId} /></div>
                                <div className="space-y-2 col-span-2"><Label>Problema Reportado</Label><Input value={formData.problemaReportado || ""} onChange={e => setFormData({ ...formData, problemaReportado: e.target.value })} /></div>
                            </>
                        )}

                        {/* OT Specifics */}
                        {formType === "ot" && (
                            <>
                                <div className="col-span-2 border-t pt-4 mt-2">
                                    <h3 className="font-semibold text-primary mb-4">Revisión Técnica</h3>
                                </div>
                                <div className="space-y-2"><Label>Técnico Asignado</Label>
                                    <Select value={formData.tecnicoAsignado} onValueChange={(v) => setFormData({ ...formData, tecnicoAsignado: v })}>
                                        <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                        <SelectContent>{tecnicos.map(t => <SelectItem key={t.id} value={t.nombre}>{t.nombre}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Estado Activo</Label>
                                    <Select value={formData.estado || "ingresado"} onValueChange={(v) => setFormData({ ...formData, estado: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ingresado">Ingresado</SelectItem><SelectItem value="en_diagnostico">En Diagnóstico</SelectItem>
                                            <SelectItem value="esperando_repuestos">Esperando Repuestos</SelectItem><SelectItem value="en_reparacion">En Reparación</SelectItem>
                                            <SelectItem value="listo">Listo / Terminado</SelectItem><SelectItem value="entregado">Entregado al Cliente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2"><Label>Diagnóstico / Trabajos Realizados</Label><Input value={formData.diagnostico || ""} onChange={e => setFormData({ ...formData, diagnostico: e.target.value })} /></div>

                                {/* Labor and Parts grids side by side */}
                                <div className="col-span-2 grid grid-cols-2 gap-6 mt-4 border-t pt-4">
                                    {/* Mano de Obra */}
                                    <div>
                                        <h4 className="font-medium text-sm text-primary mb-3 flex items-center"><Clock className="w-4 h-4 mr-1" /> Mano de Obra</h4>
                                        <div className="flex flex-col gap-2 mb-3 bg-muted/30 p-3 rounded-lg border border-dashed text-xs">
                                            <Input placeholder="Descripción (Ej: Cambio de aceite)" className="h-8 text-xs" value={laborDesc} onChange={e => setLaborDesc(e.target.value)} />
                                            <div className="flex gap-2">
                                                <div className="flex-1"><Label className="text-[10px]">Horas</Label><Input type="number" step="0.5" className="h-8 text-xs" value={laborHours} onChange={e => setLaborHours(Number(e.target.value))} /></div>
                                                <div className="flex-1"><Label className="text-[10px]">Tarifa/h</Label><Input type="number" className="h-8 text-xs" value={laborRate} onChange={e => setLaborRate(Number(e.target.value))} /></div>
                                                <div className="flex pt-4"><Button type="button" size="sm" className="h-8 px-2" onClick={handleAddLabor}><Plus className="w-3 h-3" /></Button></div>
                                            </div>
                                        </div>
                                        <div className="bg-card border rounded-md min-h-[100px] overflow-hidden">
                                            <table className="w-full text-xs">
                                                <tbody>
                                                    {formManoObra.map(mo => (
                                                        <tr key={mo.id} className="border-b last:border-0"><td className="p-2">{mo.descripcion} <span className="text-muted-foreground">({mo.horas}h x L{mo.tarifaHora})</span></td><td className="p-2 text-right font-mono">L{mo.subtotal.toFixed(2)}</td><td className="w-6 p-[2px]"><Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => setFormManoObra(formManoObra.filter(m => m.id !== mo.id))}><Trash2 className="w-3 h-3" /></Button></td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Repuestos */}
                                    <div>
                                        <h4 className="font-medium text-sm text-primary mb-3 flex items-center"><Wrench className="w-4 h-4 mr-1" /> Repuestos desde Inventario</h4>
                                        <div className="flex flex-col gap-2 mb-3 bg-muted/30 p-3 rounded-lg border border-dashed text-xs">
                                            <Select value={selectedArticleId} onValueChange={setSelectedArticleId}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccionar repuesto..." /></SelectTrigger>
                                                <SelectContent>
                                                    {mockArticulos.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre} <span className="text-muted-foreground">- L{a.precioVenta.toFixed(2)}</span></SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex gap-2 items-end">
                                                <div className="w-16"><Label className="text-[10px]">Cant.</Label><Input type="number" className="h-8 text-xs" value={addQuantity} onChange={e => setAddQuantity(Number(e.target.value))} /></div>
                                                <Button type="button" size="sm" className="h-8 px-2 w-full" onClick={handleAddPart} disabled={!selectedArticleId}><Plus className="w-3 h-3 mr-1" /> Extraer</Button>
                                            </div>
                                        </div>
                                        <div className="bg-card border rounded-md min-h-[100px] overflow-hidden">
                                            <table className="w-full text-xs">
                                                <tbody>
                                                    {formRepuestos.map(rep => (
                                                        <tr key={rep.id} className="border-b last:border-0"><td className="p-2">{rep.descripcion} <span className="text-muted-foreground">({rep.cantidad} x L{rep.precioUnitario})</span></td><td className="p-2 text-right font-mono">L{rep.subtotal.toFixed(2)}</td><td className="w-6 p-[2px]"><Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => setFormRepuestos(formRepuestos.filter(m => m.id !== rep.id))}><Trash2 className="w-3 h-3" /></Button></td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="col-span-2 border-t pt-4 mt-2">
                                    <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center px-12">
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">Mano Obra</p><p className="font-mono font-medium">L{getSubtotalOT().mo.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">Repuestos</p><p className="font-mono font-medium">L{getSubtotalOT().rep.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">Impuestos</p><p className="font-mono font-medium text-warning">L{getSubtotalOT().tax.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground font-bold">TOTAL OT</p><p className="font-mono font-bold text-xl text-primary">L{getSubtotalOT().total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Facturación */}
                        {formType === "factura" && (
                            <div className="col-span-2 space-y-4">
                                <div className="bg-muted p-4 rounded-lg flex justify-between items-center text-center">
                                    <div><p className="text-xs text-muted-foreground">Concepto</p><p className="font-semibold">Liquidación de OT: {formData.otId}</p></div>
                                    <div><p className="text-xs text-muted-foreground">Monto Total</p><p className="font-mono text-2xl font-bold text-success">L{(formData.total || 0).toFixed(2)}</p></div>
                                </div>
                                <div className="text-sm text-muted-foreground text-center flex items-center justify-center">
                                    <FileText className="w-4 h-4 mr-2" /> Esto emitirá el documento de facturación y pasará el estado de la OT a "Facturado".
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </FormDialog>
        </div>
    );
}
