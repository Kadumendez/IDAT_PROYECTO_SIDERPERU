import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileCheck, Building2, MapPin, Settings2, Trash2, FileEdit, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data - Planos pendientes de revisión
const PENDING_REVIEWS = [
  {
    id: 1,
    empresa: 'Constructora ABC',
    planos: [
      { id: 1, nombre: 'Planta General Acería', zona: 'Laminados', subzona: 'Zona A', sistema: 'Eléctrico', version: 1, fechaCarga: '2025-01-15' },
      { id: 2, nombre: 'Circuito Refrigeración Horno', zona: 'Fundición', subzona: 'Zona B', sistema: 'Hidráulico', version: 1, fechaCarga: '2025-01-14' },
    ],
    aprobador: 'Ing. Carlos Mendoza',
    zona: 'Laminados',
  },
  {
    id: 2,
    empresa: 'Ingeniería XYZ',
    planos: [
      { id: 3, nombre: 'Sistema Transportador Materias Primas', zona: 'Galvanizado', subzona: 'Zona C', sistema: 'Estructuras', version: 2, fechaCarga: '2025-01-13' },
      { id: 4, nombre: 'Distribución Eléctrica Planta', zona: 'Fundición', subzona: 'Zona A', sistema: 'Eléctrico', version: 1, fechaCarga: '2025-01-12' },
      { id: 5, nombre: 'Red Contraincendios Principal', zona: 'Laminados', subzona: 'Zona B', sistema: 'Hidráulico', version: 1, fechaCarga: '2025-01-11' },
    ],
    aprobador: 'Ing. Carlos Mendoza',
    zona: 'Galvanizado',
  },
];

// Mock data - Planos ya aprobados
const APPROVED_PLANOS = [
  {
    id: 1,
    codigo: 'PL-0001',
    nombre: 'Layout Almacén Productos Terminados',
    empresa: 'Grupo Industrial',
    zona: 'Laminados',
    subzona: 'Zona A',
    sistema: 'Estructuras',
    version: 1,
    fechaCarga: '2025-01-10',
    fechaAprobacion: '2025-01-11',
    estado: 'APROBADO',
    aprobador: 'Ing. Carlos Mendoza',
  },
  {
    id: 2,
    codigo: 'PL-0002',
    nombre: 'Sistema Ventilación Industrial',
    empresa: 'Constructora ABC',
    zona: 'Fundición',
    subzona: 'Zona B',
    sistema: 'Hidráulico',
    version: 1,
    fechaCarga: '2025-01-08',
    fechaAprobacion: '2025-01-09',
    estado: 'APROBADO',
    aprobador: 'Ing. Carlos Mendoza',
  },
  {
    id: 3,
    codigo: 'PL-0003',
    nombre: 'Estructura Puente Grúa Principal',
    empresa: 'Ingeniería XYZ',
    zona: 'Galvanizado',
    subzona: 'Zona C',
    sistema: 'Estructuras',
    version: 2,
    fechaCarga: '2025-01-05',
    fechaAprobacion: '2025-01-07',
    estado: 'APROBADO',
    aprobador: 'Ing. Carlos Mendoza',
  },
];

