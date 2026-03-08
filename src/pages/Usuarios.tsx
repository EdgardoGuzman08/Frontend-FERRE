import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, ShieldCheck, UserPlus } from "lucide-react";
import DataTable, { Column } from "@/components/shared/DataTable";
import PageHeader from "@/components/shared/PageHeader";
import FormDialog from "@/components/shared/FormDialog";
import { mockUsers, mockRoles, User, Role } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

const estadoBadge = (estado: string) => {
  const map: Record<string, string> = {
    activo: "bg-success/15 text-success border-success/30",
    inactivo: "bg-muted text-muted-foreground border-border",
    bloqueado: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={map[estado] || ""}>{estado}</Badge>;
};

export default function UsuariosPage() {
  const [activeTab, setActiveTab] = useTabFromUrl("/usuarios", "usuarios", ["usuarios", "roles"]);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles] = useState<Role[]>(mockRoles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState<{ nombre: string; email: string; rol: string; sucursal: string; estado: "activo" | "inactivo" | "bloqueado" }>({ nombre: "", email: "", rol: "", sucursal: "Central", estado: "activo" });

  const openNew = () => {
    setEditingUser(null);
    setForm({ nombre: "", email: "", rol: "", sucursal: "Central", estado: "activo" });
    setDialogOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol, sucursal: u.sucursal, estado: u.estado });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.email || !form.rol) {
      toast({ title: "Error", description: "Complete todos los campos obligatorios", variant: "destructive" });
      return;
    }
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
      toast({ title: "Usuario actualizado" });
    } else {
      const newUser: User = { id: `U${String(users.length + 1).padStart(3, "0")}`, ...form, ultimoAcceso: "—" };
      setUsers([...users, newUser]);
      toast({ title: "Usuario creado" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (u: User) => {
    setUsers(users.filter(x => x.id !== u.id));
    toast({ title: "Usuario eliminado", description: u.nombre });
  };

  const userColumns: Column<User>[] = [
    { key: "id", label: "ID", className: "w-[70px] font-mono text-xs" },
    { key: "nombre", label: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: "email", label: "Email", className: "text-muted-foreground" },
    { key: "rol", label: "Rol", render: (r) => <Badge variant="secondary">{r.rol}</Badge> },
    { key: "sucursal", label: "Sucursal" },
    { key: "estado", label: "Estado", render: (r) => estadoBadge(r.estado) },
    { key: "ultimoAcceso", label: "Último acceso", className: "text-xs text-muted-foreground" },
  ];

  const roleColumns: Column<Role>[] = [
    { key: "id", label: "ID", className: "w-[60px] font-mono text-xs" },
    { key: "nombre", label: "Rol", render: (r) => <span className="font-semibold">{r.nombre}</span> },
    { key: "descripcion", label: "Descripción" },
    { key: "usuarios", label: "Usuarios", render: (r) => <Badge variant="outline">{r.usuarios}</Badge> },
    { key: "permisos", label: "Permisos", render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.permisos.slice(0, 3).map(p => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
        {r.permisos.length > 3 && <Badge variant="outline" className="text-[10px]">+{r.permisos.length - 3}</Badge>}
      </div>
    )},
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <PageHeader title="Usuarios & Roles" subtitle="Gestión de accesos, roles y permisos del sistema" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permisos</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-4">
          <DataTable
            columns={userColumns}
            data={users}
            searchPlaceholder="Buscar usuario..."
            searchKey="nombre"
            onAdd={openNew}
            addLabel="Nuevo Usuario"
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <DataTable
            columns={roleColumns}
            data={roles}
            searchPlaceholder="Buscar rol..."
            searchKey="nombre"
            onAdd={() => setRoleDialogOpen(true)}
            addLabel="Nuevo Rol"
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingUser ? "Editar Usuario" : "Nuevo Usuario"} onSubmit={handleSave}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre completo *</Label>
              <Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select value={form.rol} onValueChange={v => setForm({ ...form, rol: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.id} value={r.nombre}>{r.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select value={form.sucursal} onValueChange={v => setForm({ ...form, sucursal: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                  <SelectItem value="Sucursal Sur">Sucursal Sur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </FormDialog>

      {/* Role Dialog placeholder */}
      <FormDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} title="Nuevo Rol" onSubmit={() => { setRoleDialogOpen(false); toast({ title: "Rol creado (mock)" }); }}>
        <div className="space-y-2">
          <Label>Nombre del rol</Label>
          <Input placeholder="Ej: Supervisor" />
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Input placeholder="Descripción del rol" />
        </div>
      </FormDialog>
    </div>
  );
}
