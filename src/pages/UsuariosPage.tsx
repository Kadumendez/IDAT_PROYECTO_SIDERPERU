import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, UserPlus, Users, Shield, Building2, Trash2, CheckCircle, Download, Eye, Calendar as CalendarIcon, X, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { fetchUsuarios } from "@/components/supabase/users";
import { supabase } from '@/lib/supabaseClient'

const MOCK_USERS = await fetchUsuarios();


// Mock data - Usuarios

//const MOCK_USERS = [
//  {
//    id: 1,
//    nombre: 'Carlos Mendoza',
//    tipo: 'Admin SiderPerú',
//    email: 'cmendoza@siderperu.com',
//    empresa: 'SiderPerú',
//    role: 'admin',
//    zonas: ['Laminados', 'Fundición'],
//  },
//  {
//    id: 2,
//    nombre: 'María Torres',
//    tipo: 'Usuario SiderPerú',
//    email: 'mtorres@siderperu.com',
//    empresa: 'SiderPerú',
//    role: 'user',
//    zonas: ['Galvanizado'],
//  },
//  {
//    id: 3,
//    nombre: 'Juan Pérez',
//    tipo: 'Usuario SiderPerú',
//    email: 'jperez@siderperu.com',
//    empresa: 'SiderPerú',
//    role: 'user',
//    zonas: ['Fundición'],
//  },
//  {
//    id: 4,
//    nombre: 'Roberto Sánchez',
//    tipo: 'Usuario Tercero',
//    email: 'rsanchez@constructoraabc.com',
//    empresa: 'Constructora ABC',
//    role: 'third-party',
//    zonas: [],
//  },
//  {
//    id: 5,
//    nombre: 'Ana López',
//    tipo: 'Usuario Tercero',
//    email: 'alopez@ingenieriaxyz.com',
//    empresa: 'Ingeniería XYZ',
//    role: 'third-party',
//    zonas: [],
//  },
//];

// Mock planos disponibles con permisos
const AVAILABLE_PLANOS = [
  {
    id: 1,
    codigo: 'PL-0001',
    nombre: 'Planta General Acería',
    empresaResponsable: 'Constructora ABC',
    zona: 'Laminados',
    subzona: 'Zona A',
    sistema: 'Estructuras',
    version: 3,
    estado: 'APROBADO',
    fechaCarga: '2025-01-15',
    hasPermission: true
  },
  {
    id: 2,
    codigo: 'PL-0002',
    nombre: 'Circuito Refrigeración Horno',
    empresaResponsable: 'Ingeniería XYZ',
    zona: 'Fundición',
    subzona: 'Zona B',
    sistema: 'Hidráulico',
    version: 2,
    estado: 'APROBADO',
    fechaCarga: '2025-01-10',
    hasPermission: true
  },
  {
    id: 3,
    codigo: 'PL-0003',
    nombre: 'Sistema Transportador Materias Primas',
    empresaResponsable: 'Grupo Industrial',
    zona: 'Galvanizado',
    subzona: 'Zona C',
    sistema: 'Eléctrico',
    version: 1,
    estado: 'PENDIENTE',
    fechaCarga: '2025-01-20',
    hasPermission: false
  },
  {
    id: 4,
    codigo: 'PL-0004',
    nombre: 'Distribución Eléctrica Planta',
    empresaResponsable: 'Constructora ABC',
    zona: 'Laminados',
    subzona: 'Zona A',
    sistema: 'Eléctrico',
    version: 4,
    estado: 'APROBADO',
    fechaCarga: '2025-01-12',
    hasPermission: false
  },
  {
    id: 5,
    codigo: 'PL-0005',
    nombre: 'Red Contraincendios Principal',
    empresaResponsable: 'Ingeniería XYZ',
    zona: 'Fundición',
    subzona: 'Zona B',
    sistema: 'Hidráulico',
    version: 2,
    estado: 'COMENTADO',
    fechaCarga: '2025-01-08',
    hasPermission: true
  },
];

// Helper functions para estados
const getStatusIcon = (estado: string) => {
  switch (estado) {
    case 'APROBADO':
      return <CheckCircle className="w-4 h-4" />;
    case 'PENDIENTE':
      return <Clock className="w-4 h-4" />;
    case 'COMENTADO':
      return <Eye className="w-4 h-4" />;
    default:
      return <X className="w-4 h-4" />;
  }
};

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'APROBADO':
      return 'bg-[#1a3a2a] border border-[#34d399] text-[#34d399]';
    case 'PENDIENTE':
      return 'bg-[#3a3a2a] border border-[#fbbf24] text-[#fbbf24]';
    case 'COMENTADO':
      return 'bg-[#2a3a4a] border border-[#60a5fa] text-[#60a5fa]';
    default:
      return 'bg-[#3a2a2a] border border-[#ef4444] text-[#ef4444]';
  }
};

