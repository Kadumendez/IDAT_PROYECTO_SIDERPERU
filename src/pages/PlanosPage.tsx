import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Pencil, Search, CalendarIcon, X, Upload, FileText, Plus, Trash2, Settings, Shield, FileX, FileEdit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

// Mock data con nombres realistas de siderúrgica
const MOCK_PLANOS = [
  {
    id: '1',
    nombre: 'Planta General Acería',
    version: 'V05',
    zona: 'Acería',
    subzona: 'Horno Eléctrico',
    sistema: 'Estructura',
    estado: 'APROBADO' as const,
    fechaSubida: '2024-12-15',
    empresaResponsable: 'SIDER INGENIEROS',
    aprobadorSiderperu: 'Carlos Mendoza',
    descripcion: 'Plano general de la planta de acería con últimas modificaciones',
  },
  {
    id: '2',
    nombre: 'Planta General Acería',
    version: 'V04',
    zona: 'Acería',
    subzona: 'Horno Eléctrico',
    sistema: 'Estructura',
    estado: 'COMENTADO' as const,
    fechaSubida: '2024-11-20',
    empresaResponsable: 'SIDER INGENIEROS',
    aprobadorSiderperu: 'Carlos Mendoza',
    descripcion: 'Versión previa de la planta general',
  },
  {
    id: '3',
    nombre: 'Sistema Eléctrico Principal',
    version: 'V12',
    zona: 'Acería',
    subzona: 'Subestación',
    sistema: 'Eléctrico',
    estado: 'APROBADO' as const,
    fechaSubida: '2024-12-10',
    empresaResponsable: 'ELECTRO SOLUTIONS',
    aprobadorSiderperu: 'María Torres',
    descripcion: 'Sistema eléctrico principal con nuevas especificaciones',
  },
  {
    id: '4',
    nombre: 'Sistema Eléctrico Principal',
    version: 'V11',
    zona: 'Acería',
    subzona: 'Subestación',
    sistema: 'Eléctrico',
    estado: 'APROBADO' as const,
    fechaSubida: '2024-11-05',
    empresaResponsable: 'ELECTRO SOLUTIONS',
    aprobadorSiderperu: 'María Torres',
    descripcion: 'Versión anterior del sistema eléctrico',
  },
  {
    id: '5',
    nombre: 'Red Hidráulica Zona Norte',
    version: 'V03',
    zona: 'Laminación',
    subzona: 'Zona Norte',
    sistema: 'Hidráulico',
    estado: 'PENDIENTE' as const,
    fechaSubida: '2024-12-14',
    empresaResponsable: 'HYDRO TECH',
    aprobadorSiderperu: 'Jorge Ramírez',
    descripcion: 'Red hidráulica para enfriamiento',
  },
  {
    id: '6',
    nombre: 'Red Hidráulica Zona Norte',
    version: 'V02',
    zona: 'Laminación',
    subzona: 'Zona Norte',
    sistema: 'Hidráulico',
    estado: 'COMENTADO' as const,
    fechaSubida: '2024-11-28',
    empresaResponsable: 'HYDRO TECH',
    aprobadorSiderperu: 'Jorge Ramírez',
    descripcion: 'Versión con observaciones pendientes',
  },
  {
    id: '7',
    nombre: 'Estructura Metálica Nave Principal',
    version: 'V08',
    zona: 'Fundición',
    subzona: 'Nave A',
    sistema: 'Estructura',
    estado: 'APROBADO' as const,
    fechaSubida: '2024-12-08',
    empresaResponsable: 'METAL WORKS SAC',
    aprobadorSiderperu: 'Ana Gutiérrez',
    descripcion: 'Estructura principal de la nave de fundición',
  },
  {
    id: '8',
    nombre: 'Sistema HVAC Torre de Enfriamiento',
    version: 'V06',
    zona: 'Servicios',
    subzona: 'Torre 1',
    sistema: 'HVAC',
    estado: 'PENDIENTE' as const,
    fechaSubida: '2024-12-13',
    empresaResponsable: 'CLIMA CONTROL',
    aprobadorSiderperu: 'Luis Fernández',
    descripcion: 'Sistema de climatización y ventilación',
  },
  {
    id: '9',
    nombre: 'Sistema HVAC Torre de Enfriamiento',
    version: 'V05',
    zona: 'Servicios',
    subzona: 'Torre 1',
    sistema: 'HVAC',
    estado: 'APROBADO' as const,
    fechaSubida: '2024-11-15',
    empresaResponsable: 'CLIMA CONTROL',
    aprobadorSiderperu: 'Luis Fernández',
    descripcion: 'Versión anterior aprobada',
  },
  {
    id: '10',
    nombre: 'Red de Instrumentación Acería',
    version: 'V04',
    zona: 'Acería',
    subzona: 'Horno Eléctrico',
    sistema: 'Instrumentación',
    estado: 'COMENTADO' as const,
    fechaSubida: '2024-12-12',
    empresaResponsable: 'INSTRUTECH',
    aprobadorSiderperu: 'Carlos Mendoza',
    descripcion: 'Red de instrumentación con observaciones',
  },
  {
    id: '11',
    nombre: 'Tubería Agua Industrial Sector B',
    version: 'V07',
    zona: 'Laminación',
    subzona: 'Sector B',
    sistema: 'Hidráulico',
    estado: 'APROBADO' as const,
    fechaSubida: '2024-12-11',
    empresaResponsable: 'HYDRO TECH',
    aprobadorSiderperu: 'Jorge Ramírez',
    descripcion: 'Sistema de distribución de agua industrial',
  },
  {
    id: '12',
    nombre: 'Tableros Eléctricos Generales',
    version: 'V09',
    zona: 'Servicios',
    subzona: 'Subestación Principal',
    sistema: 'Eléctrico',
    estado: 'PENDIENTE' as const,
    fechaSubida: '2024-12-09',
    empresaResponsable: 'ELECTRO SOLUTIONS',
    aprobadorSiderperu: 'María Torres',
    descripcion: 'Tableros de distribución eléctrica general',
  },
];

