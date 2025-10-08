import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Pencil, Search, Calendar as CalendarIcon, X, Upload, FileText, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data - determine if it's the latest version (isActual)
const MOCK_PLANOS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  codigo: `PL-${String(i + 1).padStart(4, '0')}`,
  nombre: `Plano ${i + 1}`,
  empresaResponsable: ['Constructora ABC', 'Ingeniería XYZ', 'Grupo Industrial'][i % 3],
  zona: ['Laminados', 'Fundición', 'Galvanizado'][i % 3],
  subzona: ['Zona A', 'Zona B', 'Zona C'][i % 3],
  sistema: ['Eléctrico', 'Hidráulico', 'Estructuras'][i % 3],
  version: (i % 4) + 1,
  isActual: i % 4 === 3, // Every 4th item is the latest version
  estado: ['Pendiente', 'Aprobado', 'En revisión'][i % 3],
  actualizado: new Date(2025, Math.floor(i / 10), (i % 28) + 1).toISOString(),
}));

type Plano = typeof MOCK_PLANOS[0];

export const PlanosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zonaFilter, setZonaFilter] = useState<string>("");
  const [subzonaFilter, setSubzonaFilter] = useState<string>("");
  const [sistemaFilter, setSistemaFilter] = useState<string>("");
  const [versionFilter, setVersionFilter] = useState<string>("");
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [visibleCount, setVisibleCount] = useState(15);
  const [previewPlano, setPreviewPlano] = useState<Plano | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
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
    const matchesVersion = !versionFilter || plano.version === parseInt(versionFilter);
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

  const visiblePlanos = filteredPlanos.slice(0, visibleCount);

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
      case 'Pendiente': 
        return 'border-[#f97316] text-[#f97316] bg-transparent shadow-[0_0_8px_rgba(249,115,22,0.3)]';
      case 'Aprobado': 
        return 'border-[#10b981] text-[#10b981] bg-transparent shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 'En revisión': 
        return 'border-[#3b82f6] text-[#3b82f6] bg-transparent shadow-[0_0_8px_rgba(59,130,246,0.3)]';
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
    console.log('Editar:', plano.codigo);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setZonaFilter("");
    setSubzonaFilter("");
    setSistemaFilter("");
    setVersionFilter("");
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
        estado: 'Pendiente',
        actualizado: new Date().toISOString(),
        file: uploadedFile
      };
      setUploadedPlanos([...uploadedPlanos, newPlano]);
      setShowUploadForm(false);
      setUploadedFile(null);
      setUploadFormData({ zona: "", subzona: "", sistema: "", unidadMedida: "" });
      // Show success toast (you can implement this with your toast system)
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
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Nombre o código (PL-0001)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Zona
                  </label>
                  <Select value={zonaFilter} onValueChange={setZonaFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
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

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Subzona
                  </label>
                  <Select value={subzonaFilter} onValueChange={setSubzonaFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
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

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Sistema
                  </label>
                  <Select value={sistemaFilter} onValueChange={setSistemaFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
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

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Versión
                  </label>
                  <Select value={versionFilter} onValueChange={setVersionFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="1">v1</SelectItem>
                      <SelectItem value="2">v2</SelectItem>
                      <SelectItem value="3">v3</SelectItem>
                      <SelectItem value="4">v4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Segunda fila: Estado y Rango de fechas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Estado
                  </label>
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Aprobado">Aprobado</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Fecha desde
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-foreground dark:text-gray-200",
                          !dateFrom && "text-muted-foreground"
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

                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Fecha hasta
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-foreground dark:text-gray-200",
                          !dateTo && "text-muted-foreground"
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

                <div className="md:col-span-1 flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpiar Filtros
                  </Button>
                </div>
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
                    {visiblePlanos.map((plano) => (
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
        </div>
      </div>
    </DashboardLayout>
  );
};
