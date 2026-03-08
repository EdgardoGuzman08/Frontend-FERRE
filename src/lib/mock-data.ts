// ── USUARIOS ──
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  sucursal: string;
  estado: "activo" | "inactivo" | "bloqueado";
  ultimoAcceso: string;
}

export const mockUsers: User[] = [
  { id: "U001", nombre: "Carlos Méndez", email: "carlos@ferretaller.com", rol: "Administrador", sucursal: "Central", estado: "activo", ultimoAcceso: "2026-02-28 14:30" },
  { id: "U002", nombre: "María López", email: "maria@ferretaller.com", rol: "Cajero", sucursal: "Central", estado: "activo", ultimoAcceso: "2026-02-28 09:15" },
  { id: "U003", nombre: "Pedro Ruiz", email: "pedro@ferretaller.com", rol: "Vendedor", sucursal: "Sucursal Norte", estado: "activo", ultimoAcceso: "2026-02-27 16:45" },
  { id: "U004", nombre: "Ana Torres", email: "ana@ferretaller.com", rol: "Jefe de Taller", sucursal: "Central", estado: "activo", ultimoAcceso: "2026-02-28 11:20" },
  { id: "U005", nombre: "Luis García", email: "luis@ferretaller.com", rol: "Mecánico", sucursal: "Central", estado: "inactivo", ultimoAcceso: "2026-02-15 08:00" },
  { id: "U006", nombre: "Rosa Martínez", email: "rosa@ferretaller.com", rol: "Compras", sucursal: "Central", estado: "activo", ultimoAcceso: "2026-02-28 10:00" },
  { id: "U007", nombre: "Diego Vargas", email: "diego@ferretaller.com", rol: "Auditor", sucursal: "Todas", estado: "activo", ultimoAcceso: "2026-02-26 13:30" },
  { id: "U008", nombre: "Sofía Castillo", email: "sofia@ferretaller.com", rol: "Vendedor", sucursal: "Sucursal Sur", estado: "bloqueado", ultimoAcceso: "2026-01-20 09:00" },
];

// ── VENDEDORES ──
export interface Vendedor {
  id: string;
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  zona: string;
  comision: number;         // porcentaje base (ej 0.05 = 5%)
  metaVentasMes: number;    // meta mensual en Lempiras
  estado: "activo" | "inactivo";
}

export const mockVendedores: Vendedor[] = [
  { id: "VEN-001", nombre: "Pedro Ruiz", dni: "0501-1985-12345", telefono: "9901-2345", email: "pedro@ferretaller.com", zona: "Zona Central", comision: 0.05, metaVentasMes: 80000, estado: "activo" },
  { id: "VEN-002", nombre: "Sofía Castillo", dni: "0801-1992-67890", telefono: "9912-3456", email: "sofia@ferretaller.com", zona: "Zona Sur", comision: 0.04, metaVentasMes: 60000, estado: "activo" },
  { id: "VEN-003", nombre: "Jorge Membreño", dni: "0101-1990-11223", telefono: "9823-4567", email: "jorge@ferretaller.com", zona: "Zona Norte", comision: 0.05, metaVentasMes: 70000, estado: "activo" },
  { id: "VEN-004", nombre: "Karla Paz", dni: "0601-1995-44556", telefono: "9734-5678", email: "karla@ferretaller.com", zona: "Zona Occidente", comision: 0.03, metaVentasMes: 50000, estado: "activo" },
  { id: "VEN-005", nombre: "Ricardo Zelaya", dni: "0301-1988-77889", telefono: "9645-6789", email: "rzelaya@ferretaller.com", zona: "Zona Oriente", comision: 0.06, metaVentasMes: 90000, estado: "activo" },
  { id: "VEN-006", nombre: "Mariela Flores", dni: "0701-1993-99001", telefono: "9556-7890", email: "mflores@ferretaller.com", zona: "Zona Central", comision: 0.04, metaVentasMes: 65000, estado: "inactivo" },
];

export interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  usuarios: number;
  permisos: string[];
}

export const mockRoles: Role[] = [
  { id: "R1", nombre: "Administrador", descripcion: "Acceso total al sistema", usuarios: 1, permisos: ["todos"] },
  { id: "R2", nombre: "Cajero", descripcion: "Gestión de caja y cobros", usuarios: 1, permisos: ["caja.ver", "caja.operar", "ventas.ver"] },
  { id: "R3", nombre: "Vendedor", descripcion: "Cotizaciones y facturación", usuarios: 2, permisos: ["ventas.ver", "ventas.crear", "ventas.editar", "inventario.ver", "clientes.ver"] },
  { id: "R4", nombre: "Jefe de Taller", descripcion: "Gestión completa del taller", usuarios: 1, permisos: ["taller.ver", "taller.crear", "taller.editar", "inventario.ver", "inventario.consumir"] },
  { id: "R5", nombre: "Mecánico", descripcion: "Ejecución de órdenes de trabajo", usuarios: 1, permisos: ["taller.ver", "taller.actualizar_estado"] },
  { id: "R6", nombre: "Compras", descripcion: "Gestión de compras y proveedores", usuarios: 1, permisos: ["compras.ver", "compras.crear", "compras.editar", "proveedores.ver", "inventario.ver"] },
  { id: "R7", nombre: "Auditor", descripcion: "Solo consulta y reportes", usuarios: 1, permisos: ["reportes.ver", "auditoria.ver"] },
];

