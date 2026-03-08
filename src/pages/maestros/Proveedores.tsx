import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import FormDialog from "@/components/shared/FormDialog";
import { mockProveedores, Proveedor } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

export default function ProveedoresTab() {
  const [data, setData] = useState<Proveedor[]>(mockProveedores);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [form, setForm] = useState({ nombre: "", rif: "", contacto: "", telefono: "", email: "", direccion: "", categoria: "" });

  const openNew = () => { setEditing(null); setForm({ nombre: "", rif: "", contacto: "", telefono: "", email: "", direccion: "", categoria: "" }); setDialogOpen(true); };
  const openEdit = (p: Proveedor) => { setEditing(p); setForm({ nombre: p.nombre, rif: p.rif, contacto: p.contacto, telefono: p.telefono, email: p.email, direccion: p.direccion, categoria: p.categoria }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.nombre || !form.rif) { toast({ title: "Error", description: "Nombre y RIF son obligatorios", variant: "destructive" }); return; }
    if (editing) {
      setData(data.map(p => p.id === editing.id ? { ...p, ...form } : p));
      toast({ title: "Proveedor actualizado" });
    } else {
      setData([...data, { id: `P${String(data.length + 1).padStart(3, "0")}`, ...form, estado: "activo" }]);
      toast({ title: "Proveedor creado" });
    }
    setDialogOpen(false);
  };

  const columns: Column<Proveedor>[] = [
    { key: "id", label: "ID", className: "w-[70px] font-mono text-xs" },
    { key: "nombre", label: "Razón Social", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "rif", label: "RIF", className: "font-mono text-xs" },
    { key: "contacto", label: "Contacto" },
    { key: "telefono", label: "Teléfono" },
    { key: "categoria", label: "Categoría", render: (r) => <Badge variant="secondary">{r.categoria}</Badge> },
    { key: "estado", label: "Estado", render: (r) => <Badge variant="outline" className={r.estado === "activo" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>{r.estado}</Badge> },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Buscar proveedor..." searchKey="nombre" onAdd={openNew} addLabel="Nuevo Proveedor"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}><Edit className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setData(data.filter(p => p.id !== row.id)); toast({ title: "Eliminado" }); }}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Editar Proveedor" : "Nuevo Proveedor"} onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Razón Social *</Label><Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
          <div className="space-y-2"><Label>RIF *</Label><Input value={form.rif} onChange={e => setForm({ ...form, rif: e.target.value })} /></div>
          <div className="space-y-2"><Label>Persona de contacto</Label><Input value={form.contacto} onChange={e => setForm({ ...form, contacto: e.target.value })} /></div>
          <div className="space-y-2"><Label>Teléfono</Label><Input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Categoría</Label><Input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} placeholder="Ej: Herramientas" /></div>
          <div className="col-span-2 space-y-2"><Label>Dirección</Label><Input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} /></div>
        </div>
      </FormDialog>
    </>
  );
}
