import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, RefreshCw, ArrowRightLeft, Package } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import PageHeader from "@/components/shared/PageHeader";
import FormDialog from "@/components/shared/FormDialog";
import { mockArticulos, mockMovimientos, Articulo, MovimientoInventario } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

const tipoIcon = (tipo: string) => {
  const map: Record<string, React.ReactNode> = {
    entrada: <ArrowDownCircle className="w-4 h-4 text-success" />,
    salida: <ArrowUpCircle className="w-4 h-4 text-destructive" />,
    ajuste: <RefreshCw className="w-4 h-4 text-warning" />,
    transferencia: <ArrowRightLeft className="w-4 h-4 text-primary" />,
  };
  return map[tipo] || null;
};

const tipoBadge = (tipo: string) => {
  const map: Record<string, string> = {
    entrada: "bg-success/15 text-success border-success/30",
    salida: "bg-destructive/15 text-destructive border-destructive/30",
    ajuste: "bg-warning/15 text-warning border-warning/30",
    transferencia: "bg-primary/15 text-primary border-primary/30",
  };
  return <Badge variant="outline" className={`${map[tipo] || ""} capitalize`}>{tipo}</Badge>;
};

export default function InventarioPage() {
  const [activeTab, setActiveTab] = useTabFromUrl("/inventario", "stock", ["stock", "movimientos", "bajo-minimo"]);
  const [movimientos] = useState<MovimientoInventario[]>(mockMovimientos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movForm, setMovForm] = useState({ tipo: "entrada", articulo: "", cantidad: 0, referencia: "", nota: "" });

  const bajosStock = mockArticulos.filter(a => a.stock <= a.minimo);

  const stockColumns: Column<Articulo>[] = [
    { key: "sku", label: "SKU", className: "font-mono text-xs w-[90px]" },
    { key: "nombre", label: "Artículo", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "categoria", label: "Categoría", render: (r) => <Badge variant="secondary">{r.categoria}</Badge> },
    {
      key: "stock", label: "Stock", render: (r) => {
        const bajo = r.stock <= r.minimo;
        return <span className={`font-mono font-semibold ${bajo ? "text-destructive" : ""}`}>{bajo && <AlertTriangle className="w-3 h-3 inline mr-1" />}{r.stock}</span>;
      }
    },
    { key: "minimo", label: "Mín", className: "font-mono text-xs text-muted-foreground" },
    { key: "maximo", label: "Máx", className: "font-mono text-xs text-muted-foreground" },
    { key: "precioCompra", label: "Costo", render: (r) => <span className="font-mono">L{r.precioCompra.toFixed(2)}</span> },
    { key: "valorizado", label: "Valorizado", render: (r) => <span className="font-mono font-semibold">L{(r.stock * r.precioCompra).toFixed(2)}</span> },
    { key: "stock", label: "Stock", render: (r) => {
      const bajo = r.stock <= r.minimo;
      return <span className={`font-mono font-semibold ${bajo ? "text-destructive" : ""}`}>{bajo && <AlertTriangle className="w-3 h-3 inline mr-1" />}{r.stock}</span>;
    }},
    { key: "minimo", label: "Mín", className: "font-mono text-xs text-muted-foreground" },
    { key: "maximo", label: "Máx", className: "font-mono text-xs text-muted-foreground" },
    { key: "precioCompra", label: "Costo", render: (r) => <span className="font-mono">${r.precioCompra.toFixed(2)}</span> },
    { key: "valorizado", label: "Valorizado", render: (r) => <span className="font-mono font-semibold">${(r.stock * r.precioCompra).toFixed(2)}</span> },

    { key: "ubicacion", label: "Ubic.", className: "font-mono text-xs" },
  ];

  const movColumns: Column<MovimientoInventario>[] = [
    { key: "fecha", label: "Fecha", className: "text-xs w-[140px]" },
    { key: "tipo", label: "Tipo", render: (r) => <div className="flex items-center gap-2">{tipoIcon(r.tipo)}{tipoBadge(r.tipo)}</div> },
    { key: "sku", label: "SKU", className: "font-mono text-xs" },
    { key: "articulo", label: "Artículo", render: (r) => <span className="font-medium">{r.articulo}</span> },
    { key: "cantidad", label: "Cant.", render: (r) => <span className={`font-mono font-semibold ${r.cantidad < 0 ? "text-destructive" : r.tipo === "salida" ? "text-destructive" : "text-success"}`}>{r.cantidad > 0 && r.tipo !== "salida" ? "+" : ""}{r.cantidad}</span> },
    { key: "costoUnitario", label: "C. Unit.", render: (r) => <span className="font-mono">L{r.costoUnitario.toFixed(2)}</span> },
    { key: "costoUnitario", label: "C. Unit.", render: (r) => <span className="font-mono">${r.costoUnitario.toFixed(2)}</span> },
    { key: "referencia", label: "Referencia", className: "font-mono text-xs" },
    { key: "usuario", label: "Usuario", className: "text-muted-foreground" },
  ];

  const handleNewMov = () => {
    toast({ title: "Movimiento registrado (mock)", description: `${movForm.tipo} - ${movForm.articulo}` });
    setDialogOpen(false);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <PageHeader title="Inventario" subtitle="Control de existencias, movimientos y kardex">
        {bajosStock.length > 0 && (
          <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30 gap-1">
            <AlertTriangle className="w-3 h-3" />{bajosStock.length} bajo mínimo
          </Badge>
        )}
      </PageHeader>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total artículos", value: mockArticulos.length, icon: Package },
          { label: "Bajo mínimo", value: bajosStock.length, icon: AlertTriangle, color: "text-destructive" },

          { label: "Valor total", value: `L${mockArticulos.reduce((s, a) => s + a.stock * a.precioCompra, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ArrowDownCircle },

          { label: "Valor total", value: `$${mockArticulos.reduce((s, a) => s + a.stock * a.precioCompra, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ArrowDownCircle },

          { label: "Valor total", value: `L${mockArticulos.reduce((s, a) => s + a.stock * a.precioCompra, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ArrowDownCircle },
          { label: "Movimientos hoy", value: mockMovimientos.filter(m => m.fecha.startsWith("2026-02-28")).length, icon: RefreshCw },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color || "text-primary"}`} /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className={`text-lg font-bold ${s.color || ""}`}>{s.value}</p></div>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stock">Existencias</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="bajo-minimo">Bajo Mínimo ({bajosStock.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="mt-4">

          <DataTable columns={stockColumns} data={mockArticulos} searchPlaceholder="Buscar artículo..." searchKey="nombre" onAdd={() => toast({ title: "Gestión de Artículos", description: "Para crear nuevos artículos base, diríjase al módulo de Maestros." })} addLabel="Nuevo Producto" />

          <DataTable columns={stockColumns} data={mockArticulos} searchPlaceholder="Buscar artículo..." searchKey="nombre" />

          <DataTable columns={stockColumns} data={mockArticulos} searchPlaceholder="Buscar artículo..." searchKey="nombre" onAdd={() => toast({ title: "Gestión de Artículos", description: "Para crear nuevos artículos base, diríjase al módulo de Maestros." })} addLabel="Nuevo Producto" />
        </TabsContent>

        <TabsContent value="movimientos" className="mt-4">
          <DataTable columns={movColumns} data={movimientos} searchPlaceholder="Buscar movimiento..." onAdd={() => setDialogOpen(true)} addLabel="Nuevo Movimiento" />
        </TabsContent>

        <TabsContent value="bajo-minimo" className="mt-4">
          <DataTable columns={stockColumns} data={bajosStock} searchPlaceholder="Buscar..." searchKey="nombre" />
        </TabsContent>
      </Tabs>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Nuevo Movimiento" onSubmit={handleNewMov}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Tipo *</Label>
            <Select value={movForm.tipo} onValueChange={v => setMovForm({ ...movForm, tipo: v })}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="salida">Salida</SelectItem><SelectItem value="ajuste">Ajuste</SelectItem><SelectItem value="transferencia">Transferencia</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Artículo *</Label>
            <Select value={movForm.articulo} onValueChange={v => setMovForm({ ...movForm, articulo: v })}><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>{mockArticulos.map(a => <SelectItem key={a.id} value={a.nombre}>{a.sku} - {a.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Cantidad *</Label><Input type="number" value={movForm.cantidad} onChange={e => setMovForm({ ...movForm, cantidad: Number(e.target.value) })} /></div>
          <div className="space-y-2"><Label>Referencia</Label><Input value={movForm.referencia} onChange={e => setMovForm({ ...movForm, referencia: e.target.value })} placeholder="OC-0045, FAC-1234..." /></div>
          <div className="col-span-2 space-y-2"><Label>Nota</Label><Input value={movForm.nota} onChange={e => setMovForm({ ...movForm, nota: e.target.value })} /></div>
        </div>
      </FormDialog>
    </div>
  );
}