// ── CLIENTES ──
export interface Cliente {
  id: string;
  nombre: string;
  tipo: "persona" | "empresa";
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  limiteCredito: number;
  saldo: number;
  estado: "activo" | "inactivo";
}

export const mockClientes: Cliente[] = [
  { id: "C001", nombre: "Ferretería El Progreso", tipo: "empresa", documento: "J-12345678-9", telefono: "0414-1234567", email: "contacto@elprogreso.com", direccion: "Av. Principal 123", limiteCredito: 50000, saldo: 12500, estado: "activo" },
  { id: "C002", nombre: "Juan Pérez", tipo: "persona", documento: "V-18765432", telefono: "0412-7654321", email: "juan@gmail.com", direccion: "Calle 5 #22", limiteCredito: 5000, saldo: 0, estado: "activo" },
  { id: "C003", nombre: "Constructora Andes C.A.", tipo: "empresa", documento: "J-30987654-1", telefono: "0416-5551234", email: "compras@andes.com", direccion: "Zona Industrial B", limiteCredito: 100000, saldo: 45000, estado: "activo" },
  { id: "C004", nombre: "María Rodríguez", tipo: "persona", documento: "V-20123456", telefono: "0424-9876543", email: "maria.r@hotmail.com", direccion: "Urb. Las Palmas", limiteCredito: 3000, saldo: 1500, estado: "activo" },
  { id: "C005", nombre: "Taller Mecánico San José", tipo: "empresa", documento: "J-41234567-0", telefono: "0414-3334455", email: "taller.sanjose@gmail.com", direccion: "Av. Bolívar 456", limiteCredito: 25000, saldo: 8000, estado: "inactivo" },
];

// ── PROVEEDORES ──
export interface Proveedor {
  id: string;
  nombre: string;
  rif: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  categoria: string;
  estado: "activo" | "inactivo";
}

export const mockProveedores: Proveedor[] = [
  { id: "P001", nombre: "Aceros del Norte C.A.", rif: "J-10001234-5", contacto: "Roberto Sánchez", telefono: "0212-5551234", email: "ventas@acerosnorte.com", direccion: "Zona Ind. Norte", categoria: "Materiales", estado: "activo" },
  { id: "P002", nombre: "Pinturas Nacional", rif: "J-20005678-3", contacto: "Laura Gómez", telefono: "0212-5559876", email: "pedidos@pinturasnac.com", direccion: "Av. Industrial 78", categoria: "Pinturas", estado: "activo" },
  { id: "P003", nombre: "Herramientas Pro", rif: "J-30009012-1", contacto: "Miguel Ángel", telefono: "0414-6667788", email: "info@herrapro.com", direccion: "CC Industrial Local 5", categoria: "Herramientas", estado: "activo" },
  { id: "P004", nombre: "Distribuidora Eléctrica", rif: "J-40003456-7", contacto: "Carmen Díaz", telefono: "0416-1112233", email: "ventas@distelec.com", direccion: "Calle 10 #45", categoria: "Eléctricos", estado: "activo" },
  { id: "P005", nombre: "Tornillos y Fijaciones S.A.", rif: "J-50007890-9", contacto: "Fernando Villa", telefono: "0412-4445566", email: "pedidos@tornifij.com", direccion: "Zona Ind. Sur", categoria: "Fijaciones", estado: "inactivo" },
];

// ── ARTÍCULOS ──
export interface Articulo {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  marca: string;
  unidad: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  minimo: number;
  maximo: number;
  ubicacion: string;
  estado: "activo" | "descontinuado";
}

