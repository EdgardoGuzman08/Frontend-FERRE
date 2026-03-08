import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import ClientesTab from "./maestros/Clientes";
import ProveedoresTab from "./maestros/Proveedores";
import ArticulosTab from "./maestros/Articulos";
import VendedoresTab from "./maestros/Vendedores";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";

export default function MaestrosPage() {
  const [activeTab, setActiveTab] = useTabFromUrl("/maestros", "clientes", ["clientes", "proveedores", "articulos"]);

  return (
    <div className="flex-1 overflow-auto p-6">
      <PageHeader title="Datos Maestros" subtitle="Clientes, proveedores, vendedores y catálogo de artículos" />
      <Tabs defaultValue="clientes">
      <PageHeader title="Datos Maestros" subtitle="Clientes, proveedores y catálogo de artículos" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="articulos">Artículos</TabsTrigger>
          <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
        </TabsList>
        <TabsContent value="clientes" className="mt-4"><ClientesTab /></TabsContent>
        <TabsContent value="proveedores" className="mt-4"><ProveedoresTab /></TabsContent>
        <TabsContent value="articulos" className="mt-4"><ArticulosTab /></TabsContent>
        <TabsContent value="vendedores" className="mt-4"><VendedoresTab /></TabsContent>
      </Tabs>
    </div>
  );
}
