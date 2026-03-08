import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Truck, FileCheck, DollarSign, ArrowRight, Plus, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import PageHeader from "@/components/shared/PageHeader";
import FormDialog from "@/components/shared/FormDialog";
import { mockVentas, mockEntregas, mockFacturas, mockPagos, mockClientes, mockArticulos, mockVendedores, Venta, Entrega, Factura, Pago, DetalleDocumento } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

const estadoBadgeVenta = (estado: string) => {
  const map: Record<string, string> = {
    borrador: "bg-muted text-muted-foreground border-muted-foreground/30",
    aprobada: "bg-primary/15 text-primary border-primary/30",
    facturada: "bg-success/15 text-success border-success/30",
    anulada: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado}</Badge>;
};

const estadoBadgeEntrega = (estado: string) => {
  const map: Record<string, string> = {
    pendiente: "bg-warning/15 text-warning border-warning/30",
    entregado: "bg-success/15 text-success border-success/30",
    cancelado: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado}</Badge>;
};

const estadoBadgeFactura = (estado: string) => {
  const map: Record<string, string> = {
    pendiente: "bg-warning/15 text-warning border-warning/30",
    pagada: "bg-success/15 text-success border-success/30",
    vencida: "bg-destructive/15 text-destructive border-destructive/30",
    anulada: "bg-muted text-muted-foreground border-muted-foreground/30",
  };
  return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado}</Badge>;
};