export const mockArticulos: Articulo[] = [
  { id: "A001", sku: "HER-001", nombre: "Martillo de uña 16oz", categoria: "Herramientas", marca: "Stanley", unidad: "UND", precioCompra: 8.50, precioVenta: 14.99, stock: 45, minimo: 10, maximo: 100, ubicacion: "A-01-03", estado: "activo" },
  { id: "A002", sku: "HER-002", nombre: "Destornillador Phillips #2", categoria: "Herramientas", marca: "Stanley", unidad: "UND", precioCompra: 3.20, precioVenta: 5.99, stock: 78, minimo: 20, maximo: 150, ubicacion: "A-01-05", estado: "activo" },
  { id: "A003", sku: "PIN-001", nombre: "Pintura látex blanca 1gal", categoria: "Pinturas", marca: "Nacional", unidad: "GAL", precioCompra: 12.00, precioVenta: 19.99, stock: 30, minimo: 15, maximo: 80, ubicacion: "B-02-01", estado: "activo" },
  { id: "A004", sku: "ELE-001", nombre: "Cable THHN #12 AWG", categoria: "Eléctricos", marca: "Cabel", unidad: "MTS", precioCompra: 0.85, precioVenta: 1.50, stock: 500, minimo: 200, maximo: 2000, ubicacion: "C-01-01", estado: "activo" },
  { id: "A005", sku: "TOR-001", nombre: "Tornillo drywall 6x1\"", categoria: "Fijaciones", marca: "Fix", unidad: "CJA", precioCompra: 2.50, precioVenta: 4.99, stock: 120, minimo: 50, maximo: 300, ubicacion: "D-03-02", estado: "activo" },
  { id: "A006", sku: "PLO-001", nombre: "Tubo PVC 1/2\" x 3m", categoria: "Plomería", marca: "Pavco", unidad: "UND", precioCompra: 1.80, precioVenta: 3.49, stock: 8, minimo: 25, maximo: 100, ubicacion: "E-01-01", estado: "activo" },
  { id: "A007", sku: "HER-003", nombre: "Llave ajustable 10\"", categoria: "Herramientas", marca: "Bahco", unidad: "UND", precioCompra: 15.00, precioVenta: 24.99, stock: 12, minimo: 5, maximo: 40, ubicacion: "A-02-01", estado: "activo" },
  { id: "A008", sku: "SEG-001", nombre: "Guantes de nitrilo (par)", categoria: "Seguridad", marca: "3M", unidad: "PAR", precioCompra: 2.00, precioVenta: 3.99, stock: 200, minimo: 50, maximo: 500, ubicacion: "F-01-01", estado: "activo" },
  { id: "A009", sku: "PIN-002", nombre: "Brocha 4\" profesional", categoria: "Pinturas", marca: "Atlas", unidad: "UND", precioCompra: 4.50, precioVenta: 7.99, stock: 3, minimo: 10, maximo: 60, ubicacion: "B-01-03", estado: "activo" },
  { id: "A010", sku: "ELE-002", nombre: "Interruptor sencillo", categoria: "Eléctricos", marca: "Bticino", unidad: "UND", precioCompra: 2.80, precioVenta: 5.49, stock: 65, minimo: 20, maximo: 150, ubicacion: "C-02-04", estado: "activo" },
];

// ── INVENTARIO MOVIMIENTOS ──
export interface MovimientoInventario {
  id: string;
  fecha: string;
  tipo: "entrada" | "salida" | "ajuste" | "transferencia";
  articulo: string;
  sku: string;
  cantidad: number;
  costoUnitario: number;
  almacenOrigen?: string;
  almacenDestino?: string;
  referencia: string;
  usuario: string;
  nota?: string;
}

export const mockMovimientos: MovimientoInventario[] = [
  { id: "M001", fecha: "2026-02-28 14:30", tipo: "entrada", articulo: "Martillo de uña 16oz", sku: "HER-001", cantidad: 20, costoUnitario: 8.50, almacenDestino: "Central", referencia: "OC-0045", usuario: "Rosa Martínez" },
  { id: "M002", fecha: "2026-02-28 11:15", tipo: "salida", articulo: "Cable THHN #12 AWG", sku: "ELE-001", cantidad: 50, costoUnitario: 0.85, almacenOrigen: "Central", referencia: "FAC-1234", usuario: "Pedro Ruiz" },
  { id: "M003", fecha: "2026-02-27 16:00", tipo: "ajuste", articulo: "Tornillo drywall 6x1\"", sku: "TOR-001", cantidad: -5, costoUnitario: 2.50, almacenOrigen: "Central", referencia: "AJ-0012", usuario: "Carlos Méndez", nota: "Diferencia en conteo físico" },
  { id: "M004", fecha: "2026-02-27 09:30", tipo: "entrada", articulo: "Pintura látex blanca 1gal", sku: "PIN-001", cantidad: 15, costoUnitario: 12.00, almacenDestino: "Central", referencia: "OC-0044", usuario: "Rosa Martínez" },
  { id: "M005", fecha: "2026-02-26 14:00", tipo: "transferencia", articulo: "Destornillador Phillips #2", sku: "HER-002", cantidad: 10, costoUnitario: 3.20, almacenOrigen: "Central", almacenDestino: "Sucursal Norte", referencia: "TRA-0003", usuario: "Carlos Méndez" },
  { id: "M006", fecha: "2026-02-26 10:00", tipo: "salida", articulo: "Guantes de nitrilo (par)", sku: "SEG-001", cantidad: 30, costoUnitario: 2.00, almacenOrigen: "Central", referencia: "OT-0078", usuario: "Ana Torres", nota: "Consumo taller" },
  { id: "M007", fecha: "2026-02-25 15:30", tipo: "entrada", articulo: "Llave ajustable 10\"", sku: "HER-003", cantidad: 8, costoUnitario: 15.00, almacenDestino: "Central", referencia: "OC-0043", usuario: "Rosa Martínez" },
  { id: "M008", fecha: "2026-02-25 11:00", tipo: "salida", articulo: "Tubo PVC 1/2\" x 3m", sku: "PLO-001", cantidad: 12, costoUnitario: 1.80, almacenOrigen: "Central", referencia: "FAC-1230", usuario: "Pedro Ruiz" },
];