type Plano = typeof MOCK_PLANOS[0];

export const PlanosPage = () => {
  const [filtros, setFiltros] = useState({
    searchTerm: '',
    zona: 'todas',
    subzona: 'todas',
    sistema: 'todos',
    version: 'todas',
    estado: 'todos',
    aprobadorSiderperu: 'todos',
    fechaDesde: undefined as Date | undefined,
    fechaHasta: undefined as Date | undefined,
  });

  const [visibleCount, setVisibleCount] = useState(15);
  const [previewPlano, setPreviewPlano] = useState<Plano | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'fechaSubida',
    direction: 'desc',
  });

  // Edit modal states
  const [editingPlano, setEditingPlano] = useState<Plano | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);

  // Permissions modal state - updated to use checkboxes
  const [permissionsData, setPermissionsData] = useState({
    rol: '',
    accesoDescargar: false,
    accesoSubir: false,
    empresa: '',
    usuario: '',
    versionesAutorizar: 'todas',
    versionesEspecificas: '',
    tiempoAccesoFrecuencia: 'meses',
    tiempoAccesoNumero: '',
  });

  // Status modal state - with file upload
  const [statusData, setStatusData] = useState({
    status: '',
    comentario: '',
    archivo: null as File | null,
  });

  // Rename modal state
  const [renameData, setRenameData] = useState({
    nombre: '',
    nombreExiste: false,
  });

  // Info modal state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPlanoInfo, setSelectedPlanoInfo] = useState<Plano | null>(null);

  // Cargas tab state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPlanos, setUploadedPlanos] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    zona: '',
    subzona: '',
    sistema: '',
    unidadMedida: '',
  });

  const filteredPlanos = MOCK_PLANOS.filter((plano) => {
    const matchSearch =
      filtros.searchTerm === '' ||
      plano.nombre.toLowerCase().includes(filtros.searchTerm.toLowerCase());
    const matchZona = filtros.zona === 'todas' || plano.zona === filtros.zona;
    const matchSubzona = filtros.subzona === 'todas' || plano.subzona === filtros.subzona;
    const matchSistema = filtros.sistema === 'todos' || plano.sistema === filtros.sistema;
    const matchVersion =
      filtros.version === 'todas' ||
      (filtros.version === 'actual' && plano.esVersionActual);
    const matchEstado = filtros.estado === 'todos' || plano.estado === filtros.estado;
    const matchAprobador =
      filtros.aprobadorSiderperu === 'todos' ||
      plano.aprobadorSiderperu === filtros.aprobadorSiderperu;

    return (
      matchSearch &&
      matchZona &&
      matchSubzona &&
      matchSistema &&
      matchVersion &&
      matchEstado &&
      matchAprobador
    );
  });

  // Sort planos
  const sortedPlanos = [...filteredPlanos].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const visiblePlanos = sortedPlanos.slice(0, visibleCount);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      searchTerm: '',
      zona: 'todas',
      subzona: 'todas',
      sistema: 'todos',
      version: 'todas',
      estado: 'todos',
      aprobadorSiderperu: 'todos',
      fechaDesde: undefined,
      fechaHasta: undefined,
    });
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(15);
  }, [filtros]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (!target) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        if (visibleCount < filteredPlanos.length) {
          setVisibleCount((prev) => Math.min(prev + 15, filteredPlanos.length));
        }
      }
    };

    const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [visibleCount, filteredPlanos.length]);

  // Cargas tab handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.dwg'))) {
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handlePreviewFile = () => {
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewFile(url);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setPreviewFile(null);
  };

  const handleAddFile = () => {
    if (uploadedFile) {
      setShowUploadForm(true);
    }
  };

  const handleSaveUpload = () => {
    if (
      uploadedFile &&
      uploadFormData.zona &&
      uploadFormData.subzona &&
      uploadFormData.sistema &&
      uploadFormData.unidadMedida
    ) {
      const newPlano = {
        id: uploadedPlanos.length + 1,
        nombre: uploadedFile.name,
        empresaResponsable: 'Mi Empresa',
        zona: uploadFormData.zona,
        subzona: uploadFormData.subzona,
        sistema: uploadFormData.sistema,
        unidadMedida: uploadFormData.unidadMedida,
        version: 1,
        isActual: true,
        estado: 'PENDIENTE',
        actualizado: new Date().toISOString(),
        file: uploadedFile,
      };
      setUploadedPlanos([...uploadedPlanos, newPlano]);
      setShowUploadForm(false);
      setUploadedFile(null);
      setUploadFormData({ zona: '', subzona: '', sistema: '', unidadMedida: '' });
    }
  };

  const handleCancelUpload = () => {
    setShowUploadForm(false);
    setUploadFormData({ zona: '', subzona: '', sistema: '', unidadMedida: '' });
  };

  return (
    <DashboardLayout pageTitle="Planos (Listado y Cargas)">
      <TooltipProvider>
        <div className="p-8">
          <div className="max-w-[1800px] mx-auto">
            <Tabs defaultValue="listado" className="w-full">
              <TabsList className="mb-6 bg-muted/50">
                <TabsTrigger
                  value="listado"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Listado
                </TabsTrigger>
                <TabsTrigger
                  value="cargas"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Cargas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listado" className="space-y-6">
                {/* Zona de Filtros */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9 gap-3 items-end">
                      {/* Buscar */}
                      <div className="xl:col-span-2">
                        <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                          Buscar
                        </Label>
                        <Input
                          id="search"
                          placeholder="Buscar planos..."
                          value={filtros.searchTerm}
                          onChange={(e) => setFiltros({ ...filtros, searchTerm: e.target.value })}
                          className="w-full text-white"
                        />
                      </div>

                      {/* Zona */}
                      <div>
                        <Label htmlFor="zona" className="text-sm font-medium mb-2 block">
                          Zona
                        </Label>
                        <Select
                          value={filtros.zona}
                          onValueChange={(value) => setFiltros({ ...filtros, zona: value })}
                        >
                          <SelectTrigger id="zona" className="w-full [&_svg]:text-white">
                            <SelectValue placeholder="Todas" />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="Acería">Acería</SelectItem>
                            <SelectItem value="Laminación">Laminación</SelectItem>
                            <SelectItem value="Fundición">Fundición</SelectItem>
                            <SelectItem value="Servicios">Servicios</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subzona */}
                      <div>
                        <Label htmlFor="subzona" className="text-sm font-medium mb-2 block">
                          Subzona
                        </Label>
                        <Select
                          value={filtros.subzona}
                          onValueChange={(value) => setFiltros({ ...filtros, subzona: value })}
                        >
                          <SelectTrigger id="subzona" className="w-full [&_svg]:text-white">
                            <SelectValue placeholder="Todas" />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="Horno Eléctrico">Horno Eléctrico</SelectItem>
                            <SelectItem value="Subestación">Subestación</SelectItem>
                            <SelectItem value="Zona Norte">Zona Norte</SelectItem>
                            <SelectItem value="Nave A">Nave A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sistema */}
                      <div>
                        <Label htmlFor="sistema" className="text-sm font-medium mb-2 block">
                          Sistema
                        </Label>
                        <Select
                          value={filtros.sistema}
                          onValueChange={(value) => setFiltros({ ...filtros, sistema: value })}
                        >
                          <SelectTrigger id="sistema" className="w-full [&_svg]:text-white">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="Estructura">Estructura</SelectItem>
                            <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                            <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                            <SelectItem value="HVAC">HVAC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Versión */}
                      <div>
                        <Label htmlFor="version" className="text-sm font-medium mb-2 block">
                          Versión
                        </Label>
                        <Select
                          value={filtros.version}
                          onValueChange={(value) => setFiltros({ ...filtros, version: value })}
                        >
                          <SelectTrigger id="version" className="w-full [&_svg]:text-white">
                            <SelectValue placeholder="Todas" />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="actual">Versión actual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Estado */}
                      <div>
                        <Label htmlFor="estado" className="text-sm font-medium mb-2 block">
                          Estado
                        </Label>
                        <Select
                          value={filtros.estado}
                          onValueChange={(value) => setFiltros({ ...filtros, estado: value })}
                        >
                          <SelectTrigger id="estado" className="w-full [&_svg]:text-white">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="APROBADO">Aprobado</SelectItem>
                            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                            <SelectItem value="COMENTADO">Comentado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Limpiar Filtros */}
                      <div className="xl:col-span-1 flex items-end">
                        <Button
                          onClick={limpiarFiltros}
                          variant="outline"
                          className="w-full bg-destructive/30 hover:bg-destructive/40 text-white border-destructive/60"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Limpiar
                        </Button>
                      </div>
                    </div>

                    {/* Segunda fila de filtros - Aprobador SiderPerú */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9 gap-3 items-end mt-3">
                      <div className="xl:col-span-2">
                        <Label htmlFor="aprobador" className="text-sm font-medium mb-2 block">
                          Aprobador SiderPerú
                        </Label>
                        <Select
                          value={filtros.aprobadorSiderperu}
                          onValueChange={(value) =>
                            setFiltros({ ...filtros, aprobadorSiderperu: value })
                          }
                        >
                          <SelectTrigger id="aprobador" className="w-full [&_svg]:text-white">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent className="z-[100]">
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="Carlos Mendoza">Carlos Mendoza</SelectItem>
                            <SelectItem value="María Torres">María Torres</SelectItem>
                            <SelectItem value="Jorge Ramírez">Jorge Ramírez</SelectItem>
                            <SelectItem value="Ana Gutiérrez">Ana Gutiérrez</SelectItem>
                            <SelectItem value="Luis Fernández">Luis Fernández</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contador de Resultados */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    RESULTADOS ({filteredPlanos.length})
                  </h3>
                </div>

                {/* Tabla de Resultados */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="sticky top-0 bg-card z-20 border-b">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors w-[30%]"
                                onClick={() => handleSort('nombre')}
                              >
                                <div className="flex items-center gap-2">
                                  Plano
                                  {sortConfig.key === 'nombre' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('fechaSubida')}
                              >
                                <div className="flex items-center gap-2">
                                  Fecha de Subida
                                  {sortConfig.key === 'fechaSubida' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('empresaResponsable')}
                              >
                                <div className="flex items-center gap-2">
                                  Empresa Responsable
                                  {sortConfig.key === 'empresaResponsable' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('zona')}
                              >
                                <div className="flex items-center gap-2">
                                  Zona
                                  {sortConfig.key === 'zona' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('subzona')}
                              >
                                <div className="flex items-center gap-2">
                                  Subzona
                                  {sortConfig.key === 'subzona' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('sistema')}
                              >
                                <div className="flex items-center gap-2">
                                  Sistema
                                  {sortConfig.key === 'sistema' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('version')}
                              >
                                <div className="flex items-center gap-2">
                                  Versión
                                  {sortConfig.key === 'version' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('estado')}
                              >
                                <div className="flex items-center gap-2">
                                  Estado
                                  {sortConfig.key === 'estado' &&
                                    (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                </div>
                              </TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                        </Table>
                      </div>
                      <ScrollArea ref={scrollRef} className="h-[550px] custom-scrollbar">
                        <Table>
                          <TableBody>
                            {visiblePlanos.map((plano) => (
                              <TableRow key={plano.id}>
                                 <TableCell className="font-medium w-[30%]">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedPlanoInfo(plano);
                                        setShowInfoModal(true);
                                      }}
                                      className="text-white text-sm font-bold italic hover:text-primary transition-colors cursor-pointer"
                                    >
                                      i
                                    </button>
                                    {plano.nombre}
                                  </div>
                                </TableCell>
                                <TableCell>{plano.fechaSubida}</TableCell>
                                <TableCell>{plano.empresaResponsable}</TableCell>
                                <TableCell>{plano.zona}</TableCell>
                                <TableCell>{plano.subzona}</TableCell>
                                <TableCell>{plano.sistema}</TableCell>
                                <TableCell>
                                  {plano.version}
                                  {plano.esVersionActual && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Actual
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`${
                                      plano.estado === 'Aprobado'
                                        ? 'bg-blue-500/30 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : plano.estado === 'Pendiente'
                                          ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                                          : 'bg-orange-500/30 text-orange-300 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                                    } border font-medium transition-all`}
                                  >
                                    {plano.estado}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                          <Download className="h-4 w-4 text-white" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Descargar</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                          <Eye className="h-4 w-4 text-white" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Vista previa</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8"
                                          onClick={() => {
                                            setEditingPlano(plano);
                                            setRenameData({ nombre: plano.nombre, nombreExiste: false });
                                            setShowActionMenu(true);
                                          }}
                                        >
                                          <Pencil className="h-4 w-4 text-white" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Editar</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cargas" className="space-y-6">
                {/* Drag and Drop Zone */}
                <div
                  className={cn(
                    'bg-card rounded-lg border-2 border-dashed p-8 transition-colors',
                    isDragging ? 'border-primary bg-primary/5' : 'border-border'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Planos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Arrastre su archivo DWG/PDF aquí o usa "Subir DWG/PDF" del TopBar
                      </p>
                      {uploadedFile && (
                        <div className="flex items-center gap-2 mt-4">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {uploadedFile.name}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase">
                            ({uploadedFile.type === 'application/pdf' ? 'PDF' : 'DWG'})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviewFile}
                        disabled={!uploadedFile || uploadedFile.type !== 'application/pdf'}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Vista previa
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAddFile}
                        disabled={!uploadedFile}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFile}
                        disabled={!uploadedFile}
                      >
                        <Trash2 className="w-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Upload Form Modal */}
                {showUploadForm && (
                  <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
                    <DialogContent className="sm:max-w-md backdrop-blur-md">
                      <DialogHeader>
                        <DialogTitle>Cargar Plano</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Zona</Label>
                          <Select
                            value={uploadFormData.zona}
                            onValueChange={(value) =>
                              setUploadFormData({ ...uploadFormData, zona: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Acería">Acería</SelectItem>
                              <SelectItem value="Laminación">Laminación</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Subzona</Label>
                          <Select
                            value={uploadFormData.subzona}
                            onValueChange={(value) =>
                              setUploadFormData({ ...uploadFormData, subzona: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Zona A">Zona A</SelectItem>
                              <SelectItem value="Zona B">Zona B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Sistema</Label>
                          <Select
                            value={uploadFormData.sistema}
                            onValueChange={(value) =>
                              setUploadFormData({ ...uploadFormData, sistema: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                              <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Unidad de Medida</Label>
                          <Select
                            value={uploadFormData.unidadMedida}
                            onValueChange={(value) =>
                              setUploadFormData({ ...uploadFormData, unidadMedida: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="milimetros">Milímetros</SelectItem>
                              <SelectItem value="pulgadas">Pulgadas</SelectItem>
                              <SelectItem value="pies">Pies</SelectItem>
                              <SelectItem value="mixto">Mixto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          Al guardar el archivo, este pasa automáticamente a un estado de "Pendiente de
                          aprobación".
                        </div>
                      </div>

                      <div className="flex justify-center gap-3">
                        <Button onClick={handleSaveUpload}>Guardar</Button>
                        <Button variant="outline" onClick={handleCancelUpload}>
                          Cancelar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Modal: Opciones de Edición */}
        <Dialog open={showActionMenu} onOpenChange={setShowActionMenu}>
          <DialogContent className="sm:max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Opciones de Edición</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 border-2 border-border hover:border-primary"
                onClick={() => {
                  setShowActionMenu(false);
                  setTimeout(() => setShowPermissionsModal(true), 150);
                }}
              >
                <Shield className="h-5 w-5" />
                Gestionar Permisos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 border-2 border-border hover:border-primary"
                onClick={() => {
                  setShowActionMenu(false);
                  setTimeout(() => setShowStatusModal(true), 150);
                }}
              >
                <Settings className="h-5 w-5" />
                Gestionar Status
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 border-2 border-border hover:border-primary"
                onClick={() => {
                  setShowActionMenu(false);
                  setTimeout(() => setShowDeleteModal(true), 150);
                }}
              >
                <FileX className="h-5 w-5" />
                Eliminar Plano
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 border-2 border-border hover:border-primary"
                onClick={() => {
                  setShowActionMenu(false);
                  setTimeout(() => setShowRenameModal(true), 150);
                }}
              >
                <FileEdit className="h-5 w-5" />
                Renombrar Plano
              </Button>
            </div>
            <div className="flex justify-center">
              <Button variant="destructive" onClick={() => setShowActionMenu(false)}>
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal: Gestionar Permisos */}
        <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
          <DialogContent className="sm:max-w-2xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Gestionar Permisos - {editingPlano?.nombre}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Rol:</Label>
                  <Select
                    value={permissionsData.rol}
                    onValueChange={(value) => {
                      setPermissionsData({
                        ...permissionsData,
                        rol: value,
                        empresa: value === 'siderperu' ? 'SIDERPERÚ' : '',
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="siderperu">Usuario SiderPerú</SelectItem>
                      <SelectItem value="tercero">Usuario Tercero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Empresa:</Label>
                  <Input
                    value={permissionsData.empresa}
                    onChange={(e) =>
                      setPermissionsData({ ...permissionsData, empresa: e.target.value })
                    }
                    disabled={permissionsData.rol === 'siderperu'}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Usuario:</Label>
                  <Select
                    value={permissionsData.usuario}
                    onValueChange={(value) =>
                      setPermissionsData({ ...permissionsData, usuario: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario1">Usuario 1</SelectItem>
                      <SelectItem value="usuario2">Usuario 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Acceso a:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceso-descargar"
                        checked={permissionsData.accesoDescargar}
                        onCheckedChange={(checked) =>
                          setPermissionsData({
                            ...permissionsData,
                            accesoDescargar: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="acceso-descargar" className="cursor-pointer">
                        Descargar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceso-subir"
                        checked={permissionsData.accesoSubir}
                        onCheckedChange={(checked) =>
                          setPermissionsData({
                            ...permissionsData,
                            accesoSubir: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="acceso-subir" className="cursor-pointer">
                        Subir nueva versión
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Versiones a autorizar:</Label>
                  <RadioGroup
                    value={permissionsData.versionesAutorizar}
                    onValueChange={(value) =>
                      setPermissionsData({ ...permissionsData, versionesAutorizar: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="todas" id="todas-versiones" />
                      <Label htmlFor="todas-versiones" className="cursor-pointer">
                        Todas las versiones
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="especificar" id="especificar-versiones" />
                        <Label htmlFor="especificar-versiones" className="cursor-pointer">
                          Especificar
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <Input
                    placeholder="ej: 1-5, 8, 11-13"
                    className="mt-2 w-4/5"
                    value={permissionsData.versionesEspecificas}
                    onChange={(e) =>
                      setPermissionsData({
                        ...permissionsData,
                        versionesEspecificas: e.target.value,
                      })
                    }
                    disabled={permissionsData.versionesAutorizar !== 'especificar'}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Tiempo de acceso:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={permissionsData.tiempoAccesoFrecuencia}
                      onValueChange={(value) =>
                        setPermissionsData({
                          ...permissionsData,
                          tiempoAccesoFrecuencia: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meses">Meses</SelectItem>
                        <SelectItem value="dias">Días</SelectItem>
                        <SelectItem value="anos">Años</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Número"
                      value={permissionsData.tiempoAccesoNumero}
                      onChange={(e) =>
                        setPermissionsData({
                          ...permissionsData,
                          tiempoAccesoNumero: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setShowSuccessCheck(true);
                  setTimeout(() => {
                    setShowSuccessCheck(false);
                  }, 2000);
                }}
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPermissionsModal(false);
                  setTimeout(() => setShowActionMenu(true), 150);
                }}
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal: Gestionar Status */}
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="sm:max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Gestionar Status - {editingPlano?.nombre}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Status:</Label>
                <RadioGroup
                  value={statusData.status}
                  onValueChange={(value) => setStatusData({ ...statusData, status: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aprobar" id="aprobar" />
                    <Label htmlFor="aprobar" className="cursor-pointer">
                      Aprobar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="observar" id="observar" />
                    <Label htmlFor="observar" className="cursor-pointer">
                      Observar
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {statusData.status === 'observar' && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <Label htmlFor="comentario" className="text-sm font-medium mb-2 block">
                      Comentario:
                    </Label>
                    <Textarea
                      id="comentario"
                      placeholder="Escriba su comentario aquí... (máximo 1500 palabras)"
                      className="h-32 resize-none focus-visible:ring-2 focus-visible:ring-primary border-2 focus-visible:border-primary"
                      maxLength={1500}
                      value={statusData.comentario}
                      onChange={(e) =>
                        setStatusData({ ...statusData, comentario: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Archivo (opcional - máx. 5MB):</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        statusData.archivo
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.size <= 5 * 1024 * 1024) {
                          setStatusData({ ...statusData, archivo: file });
                        }
                      }}
                      onClick={() => document.getElementById('status-file-input')?.click()}
                    >
                      {statusData.archivo ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{statusData.archivo.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusData({ ...statusData, archivo: null });
                            }}
                          >
                            <FileX className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Arrastra un archivo aquí o haz clic para subir
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      id="status-file-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 5 * 1024 * 1024) {
                          setStatusData({ ...statusData, archivo: file });
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowStatusModal(false);
                  setShowSuccessCheck(true);
                  setTimeout(() => {
                    setShowSuccessCheck(false);
                  }, 2000);
                }}
              >
                Actualizar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusModal(false);
                  setTimeout(() => setShowActionMenu(true), 150);
                }}
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal: Eliminar Plano */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Eliminar Plano</DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-lg">¿Está seguro que desea eliminar el plano?</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => {
                  if (editingPlano) {
                    const index = MOCK_PLANOS.findIndex((p) => p.id === editingPlano.id);
                    if (index > -1) {
                      MOCK_PLANOS.splice(index, 1);
                    }
                  }
                  setShowDeleteModal(false);
                  setShowSuccessCheck(true);
                  setTimeout(() => {
                    setShowSuccessCheck(false);
                  }, 2000);
                }}
              >
                Sí
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTimeout(() => setShowActionMenu(true), 150);
                }}
              >
                No
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal: Renombrar Plano */}
        <Dialog open={showRenameModal} onOpenChange={setShowRenameModal}>
          <DialogContent className="sm:max-w-md backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Renombrar Plano</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="nombre-plano" className="text-sm font-medium mb-2 block">
                  Nombre:
                </Label>
                <Input
                  id="nombre-plano"
                  value={renameData.nombre}
                  onChange={(e) => {
                    const nombre = e.target.value;
                    const exists = MOCK_PLANOS.some(
                      (p) => p.nombre === nombre && p.id !== editingPlano?.id
                    );
                    setRenameData({ nombre, nombreExiste: exists });
                  }}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
                {renameData.nombreExiste && (
                  <p className="text-sm text-destructive mt-1">Ya existe un plano con este nombre</p>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => {
                  setShowRenameModal(false);
                  setShowSuccessCheck(true);
                  setTimeout(() => {
                    setShowSuccessCheck(false);
                  }, 2000);
                }}
                disabled={renameData.nombreExiste || !renameData.nombre}
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRenameModal(false);
                  setTimeout(() => setShowActionMenu(true), 150);
                }}
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Check Animation */}
        {showSuccessCheck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-green-500/20 p-8 rounded-lg shadow-lg animate-scale-in border-2 border-green-500/50 backdrop-blur-md">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-500/30 border-4 border-dashed border-green-500 flex items-center justify-center animate-spin-slow">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-lg font-semibold text-green-500">¡Realizado!</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Info Plano */}
        <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
          <DialogContent className="sm:max-w-2xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>Información del Plano</DialogTitle>
            </DialogHeader>
            {selectedPlanoInfo && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nombre del Plano</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.nombre}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Versión</Label>
                  <p className="text-sm mt-1">
                    {selectedPlanoInfo.version}
                    {selectedPlanoInfo.esVersionActual && ' (Actual)'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha de Subida</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.fechaSubida}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.estado}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Aprobador SiderPerú</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.aprobadorSiderperu}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Empresa Responsable</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.empresaResponsable}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Zona</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.zona}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Subzona</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.subzona}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sistema</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.sistema}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
                  <p className="text-sm mt-1">{selectedPlanoInfo.descripcion}</p>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <Button onClick={() => setShowInfoModal(false)}>Cerrar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Modal */}
        {previewFile && (
          <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
            <DialogContent className="sm:max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Vista Previa</DialogTitle>
              </DialogHeader>
              <iframe src={previewFile} className="w-full h-full" />
            </DialogContent>
          </Dialog>
        )}
      </TooltipProvider>
    </DashboardLayout>
  );
};
