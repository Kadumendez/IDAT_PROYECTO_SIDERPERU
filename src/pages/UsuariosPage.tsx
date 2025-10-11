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
import { Search, UserPlus, Users, Shield, Building2, Trash2, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data - Usuarios
const MOCK_USERS = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    tipo: 'Admin SiderPerú',
    email: 'cmendoza@siderperu.com',
    empresa: 'SiderPerú',
    role: 'admin',
    zonas: ['Laminados', 'Fundición'],
  },
  {
    id: 2,
    nombre: 'María Torres',
    tipo: 'Usuario SiderPerú',
    email: 'mtorres@siderperu.com',
    empresa: 'SiderPerú',
    role: 'user',
    zonas: ['Galvanizado'],
  },
  {
    id: 3,
    nombre: 'Juan Pérez',
    tipo: 'Usuario SiderPerú',
    email: 'jperez@siderperu.com',
    empresa: 'SiderPerú',
    role: 'user',
    zonas: ['Fundición'],
  },
  {
    id: 4,
    nombre: 'Roberto Sánchez',
    tipo: 'Usuario Tercero',
    email: 'rsanchez@constructoraabc.com',
    empresa: 'Constructora ABC',
    role: 'third-party',
    zonas: [],
  },
  {
    id: 5,
    nombre: 'Ana López',
    tipo: 'Usuario Tercero',
    email: 'alopez@ingenieriaxyz.com',
    empresa: 'Ingeniería XYZ',
    role: 'third-party',
    zonas: [],
  },
];

// Mock planos disponibles
const AVAILABLE_PLANOS = [
  { id: 1, codigo: 'PL-0001', nombre: 'Planta General Acería', zona: 'Laminados' },
  { id: 2, codigo: 'PL-0002', nombre: 'Circuito Refrigeración Horno', zona: 'Fundición' },
  { id: 3, codigo: 'PL-0003', nombre: 'Sistema Transportador Materias Primas', zona: 'Galvanizado' },
  { id: 4, codigo: 'PL-0004', nombre: 'Distribución Eléctrica Planta', zona: 'Laminados' },
  { id: 5, codigo: 'PL-0005', nombre: 'Red Contraincendios Principal', zona: 'Fundición' },
];

export const UsuariosPage = () => {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [selectedPlanos, setSelectedPlanos] = useState<number[]>([]);
  
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
    if (selectedPlanos.length === AVAILABLE_PLANOS.length) {
      setSelectedPlanos([]);
    } else {
      setSelectedPlanos(AVAILABLE_PLANOS.map(p => p.id));
    }
  };

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
              <label className="text-sm font-medium text-foreground mb-2 block">
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
              <label className="text-sm font-medium text-foreground mb-2 block">
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
              <label className="text-sm font-medium text-foreground mb-2 block">
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
                    {user.tipo.split(' ')[0]}
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
                <Select value={newUserData.trabajador} onValueChange={(value) => setNewUserData({...newUserData, trabajador: value})}>
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
                  <Select value={newUserData.empresa} onValueChange={(value) => setNewUserData({...newUserData, empresa: value})}>
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
                    onChange={(e) => setNewUserData({...newUserData, nombre: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label className="text-foreground">Email</Label>
                  <Input 
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
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
              <Button onClick={() => setShowCreateUserModal(false)}>
                Crear Usuario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestionar Permisos - {selectedUser?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium text-foreground">Usuario: {selectedUser?.nombre}</p>
              <p className="text-sm text-muted-foreground">Empresa: {selectedUser?.empresa}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <span className="font-medium text-foreground">Seleccionar todos los planos</span>
              <Checkbox 
                checked={selectedPlanos.length === AVAILABLE_PLANOS.length}
                onCheckedChange={handleSelectAll}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base text-foreground">Planos Disponibles</Label>
              <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                {AVAILABLE_PLANOS.map((plano) => (
                  <div key={plano.id} className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{plano.codigo} - {plano.nombre}</p>
                        <p className="text-sm text-muted-foreground">Zona: {plano.zona}</p>
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
            
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowPermissionsModal(false)}>
                Guardar Permisos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