// ── DOCUMENTOS COMPARTIDOS ──
export interface DetalleDocumento {
  id: string;
  articuloId: string;
  sku: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// ── VENTAS (Órdenes) ──
export interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  clienteId: string;
  total: number;
  estado: "borrador" | "aprobada" | "facturada" | "anulada";
  vendedor: string;
  notas?: string;
  detalles: DetalleDocumento[];
}

export const mockVentas: Venta[] = [
  {
    id: "OV-0001", fecha: "2026-03-01 10:00", cliente: "Ferretería El Progreso", clienteId: "C001", total: 1500.00, estado: "aprobada", vendedor: "Pedro Ruiz", notas: "Entrega inmediata",
    detalles: [
      { id: "D1", articuloId: "A004", sku: "ELE-001", descripcion: "Cable THHN #12 AWG", cantidad: 1000, precioUnitario: 1.50, subtotal: 1500.00 }
    ]
  },
  {
    id: "OV-0002", fecha: "2026-03-01 11:30", cliente: "Constructora Andes C.A.", clienteId: "C003", total: 4200.50, estado: "aprobada", vendedor: "Sofía Castillo",
    detalles: [
      { id: "D2", articuloId: "A001", sku: "HER-001", descripcion: "Martillo de uña 16oz", cantidad: 100, precioUnitario: 14.99, subtotal: 1499.00 },
      { id: "D3", articuloId: "A007", sku: "HER-003", descripcion: "Llave ajustable 10\"", cantidad: 50, precioUnitario: 24.99, subtotal: 1249.50 },
      { id: "D4", articuloId: "A003", sku: "PIN-001", descripcion: "Pintura látex blanca 1gal", cantidad: 72, precioUnitario: 20.16, subtotal: 1452.00 }
    ]
  },
  {
    id: "OV-0003", fecha: "2026-02-28 14:15", cliente: "Juan Pérez", clienteId: "C002", total: 125.00, estado: "borrador", vendedor: "Pedro Ruiz",
    detalles: [
      { id: "D5", articuloId: "A002", sku: "HER-002", descripcion: "Destornillador Phillips #2", cantidad: 10, precioUnitario: 5.99, subtotal: 59.90 },
      { id: "D6", articuloId: "A006", sku: "PLO-001", descripcion: "Tubo PVC 1/2\" x 3m", cantidad: 18, precioUnitario: 3.61, subtotal: 65.10 }
    ]
  },
];

// ── ENTREGAS (Remitos/Despachos) ──
export interface Entrega {
  id: string;
  fecha: string;
  ventaId: string;
  cliente: string;
  estado: "pendiente" | "entregado" | "cancelado";
  repartidor?: string;
  notas?: string;
  detalles: DetalleDocumento[];
}

export const mockEntregas: Entrega[] = [
  {
    id: "ENT-0001", fecha: "2026-03-01 14:00", ventaId: "OV-0001", cliente: "Ferretería El Progreso", estado: "entregado", repartidor: "Juan Chofer",
    detalles: [
      { id: "D1", articuloId: "A004", sku: "ELE-001", descripcion: "Cable THHN #12 AWG", cantidad: 1000, precioUnitario: 1.50, subtotal: 1500.00 }
    ]
  },
  {
    id: "ENT-0002", fecha: "2026-03-02 09:00", ventaId: "OV-0002", cliente: "Constructora Andes C.A.", estado: "pendiente", notas: "Llamar antes de llegar",
    detalles: [
      { id: "D2", articuloId: "A001", sku: "HER-001", descripcion: "Martillo de uña 16oz", cantidad: 100, precioUnitario: 14.99, subtotal: 1499.00 },
      { id: "D3", articuloId: "A007", sku: "HER-003", descripcion: "Llave ajustable 10\"", cantidad: 50, precioUnitario: 24.99, subtotal: 1249.50 },
      { id: "D4", articuloId: "A003", sku: "PIN-001", descripcion: "Pintura látex blanca 1gal", cantidad: 72, precioUnitario: 20.16, subtotal: 1452.00 }
    ]
  },
];

// ── FACTURAS ──
export interface Factura {
  id: string;
  fechaEmision: string;
  cai: string;
  ventaId: string;
  numeroFactura: string;
  cliente: string;
  clienteId: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: "pendiente" | "pagada" | "vencida" | "anulada";
  fechaVencimiento: string;
  detalles: DetalleDocumento[];
}

