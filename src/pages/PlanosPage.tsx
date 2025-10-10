import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Pencil, Search, Calendar as CalendarIcon, X, Upload, FileText, Plus, Trash2, Save, Settings, Shield, FileX, FileEdit, Info, Check, ArrowUpDown } from "lucide-react";
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

// Mock data - nombres realistas de planos de siderúrgica
const MOCK_PLANOS = Array.from({ length: 100 }, (_, i) => {
  const planoNames = [
    'Planta General Acería',
    'Circuito Refrigeración Horno',
    'Sistema Transportador Materias Primas',
    'Distribución Eléctrica Planta',
    'Layout Almacén Productos Terminados',
    'Red Contraincendios Principal',
    'Sistema Ventilación Industrial',
    'Estructura Puente Grúa Principal',
    'Diagrama Unifilar Subestación',
    'Plano Tubería Agua Proceso'
  ];
  const nameIndex = i % planoNames.length;
  const versionNum = Math.floor(i / planoNames.length) + 1;
  const isLatestVersion = (i % planoNames.length) === (Math.floor((100 - 1) / planoNames.length));
  
  return {
    id: i + 1,
    codigo: `PL-${String(i + 1).padStart(4, '0')}`,
    nombre: planoNames[nameIndex],
    empresaResponsable: ['Constructora ABC', 'Ingeniería XYZ', 'Grupo Industrial'][i % 3],
    zona: ['Laminados', 'Fundición', 'Galvanizado'][i % 3],
    subzona: ['Zona A', 'Zona B', 'Zona C'][i % 3],
    sistema: ['Eléctrico', 'Hidráulico', 'Estructuras'][i % 3],
    version: versionNum,
    isActual: isLatestVersion,
    estado: ['PENDIENTE', 'APROBADO', 'COMENTADO'][i % 3],
    actualizado: new Date(2025, Math.floor(i / 10), (i % 28) + 1).toISOString(),
    fechaSubida: format(new Date(2025, Math.floor(i / 10), (i % 28) + 1), 'yyyy-MM-dd'),
    aprobadorSiderPeru: ['Ing. Carlos Mendoza', 'Ing. María Torres', 'Ing. Juan Pérez'][i % 3],
    descripcion: 'Plano de diseño y distribución para operaciones industriales',
  };
});

type Plano = typeof MOCK_PLANOS[0];

