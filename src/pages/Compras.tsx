import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Truck, FileCheck, DollarSign, ArrowRight, Trash2, Plus, ShoppingCart } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import PageHeader from "@/components/shared/PageHeader";
import FormDialog from "@/components/shared/FormDialog";
import { useToast } from "@/hooks/use-toast";
import {
    mockSolicitudes, mockOrdenesCompra, mockRecepciones, mockFacturasCompra, mockPagosCompra,
    mockProveedores, mockArticulos, SolicitudCompra, OrdenCompra, RecepcionCompra, FacturaCompra, PagoCompra, DetalleDocumento
} from "@/lib/mock-data";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

export default function ComprasPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useTabFromUrl("/compras", "solicitudes", ["solicitudes", "ordenes", "recepciones", "facturas", "pagos"]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formType, setFormType] = useState<"solicitud" | "orden" | "recepcion" | "factura" | "pago">("solicitud");
    const [formData, setFormData] = useState<any>({});
    const [formDetalles, setFormDetalles] = useState<DetalleDocumento[]>([]);
    const [selectedArticleId, setSelectedArticleId] = useState("");
    const [addQuantity, setAddQuantity] = useState(1);

    // Persistence logic via localStorage
    const [solicitudes, setSolicitudes] = useState<SolicitudCompra[]>(() => {
        const saved = localStorage.getItem('solicitudes');
        return saved ? JSON.parse(saved) : mockSolicitudes;
    });
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>(() => {
        const saved = localStorage.getItem('ordenes');
        return saved ? JSON.parse(saved) : mockOrdenesCompra;
    });
    const [recepciones, setRecepciones] = useState<RecepcionCompra[]>(() => {
        const saved = localStorage.getItem('recepciones');
        return saved ? JSON.parse(saved) : mockRecepciones;
    });
    const [facturas, setFacturas] = useState<FacturaCompra[]>(() => {
        const saved = localStorage.getItem('facturasCompra');
        return saved ? JSON.parse(saved) : mockFacturasCompra;
    });
    const [pagos, setPagos] = useState<PagoCompra[]>(() => {
        const saved = localStorage.getItem('pagosCompra');
        return saved ? JSON.parse(saved) : mockPagosCompra;
    });

    // Sync states to localStorage
    useEffect(() => { localStorage.setItem('solicitudes', JSON.stringify(solicitudes)); }, [solicitudes]);
    useEffect(() => { localStorage.setItem('ordenes', JSON.stringify(ordenes)); }, [ordenes]);
    useEffect(() => { localStorage.setItem('recepciones', JSON.stringify(recepciones)); }, [recepciones]);
    useEffect(() => { localStorage.setItem('facturasCompra', JSON.stringify(facturas)); }, [facturas]);
    useEffect(() => { localStorage.setItem('pagosCompra', JSON.stringify(pagos)); }, [pagos]);

    const handleEntityAction = (type: "solicitud" | "orden" | "recepcion" | "factura" | "pago", entity?: any) => {
        setFormType(type);

        // Auto-populate data based on the source document
        if (entity) {
            if (type === "orden" && 'solicitante' in entity) {
                setFormData({ proveedor: "", referencia: entity.id });
                setFormDetalles([...entity.detalles]);
            } else if (type === "recepcion" && 'comprador' in entity) {
                setFormData({ proveedor: entity.proveedor, referencia: entity.id });
                setFormDetalles([...entity.detalles]);
            } else if (type === "factura" && 'recebidoPor' in entity) {
                setFormData({ proveedor: entity.proveedor, referencia: entity.id, cai: "", fechaEmision: "", fechaVencimiento: "" });
                setFormDetalles([...entity.detalles]);
            } else if (type === "pago" && 'impuestos' in entity) {
                setFormData({ proveedor: entity.proveedor, referencia: entity.numeroFactura, monto: entity.total });
                setFormDetalles([]); // Payments don't need line items displayed usually
            } else {
                setFormData({});
                setFormDetalles([]);
            }
        } else {
            setFormData({});
            setFormDetalles([]);
        }

        setSelectedArticleId("");
        setAddQuantity(1);
        setDialogOpen(true);
    };

    const handleAddLineItem = () => {
        if (!selectedArticleId || addQuantity <= 0) return;
        const article = mockArticulos.find(a => a.id === selectedArticleId);
        if (!article) return;

        const newDetalle: DetalleDocumento = {
            id: `temp-${Date.now()}`,
            articuloId: article.id,
            sku: article.sku,
            descripcion: article.nombre,
            cantidad: addQuantity,
            precioUnitario: article.precioCompra,
            subtotal: addQuantity * article.precioCompra,
        };

        setFormDetalles([...formDetalles, newDetalle]);
        setSelectedArticleId("");
        setAddQuantity(1);
        toast({ title: "Artículo agregado", description: `${addQuantity}x ${article.nombre}` });
    };

    const handleRemoveLineItem = (id: string) => {
        setFormDetalles(formDetalles.filter(d => d.id !== id));
    };

    // Badge mapping objects
    const estadoMap = {
        borrador: "bg-muted text-muted-foreground border-muted",
        pendiente: "bg-warning/15 text-warning border-warning/30",
        aprobada: "bg-primary/15 text-primary border-primary/30",
        rechazada: "bg-destructive/15 text-destructive border-destructive/30",
        emitida: "bg-primary/15 text-primary border-primary/30",
        recibida_parcial: "bg-warning/15 text-warning border-warning/30",
        recibida: "bg-success/15 text-success border-success/30",
        recibido: "bg-success/15 text-success border-success/30",
        cancelada: "bg-destructive/15 text-destructive border-destructive/30",
        pagada: "bg-success/15 text-success border-success/30",
        vencida: "bg-destructive/15 text-destructive border-destructive/30",
        anulada: "bg-destructive/15 text-destructive border-destructive/30",
        completado: "bg-success/15 text-success border-success/30",
    };

    const renderBadge = (estado: string) => {
        const classN = estadoMap[estado as keyof typeof estadoMap] || "";
        return <Badge variant="outline" className={`${classN} capitalize`}>{estado.replace('_', ' ')}</Badge>;
    };

    // Column Definitions
    const columnsSolicitudes: Column<SolicitudCompra>[] = [
        { key: "id", label: "ID Sol.", className: "font-mono text-xs w-[80px]" },
        { key: "fecha", label: "Fecha", className: "text-xs" },
        { key: "solicitante", label: "Solicitante", render: (r) => <span className="font-medium">{r.solicitante}</span> },
        { key: "departamento", label: "Dpto." },
        { key: "estado", label: "Estado", render: (r) => renderBadge(r.estado) },
        {
            key: "id", label: "Acciones", render: (r) => (
                r.estado === "aprobada" ?
                    <Button variant="ghost" size="sm" onClick={() => handleEntityAction("orden", r)} className="h-8 text-primary">
                        <ShoppingCart className="w-4 h-4 mr-2" /> Emitir OC <ArrowRight className="w-3 h-3 ml-1" />
                    </Button> : null
            )
        }
    ];

    const columnsOrdenes: Column<OrdenCompra>[] = [
        { key: "id", label: "ID OC", className: "font-mono text-xs w-[80px]" },
        { key: "fecha", label: "Fecha", className: "text-xs" },
        { key: "proveedor", label: "Proveedor", render: (r) => <span className="font-medium">{r.proveedor}</span> },
        { key: "estado", label: "Estado", render: (r) => renderBadge(r.estado) },
        { key: "comprador", label: "Comprador", className: "text-muted-foreground text-xs" },
        { key: "total", label: "Total", render: (r) => <span className="font-mono font-semibold">L{r.total.toFixed(2)}</span> },
        {
            key: "id", label: "Acciones", render: (r) => (
                r.estado === "emitida" || r.estado === "recibida_parcial" ?
                    <Button variant="ghost" size="sm" onClick={() => handleEntityAction("recepcion", r)} className="h-8 text-primary">
                        <Truck className="w-4 h-4 mr-2" /> Recibir <ArrowRight className="w-3 h-3 ml-1" />
                    </Button> : null
            )
        }
    ];

    const columnsRecepciones: Column<RecepcionCompra>[] = [
        { key: "id", label: "ID Rec.", className: "font-mono text-xs w-[80px]" },
        { key: "fecha", label: "Fecha", className: "text-xs" },
        { key: "ordenId", label: "Ref. OC", className: "font-mono text-xs text-muted-foreground" },
        { key: "proveedor", label: "Proveedor", render: (r) => <span className="font-medium">{r.proveedor}</span> },
        { key: "estado", label: "Estado", render: (r) => renderBadge(r.estado) },
        {
            key: "id", label: "Acciones", render: (r) => (
                r.estado === "recibido" ?
                    <Button variant="ghost" size="sm" onClick={() => handleEntityAction("factura", r)} className="h-8 text-primary">
                        <FileText className="w-4 h-4 mr-2" /> Facturar <ArrowRight className="w-3 h-3 ml-1" />
                    </Button> : null
            )
        }
    ];

    const columnsFacturas: Column<FacturaCompra>[] = [
        { key: "numeroFactura", label: "N° Factura", className: "font-mono text-xs" },
        { key: "fechaEmision", label: "Emisión", className: "text-xs" },
        { key: "proveedor", label: "Proveedor", render: (r) => <span className="font-medium">{r.proveedor}</span> },
        { key: "estado", label: "Estado", render: (r) => renderBadge(r.estado) },
        { key: "total", label: "Total", render: (r) => <span className="font-mono font-semibold">L{r.total.toFixed(2)}</span> },
        {
            key: "id", label: "Acciones", render: (r) => (
                (r.estado === "pendiente" || r.estado === "vencida") ?
                    <Button variant="ghost" size="sm" onClick={() => handleEntityAction("pago", r)} className="h-8 text-success hover:text-success/90">
                        <DollarSign className="w-4 h-4 mr-2" /> Pagar <ArrowRight className="w-3 h-3 ml-1" />
                    </Button> : null
            )
        }
    ];

    const columnsPagos: Column<PagoCompra>[] = [
        { key: "id", label: "ID Pago", className: "font-mono text-xs w-[80px]" },
        { key: "fecha", label: "Fecha", className: "text-xs" },
        { key: "facturaId", label: "Ref. Factura", className: "font-mono text-xs text-muted-foreground" },
        { key: "proveedor", label: "Proveedor", render: (r) => <span className="font-medium">{r.proveedor}</span> },
        { key: "metodo", label: "Método", className: "capitalize" },
        { key: "estado", label: "Estado", render: (r) => renderBadge(r.estado) },
        { key: "monto", label: "Monto", render: (r) => <span className="font-mono font-semibold text-success">L{r.monto.toFixed(2)}</span> },
    ];

    const handleFormSubmit = () => {
        const timeNow = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const randId = Math.floor(1000 + Math.random() * 9000);

        const calcSubtotal = formDetalles.reduce((sum, det) => sum + det.subtotal, 0);

        if (formType === "solicitud") {
            const nuevaSolicitud: SolicitudCompra = {
                id: `REQ-${randId}`, fecha: timeNow, solicitante: "Usuario Actual", departamento: "General", estado: "pendiente", detalles: formDetalles
            };
            setSolicitudes([nuevaSolicitud, ...solicitudes]);
        } else if (formType === "orden") {
            const nuevaOC: OrdenCompra = {
                id: `OC-${randId}`, fecha: timeNow, solicitudId: formData.referencia, proveedor: formData.proveedor || "Prov. Genérico", proveedorId: "P999",
                total: calcSubtotal * 1.15, estado: "emitida", comprador: "Usuario Actual", detalles: formDetalles
            };
            setOrdenes([nuevaOC, ...ordenes]);
            if (formData.referencia) { setSolicitudes(solicitudes.map(s => s.id === formData.referencia ? { ...s, estado: "aprobada" } : s)); }
        } else if (formType === "recepcion") {
            const nuevaRecepcion: RecepcionCompra = {
                id: `REC-${randId}`, fecha: timeNow, ordenId: formData.referencia || "OC-XXXX", proveedor: formData.proveedor || "Prov. Genérico",
                estado: "recibido", recibidoPor: "Bodeguero Asignado", detalles: formDetalles
            };
            setRecepciones([nuevaRecepcion, ...recepciones]);
            if (formData.referencia) { setOrdenes(ordenes.map(o => o.id === formData.referencia ? { ...o, estado: "recibida" } : o)); }
        } else if (formType === "factura") {
            const nuevaFactura: FacturaCompra = {
                id: `FCP-${randId}`, fechaEmision: formData.fechaEmision || timeNow.split(' ')[0], cai: formData.cai || "PENDIENTE-CAI",
                recepcionId: formData.referencia || "REC-XXXX", numeroFactura: `001-001-${randId.toString().padStart(8, '0')}`,
                proveedor: formData.proveedor || "Prov. Genérico", proveedorId: "P999", subtotal: calcSubtotal, impuestos: calcSubtotal * 0.15,
                total: calcSubtotal * 1.15, estado: "pendiente", fechaVencimiento: formData.fechaVencimiento || timeNow.split(' ')[0], detalles: formDetalles
            };
            setFacturas([nuevaFactura, ...facturas]);
        } else if (formType === "pago") {
            const nuevoPago: PagoCompra = {
                id: `PAG-C-${randId}`, fecha: timeNow, facturaId: formData.referencia || "FAC-XXXX", proveedor: formData.proveedor || "Prov. Genérico",
                monto: formData.monto || 0, metodo: "transferencia", referencia: `TRF-${randId}`, estado: "completado"
            };
            setPagos([nuevoPago, ...pagos]);
            if (formData.referencia) { setFacturas(facturas.map(f => f.numeroFactura === formData.referencia ? { ...f, estado: "pagada" } : f)); }
        }

        toast({ title: `Registro de ${formType.toUpperCase()} exitoso`, description: `Documento generado correctamente.` });
        setDialogOpen(false);

        if (formType === 'solicitud') setActiveTab('ordenes');
        if (formType === 'orden') setActiveTab('recepciones');
        if (formType === 'recepcion') setActiveTab('facturas');
        if (formType === 'factura') setActiveTab('pagos');
    };

    const formTitles = { solicitud: "Nueva Solicitud de Compra", orden: "Emitir Orden de Compra", recepcion: "Recibir Pedido", factura: "Registrar Factura de Proveedor", pago: "Efectuar Pago" };

    return (
        <div className="flex-1 overflow-auto p-6">
            <PageHeader title="Compras y Abastecimiento" subtitle="Gestión del ciclo de compras">
                <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 gap-1">
                    {ordenes.filter(v => v.estado === "emitida").length} Órdenes Activas
                </Badge>
            </PageHeader>

            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Compras (Mes)", value: `L${facturas.reduce((s, a) => s + a.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ShoppingCart, color: "text-primary" },
                    { label: "Pedidos en tránsito", value: ordenes.filter(e => e.estado === "emitida").length, icon: Truck, color: "text-warning" },
                    { label: "Facturas por pagar", value: facturas.filter(f => f.estado === "pendiente" || f.estado === "vencida").length, icon: FileCheck, color: "text-destructive" },
                    { label: "Pagos Emitidos", value: `L${pagos.reduce((s, p) => s + p.monto, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success" },
                ].map((s, i) => (
                    <div key={i} className="rounded-lg border bg-card p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <s.icon className={`w-5 h-5 ${s.color || "text-primary"}`} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                            <p className={`text-lg font-bold ${s.color || ""}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="solicitudes">1. Solicitudes</TabsTrigger>
                    <TabsTrigger value="ordenes">2. Órdenes</TabsTrigger>
                    <TabsTrigger value="recepciones">3. Pedidos/Recepciones</TabsTrigger>
                    <TabsTrigger value="facturas">4. Facturación</TabsTrigger>
                    <TabsTrigger value="pagos">5. Pagos Emitidos</TabsTrigger>
                </TabsList>

                <TabsContent value="solicitudes">
                    <DataTable columns={columnsSolicitudes} data={solicitudes} searchPlaceholder="Buscar solicitud..." searchKey="solicitante" onAdd={() => handleEntityAction("solicitud")} addLabel="Nueva Solicitud" />
                </TabsContent>

                <TabsContent value="ordenes">
                    <DataTable columns={columnsOrdenes} data={ordenes} searchPlaceholder="Buscar orden..." searchKey="proveedor" onAdd={() => handleEntityAction("orden")} addLabel="Crear OC Directa" />
                </TabsContent>

                <TabsContent value="recepciones">
                    <DataTable columns={columnsRecepciones} data={recepciones} searchPlaceholder="Buscar recepción..." searchKey="proveedor" onAdd={() => handleEntityAction("recepcion")} addLabel="Registrar Recepción" />
                </TabsContent>

                <TabsContent value="facturas">
                    <DataTable columns={columnsFacturas} data={facturas} searchPlaceholder="Buscar factura..." searchKey="numeroFactura" onAdd={() => handleEntityAction("factura")} addLabel="Registrar Factura" />
                </TabsContent>

                <TabsContent value="pagos">
                    <DataTable columns={columnsPagos} data={pagos} searchPlaceholder="Buscar pago..." searchKey="proveedor" onAdd={() => handleEntityAction("pago")} addLabel="Emitir Pago" />
                </TabsContent>
            </Tabs>

            <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={formTitles[formType]} onSubmit={handleFormSubmit}>
                <div className="max-w-3xl">
                    <div className="grid grid-cols-2 gap-4">

                        {(formType !== "solicitud") && (
                            <div className="space-y-2 col-span-2">
                                <Label>Proveedor *</Label>
                                <Select value={formData.proveedor} onValueChange={(v) => setFormData({ ...formData, proveedor: v })}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar proveedor de la base de datos" /></SelectTrigger>
                                    <SelectContent>
                                        {mockProveedores.map(p => <SelectItem key={p.id} value={p.nombre}>{p.rif} - {p.nombre}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {formType !== "solicitud" && formType !== "orden" && (
                            <div className="space-y-2">
                                <Label>Documento Referencia</Label>
                                <Input value={formData.referencia || ""} readOnly className="bg-muted text-muted-foreground" />
                            </div>
                        )}

                        {formType === "factura" && (
                            <>
                                <div className="space-y-2"><Label>CAI *</Label><Input value={formData.cai || ""} onChange={e => setFormData({ ...formData, cai: e.target.value })} placeholder="1A2B3C..." /></div>
                                <div className="space-y-2"><Label>Fecha Emisión *</Label><Input type="date" value={formData.fechaEmision || ""} onChange={e => setFormData({ ...formData, fechaEmision: e.target.value })} /></div>
                                <div className="space-y-2"><Label>Fecha Vencimiento *</Label><Input type="date" value={formData.fechaVencimiento || ""} onChange={e => setFormData({ ...formData, fechaVencimiento: e.target.value })} /></div>
                            </>
                        )}

                        {formType === "pago" && (
                            <>
                                <div className="space-y-2"><Label>Monto a Pagar *</Label><Input type="number" step="0.01" value={formData.monto || ""} onChange={e => setFormData({ ...formData, monto: Number(e.target.value) })} /></div>
                                <div className="space-y-2"><Label>Método</Label>
                                    <Select defaultValue="transferencia"><SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="transferencia">Transferencia / ACH</SelectItem><SelectItem value="cheque">Cheque</SelectItem><SelectItem value="efectivo">Efectivo</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {["solicitud", "orden", "recepcion"].includes(formType) && (
                            <div className="col-span-2 space-y-2 mt-4">
                                <Label className="text-base font-semibold border-b pb-2 block">Detalle de Productos</Label>

                                {(formType === "solicitud" || formType === "orden") && (
                                    <div className="flex items-end gap-3 mb-4 bg-muted/30 p-4 rounded-lg border border-dashed">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Buscar del Inventario</Label>
                                            <Select value={selectedArticleId} onValueChange={setSelectedArticleId}>
                                                <SelectTrigger><SelectValue placeholder="Seleccione un producto..." /></SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                    {mockArticulos.map(a => (
                                                        <SelectItem key={a.id} value={a.id}>
                                                            <span className="font-mono text-xs text-muted-foreground mr-2">{a.sku}</span>
                                                            {a.nombre} <span className="font-mono text-xs ml-1 font-semibold text-primary">L{a.precioCompra.toFixed(2)}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-24 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Cant.</Label>
                                            <Input type="number" min="1" value={addQuantity} onChange={(e) => setAddQuantity(Number(e.target.value))} />
                                        </div>
                                        <Button type="button" onClick={handleAddLineItem} disabled={!selectedArticleId} className="gap-2">
                                            <Plus className="w-4 h-4" /> Agregar
                                        </Button>
                                    </div>
                                )}

                                <div className="border rounded-md mt-2 max-h-60 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted text-muted-foreground sticky top-0 hidden sm:table-header-group">
                                            <tr>
                                                <th className="p-2 text-left font-medium">SKU</th>
                                                <th className="p-2 text-left font-medium">Descripción</th>
                                                <th className="p-2 text-right font-medium">Cant.</th>
                                                <th className="p-2 text-right font-medium">Costo Unit.</th>
                                                <th className="p-2 text-right font-medium">Subtotal</th>
                                                {(formType === "solicitud" || formType === "orden") && <th className="p-2 w-10"></th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formDetalles.length === 0 ? (
                                                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Sin artículos agregados</td></tr>
                                            ) : (
                                                formDetalles.map((detalle, i) => (
                                                    <tr key={detalle.id || i} className="border-t">
                                                        <td className="p-2 align-middle font-mono text-xs">{detalle.sku}</td>
                                                        <td className="p-2 align-middle">{detalle.descripcion}</td>
                                                        <td className="p-2 align-middle text-right">{detalle.cantidad}</td>
                                                        <td className="p-2 align-middle text-right font-mono">L{detalle.precioUnitario.toFixed(2)}</td>
                                                        <td className="p-2 align-middle text-right font-mono font-semibold">L{detalle.subtotal.toFixed(2)}</td>
                                                        {(formType === "solicitud" || formType === "orden") && (
                                                            <td className="p-2 align-middle text-center">
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveLineItem(detalle.id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {formDetalles.length > 0 && formType !== "solicitud" && (
                                    <div className="mt-4 pt-4 border-t flex justify-end gap-12 pr-2">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Subtotal</p>
                                            <p className="font-mono font-medium">L{formDetalles.reduce((a, b) => a + b.subtotal, 0).toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Impuesto (15%)</p>
                                            <p className="font-mono font-medium">L{(formDetalles.reduce((a, b) => a + b.subtotal, 0) * 0.15).toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground font-bold">Total OC</p>
                                            <p className="font-mono font-bold text-lg text-primary">L{(formDetalles.reduce((a, b) => a + b.subtotal, 0) * 1.15).toFixed(2)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </FormDialog>
        </div>
    );
}