export const mockFacturas: Factura[] = [
  {
    id: "FAC-1001", fechaEmision: "2026-03-01", cai: "1A2B3C-4D5E6F-7G8H9I", ventaId: "OV-0001", numeroFactura: "001-001-00001001", cliente: "Ferretería El Progreso", clienteId: "C001", subtotal: 1293.10, impuestos: 206.90, total: 1500.00, estado: "pendiente", fechaVencimiento: "2026-03-15",
    detalles: [
      { id: "D1", articuloId: "A004", sku: "ELE-001", descripcion: "Cable THHN #12 AWG", cantidad: 1000, precioUnitario: 1.50, subtotal: 1500.00 }
    ]
  },
  {
    id: "FAC-0999", fechaEmision: "2026-02-15", cai: "9Z8Y7X-6W5V4U-3T2S1R", ventaId: "OV-0000", numeroFactura: "001-001-00000999", cliente: "Constructora Andes C.A.", clienteId: "C003", subtotal: 3000.00, impuestos: 480.00, total: 3480.00, estado: "vencida", fechaVencimiento: "2026-02-28",
    detalles: [
      { id: "D99", articuloId: "A005", sku: "TOR-001", descripcion: "Tornillo drywall 6x1\"", cantidad: 600, precioUnitario: 4.00, subtotal: 2400.00 },
      { id: "D100", articuloId: "A008", sku: "SEG-001", descripcion: "Guantes de nitrilo (par)", cantidad: 270, precioUnitario: 4.00, subtotal: 1080.00 }
    ]
  },
];

// ── PAGOS ──
export interface Pago {
  id: string;
  fecha: string;
  facturaId: string;
  cliente: string;
  monto: number;
  metodo: "transferencia" | "efectivo" | "tarjeta" | "cheque";
  referencia: string;
  estado: "completado" | "pendiente" | "rechazado";
}

export const mockPagos: Pago[] = [
  { id: "PAG-0001", fecha: "2026-02-28 10:00", facturaId: "FAC-0950", cliente: "Juan Pérez", monto: 450.00, metodo: "tarjeta", referencia: "REF-9912", estado: "completado" },
  { id: "PAG-0002", fecha: "2026-03-01 09:00", facturaId: "FAC-0960", cliente: "Taller Mecánico San José", monto: 1200.00, metodo: "transferencia", referencia: "TRF-001122", estado: "pendiente" },
];

// ── COMPRAS (Solicitudes) ──
export interface SolicitudCompra {
  id: string;
  fecha: string;
  solicitante: string;
  departamento: string;
  estado: "borrador" | "pendiente" | "aprobada" | "rechazada";
  notas?: string;
  detalles: DetalleDocumento[];
}

export const mockSolicitudes: SolicitudCompra[] = [
  {
    id: "REQ-0001", fecha: "2026-03-01 08:00", solicitante: "Pedro Ruiz", departamento: "Ventas", estado: "aprobada", notas: "Reposición urgente para proyecto Andes",
    detalles: [
      { id: "D1", articuloId: "A004", sku: "ELE-001", descripcion: "Cable THHN #12 AWG", cantidad: 2000, precioUnitario: 0.85, subtotal: 1700.00 }
    ]
  },
  {
    id: "REQ-0002", fecha: "2026-03-01 09:30", solicitante: "Ana Torres", departamento: "Taller", estado: "pendiente",
    detalles: [
      { id: "D2", articuloId: "A008", sku: "SEG-001", descripcion: "Guantes de nitrilo (par)", cantidad: 50, precioUnitario: 2.00, subtotal: 100.00 }
    ]
  }
];

// ── COMPRAS (Órdenes) ──
export interface OrdenCompra {
  id: string;
  fecha: string;
  solicitudId?: string;
  proveedor: string;
  proveedorId: string;
  total: number;
  estado: "borrador" | "emitida" | "recibida_parcial" | "recibida" | "cancelada";
  comprador: string;
  notas?: string;
  detalles: DetalleDocumento[];
}

export const mockOrdenesCompra: OrdenCompra[] = [
  {
    id: "OC-0045", fecha: "2026-03-01 10:30", solicitudId: "REQ-0001", proveedor: "Distribuidora Eléctrica", proveedorId: "P004", total: 1955.00, estado: "emitida", comprador: "Rosa Martínez",
    detalles: [
      { id: "D1", articuloId: "A004", sku: "ELE-001", descripcion: "Cable THHN #12 AWG", cantidad: 2000, precioUnitario: 0.85, subtotal: 1700.00 }
    ]
  }
];

// ── COMPRAS (Recepciones/Pedidos) ──
export interface RecepcionCompra {
  id: string;
  fecha: string;
  ordenId: string;
  proveedor: string;
  estado: "pendiente" | "recibido" | "devuelto";
  recibidoPor?: string;
  notas?: string;
  detalles: DetalleDocumento[];
}