export const RevisionesPage = () => {
  const [selectedCard, setSelectedCard] = useState<typeof PENDING_REVIEWS[0] | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState<any>(null);
  
  // Filters for approved table
  const [searchTerm, setSearchTerm] = useState("");
  const [zonaFilter, setZonaFilter] = useState("all");
  const [empresaFilter, setEmpresaFilter] = useState("all");
  
  const [statusData, setStatusData] = useState({
    estado: "",
    comentarios: "",
  });

  const handleCardClick = (card: typeof PENDING_REVIEWS[0]) => {
    setSelectedCard(card);
    setShowActionMenu(true);
  };

  const handleEditPlano = (plano: any, action: 'status' | 'delete' | 'rename') => {
    setSelectedPlano(plano);
    setShowActionMenu(false);
    
    if (action === 'status') setShowStatusModal(true);
    if (action === 'delete') setShowDeleteModal(true);
    if (action === 'rename') setShowRenameModal(true);
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDIENTE':
        return <Clock className="w-4 h-4" />;
      case 'COMENTADO':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return 'bg-[#1a3a2a] border-[#34d399] text-[#34d399]';
      case 'PENDIENTE':
        return 'bg-[#3a3830] border-[#fbbf24] text-[#fbbf24]';
      case 'COMENTADO':
        return 'bg-[#2a3a4a] border-[#60a5fa] text-[#60a5fa]';
      default:
        return 'bg-[#3a2a2a] border-[#f87171] text-[#f87171]';
    }
  };

  // Filter approved planos
  const filteredApprovedPlanos = APPROVED_PLANOS.filter((plano) => {
    const matchesSearch = searchTerm === "" || 
      plano.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = !zonaFilter || zonaFilter === "all" || plano.zona === zonaFilter;
    const matchesEmpresa = !empresaFilter || empresaFilter === "all" || plano.empresa === empresaFilter;
    
    return matchesSearch && matchesZona && matchesEmpresa;
  });

  // Sort by most recent
  const sortedApprovedPlanos = [...filteredApprovedPlanos].sort((a, b) => {
    return new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime();
  });

  return (
    <DashboardLayout pageTitle="Revisiones">
      <div className="p-8 space-y-6">
        {/* Pending Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Pendientes de Aprobación</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PENDING_REVIEWS.map((review) => (
              <Card 
                key={review.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
                onClick={() => handleCardClick(review)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {review.empresa}
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {review.zona}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor('PENDIENTE')} flex items-center gap-1 px-3 py-1 border rounded-lg font-medium`}>
                      {getStatusIcon('PENDIENTE')}
                      {review.planos.length} plano{review.planos.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <strong>Aprobador:</strong> {review.aprobador}
                  </div>
                  <div className="text-xs text-muted-foreground border-t pt-2">
                    Haz clic para ver opciones de edición
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Approved Planos Section */}
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-foreground">Planos Aprobados</h2>
          
          {/* Filters */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="col-span-3">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Zona
                </label>
                <Select value={zonaFilter} onValueChange={setZonaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las zonas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las zonas</SelectItem>
                    <SelectItem value="Laminados">Laminados</SelectItem>
                    <SelectItem value="Fundición">Fundición</SelectItem>
                    <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Empresa
                </label>
                <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las empresas</SelectItem>
                    <SelectItem value="Constructora ABC">Constructora ABC</SelectItem>
                    <SelectItem value="Ingeniería XYZ">Ingeniería XYZ</SelectItem>
                    <SelectItem value="Grupo Industrial">Grupo Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setZonaFilter("all");
                    setEmpresaFilter("all");
                  }}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-foreground">
              Resultados ({sortedApprovedPlanos.length})
            </p>
          </div>

          {/* Approved Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="h-[400px] overflow-auto custom-scrollbar relative rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Código</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Plano</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Empresa</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Zona</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Sistema</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Versión</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Fecha Carga</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Fecha Aprobación</TableHead>
                    <TableHead className="font-semibold bg-background sticky top-0 z-10">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedApprovedPlanos.map((plano) => (
                    <TableRow key={plano.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{plano.codigo}</TableCell>
                      <TableCell>{plano.nombre}</TableCell>
                      <TableCell>{plano.empresa}</TableCell>
                      <TableCell>{plano.zona}</TableCell>
                      <TableCell>{plano.sistema}</TableCell>
                      <TableCell>v{plano.version}</TableCell>
                      <TableCell>{format(new Date(plano.fechaCarga), 'dd/MM/yyyy', { locale: es })}</TableCell>
                      <TableCell>{format(new Date(plano.fechaAprobacion), 'dd/MM/yyyy', { locale: es })}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(plano.estado)} flex items-center gap-1 px-3 py-1 border rounded-lg font-medium w-fit`}>
                          {getStatusIcon(plano.estado)}
                          {plano.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Action Menu Dialog */}
      <Dialog open={showActionMenu} onOpenChange={setShowActionMenu}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Planos de {selectedCard?.empresa}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCard?.planos.map((plano) => (
              <div key={plano.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{plano.nombre}</h4>
                    <p className="text-sm text-muted-foreground">
                      {plano.zona} • {plano.subzona} • {plano.sistema} • v{plano.version}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditPlano(plano, 'status')}
                    className="flex items-center gap-2"
                  >
                    <Settings2 className="w-4 h-4" />
                    Gestionar Status
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPlano(plano, 'rename')}
                    className="flex items-center gap-2"
                  >
                    <FileEdit className="w-4 h-4" />
                    Renombrar
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleEditPlano(plano, 'delete')}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestionar Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Estado</Label>
              <Select value={statusData.estado} onValueChange={(value) => setStatusData({...statusData, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APROBADO">Aprobado</SelectItem>
                  <SelectItem value="COMENTADO">Comentado</SelectItem>
                  <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Comentarios</Label>
              <Textarea
                placeholder="Ingrese comentarios..."
                value={statusData.comentarios}
                onChange={(e) => setStatusData({...statusData, comentarios: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowStatusModal(false)}>
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Plano</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar este plano? Esta acción no se puede deshacer.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteModal(false)}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Modal */}
      <Dialog open={showRenameModal} onOpenChange={setShowRenameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Plano</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nuevo nombre</Label>
              <Input placeholder="Ingrese el nuevo nombre" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRenameModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowRenameModal(false)}>
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
