import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import FormDialog from "@/components/shared/FormDialog";
import { mockClientes, Cliente } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

export default function ClientesTab() {
  const [data, setData] = useState<Cliente[]>(mockClientes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nombre: "", tipo: "persona" as "persona" | "empresa", documento: "", telefono: "", email: "", direccion: "", limiteCredito: 0 });

  const openNew = () => { setEditing(null); setForm({ nombre: "", tipo: "persona", documento: "", telefono: "", email: "", direccion: "", limiteCredito: 0 }); setDialogOpen(true); };
  const openEdit = (c: Cliente) => { setEditing(c); setForm({ nombre: c.nombre, tipo: c.tipo, documento: c.documento, telefono: c.telefono, email: c.email, direccion: c.direccion, limiteCredito: c.limiteCredito }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.nombre || !form.documento) { toast({ title: "Error", description: "Nombre y documento son obligatorios", variant: "destructive" }); return; }
    if (editing) {
      setData(data.map(c => c.id === editing.id ? { ...c, ...form } : c));
      toast({ title: "Cliente actualizado" });
    } else {
      setData([...data, { id: `C${String(data.length + 1).padStart(3, "0")}`, ...form, saldo: 0, estado: "activo" }]);
      toast({ title: "Cliente creado" });
    }
    setDialogOpen(false);
  };

  const columns: Column<Cliente>[] = [
    { key: "id", label: "ID", className: "w-[70px] font-mono text-xs" },
    { key: "nombre", label: "Nombre / Razón Social", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "tipo", label: "Tipo", render: (r) => <Badge variant="secondary" className="capitalize">{r.tipo}</Badge> },
    { key: "documento", label: "Documento", className: "font-mono text-xs" },
    { key: "telefono", label: "Teléfono" },

    { key: "limiteCredito", label: "Límite Cr.", render: (r) => <span className="font-mono">L{r.limiteCredito.toLocaleString()}</span> },
    { key: "saldo", label: "Saldo", render: (r) => <span className={`font-mono ${r.saldo > 0 ? "text-warning" : ""}`}>L{r.saldo.toLocaleString()}</span> },

    { key: "limiteCredito", label: "Límite Cr.", render: (r) => <span className="font-mono">${r.limiteCredito.toLocaleString()}</span> },
    { key: "saldo", label: "Saldo", render: (r) => <span className={`font-mono ${r.saldo > 0 ? "text-warning" : ""}`}>${r.saldo.toLocaleString()}</span> },

    { key: "limiteCredito", label: "Límite Cr.", render: (r) => <span className="font-mono">L{r.limiteCredito.toLocaleString()}</span> },
    { key: "saldo", label: "Saldo", render: (r) => <span className={`font-mono ${r.saldo > 0 ? "text-warning" : ""}`}>L{r.saldo.toLocaleString()}</span> },
    { key: "estado", label: "Estado", render: (r) => <Badge variant="outline" className={r.estado === "activo" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>{r.estado}</Badge> },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Buscar cliente..." searchKey="nombre" onAdd={openNew} addLabel="Nuevo Cliente"
        actions={(row) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}><Edit className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setData(data.filter(c => c.id !== row.id)); toast({ title: "Eliminado" }); }}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Editar Cliente" : "Nuevo Cliente"} onSubmit={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Nombre / Razón Social *</Label><Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
          <div className="space-y-2"><Label>Tipo</Label>
            <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="persona">Persona</SelectItem><SelectItem value="empresa">Empresa</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Documento *</Label><Input value={form.documento} onChange={e => setForm({ ...form, documento: e.target.value })} /></div>
          <div className="space-y-2"><Label>Teléfono</Label><Input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Límite crédito</Label><Input type="number" value={form.limiteCredito} onChange={e => setForm({ ...form, limiteCredito: Number(e.target.value) })} /></div>
          <div className="col-span-2 space-y-2"><Label>Dirección</Label><Input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} /></div>
        </div>
      </FormDialog>
    </>
  );
}