export const mockRecepciones: RecepcionCompra[] = [
  {
    id: "REC-0012", fecha: "2026-02-28 14:30", ordenId: "OC-0044", proveedor: "Pinturas Nacional", estado: "recibido", recibidoPor: "Rosa Martínez",
    detalles: [
      { id: "D4", articuloId: "A003", sku: "PIN-001", descripcion: "Pintura látex blanca 1gal", cantidad: 15, precioUnitario: 12.00, subtotal: 180.00 }
    ]
  }
];

// ── COMPRAS (Facturas de Proveedor) ──
export interface FacturaCompra {
  id: string;
  fechaEmision: string;
  cai: string;
  recepcionId: string;
  numeroFactura: string;
  proveedor: string;
  proveedorId: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: "pendiente" | "pagada" | "vencida" | "anulada";
  fechaVencimiento: string;
  detalles: DetalleDocumento[];
}

export const mockFacturasCompra: FacturaCompra[] = [
  {
    id: "FCP-0888", fechaEmision: "2026-02-28", cai: "PROV-123456", recepcionId: "REC-0012", numeroFactura: "001-001-00008888", proveedor: "Pinturas Nacional", proveedorId: "P002", subtotal: 180.00, impuestos: 27.00, total: 207.00, estado: "pendiente", fechaVencimiento: "2026-03-30",
    detalles: [
      { id: "D4", articuloId: "A003", sku: "PIN-001", descripcion: "Pintura látex blanca 1gal", cantidad: 15, precioUnitario: 12.00, subtotal: 180.00 }
    ]
  }
];

// ── COMPRAS (Pagos a Proveedor) ──
export interface PagoCompra {
  id: string;
  fecha: string;
  facturaId: string;
  proveedor: string;
  monto: number;
  metodo: "transferencia" | "efectivo" | "cheque";
  referencia: string;
  estado: "completado" | "pendiente" | "rechazado";
}

export const mockPagosCompra: PagoCompra[] = [
  { id: "PAG-C-001", fecha: "2026-02-25 09:00", facturaId: "FCP-0870", proveedor: "Aceros del Norte C.A.", monto: 1500.00, metodo: "transferencia", referencia: "TRF-009988", estado: "completado" }
];

// ── TALLER (Citas) ──
export interface Cita {
  id: string;
  fechaHora: string;
  cliente: string;
  clienteId: string;
  equipo: string;
  motivo: string;
  estado: "agendada" | "en_taller" | "cancelada" | "completada";
}

export const mockCitas: Cita[] = [
  { id: "CIT-0001", fechaHora: "2026-03-02 08:30", cliente: "Juan Pérez", clienteId: "C002", equipo: "Generador Honda EU2200i", motivo: "Mantenimiento preventivo, cambio de aceite", estado: "agendada" },
  { id: "CIT-0002", fechaHora: "2026-03-01 10:00", cliente: "Constructora Andes C.A.", clienteId: "C003", equipo: "Taladro Percutor DeWalt", motivo: "No enciende, saca chispas", estado: "en_taller" },
];

// ── TALLER (Órdenes de Trabajo) ──
export interface ServicioManoObra {
  id: string;
  descripcion: string;
  horas: number;
  tarifaHora: number;
  subtotal: number;
}

export interface OrdenTrabajo {
  id: string;
  fechaIngreso: string;
  citaId?: string;
  cliente: string;
  clienteId: string;
  equipo: string;
  problemaReportado: string;
  diagnostico?: string;
  tecnicoAsignado?: string;
  estado: "ingresado" | "en_diagnostico" | "esperando_repuestos" | "en_reparacion" | "listo" | "entregado" | "facturado";
  manoObra: ServicioManoObra[];
  repuestos: DetalleDocumento[];
  totalManoObra: number;
  totalRepuestos: number;
  subtotal: number;
  impuestos: number;
  total: number;
}

export const mockOTs: OrdenTrabajo[] = [
  {
    id: "OT-0001", fechaIngreso: "2026-03-01 10:15", citaId: "CIT-0002", cliente: "Constructora Andes C.A.", clienteId: "C003", equipo: "Taladro Percutor DeWalt", problemaReportado: "No enciende, saca chispas", diagnostico: "Carbones desgastados y limpieza general requerida", tecnicoAsignado: "Luis García", estado: "en_reparacion",
    manoObra: [
      { id: "MO1", descripcion: "Diagnóstico y cambio de carbones", horas: 1.5, tarifaHora: 250.00, subtotal: 375.00 }
    ],
    repuestos: [
      { id: "R1", articuloId: "A002", sku: "HER-002", descripcion: "Cable de repuesto 3m (Adaptado)", cantidad: 1, precioUnitario: 85.00, subtotal: 85.00 }
    ],
    totalManoObra: 375.00, totalRepuestos: 85.00, subtotal: 460.00, impuestos: 69.00, total: 529.00
  },
  {
    id: "OT-0002", fechaIngreso: "2026-02-28 09:00", cliente: "Ferretería El Progreso", clienteId: "C001", equipo: "Bomba de Agua 1HP", problemaReportado: "Fuga en el sello mecánico", diagnostico: "Sello roto, rodillos dañados", tecnicoAsignado: "Ana Torres", estado: "listo",
    manoObra: [
      { id: "MO2", descripcion: "Desarme, reemplazo de sello y pruebas", horas: 3, tarifaHora: 300.00, subtotal: 900.00 }
    ],
    repuestos: [
      { id: "R2", articuloId: "A006", sku: "PLO-001", descripcion: "Adaptador de bronce", cantidad: 2, precioUnitario: 45.00, subtotal: 90.00 }
    ],
    totalManoObra: 900.00, totalRepuestos: 90.00, subtotal: 990.00, impuestos: 148.50, total: 1138.50
  }
];

