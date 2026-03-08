import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import FormDialog from "@/components/shared/FormDialog";
import { mockArticulos, Articulo } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

export default function ArticulosTab() {
  const [data, setData] = useState<Articulo[]>(mockArticulos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Articulo | null>(null);
  const [form, setForm] = useState({ sku: "", nombre: "", categoria: "", marca: "", unidad: "UND", precioCompra: 0, precioVenta: 0, minimo: 0, maximo: 0, ubicacion: "" });

  const openNew = () => { setEditing(null); setForm({ sku: "", nombre: "", categoria: "", marca: "", unidad: "UND", precioCompra: 0, precioVenta: 0, minimo: 0, maximo: 0, ubicacion: "" }); setDialogOpen(true); };
  const openEdit = (a: Articulo) => { setEditing(a); setForm({ sku: a.sku, nombre: a.nombre, categoria: a.categoria, marca: a.marca, unidad: a.unidad, precioCompra: a.precioCompra, precioVenta: a.precioVenta, minimo: a.minimo, maximo: a.maximo, ubicacion: a.ubicacion }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.sku || !form.nombre) { toast({ title: "Error", description: "SKU y nombre son obligatorios", variant: "destructive" }); return; }
    if (editing) {
      setData(data.map(a => a.id === editing.id ? { ...a, ...form } : a));
      toast({ title: "Artículo actualizado" });
    } else {
      setData([...data, { id: `A${String(data.length + 1).padStart(3, "0")}`, ...form, stock: 0, estado: "activo" }]);
      toast({ title: "Artículo creado" });
    }
    setDialogOpen(false);
  };

  const stockBadge = (a: Articulo) => {
    if (a.stock <= a.minimo) return <span className="flex items-center gap-1 text-destructive font-mono text-sm"><AlertTriangle className="w-3 h-3" />{a.stock}</span>;
    if (a.stock >= a.maximo) return <span className="text-warning font-mono text-sm">{a.stock}</span>;
    return <span className="font-mono text-sm">{a.stock}</span>;
  };

  const columns: Column<Articulo>[] = [
    { key: "sku", label: "SKU", className: "font-mono text-xs w-[90px]" },
    { key: "nombre", label: "Artículo", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "categoria", label: "Categoría", render: (r) => <Badge variant="secondary">{r.categoria}</Badge> },
    { key: "marca", label: "Marca" },
    { key: "unidad", label: "Und", className: "w-[50px]" },

    { key: "precioCompra", label: "P. Compra", render: (r) => <span className="font-mono">L{r.precioCompra.toFixed(2)}</span> },
    { key: "precioVenta", label: "P. Venta", render: (r) => <span className="font-mono font-semibold">L{r.precioVenta.toFixed(2)}</span> },
    { key: "precioCompra", label: "P. Compra", render: (r) => <span className="font-mono">${r.precioCompra.toFixed(2)}</span> },
    { key: "precioVenta", label: "P. Venta", render: (r) => <span className="font-mono font-semibold">${r.precioVenta.toFixed(2)}</span> },

    { key: "precioCompra", label: "P. Compra", render: (r) => <span className="font-mono">L{r.precioCompra.toFixed(2)}</span> },
    { key: "precioVenta", label: "P. Venta", render: (r) => <span className="font-mono font-semibold">L{r.precioVenta.toFixed(2)}</span> },
    { key: "stock", label: "Stock", render: (r) => stockBadge(r) },
    { key: "ubicacion", label: "Ubic.", className: "font-mono text-xs" },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Buscar artículo..." searchKey="nombre" onAdd={openNew} addLabel="Nuevo Artículo"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}><Edit className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setData(data.filter(a => a.id !== row.id)); toast({ title: "Eliminado" }); }}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Editar Artículo" : "Nuevo Artículo"} onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>SKU *</Label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="HER-001" /></div>
          <div className="space-y-2"><Label>Nombre *</Label><Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
          <div className="space-y-2"><Label>Categoría</Label><Input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} /></div>
          <div className="space-y-2"><Label>Marca</Label><Input value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} /></div>
          <div className="space-y-2"><Label>Unidad</Label>
            <Select value={form.unidad} onValueChange={v => setForm({ ...form, unidad: v })}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="UND">UND</SelectItem><SelectItem value="MTS">MTS</SelectItem><SelectItem value="GAL">GAL</SelectItem><SelectItem value="KG">KG</SelectItem><SelectItem value="CJA">CJA</SelectItem><SelectItem value="PAR">PAR</SelectItem><SelectItem value="LTS">LTS</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Ubicación</Label><Input value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} placeholder="A-01-03" /></div>
          <div className="space-y-2"><Label>Precio Compra</Label><Input type="number" step="0.01" value={form.precioCompra} onChange={e => setForm({ ...form, precioCompra: Number(e.target.value) })} /></div>
          <div className="space-y-2"><Label>Precio Venta</Label><Input type="number" step="0.01" value={form.precioVenta} onChange={e => setForm({ ...form, precioVenta: Number(e.target.value) })} /></div>
          <div className="space-y-2"><Label>Stock mínimo</Label><Input type="number" value={form.minimo} onChange={e => setForm({ ...form, minimo: Number(e.target.value) })} /></div>
          <div className="space-y-2"><Label>Stock máximo</Label><Input type="number" value={form.maximo} onChange={e => setForm({ ...form, maximo: Number(e.target.value) })} /></div>
        </div>
      </FormDialog>
    </>
  );
}