export const UsuariosPage = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [selectedPlanos, setSelectedPlanos] = useState<number[]>([]);

  // Filters for permissions modal
  const [permSearchTerm, setPermSearchTerm] = useState("");
  const [permZonaFilter, setPermZonaFilter] = useState("");
  const [permSubzonaFilter, setPermSubzonaFilter] = useState("");
  const [permSistemaFilter, setPermSistemaFilter] = useState("");
  const [permEstadoFilter, setPermEstadoFilter] = useState("");
  const [permVersionFilter, setPermVersionFilter] = useState("");
  const [permDateFrom, setPermDateFrom] = useState<Date>();
  const [permDateTo, setPermDateTo] = useState<Date>();

  // Permission management states
  const [versionOption, setVersionOption] = useState<'todas' | 'especifica'>('todas');
  const [versionSpecType, setVersionSpecType] = useState<'actual' | 'historica'>('actual');
  const [versionesEspecificas, setVersionesEspecificas] = useState("");
  const [tiempoUnidad, setTiempoUnidad] = useState("meses");
  const [tiempoCantidad, setTiempoCantidad] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [empresaFilter, setEmpresaFilter] = useState("all");

  // Create user form
  const [userType, setUserType] = useState<'siderperu' | 'tercero'>('siderperu');
  const [newUserData, setNewUserData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    trabajador: '',
  });

  const getUserIcon = (tipo: string) => {
    if (tipo === 'Admin SiderPerú') return <Shield className="w-5 h-5" />;
    if (tipo === 'Usuario SiderPerú') return <Users className="w-5 h-5" />;
    return <Building2 className="w-5 h-5" />;
  };

  const getUserBadgeColor = (tipo: string) => {
    if (tipo === 'Admin SiderPerú') return 'bg-[#2a3a4a] border border-[#60a5fa] text-[#60a5fa]';
    if (tipo === 'Usuario SiderPerú') return 'bg-[#1a3a2a] border border-[#34d399] text-[#34d399]';
    return 'bg-[#3a3830] border border-[#fbbf24] text-[#fbbf24]';
  };

  const handleUserClick = (user: typeof MOCK_USERS[0]) => {
    if (user.role !== 'admin') {
      setSelectedUser(user);
      setSelectedPlanos([]);
      setShowPermissionsModal(true);
    }
  };

  const handleTogglePlano = (planoId: number) => {
    setSelectedPlanos(prev =>
      prev.includes(planoId)
        ? prev.filter(id => id !== planoId)
        : [...prev, planoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlanos.length === filteredPermPlanos.length) {
      setSelectedPlanos([]);
    } else {
      setSelectedPlanos(filteredPermPlanos.map(p => p.id));
    }
  };

  const clearPermFilters = () => {
    setPermSearchTerm("");
    setPermZonaFilter("");
    setPermSubzonaFilter("");
    setPermSistemaFilter("");
    setPermEstadoFilter("");
    setPermVersionFilter("");
    setPermDateFrom(undefined);
    setPermDateTo(undefined);
  };

  // Filter planos for permissions modal
  const filteredPermPlanos = AVAILABLE_PLANOS.filter((plano) => {
    const matchesSearch = permSearchTerm === "" ||
      plano.nombre.toLowerCase().includes(permSearchTerm.toLowerCase()) ||
      plano.codigo.toLowerCase().includes(permSearchTerm.toLowerCase());
    const matchesZona = !permZonaFilter || permZonaFilter === "all" || plano.zona === permZonaFilter;
    const matchesSubzona = !permSubzonaFilter || permSubzonaFilter === "all" || plano.subzona === permSubzonaFilter;
    const matchesSistema = !permSistemaFilter || permSistemaFilter === "all" || plano.sistema === permSistemaFilter;
    const matchesEstado = !permEstadoFilter || permEstadoFilter === "all" || plano.estado === permEstadoFilter;
    const matchesVersion = !permVersionFilter || permVersionFilter === "all" || String(plano.version) === permVersionFilter;

    let matchesDate = true;
    if (permDateFrom || permDateTo) {
      const planoDate = new Date(plano.fechaCarga);
      if (permDateFrom && planoDate < permDateFrom) matchesDate = false;
      if (permDateTo && planoDate > permDateTo) matchesDate = false;
    }

    return matchesSearch && matchesZona && matchesSubzona && matchesSistema && matchesEstado && matchesVersion && matchesDate;
  });

  // Filter users
  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch = searchTerm === "" ||
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFilter || tipoFilter === "all" || user.tipo === tipoFilter;
    const matchesEmpresa = !empresaFilter || empresaFilter === "all" || user.empresa === empresaFilter;

    return matchesSearch && matchesTipo && matchesEmpresa;
  });

  return (
    <DashboardLayout pageTitle="Usuarios y Roles">
      <div className="p-8 space-y-6">
        {/* Create User Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Gestión de Usuarios</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Administra usuarios de SiderPerú y empresas terceras
            </p>
          </div>
          <Button
            onClick={() => setShowCreateUserModal(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Crear Nuevo Usuario
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="text-sm font-medium text-white mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="col-span-3">
              <label className="text-sm font-medium text-white mb-2 block">
                Tipo de Usuario
              </label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Admin SiderPerú">Admin SiderPerú</SelectItem>
                  <SelectItem value="Usuario SiderPerú">Usuario SiderPerú</SelectItem>
                  <SelectItem value="Usuario Tercero">Usuario Tercero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <label className="text-sm font-medium text-white mb-2 block">
                Empresa
              </label>
              <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las empresas</SelectItem>
                  <SelectItem value="SiderPerú">SiderPerú</SelectItem>
                  <SelectItem value="Constructora ABC">Constructora ABC</SelectItem>
                  <SelectItem value="Ingeniería XYZ">Ingeniería XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTipoFilter("all");
                  setEmpresaFilter("all");
                }}
                className="w-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            Usuarios ({filteredUsers.length})
          </p>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={`${user.role === 'admin' ? 'opacity-75' : 'cursor-pointer hover:shadow-lg transition-all hover:border-primary'}`}
              onClick={() => handleUserClick(user)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getUserIcon(user.tipo)}
                      {user.nombre}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {user.email}
                    </CardDescription>
                  </div>
                  <Badge className={`${getUserBadgeColor(user.tipo)} flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs`}>
                    {user.tipo.includes('Admin') ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    {user.tipo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-foreground">
                  <strong className="font-semibold">Empresa:</strong> {user.empresa}
                </div>
                {user.zonas.length > 0 && (
                  <div className="text-sm text-foreground">
                    <strong className="font-semibold">Zonas:</strong> {user.zonas.join(', ')}
                  </div>
                )}
                {user.role !== 'admin' && (
                  <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                    Haz clic para gestionar permisos
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      <Dialog open={showCreateUserModal} onOpenChange={setShowCreateUserModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Tipo de Usuario</Label>
              <RadioGroup value={userType} onValueChange={(value: any) => setUserType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="siderperu" id="siderperu" />
                  <Label htmlFor="siderperu" className="cursor-pointer text-foreground">Usuario SiderPerú</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tercero" id="tercero" />
                  <Label htmlFor="tercero" className="cursor-pointer text-foreground">Usuario Tercero</Label>
                </div>
              </RadioGroup>
            </div>

            {userType === 'siderperu' ? (
              <div>
                <Label className="text-foreground">Seleccionar Trabajador</Label>
                <Select value={newUserData.trabajador} onValueChange={(value) => setNewUserData({ ...newUserData, trabajador: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar de lista..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Carlos Mendoza - Ing. Industrial</SelectItem>
                    <SelectItem value="2">María Torres - Ing. Eléctrica</SelectItem>
                    <SelectItem value="3">Juan Pérez - Ing. Mecánica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-foreground">Empresa</Label>
                  <Select value={newUserData.empresa} onValueChange={(value) => setNewUserData({ ...newUserData, empresa: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Constructora ABC">Constructora ABC</SelectItem>
                      <SelectItem value="Ingeniería XYZ">Ingeniería XYZ</SelectItem>
                      <SelectItem value="Grupo Industrial">Grupo Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Nombre Completo</Label>
                  <Input
                    placeholder="Ingrese nombre completo"
                    value={newUserData.nombre}
                    onChange={(e) => setNewUserData({ ...newUserData, nombre: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-foreground">Email</Label>
                  <Input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1 text-foreground">Notas importantes:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Usuarios SiderPerú pueden crear usuarios de otras empresas</li>
                <li>Requiere autorización del admin a cargo</li>
                <li>Usuarios terceros solo pueden visualizar nombres de planos</li>
                <li>No tienen acceso a descargas ni vista previa</li>
              </ul>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateUserModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  const { data, error } = await supabase
                    .from('usuario')
                    .insert([
                      {
                        nombre: newUserData.nombre,
                        email: newUserData.email,
                        empresa: newUserData.empresa,
                        role: newUserData.trabajador, // asegúrate que esta columna exista o cámbiala
                      },
                    ])
                    .select()

                  if (error) {
                    console.error('Error al crear usuario:', error.message)
                    return
                  }

                  console.log('✅ Usuario creado:', data)

                  // 🔹 Aquí cierras el modal correctamente:
                  setShowCreateUserModal(false)

                  await fetchUsuarios()


                }}
              >
                Crear Usuario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* Permissions Modal with Tabs */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Gestionar Permisos - {selectedUser?.nombre}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="activos" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activos">Permisos Activos</TabsTrigger>
              <TabsTrigger value="gestion">Gestión de Permisos</TabsTrigger>
            </TabsList>

            {/* Permisos Activos Tab */}
            <TabsContent value="activos" className="flex-1 overflow-y-auto space-y-4 mt-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground">Usuario: {selectedUser?.nombre}</p>
                <p className="text-sm text-muted-foreground">Empresa: {selectedUser?.empresa}</p>
              </div>

              {/* Filters */}
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Buscar plano..."
                        value={permSearchTerm}
                        onChange={(e) => setPermSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Zona
                    </label>
                    <Select value={permZonaFilter} onValueChange={setPermZonaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Laminados">Laminados</SelectItem>
                        <SelectItem value="Fundición">Fundición</SelectItem>
                        <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Subzona
                    </label>
                    <Select value={permSubzonaFilter} onValueChange={setPermSubzonaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Zona A">Zona A</SelectItem>
                        <SelectItem value="Zona B">Zona B</SelectItem>
                        <SelectItem value="Zona C">Zona C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Sistema
                    </label>
                    <Select value={permSistemaFilter} onValueChange={setPermSistemaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                        <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                        <SelectItem value="Estructuras">Estructuras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Estado
                    </label>
                    <Select value={permEstadoFilter} onValueChange={setPermEstadoFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="APROBADO">Aprobado</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="COMENTADO">Comentado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearPermFilters}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Versión
                    </label>
                    <Select value={permVersionFilter} onValueChange={setPermVersionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="1">v1</SelectItem>
                        <SelectItem value="2">v2</SelectItem>
                        <SelectItem value="3">v3</SelectItem>
                        <SelectItem value="4">v4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Fecha desde
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !permDateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {permDateFrom ? format(permDateFrom, "dd/MM/yyyy") : "Seleccionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={permDateFrom}
                          onSelect={setPermDateFrom}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-white mb-2 block">
                      Fecha hasta
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !permDateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {permDateTo ? format(permDateTo, "dd/MM/yyyy") : "Seleccionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={permDateTo}
                          onSelect={setPermDateTo}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Plano</TableHead>
                      <TableHead className="text-foreground">Empresa Responsable</TableHead>
                      <TableHead className="text-foreground">Zona</TableHead>
                      <TableHead className="text-foreground">Subzona</TableHead>
                      <TableHead className="text-foreground">Sistema</TableHead>
                      <TableHead className="text-foreground">Versión</TableHead>
                      <TableHead className="text-foreground">Estado</TableHead>
                      <TableHead className="text-foreground">Fecha de Carga</TableHead>
                      <TableHead className="text-foreground">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermPlanos.filter(p => p.hasPermission).map((plano) => (
                      <TableRow key={plano.id}>
                        <TableCell className="text-foreground">
                          <div>
                            <p className="font-medium">{plano.codigo}</p>
                            <p className="text-sm text-muted-foreground">{plano.nombre}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{plano.empresaResponsable}</TableCell>
                        <TableCell className="text-foreground">{plano.zona}</TableCell>
                        <TableCell className="text-foreground">{plano.subzona}</TableCell>
                        <TableCell className="text-foreground">{plano.sistema}</TableCell>
                        <TableCell className="text-foreground">v{plano.version}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(plano.estado)} flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs w-fit`}>
                            {getStatusIcon(plano.estado)}
                            {plano.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{plano.fechaCarga}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Gestión de Permisos Tab */}
            <TabsContent value="gestion" className="flex-1 overflow-y-auto space-y-4 mt-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground">Usuario: {selectedUser?.nombre}</p>
                <p className="text-sm text-muted-foreground">Empresa: {selectedUser?.empresa}</p>
              </div>

              {/* Same Filters */}
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Buscar plano..."
                        value={permSearchTerm}
                        onChange={(e) => setPermSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Zona
                    </label>
                    <Select value={permZonaFilter} onValueChange={setPermZonaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Laminados">Laminados</SelectItem>
                        <SelectItem value="Fundición">Fundición</SelectItem>
                        <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Subzona
                    </label>
                    <Select value={permSubzonaFilter} onValueChange={setPermSubzonaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Zona A">Zona A</SelectItem>
                        <SelectItem value="Zona B">Zona B</SelectItem>
                        <SelectItem value="Zona C">Zona C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Sistema
                    </label>
                    <Select value={permSistemaFilter} onValueChange={setPermSistemaFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                        <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                        <SelectItem value="Estructuras">Estructuras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Estado
                    </label>
                    <Select value={permEstadoFilter} onValueChange={setPermEstadoFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="APROBADO">Aprobado</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="COMENTADO">Comentado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearPermFilters}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Versión
                    </label>
                    <Select value={permVersionFilter} onValueChange={setPermVersionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="1">v1</SelectItem>
                        <SelectItem value="2">v2</SelectItem>
                        <SelectItem value="3">v3</SelectItem>
                        <SelectItem value="4">v4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Fecha desde
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !permDateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {permDateFrom ? format(permDateFrom, "dd/MM/yyyy") : "Seleccionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={permDateFrom}
                          onSelect={setPermDateFrom}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium text-black mb-2 block">
                      Fecha hasta
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !permDateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {permDateTo ? format(permDateTo, "dd/MM/yyyy") : "Seleccionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={permDateTo}
                          onSelect={setPermDateTo}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Planos Selection */}
              <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
                <span className="font-medium text-foreground">Seleccionar todos los planos</span>
                <Checkbox
                  checked={selectedPlanos.length === filteredPermPlanos.length}
                  onCheckedChange={handleSelectAll}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base text-foreground">Planos Disponibles</Label>
                <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
                  {filteredPermPlanos.map((plano) => (
                    <div key={plano.id} className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{plano.codigo} - {plano.nombre}</p>
                          <p className="text-sm text-muted-foreground">Zona: {plano.zona} | Sistema: {plano.sistema}</p>
                        </div>
                        <Checkbox
                          checked={selectedPlanos.includes(plano.id)}
                          onCheckedChange={() => handleTogglePlano(plano.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlanos.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{selectedPlanos.length} plano(s) seleccionado(s)</span>
                </div>
              )}

              {/* Versiones a Autorizar */}
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-base text-foreground">Versiones a autorizar:</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={versionOption === 'todas' ? 'default' : 'outline'}
                    onClick={() => setVersionOption('todas')}
                  >
                    Todas las versiones
                  </Button>
                  <Button
                    type="button"
                    variant={versionOption === 'especifica' ? 'default' : 'outline'}
                    onClick={() => setVersionOption('especifica')}
                  >
                    Especificar
                  </Button>
                </div>
                {versionOption === 'especifica' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={versionSpecType === 'actual' ? 'default' : 'outline'}
                        onClick={() => setVersionSpecType('actual')}
                        className="flex-1"
                      >
                        Actual
                      </Button>
                      <Button
                        type="button"
                        variant={versionSpecType === 'historica' ? 'default' : 'outline'}
                        onClick={() => setVersionSpecType('historica')}
                        className="flex-1"
                      >
                        Histórica
                      </Button>
                    </div>
                    <Input
                      placeholder="Ej: 1, 2, 3"
                      value={versionesEspecificas}
                      onChange={(e) => setVersionesEspecificas(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Tiempo de Acceso */}
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-base text-foreground">Tiempo de acceso:</Label>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground">Frecuencia:</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={tiempoUnidad} onValueChange={setTiempoUnidad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dias">Días</SelectItem>
                        <SelectItem value="meses">Meses</SelectItem>
                        <SelectItem value="años">Años</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={tiempoCantidad}
                      onChange={(e) => setTiempoCantidad(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowPermissionsModal(false)}>
                  Guardar
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