// ── TALLER (Garantías) ──
export interface Garantia {
  id: string;
  otId: string;
  cliente: string;
  equipo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: "activa" | "vencida" | "reclamada";
  descripcion: string;
}

export const mockGarantias: Garantia[] = [
  { id: "GAR-0001", otId: "OT-0002", cliente: "Ferretería El Progreso", equipo: "Bomba de Agua 1HP", fechaEmision: "2026-03-01", fechaVencimiento: "2026-06-01", estado: "activa", descripcion: "3 meses de garantía en mano de obra sobre cambio de sello mecánico." }
];

// ── CAJA / TESORERÍA ──
export interface MovimientoCaja {
  id: string;
  fecha: string;
  tipo: "ingreso" | "egreso";
  concepto: "venta" | "pago_proveedor" | "gasto_operativo" | "prestamo" | "cobro_credito" | "transferencia" | "otro";
  descripcion: string;
  monto: number;
  metodo: "efectivo" | "transferencia" | "tarjeta" | "cheque";
  referencia?: string;
  usuario: string;
  cuentaId?: string;
  nota?: string;
}

export const mockMovimientosCaja: MovimientoCaja[] = [
  { id: "MC-0001", fecha: "2026-03-07 08:05", tipo: "ingreso", concepto: "venta", descripcion: "Cobro Factura 001-001-00001001", monto: 1500.00, metodo: "efectivo", referencia: "FAC-1001", usuario: "María López" },
  { id: "MC-0002", fecha: "2026-03-07 09:30", tipo: "ingreso", concepto: "cobro_credito", descripcion: "Abono cuenta - Juan Pérez", monto: 450.00, metodo: "transferencia", referencia: "PAG-0001", usuario: "María López" },
  { id: "MC-0003", fecha: "2026-03-07 10:15", tipo: "egreso", concepto: "gasto_operativo", descripcion: "Pago servicio de limpieza", monto: 350.00, metodo: "efectivo", usuario: "Carlos Méndez", nota: "Empleada de limpieza quincenal" },
  { id: "MC-0004", fecha: "2026-03-07 11:00", tipo: "egreso", concepto: "pago_proveedor", descripcion: "Abono OC-0044 a Pinturas Nacional", monto: 207.00, metodo: "cheque", referencia: "FCP-0888", usuario: "Rosa Martínez" },
  { id: "MC-0005", fecha: "2026-03-07 11:45", tipo: "ingreso", concepto: "venta", descripcion: "Venta mostrador - efectivo", monto: 875.50, metodo: "tarjeta", usuario: "Pedro Ruiz" },
  { id: "MC-0006", fecha: "2026-03-07 12:30", tipo: "egreso", concepto: "gasto_operativo", descripcion: "Almuerzo reunión de directivos", monto: 620.00, metodo: "efectivo", usuario: "Carlos Méndez" },
  { id: "MC-0007", fecha: "2026-03-07 14:00", tipo: "ingreso", concepto: "cobro_credito", descripcion: "Pago Constructora Andes - parcial", monto: 5000.00, metodo: "transferencia", referencia: "TRF-003311", usuario: "María López" },
  { id: "MC-0008", fecha: "2026-03-07 15:30", tipo: "egreso", concepto: "gasto_operativo", descripcion: "Pago ENEE (energía eléctrica)", monto: 1850.00, metodo: "transferencia", usuario: "Carlos Méndez", nota: "Mes de febrero 2026" },
  { id: "MC-0009", fecha: "2026-03-06 09:00", tipo: "ingreso", concepto: "venta", descripcion: "Cobro Factura 001-001-00000999", monto: 3480.00, metodo: "cheque", referencia: "FAC-0999", usuario: "María López" },
  { id: "MC-0010", fecha: "2026-03-06 16:00", tipo: "egreso", concepto: "gasto_operativo", descripcion: "Compra suministros de oficina", monto: 280.00, metodo: "efectivo", usuario: "Rosa Martínez" },
];

export interface DenominacionArqueo {
  denominacion: number;
  tipo: "billete" | "moneda";
  cantidad: number;
  subtotal: number;
}