export const PlanosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zonaFilter, setZonaFilter] = useState<string>("");
  const [subzonaFilter, setSubzonaFilter] = useState<string>("");
  const [sistemaFilter, setSistemaFilter] = useState<string>("");
  const [versionFilter, setVersionFilter] = useState<string>("Todas");
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [visibleCount, setVisibleCount] = useState(15);
  const [previewPlano, setPreviewPlano] = useState<Plano | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
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
    rol: "",
    accesoDescargar: false,
    accesoSubir: false,
    empresa: "",
    usuario: "",
    versionesAutorizar: "todas",
    versionesEspecificas: "",
    frecuencia: "",
    tiempoAcceso: ""
  });
  
  // Status modal state - with file upload
  const [statusData, setStatusData] = useState({
    status: "",
    comentario: "",
    archivo: null as File | null
  });
  
  // Rename modal state
  const [renameData, setRenameData] = useState({
    nombre: "",
    error: false
  });
  
  // Cargas tab state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPlanos, setUploadedPlanos] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    zona: "",
    subzona: "",
    sistema: "",
    unidadMedida: ""
  });

  // Filter planos
  const filteredPlanos = MOCK_PLANOS.filter((plano) => {
    const matchesSearch = searchTerm === "" || 
      plano.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = !zonaFilter || plano.zona === zonaFilter;
    const matchesSubzona = !subzonaFilter || plano.subzona === subzonaFilter;
    const matchesSistema = !sistemaFilter || plano.sistema === sistemaFilter;
    
    // Filtro de versión actualizado
    let matchesVersion = true;
    if (versionFilter === 'Versión actual') {
      // Find the maximum version for this plano name
      const maxVersionForPlano = Math.max(
        ...MOCK_PLANOS.filter(p => p.nombre === plano.nombre).map(p => p.version)
      );
      matchesVersion = plano.version === maxVersionForPlano;
    }
    
    const matchesEstado = !estadoFilter || plano.estado === estadoFilter;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const planoDate = new Date(plano.actualizado);
      if (dateFrom && planoDate < dateFrom) matchesDate = false;
      if (dateTo && planoDate > dateTo) matchesDate = false;
    }

    return matchesSearch && matchesZona && matchesSubzona && matchesSistema && 
           matchesVersion && matchesEstado && matchesDate;
  });

  // Sort planos
  const sortedPlanos = [...filteredPlanos].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue = a[sortColumn as keyof typeof a];
    let bValue = b[sortColumn as keyof typeof b];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const visiblePlanos = sortedPlanos.slice(0, visibleCount);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(15);
  }, [searchTerm, zonaFilter, subzonaFilter, sistemaFilter, versionFilter, estadoFilter, dateFrom, dateTo]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (!target) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        if (visibleCount < filteredPlanos.length) {
          setVisibleCount(prev => Math.min(prev + 15, filteredPlanos.length));
        }
      }
    };

    const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [visibleCount, filteredPlanos.length]);

  const getEstadoNeonStyle = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': 
        return 'border-[#f97316] text-[#f97316] bg-transparent shadow-[0_0_8px_rgba(249,115,22,0.5)]';
      case 'APROBADO': 
        return 'border-[#10b981] text-[#10b981] bg-transparent shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'COMENTADO': 
        return 'border-[#eab308] text-[#eab308] bg-transparent shadow-[0_0_8px_rgba(234,179,8,0.5)]';
      default: 
        return 'border-gray-400 text-gray-400 bg-transparent';
    }
  };

  const handleDownload = (plano: Plano) => {
    console.log('Descargando:', plano.codigo);
  };

  const handlePreview = (plano: Plano) => {
    setPreviewPlano(plano);
  };

  const handleEdit = (plano: Plano) => {
    setEditingPlano(plano);
    setShowActionMenu(true);
  };

  const handleActionMenuOption = (action: string) => {
    setShowActionMenu(false);
    setTimeout(() => {
      switch (action) {
        case 'permissions':
          setShowPermissionsModal(true);
          break;
        case 'status':
          setShowStatusModal(true);
          break;
        case 'delete':
          setShowDeleteModal(true);
          break;
        case 'rename':
          setRenameData({ nombre: editingPlano?.nombre || "", error: false });
          setShowRenameModal(true);
          break;
      }
    }, 150);
  };

  const handleActionComplete = () => {
    setShowSuccessCheck(true);
    setTimeout(() => {
      setShowSuccessCheck(false);
      setShowActionMenu(false);
      setShowPermissionsModal(false);
      setShowStatusModal(false);
      setShowDeleteModal(false);
      setShowRenameModal(false);
      setEditingPlano(null);
    }, 2000);
  };

  const handleCancelToMenu = (currentModal: string) => {
    // Close current modal
    switch(currentModal) {
      case 'permissions':
        setShowPermissionsModal(false);
        break;
      case 'status':
        setShowStatusModal(false);
        break;
      case 'delete':
        setShowDeleteModal(false);
        break;
      case 'rename':
        setShowRenameModal(false);
        break;
    }
    // Show action menu after a brief delay
    setTimeout(() => {
      setShowActionMenu(true);
    }, 150);
  };

  const handleCancelModals = () => {
    setShowActionMenu(false);
    setShowPermissionsModal(false);
    setShowStatusModal(false);
    setShowDeleteModal(false);
    setShowRenameModal(false);
    setEditingPlano(null);
  };

  // Update empresa when rol changes
  useEffect(() => {
    if (permissionsData.rol === "Usuario SiderPerú") {
      setPermissionsData(prev => ({ ...prev, empresa: "SIDERPERÚ" }));
    }
  }, [permissionsData.rol]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setZonaFilter("");
    setSubzonaFilter("");
    setSistemaFilter("");
    setVersionFilter("Todas");
    setEstadoFilter("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

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
    if (uploadedFile && uploadFormData.zona && uploadFormData.subzona && uploadFormData.sistema && uploadFormData.unidadMedida) {
      const newPlano = {
        id: uploadedPlanos.length + 1,
        codigo: `PL-${String(uploadedPlanos.length + 1).padStart(4, '0')}`,
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
        file: uploadedFile
      };
      setUploadedPlanos([...uploadedPlanos, newPlano]);
      setShowUploadForm(false);
      setUploadedFile(null);
      setUploadFormData({ zona: "", subzona: "", sistema: "", unidadMedida: "" });
      console.log('✓ Archivo subido exitosamente');
    }
  };

  const handleCancelUpload = () => {
    setShowUploadForm(false);
    setUploadFormData({ zona: "", subzona: "", sistema: "", unidadMedida: "" });
  };

  return (
    <DashboardLayout pageTitle="Planos (Listado y Cargas)">
      <div className="p-8">
        <div className="max-w-[1600px] mx-auto">

        <Tabs defaultValue="listado" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="listado" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Listado
            </TabsTrigger>
            <TabsTrigger value="cargas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cargas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listado" className="space-y-6">
            {/* Filtros */}
            <div className="bg-card dark:bg-slate-800 p-6 rounded-lg border border-border dark:border-slate-700 space-y-4">
              {/* Primera fila de filtros */}
              <div className="grid grid-cols-8 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Nombre o código (PL-0001)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-foreground dark:text-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Zona
                  </label>
                  <Select value={zonaFilter} onValueChange={setZonaFilter}>
                    <SelectTrigger className="w-[140px] [&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Laminados">Laminados</SelectItem>
                      <SelectItem value="Fundición">Fundición</SelectItem>
                      <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Subzona
                  </label>
                  <Select value={subzonaFilter} onValueChange={setSubzonaFilter}>
                    <SelectTrigger className="w-[140px] [&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Zona A">Zona A</SelectItem>
                      <SelectItem value="Zona B">Zona B</SelectItem>
                      <SelectItem value="Zona C">Zona C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Sistema
                  </label>
                  <Select value={sistemaFilter} onValueChange={setSistemaFilter}>
                    <SelectTrigger className="w-[140px] [&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                      <SelectItem value="Estructuras">Estructuras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Versión
                  </label>
                  <Select value={versionFilter} onValueChange={setVersionFilter}>
                    <SelectTrigger className="w-[140px] [&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="Todas">Todas</SelectItem>
                      <SelectItem value="Versión actual">Versión actual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Estado
                  </label>
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger className="w-[140px] [&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="APROBADO">APROBADO</SelectItem>
                      <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                      <SelectItem value="COMENTADO">COMENTADO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Fecha desde
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[160px] justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground",
                          dateFrom && "text-foreground dark:text-gray-200"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[100]" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Fecha hasta
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[160px] justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground",
                          dateTo && "text-foreground dark:text-gray-200"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[100]" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Botón de limpiar filtros */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="bg-muted/50 hover:bg-muted text-foreground border-2 border-border"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>

            {/* Encabezado de resultados */}
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-foreground dark:text-gray-100">
                Resultados ({filteredPlanos.length})
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Demo - datos mock
              </p>
            </div>

            {/* Tabla */}
            <div className="bg-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 overflow-hidden">
              <ScrollArea ref={scrollRef} className="h-[600px] custom-scrollbar">
                <Table>
                  <TableHeader className="bg-muted/50 dark:bg-slate-700/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead 
                        className="font-semibold bg-muted/50 dark:bg-slate-700/50 cursor-pointer hover:bg-muted/70"
                        onClick={() => handleSort('nombre')}
                      >
                        <div className="flex items-center gap-1">
                          Plano
                          {sortColumn === 'nombre' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="font-semibold bg-muted/50 dark:bg-slate-700/50 cursor-pointer hover:bg-muted/70"
                        onClick={() => handleSort('empresaResponsable')}
                      >
                        <div className="flex items-center gap-1">
                          Empresa Responsable
                          {sortColumn === 'empresaResponsable' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="font-semibold bg-muted/50 dark:bg-slate-700/50 cursor-pointer hover:bg-muted/70"
                        onClick={() => handleSort('zona')}
                      >
                        <div className="flex items-center gap-1">
                          Zona
                          {sortColumn === 'zona' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="font-semibold bg-muted/50 dark:bg-slate-700/50 cursor-pointer hover:bg-muted/70"
                        onClick={() => handleSort('subzona')}
                      >
                        <div className="flex items-center gap-1">
                          Subzona
                          {sortColumn === 'subzona' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="font-semibold bg-muted/50 dark:bg-slate-700/50 cursor-pointer hover:bg-muted/70"
                        onClick={() => handleSort('sistema')}
                      >
                        <div className="flex items-center gap-1">
                          Sistema
                          {sortColumn === 'sistema' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-center bg-muted/50 dark:bg-slate-700/50">Versión</TableHead>
                      <TableHead className="font-semibold text-center bg-muted/50 dark:bg-slate-700/50">Estado</TableHead>
                      <TableHead className="font-semibold text-center bg-muted/50 dark:bg-slate-700/50">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visiblePlanos.map((plano) => (
                      <TableRow key={plano.id} className="hover:bg-muted/30 dark:hover:bg-slate-700/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary cursor-help flex-shrink-0">
                                    <Info className="h-3 w-3 text-primary" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p><strong>Fecha de subida:</strong> {plano.fechaSubida}</p>
                                    <p><strong>Aprobador SiderPerú:</strong> {plano.aprobadorSiderPeru}</p>
                                    <p><strong>Versión:</strong> {plano.version}</p>
                                    <p><strong>Descripción:</strong> {plano.descripcion}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div>
                              <div className="font-semibold text-foreground dark:text-gray-100">
                                {plano.nombre}
                              </div>
                              <div className="text-xs text-muted-foreground dark:text-gray-500 mt-0.5">
                                {plano.codigo}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.empresaResponsable}</TableCell>
                        <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.zona}</TableCell>
                        <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.subzona}</TableCell>
                        <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.sistema}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm text-foreground dark:text-gray-200">v{plano.version}</span>
                            {plano.isActual && (
                              <Badge 
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 border-green-500 text-green-500"
                              >
                                Actual
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Badge 
                              variant="outline"
                              className={cn("font-medium border-2", getEstadoNeonStyle(plano.estado))}
                            >
                              {plano.estado}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleDownload(plano)}
                              className="p-2 hover:bg-muted/50 rounded-md transition-colors group"
                              title="Descargar"
                            >
                              <Download className="w-4 h-4 text-white group-hover:text-white/80" />
                            </button>
                            <button
                              onClick={() => handlePreview(plano)}
                              className="p-2 hover:bg-muted/50 rounded-md transition-colors group"
                              title="Vista previa"
                            >
                              <Eye className="w-4 h-4 text-white group-hover:text-white/80" />
                            </button>
                            <button
                              onClick={() => handleEdit(plano)}
                              className="p-2 hover:bg-muted/50 rounded-md transition-colors group"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4 text-white group-hover:text-white/80" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {visibleCount >= filteredPlanos.length && filteredPlanos.length > 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground dark:text-gray-400 border-t border-border dark:border-slate-700">
                    No hay más resultados
                  </div>
                )}
                {filteredPlanos.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground dark:text-gray-400">
                      No se encontraron planos con los filtros seleccionados
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="cargas" className="space-y-6">
            {/* Drag and Drop Zone */}
            <div 
              className={cn(
                "bg-card dark:bg-slate-800 rounded-lg border-2 border-dashed p-8 transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-border dark:border-slate-700"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-2">
                    Planos
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                    Arrastre su archivo DWG/PDF aquí o usa "Subir DWG/PDF" del TopBar
                  </p>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 mt-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground dark:text-gray-200">
                        {uploadedFile.name}
                      </span>
                      <span className="text-xs text-muted-foreground dark:text-gray-400 uppercase">
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
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>

            {/* Uploaded Files Table */}
            {uploadedPlanos.length > 0 && (
              <div className="bg-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 overflow-hidden">
                <ScrollArea className="h-[400px] custom-scrollbar">
                  <Table>
                    <TableHeader className="bg-muted/50 dark:bg-slate-700/50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="font-semibold bg-muted/50 dark:bg-slate-700/50">Plano</TableHead>
                        <TableHead className="font-semibold bg-muted/50 dark:bg-slate-700/50">Empresa Responsable</TableHead>
                        <TableHead className="font-semibold bg-muted/50 dark:bg-slate-700/50">Zona</TableHead>
                        <TableHead className="font-semibold bg-muted/50 dark:bg-slate-700/50">Subzona</TableHead>
                        <TableHead className="font-semibold bg-muted/50 dark:bg-slate-700/50">Sistema</TableHead>
                        <TableHead className="font-semibold text-center bg-muted/50 dark:bg-slate-700/50">Versión</TableHead>
                        <TableHead className="font-semibold text-center bg-muted/50 dark:bg-slate-700/50">Estado</TableHead>
                        <TableHead className="font-semibold bg-muted/50 dark:bg-slate-700/50">Actualizado</TableHead>
                        <TableHead className="font-semibold text-center bg-muted/50 dark:bg-slate-700/50">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedPlanos.map((plano) => (
                        <TableRow key={plano.id} className="hover:bg-muted/30 dark:hover:bg-slate-700/30">
                          <TableCell>
                            <div>
                              <div className="font-semibold text-foreground dark:text-gray-100">
                                {plano.nombre}
                              </div>
                              <div className="text-xs text-muted-foreground dark:text-gray-500 mt-0.5">
                                {plano.codigo}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.empresaResponsable}</TableCell>
                          <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.zona}</TableCell>
                          <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.subzona}</TableCell>
                          <TableCell className="text-sm text-foreground dark:text-gray-200">{plano.sistema}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm text-foreground dark:text-gray-200">v{plano.version}</span>
                              {plano.isActual && (
                                <Badge 
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4 border-green-500 text-green-500"
                                >
                                  Actual
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Badge 
                                variant="outline"
                                className={cn("font-medium border-2", getEstadoNeonStyle(plano.estado))}
                              >
                                {plano.estado}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-foreground dark:text-gray-200">
                            {format(new Date(plano.actualizado), 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleDownload(plano)}
                                className="p-2 hover:bg-muted/50 rounded-md transition-colors group"
                                title="Descargar"
                              >
                                <Download className="w-4 h-4 text-white group-hover:text-white/80" />
                              </button>
                              <button
                                onClick={() => handlePreview(plano)}
                                className="p-2 hover:bg-muted/50 rounded-md transition-colors group"
                                title="Vista previa"
                              >
                                <Eye className="w-4 h-4 text-white group-hover:text-white/80" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview Modal for Listado */}
        <Dialog open={!!previewPlano} onOpenChange={() => setPreviewPlano(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Vista previa: {previewPlano?.nombre} ({previewPlano?.codigo})
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center h-[500px] bg-muted dark:bg-slate-700 rounded-lg">
              <p className="text-muted-foreground dark:text-gray-400">
                Aquí se mostrará el plano en vista previa
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Modal for PDF Files */}
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-6xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>Vista previa: {uploadedFile?.name}</DialogTitle>
            </DialogHeader>
            {previewFile && (
              <iframe
                src={previewFile}
                className="w-full h-full rounded-lg"
                title="PDF Preview"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Form Modal */}
        <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cargar Plano</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-foreground dark:text-gray-200 mb-2 block">
                  Zona
                </label>
                <Select value={uploadFormData.zona} onValueChange={(value) => setUploadFormData({...uploadFormData, zona: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laminados">Laminados</SelectItem>
                    <SelectItem value="Fundición">Fundición</SelectItem>
                    <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground dark:text-gray-200 mb-2 block">
                  Subzona
                </label>
                <Select value={uploadFormData.subzona} onValueChange={(value) => setUploadFormData({...uploadFormData, subzona: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar subzona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zona A">Zona A</SelectItem>
                    <SelectItem value="Zona B">Zona B</SelectItem>
                    <SelectItem value="Zona C">Zona C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground dark:text-gray-200 mb-2 block">
                  Sistema
                </label>
                <Select value={uploadFormData.sistema} onValueChange={(value) => setUploadFormData({...uploadFormData, sistema: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                    <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                    <SelectItem value="Estructuras">Estructuras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground dark:text-gray-200 mb-2 block">
                  Unidades de Medida
                </label>
                <Select value={uploadFormData.unidadMedida} onValueChange={(value) => setUploadFormData({...uploadFormData, unidadMedida: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Milímetros">Milímetros</SelectItem>
                    <SelectItem value="Pulgadas">Pulgadas</SelectItem>
                    <SelectItem value="Pies">Pies</SelectItem>
                    <SelectItem value="Mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Nota:</strong> Al guardar el archivo, este pasa automáticamente a un estado de "Pendiente de aprobación".
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancelUpload}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveUpload}
                  className="flex-1"
                  disabled={!uploadFormData.zona || !uploadFormData.subzona || !uploadFormData.sistema || !uploadFormData.unidadMedida}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Menu Modal */}
        <Dialog open={showActionMenu} onOpenChange={handleCancelModals}>
          <DialogContent className="max-w-md border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-xl">Opciones de Edición</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 hover:border-primary/50 hover:bg-primary/10 transition-all"
                onClick={() => handleActionMenuOption('permissions')}
              >
                <Shield className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Gestionar Permisos</div>
                  <div className="text-xs text-muted-foreground">Configurar accesos y autorizaciones</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 hover:border-primary/50 hover:bg-primary/10 transition-all"
                onClick={() => handleActionMenuOption('status')}
              >
                <Settings className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Gestionar Status</div>
                  <div className="text-xs text-muted-foreground">Aprobar u observar plano</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 hover:border-primary/50 hover:bg-primary/10 transition-all"
                onClick={() => handleActionMenuOption('delete')}
              >
                <FileX className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Eliminar Plano</div>
                  <div className="text-xs text-muted-foreground">Borrar permanentemente</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 hover:border-primary/50 hover:bg-primary/10 transition-all"
                onClick={() => handleActionMenuOption('rename')}
              >
                <FileEdit className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Renombrar Plano</div>
                  <div className="text-xs text-muted-foreground">Cambiar nombre del archivo</div>
                </div>
              </Button>
            </div>
            <div className="flex justify-center pt-2">
              <Button 
                variant="secondary" 
                onClick={handleCancelModals} 
                className="w-full bg-muted hover:bg-muted/80"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Check Animation */}
        <Dialog open={showSuccessCheck} onOpenChange={setShowSuccessCheck}>
          <DialogContent className="sm:max-w-xs border-0 bg-transparent shadow-none">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-green-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Permissions Modal */}
        <Dialog open={showPermissionsModal} onOpenChange={() => setShowPermissionsModal(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-xl">Gestionar Permisos - {editingPlano?.nombre}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Rol */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Rol:</Label>
                <Select value={permissionsData.rol} onValueChange={(value) => setPermissionsData({...permissionsData, rol: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Usuario SiderPerú">Usuario SiderPerú</SelectItem>
                    <SelectItem value="Usuario Tercero">Usuario Tercero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Acceso a - Changed to checkboxes */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Acceso a:</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="descargar"
                      checked={permissionsData.accesoDescargar}
                      onCheckedChange={(checked) =>
                        setPermissionsData({ ...permissionsData, accesoDescargar: checked as boolean })
                      }
                    />
                    <Label htmlFor="descargar" className="font-normal cursor-pointer">Descargar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subir"
                      checked={permissionsData.accesoSubir}
                      onCheckedChange={(checked) =>
                        setPermissionsData({ ...permissionsData, accesoSubir: checked as boolean })
                      }
                    />
                    <Label htmlFor="subir" className="font-normal cursor-pointer">Subir nueva versión</Label>
                  </div>
                </div>
              </div>

              {/* Empresa */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Empresa:</Label>
                <Select 
                  value={permissionsData.empresa} 
                  onValueChange={(value) => setPermissionsData({...permissionsData, empresa: value})}
                  disabled={permissionsData.rol === "Usuario SiderPerú"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIDERPERÚ">SIDERPERÚ</SelectItem>
                    <SelectItem value="Constructora ABC">Constructora ABC</SelectItem>
                    <SelectItem value="Ingeniería XYZ">Ingeniería XYZ</SelectItem>
                    <SelectItem value="Grupo Industrial">Grupo Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Usuario */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Usuario:</Label>
                <Select 
                  value={permissionsData.usuario} 
                  onValueChange={(value) => setPermissionsData({...permissionsData, usuario: value})}
                  disabled={!permissionsData.empresa}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Juan Pérez</SelectItem>
                    <SelectItem value="user2">María García</SelectItem>
                    <SelectItem value="user3">Carlos López</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Versiones a autorizar */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Versiones a autorizar:</Label>
                <RadioGroup 
                  value={permissionsData.versionesAutorizar} 
                  onValueChange={(value) => setPermissionsData({...permissionsData, versionesAutorizar: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="todas" id="todas" />
                    <Label htmlFor="todas" className="font-normal cursor-pointer">Todas las versiones</Label>
                  </div>
                  <div className="flex items-center space-x-2 gap-3">
                    <RadioGroupItem value="especificar" id="especificar" />
                    <Label htmlFor="especificar" className="font-normal cursor-pointer">Especificar</Label>
                    {permissionsData.versionesAutorizar === "especificar" && (
                      <Input 
                        placeholder="Ej: 1-5, 8, 11-13"
                        value={permissionsData.versionesEspecificas}
                        onChange={(e) => setPermissionsData({...permissionsData, versionesEspecificas: e.target.value})}
                        className="flex-1"
                      />
                    )}
                  </div>
                </RadioGroup>
              </div>

              {/* Tiempo de acceso */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Tiempo de acceso:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-2 block">Frecuencia</Label>
                    <Select value={permissionsData.frecuencia} onValueChange={(value) => setPermissionsData({...permissionsData, frecuencia: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Días">Días</SelectItem>
                        <SelectItem value="Meses">Meses</SelectItem>
                        <SelectItem value="Años">Años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">Colocar número</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={permissionsData.tiempoAcceso}
                      onChange={(e) => setPermissionsData({...permissionsData, tiempoAcceso: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => handleCancelToMenu('permissions')} 
                  className="flex-1 bg-muted hover:bg-muted/80"
                >
                  Cancelar
                </Button>
                <Button onClick={handleActionComplete} className="flex-1">
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Status Modal */}
        <Dialog open={showStatusModal} onOpenChange={() => setShowStatusModal(false)}>
          <DialogContent className="max-w-xl border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-xl">Gestionar Status - {editingPlano?.nombre}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Status */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Status:</Label>
                <RadioGroup value={statusData.status} onValueChange={(value) => setStatusData({...statusData, status: value})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aprobar" id="aprobar" />
                    <Label htmlFor="aprobar" className="font-normal cursor-pointer">Aprobar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="observar" id="observar" />
                    <Label htmlFor="observar" className="font-normal cursor-pointer">Observar</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Comentario with smooth animation */}
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out space-y-4",
                  statusData.status === "observar" 
                    ? "max-h-[600px] opacity-100" 
                    : "max-h-0 opacity-0"
                )}
              >
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Comentario:</Label>
                  <Textarea 
                    placeholder="Escriba sus observaciones aquí... (máximo 1500 palabras)"
                    value={statusData.comentario}
                    onChange={(e) => {
                      const words = e.target.value.split(/\s+/).filter(word => word.length > 0);
                      if (words.length <= 1500) {
                        setStatusData({...statusData, comentario: e.target.value});
                      }
                    }}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {statusData.comentario.split(/\s+/).filter(word => word.length > 0).length}/1500 palabras
                  </p>
                </div>

                {/* Drag and drop file upload */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">O puede subir un archivo (máx. 5MB):</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                      statusData.archivo 
                        ? "border-green-500 bg-green-500/10" 
                        : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.size <= 5 * 1024 * 1024) {
                        setStatusData({ ...statusData, archivo: file });
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {statusData.archivo ? (
                      <div className="space-y-2">
                        <FileText className="h-8 w-8 mx-auto text-green-500" />
                        <p className="text-sm font-medium">{statusData.archivo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(statusData.archivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setStatusData({ ...statusData, archivo: null })}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm">Arrastra tu archivo aquí</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '*/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file && file.size <= 5 * 1024 * 1024) {
                                setStatusData({ ...statusData, archivo: file });
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Seleccionar archivo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => handleCancelToMenu('status')} 
                  className="flex-1 bg-muted hover:bg-muted/80"
                >
                  Cancelar
                </Button>
                <Button onClick={handleActionComplete} className="flex-1">
                  Actualizar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={() => setShowDeleteModal(false)}>
          <DialogContent className="max-w-md border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">¿Está seguro que desea eliminar el plano?</DialogTitle>
            </DialogHeader>
            <div className="flex gap-3 py-4">
              <Button
                variant="destructive"
                onClick={handleActionComplete}
                className="flex-1"
              >
                Sí
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => handleCancelToMenu('delete')} 
                className="flex-1 bg-muted hover:bg-muted/80"
              >
                No
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rename Modal */}
        <Dialog open={showRenameModal} onOpenChange={() => setShowRenameModal(false)}>
          <DialogContent className="max-w-md border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-xl">Renombrar Plano</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Nombre:</Label>
                <Input
                  value={renameData.nombre}
                  onChange={(e) => {
                    const nameExists = MOCK_PLANOS.some(
                      p => p.nombre.toLowerCase() === e.target.value.toLowerCase() && p.id !== editingPlano?.id
                    );
                    setRenameData({ nombre: e.target.value, error: nameExists });
                  }}
                  placeholder="Ingrese el nuevo nombre"
                />
                {renameData.error && (
                  <p className="text-sm text-destructive mt-2">Ya existe un plano con este nombre</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => handleCancelToMenu('rename')} 
                  className="flex-1 bg-muted hover:bg-muted/80"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleActionComplete} 
                  className="flex-1"
                  disabled={renameData.error || !renameData.nombre}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        </div>
      </div>
    </DashboardLayout>
  );
};
