import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, TrendingUp } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import FormDialog from "@/components/shared/FormDialog";
import { mockVendedores, Vendedor } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const ZONAS = ["Zona Central", "Zona Norte", "Zona Sur", "Zona Oriente", "Zona Occidente", "Zona Atlántida", "Nacional"];

export default function VendedoresTab() {
    const [data, setData] = useState<Vendedor[]>(() => {
        const saved = localStorage.getItem("vendedores");
        return saved ? JSON.parse(saved) : mockVendedores;
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Vendedor | null>(null);
    const [form, setForm] = useState({
        nombre: "", dni: "", telefono: "", email: "",
        zona: "Zona Central", comision: 5, metaVentasMes: 60000,
    });

    const save = () => {
        const updated = [...data];
        if (!form.nombre || !form.dni) {
            toast({ title: "Error", description: "Nombre y DNI son obligatorios", variant: "destructive" });
            return;
        }
        if (editing) {
            const idx = updated.findIndex(v => v.id === editing.id);
            updated[idx] = { ...editing, ...form, comision: form.comision / 100 };
            toast({ title: "Vendedor actualizado" });
        } else {
            const newV: Vendedor = {
                id: `VEN-${String(data.length + 1).padStart(3, "0")}`,
                ...form,
                comision: form.comision / 100,
                estado: "activo",
            };
            updated.unshift(newV);
            toast({ title: "Vendedor creado", description: `${form.nombre} registrado con ${form.comision}% comisión` });
        }
        localStorage.setItem("vendedores", JSON.stringify(updated));
        setData(updated);
        setDialogOpen(false);
    };

    const openNew = () => {
        setEditing(null);
        setForm({ nombre: "", dni: "", telefono: "", email: "", zona: "Zona Central", comision: 5, metaVentasMes: 60000 });
        setDialogOpen(true);
    };
    const openEdit = (v: Vendedor) => {
        setEditing(v);
        setForm({ nombre: v.nombre, dni: v.dni, telefono: v.telefono, email: v.email, zona: v.zona, comision: v.comision * 100, metaVentasMes: v.metaVentasMes });
        setDialogOpen(true);
    };
    const remove = (id: string) => {
        const updated = data.filter(v => v.id !== id);
        localStorage.setItem("vendedores", JSON.stringify(updated));
        setData(updated);
        toast({ title: "Vendedor eliminado" });
    };

    const columns: Column<Vendedor>[] = [
        { key: "id", label: "ID", className: "font-mono text-xs w-[90px]" },
        {
            key: "nombre", label: "Vendedor", render: (r) => (
                <div>
                    <p className="font-semibold">{r.nombre}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{r.dni}</p>
                </div>
            )
        },
        { key: "zona", label: "Zona", render: (r) => <Badge variant="secondary" className="text-xs">{r.zona}</Badge> },
        { key: "telefono", label: "Teléfono", className: "text-sm" },
        { key: "email", label: "Email", className: "text-xs text-muted-foreground" },
        {
            key: "comision", label: "% Comisión", render: (r) => (
                <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="font-mono font-bold text-success">{(r.comision * 100).toFixed(0)}%</span>
                </div>
            )
        },
        {
            key: "metaVentasMes", label: "Meta Mensual", render: (r) => (
                <span className="font-mono text-sm text-primary">L{r.metaVentasMes.toLocaleString("es-HN")}</span>
            )
        },
        {
            key: "estado", label: "Estado", render: (r) => (
                <Badge variant="outline" className={r.estado === "activo" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                    {r.estado}
                </Badge>
            )
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Buscar vendedor..."
                searchKey="nombre"
                onAdd={openNew}
                addLabel="Nuevo Vendedor"
                actions={(row) => (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(row.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            />

            <FormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={editing ? "Editar Vendedor" : "Nuevo Vendedor"}
                onSubmit={save}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                        <Label>Nombre Completo *</Label>
                        <Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Pedro Ruiz" />
                    </div>
                    <div className="space-y-2">
                        <Label>DNI *</Label>
                        <Input value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} placeholder="0501-1985-XXXXX" className="font-mono text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label>Zona / Territorio</Label>
                        <Select value={form.zona} onValueChange={v => setForm({ ...form, zona: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {ZONAS.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="9901-2345" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="vendedor@empresa.com" />
                    </div>
                    <div className="space-y-2">
                        <Label>% Comisión sobre Venta</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number" min={0} max={30} step={0.5}
                                value={form.comision}
                                onChange={e => setForm({ ...form, comision: Number(e.target.value) })}
                                className="font-mono font-bold text-success"
                            />
                            <span className="text-muted-foreground">%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Meta Mensual (L)</Label>
                        <Input
                            type="number" min={0} step={1000}
                            value={form.metaVentasMes}
                            onChange={e => setForm({ ...form, metaVentasMes: Number(e.target.value) })}
                            className="font-mono"
                        />
                    </div>
                </div>
            </FormDialog>
        </>
    );
}