export interface ArqueoCaja {
  id: string;
  fecha: string;
  turno: "mañana" | "tarde" | "nocturno";
  cajero: string;
  saldoInicio: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoEsperado: number;
  saldoContado: number;
  diferencia: number;
  estado: "cuadrado" | "sobrante" | "faltante";
  denominaciones: DenominacionArqueo[];
  observaciones?: string;
}

export const mockArqueos: ArqueoCaja[] = [
  {
    id: "ARQ-0001", fecha: "2026-03-06 17:00", turno: "tarde", cajero: "María López",
    saldoInicio: 5000.00, totalIngresos: 9930.00, totalEgresos: 2130.00,
    saldoEsperado: 12800.00, saldoContado: 12750.00, diferencia: -50.00, estado: "faltante",
    denominaciones: [
      { denominacion: 500, tipo: "billete", cantidad: 20, subtotal: 10000 },
      { denominacion: 100, tipo: "billete", cantidad: 22, subtotal: 2200 },
      { denominacion: 50, tipo: "billete", cantidad: 8, subtotal: 400 },
      { denominacion: 20, tipo: "billete", cantidad: 5, subtotal: 100 },
      { denominacion: 10, tipo: "moneda", cantidad: 3, subtotal: 30 },
      { denominacion: 5, tipo: "moneda", cantidad: 4, subtotal: 20 },
    ],
    observaciones: "Diferencia de L50 pendiente de revisión."
  },
  {
    id: "ARQ-0002", fecha: "2026-03-05 17:00", turno: "tarde", cajero: "María López",
    saldoInicio: 3500.00, totalIngresos: 6250.00, totalEgresos: 1850.00,
    saldoEsperado: 7900.00, saldoContado: 7900.00, diferencia: 0, estado: "cuadrado",
    denominaciones: [
      { denominacion: 500, tipo: "billete", cantidad: 12, subtotal: 6000 },
      { denominacion: 200, tipo: "billete", cantidad: 6, subtotal: 1200 },
      { denominacion: 100, tipo: "billete", cantidad: 5, subtotal: 500 },
      { denominacion: 50, tipo: "billete", cantidad: 4, subtotal: 200 },
    ]
  }
];

export interface CuentaBancaria {
  id: string;
  banco: string;
  tipoCuenta: "corriente" | "ahorro" | "caja_chica";
  numeroCuenta: string;
  titular: string;
  moneda: "HNL" | "USD";
  saldo: number;
  ultimoMovimiento: string;
  estado: "activa" | "inactiva";
}

export const mockCuentasBancarias: CuentaBancaria[] = [
  { id: "CB-001", banco: "Banco Atlántida", tipoCuenta: "corriente", numeroCuenta: "4100-1234-5678", titular: "Ferretaller S.A. de C.V.", moneda: "HNL", saldo: 125450.00, ultimoMovimiento: "2026-03-07", estado: "activa" },
  { id: "CB-002", banco: "Ficohsa", tipoCuenta: "ahorro", numeroCuenta: "2200-9876-5432", titular: "Ferretaller S.A. de C.V.", moneda: "HNL", saldo: 48200.00, ultimoMovimiento: "2026-03-05", estado: "activa" },
  { id: "CB-003", banco: "BAC Honduras", tipoCuenta: "corriente", numeroCuenta: "3300-1111-2222", titular: "Ferretaller S.A. de C.V.", moneda: "USD", saldo: 8500.00, ultimoMovimiento: "2026-03-01", estado: "activa" },
  { id: "CB-004", banco: "Banpaís", tipoCuenta: "caja_chica", numeroCuenta: "N/A (Físico)", titular: "Caja Central", moneda: "HNL", saldo: 12750.00, ultimoMovimiento: "2026-03-07", estado: "activa" },
];

export interface TransferenciaFondo {
  id: string;
  fecha: string;
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  concepto: string;
  referencia?: string;
  usuario: string;
  estado: "completada" | "pendiente" | "rechazada";
}

export const mockTransferencias: TransferenciaFondo[] = [
  { id: "TRF-F-001", fecha: "2026-03-07 13:00", cuentaOrigen: "Banpaís - Caja Central", cuentaDestino: "Banco Atlántida - Cta. Corriente", monto: 50000.00, concepto: "Depósito diario de recaudo", referencia: "DEP-007", usuario: "Carlos Méndez", estado: "completada" },
  { id: "TRF-F-002", fecha: "2026-03-05 15:30", cuentaOrigen: "Ficohsa - Ahorro", cuentaDestino: "BAC Honduras - USD", monto: 30000.00, concepto: "Compra divisas para importación", referencia: "DIV-002", usuario: "Carlos Méndez", estado: "completada" },
  { id: "TRF-F-003", fecha: "2026-03-08 09:00", cuentaOrigen: "Banco Atlántida - Cta. Corriente", cuentaDestino: "Banpaís - Caja Central", monto: 15000.00, concepto: "Fondo cambio semana", usuario: "Carlos Méndez", estado: "pendiente" },
];
=======
>>>>>>> 702f65514c79f94239f810c99219e4f5bdf7188f