const estadoBadgePago = (estado: string) => {
  const map: Record<string, string> = {
    completado: "bg-success/15 text-success border-success/30",
    pendiente: "bg-warning/15 text-warning border-warning/30",
    rechazado: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={`${map[estado] || ""} capitalize`}>{estado}</Badge>;
};

export default function VentasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formType, setFormType] = useState<"orden" | "entrega" | "factura" | "pago">("orden");
  const [formData, setFormData] = useState({ id: "", cliente: "", monto: 0, referencia: "", cai: "", fechaEmision: "", fechaVencimiento: "", vendedorId: "" });
  const [formDetalles, setFormDetalles] = useState<DetalleDocumento[]>([]);
  const [activeTab, setActiveTab] = useState("ordenes");
  // Current vendedores from localStorage (same source as Maestros)
  const [vendedores] = useState(() => {
    const saved = localStorage.getItem("vendedores");
    return saved ? JSON.parse(saved) : mockVendedores;
  });
  const [activeTab, setActiveTab] = useTabFromUrl("/ventas", "cotizaciones", ["cotizaciones", "entregas", "facturas", "pagos"]);

  // States for adding line items dynamically
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [addQuantity, setAddQuantity] = useState(1);

  // Main data states to simulate a database connection with localStorage
  const [ventas, setVentas] = useState<Venta[]>(() => {
    const saved = localStorage.getItem('ventas');
    return saved ? JSON.parse(saved) : mockVentas;
  });
  const [entregas, setEntregas] = useState<Entrega[]>(() => {
    const saved = localStorage.getItem('entregas');
    return saved ? JSON.parse(saved) : mockEntregas;
  });
  const [facturas, setFacturas] = useState<Factura[]>(() => {
    const saved = localStorage.getItem('facturas');
    return saved ? JSON.parse(saved) : mockFacturas;
  });
  const [pagos, setPagos] = useState<Pago[]>(() => {
    const saved = localStorage.getItem('pagos');
    return saved ? JSON.parse(saved) : mockPagos;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('ventas', JSON.stringify(ventas)); }, [ventas]);
  useEffect(() => { localStorage.setItem('entregas', JSON.stringify(entregas)); }, [entregas]);
  useEffect(() => { localStorage.setItem('facturas', JSON.stringify(facturas)); }, [facturas]);
  useEffect(() => { localStorage.setItem('pagos', JSON.stringify(pagos)); }, [pagos]);

  const handleEntityAction = (type: "orden" | "entrega" | "factura" | "pago", entity?: Venta | Entrega | Factura | Pago) => {
    setFormType(type);

    // Auto-fill from previous step if provided
    if (entity) {
      if ('detalles' in entity) setFormDetalles(entity.detalles);

      if (type === "entrega" && 'vendedor' in entity) {
        // From Venta to Entrega
        setFormData({ ...formData, cliente: entity.cliente, referencia: entity.id });
      } else if (type === "factura" && 'repartidor' in entity) {
        // From Entrega to Factura
        setFormData({ ...formData, cliente: entity.cliente, referencia: entity.id, cai: "A1B2C3-D4E5F6", fechaEmision: new Date().toISOString().split('T')[0] });
      } else if (type === "pago" && 'numeroFactura' in entity) {
        // From Factura to Pago
        setFormData({ ...formData, cliente: entity.cliente, referencia: entity.numeroFactura, monto: entity.total });
        setFormDetalles([]); // Payments don't have item details directly
      }
    } else {
      setFormData({ id: "", cliente: "", monto: 0, referencia: "", cai: "", fechaEmision: "", fechaVencimiento: "", vendedorId: "" });
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

    const newDetail: DetalleDocumento = {
      id: `temp-${Date.now()}`,
      articuloId: article.id,
      sku: article.sku,
      descripcion: article.nombre,
      cantidad: addQuantity,
      precioUnitario: article.precioVenta,
      subtotal: addQuantity * article.precioVenta
    };

    setFormDetalles([...formDetalles, newDetail]);
    setSelectedArticleId("");
    setAddQuantity(1);
    toast({ title: "Artículo agregado", description: `${addQuantity}x ${article.nombre}` });
  };

  const handleRemoveLineItem = (id: string) => {
    setFormDetalles(formDetalles.filter(d => d.id !== id));
  };

  const columnsVentas: Column<Venta>[] = [
    { key: "id", label: "ID Orden", className: "font-mono text-xs w-[100px]" },
    { key: "fecha", label: "Fecha", className: "text-xs w-[140px]" },
    { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
    { key: "estado", label: "Estado", render: (r) => estadoBadgeVenta(r.estado) },
    {
      key: "vendedor", label: "Vendedor", render: (r) => {
        const v = vendedores.find((vd: any) => vd.nombre === r.vendedor);
        return (
          <div>
            <p className="text-xs font-medium">{r.vendedor || "—"}</p>
            {v && <p className="text-[10px] text-success font-mono">{(v.comision * 100).toFixed(0)}% comisión</p>}
          </div>
        );
      }
    },
    { key: "total", label: "Total", render: (r) => <span className="font-mono font-semibold">L{r.total.toFixed(2)}</span> },
    {
      key: "id", label: "Acciones", render: (r) => (
        r.estado === "aprobada" ?
          <Button variant="ghost" size="sm" onClick={() => handleEntityAction("entrega", r)} className="h-8 gap-1 text-primary">
            <Truck className="w-4 h-4" /> Despachar <ArrowRight className="w-3 h-3" />
          </Button> : null
      )
    }
  ];

  const columnsEntregas: Column<Entrega>[] = [
    { key: "id", label: "ID Entrega", className: "font-mono text-xs w-[100px]" },
    { key: "fecha", label: "Fecha", className: "text-xs w-[140px]" },
    { key: "ventaId", label: "Ref. Orden", className: "font-mono text-xs text-primary" },
    { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
    { key: "estado", label: "Estado", render: (r) => estadoBadgeEntrega(r.estado) },
    { key: "repartidor", label: "Repartidor", className: "text-muted-foreground text-xs" },
    {
      key: "id", label: "Acciones", render: (r) => (
        r.estado === "entregado" ?
          <Button variant="ghost" size="sm" onClick={() => handleEntityAction("factura", r)} className="h-8 gap-1 text-success">
            <FileCheck className="w-4 h-4" /> Facturar <ArrowRight className="w-3 h-3" />
          </Button> : null
      )
    }
  ];

  const columnsFacturas: Column<Factura>[] = [
    { key: "numeroFactura", label: "No. Factura", className: "font-mono text-xs font-semibold w-[140px]" },
    { key: "fechaEmision", label: "Emisión", className: "text-xs w-[120px]" },
    { key: "fechaVencimiento", label: "Vencimiento", className: "text-xs w-[120px]" },
    { key: "cai", label: "CAI", className: "font-mono text-[10px] text-muted-foreground" },
    { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
    {
      key: "vendedor", label: "Vendedor / Comisión", render: (r: any) => {
        const v = vendedores.find((vd: any) => vd.nombre === r.vendedor);
        const comisionMonto = v ? r.total * v.comision : 0;
        return (
          <div>
            <p className="text-xs font-medium">{r.vendedor || "—"}</p>
            {v && (
              <p className="text-[10px] font-mono text-success flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                L{comisionMonto.toFixed(2)} ({(v.comision * 100).toFixed(0)}%)
              </p>
            )}
          </div>
        );
      }
    },
    { key: "estado", label: "Estado", render: (r) => estadoBadgeFactura(r.estado) },
    { key: "total", label: "Total", render: (r) => <span className="font-mono font-semibold">L{r.total.toFixed(2)}</span> },
    {
      key: "id", label: "Acciones", render: (r) => (
        r.estado === "pendiente" || r.estado === "vencida" ?
          <Button variant="ghost" size="sm" onClick={() => handleEntityAction("pago", r)} className="h-8 gap-1 text-primary">
            <DollarSign className="w-4 h-4" /> Pagar <ArrowRight className="w-3 h-3" />
          </Button> : null
      )
    }
  ];

  const columnsPagos: Column<Pago>[] = [
    { key: "id", label: "ID Pago", className: "font-mono text-xs w-[100px]" },
    { key: "fecha", label: "Fecha", className: "text-xs w-[140px]" },
    { key: "facturaId", label: "Factura", className: "font-mono text-xs text-primary" },
    { key: "cliente", label: "Cliente", render: (r) => <span className="font-medium">{r.cliente}</span> },
    { key: "metodo", label: "Método", className: "capitalize" },
    { key: "estado", label: "Estado", render: (r) => estadoBadgePago(r.estado) },
    { key: "monto", label: "Monto", render: (r) => <span className="font-mono font-semibold text-success">L{r.monto.toFixed(2)}</span> },
  ];

  const handleFormSubmit = () => {
    const timeNow = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const randId = Math.floor(1000 + Math.random() * 9000);

    if (formType === "orden") {
      const vendObj = vendedores.find((v: any) => v.id === formData.vendedorId);
      const nuevaOrden: Venta = {
        id: `OV-${randId}`,
        fecha: timeNow,
        cliente: formData.cliente || "Cliente Genérico",
        clienteId: "C999",
        total: formDetalles.reduce((sum, det) => sum + det.subtotal, 0) * 1.15,
        estado: "aprobada",
        vendedor: vendObj ? vendObj.nombre : "Usuario Actual",
        detalles: formDetalles
      };
      setVentas([nuevaOrden, ...ventas]);
    } else if (formType === "entrega") {
      const nuevaEntrega: Entrega = {
        id: `ENT-${randId}`,
        fecha: timeNow,
        ventaId: formData.referencia || "OV-XXXX",
        cliente: formData.cliente || "Cliente Genérico",
        estado: "entregado",
        repartidor: "Repartidor Asignado",
        detalles: formDetalles
      };
      setEntregas([nuevaEntrega, ...entregas]);

      // Update order status if applicable
      setVentas(ventas.map(v => v.id === formData.referencia ? { ...v, estado: "facturada" } : v));
    } else if (formType === "factura") {
      const nuevaFactura: Factura = {
        id: `FAC-${randId}`,
        fechaEmision: formData.fechaEmision || timeNow.split(' ')[0],
        cai: formData.cai || "PENDIENTE-CAI",
        ventaId: formData.referencia || "OV-XXXX",
        numeroFactura: `001-001-${randId.toString().padStart(8, '0')}`,
        cliente: formData.cliente || "Cliente Genérico",
        clienteId: "C999",
        subtotal: formDetalles.reduce((sum, det) => sum + det.subtotal, 0),
        impuestos: formDetalles.reduce((sum, det) => sum + det.subtotal, 0) * 0.15,
        total: formDetalles.reduce((sum, det) => sum + det.subtotal, 0) * 1.15,
        estado: "pendiente",
        fechaVencimiento: formData.fechaVencimiento || timeNow.split(' ')[0],
        detalles: formDetalles
      };
      setFacturas([nuevaFactura, ...facturas]);
    } else if (formType === "pago") {
      const nuevoPago: Pago = {
        id: `PAG-${randId}`,
        fecha: timeNow,
        facturaId: formData.referencia || "FAC-XXXX",
        cliente: formData.cliente || "Cliente Genérico",
        monto: formData.monto,
        metodo: "transferencia",
        referencia: `TRF-${randId}`,
        estado: "completado"
      };
      setPagos([nuevoPago, ...pagos]);

      // Update invoice status if applicable
      setFacturas(facturas.map(f => f.numeroFactura === formData.referencia ? { ...f, estado: "pagada" } : f));
    }

    toast({ title: `Registro de ${formType.toUpperCase()} exitoso`, description: `Documento generado para ${formData.cliente || "el cliente"}.` });
    setDialogOpen(false);

    // Auto-switch tabs to show flow progress
    if (formType === 'orden') setActiveTab('entregas');
    if (formType === 'entrega') setActiveTab('facturas');
    if (formType === 'factura') setActiveTab('pagos');
  };

  const getFormTitle = () => {
    switch (formType) {
      case "orden": return "Nueva Orden de Venta";
      case "entrega": return "Programar Entrega / Despacho";
      case "factura": return "Emitir Factura Fiscal";
      case "pago": return "Registrar Pago Recibido";
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <PageHeader title="Ventas & Cobranza" subtitle="Flujo completo: Órdenes, Despachos, Facturación y Pagos">
        <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 gap-1">
          {ventas.filter(v => v.estado === "aprobada").length} Órdenes Pendientes
        </Badge>
      </PageHeader>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Ventas (Mes)", value: `L${ventas.reduce((s, a) => s + a.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: FileText, color: "text-primary" },
          { label: "Entregas Pendientes", value: entregas.filter(e => e.estado === "pendiente").length, icon: Truck, color: "text-warning" },
          { label: "Facturas Vencidas", value: facturas.filter(f => f.estado === "vencida").length, icon: FileCheck, color: "text-destructive" },
          { label: "Pagos Recibidos", value: `L${pagos.reduce((s, p) => s + p.monto, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success" },
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
        <TabsList>
          <TabsTrigger value="cotizaciones">1. Órdenes</TabsTrigger>
          <TabsTrigger value="entregas">2. Entregas</TabsTrigger>
          <TabsTrigger value="facturas">3. Facturación</TabsTrigger>
          <TabsTrigger value="pagos">4. Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value="cotizaciones" className="mt-4">
          <DataTable
            columns={columnsVentas}
            data={ventas}
            searchPlaceholder="Buscar orden..."
            searchKey="cliente"
            onAdd={() => handleEntityAction("orden")}
            addLabel="Nueva Orden"
          />
        </TabsContent>

        <TabsContent value="entregas" className="mt-4">
          <DataTable
            columns={columnsEntregas}
            data={entregas}
            searchPlaceholder="Buscar entrega..."
            searchKey="cliente"
            onAdd={() => handleEntityAction("entrega")}
            addLabel="Nueva Entrega"
          />
        </TabsContent>

        <TabsContent value="facturas" className="mt-4">
          <DataTable
            columns={columnsFacturas}
            data={facturas}
            searchPlaceholder="Buscar factura..."
            searchKey="numeroFactura"
            onAdd={() => handleEntityAction("factura")}
            addLabel="Emitir Factura Manual"
          />
        </TabsContent>

        <TabsContent value="pagos" className="mt-4">
          <DataTable
            columns={columnsPagos}
            data={pagos}
            searchPlaceholder="Buscar pago..."
            searchKey="cliente"
            onAdd={() => handleEntityAction("pago")}
            addLabel="Registrar Pago"
          />
        </TabsContent>
      </Tabs>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={getFormTitle()} onSubmit={handleFormSubmit}>
        <div className="max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Cliente *</Label>
              <Select value={formData.cliente} onValueChange={(v) => setFormData({ ...formData, cliente: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {mockClientes.map(c => (
                    <SelectItem key={c.id} value={c.nombre}>{c.documento} - {c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formType === "entrega" || formType === "factura" || formType === "pago") && (
              <div className="space-y-2 col-span-2">
                <Label className="text-primary font-semibold">Documento Origen (Referencia)</Label>
                <Input value={formData.referencia} disabled className="bg-muted font-mono" />
              </div>
            )}

            {formType === "factura" && (
              <>
                <div className="space-y-2 col-span-2">
                  <Label>CAI (Clave de Autorización)</Label>
                  <Input value={formData.cai} onChange={e => setFormData({ ...formData, cai: e.target.value })} placeholder="Ej: A1B2C3-..." className="font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Emisión</Label>
                  <Input type="date" value={formData.fechaEmision} onChange={e => setFormData({ ...formData, fechaEmision: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Vencimiento</Label>
                  <Input type="date" value={formData.fechaVencimiento} onChange={e => setFormData({ ...formData, fechaVencimiento: e.target.value })} />
                </div>
              </>
            )}

            {formType === "pago" && (
              <div className="space-y-2 col-span-2">
                <Label>Monto a Pagar</Label>
                <Input type="number" value={formData.monto} onChange={e => setFormData({ ...formData, monto: Number(e.target.value) })} className="font-mono font-bold text-success text-lg" />
              </div>
            )}
          </div>

          {/* Line Items Section */}
          {formType !== "pago" && (
            <div className="mt-6 border rounded-lg p-4 bg-muted/20">
              <h4 className="font-semibold mb-3">Detalle de Productos</h4>

              {formType === "orden" && (
                <div className="flex items-end gap-2 mb-4 p-3 border rounded-md bg-card">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Buscar Artículo del Inventario</Label>
                    <Select value={selectedArticleId} onValueChange={setSelectedArticleId}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Seleccionar producto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockArticulos.map(a => (
                          <SelectItem key={a.id} value={a.id}>
                            <span className="font-mono text-xs text-muted-foreground mr-2">{a.sku}</span>
                            {a.nombre} <span className="font-mono text-xs ml-1 font-semibold">L{a.precioVenta.toFixed(2)}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20 space-y-1">
                    <Label className="text-xs">Cant.</Label>
                    <Input type="number" min="1" value={addQuantity} onChange={e => setAddQuantity(Number(e.target.value))} className="h-8 text-sm" />
                  </div>
                  <Button size="sm" onClick={handleAddLineItem} disabled={!selectedArticleId} className="h-8">
                    <Plus className="w-4 h-4 mr-1" /> Agregar
                  </Button>
                </div>
              )}

              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm max-h-[200px]">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[100px]">SKU</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Descripción</th>
                      <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-[80px]">Cant.</th>
                      <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-[100px]">P. Unitario</th>
                      <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-[100px]">Subtotal</th>
                      {formType === "orden" && <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground w-[50px]"></th>}
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {formDetalles.length > 0 ? formDetalles.map(detalle => (
                      <tr key={detalle.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-2 align-middle font-mono text-xs">{detalle.sku}</td>
                        <td className="p-2 align-middle">{detalle.descripcion}</td>
                        <td className="p-2 align-middle text-right">{detalle.cantidad}</td>
                        <td className="p-2 align-middle text-right font-mono">L{detalle.precioUnitario.toFixed(2)}</td>
                        <td className="p-2 align-middle text-right font-mono font-semibold">L{detalle.subtotal.toFixed(2)}</td>
                        {formType === "orden" && (
                          <td className="p-2 align-middle text-center">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveLineItem(detalle.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={formType === "orden" ? 6 : 5} className="p-4 text-center text-muted-foreground">
                          No hay artículos detallados en este documento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {formDetalles.length > 0 && (
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
                      <p className="text-xs text-muted-foreground font-bold">Total</p>
                      <p className="font-mono font-bold text-lg text-primary">L{(formDetalles.reduce((a, b) => a + b.subtotal, 0) * 1.15).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </FormDialog>
    </div>
  );
}
