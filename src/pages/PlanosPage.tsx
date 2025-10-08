import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Pencil, Search, Calendar as CalendarIcon } from "lucide-react";
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-1">
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

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Zona
                  </label>
                  <Select value={zonaFilter} onValueChange={setZonaFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
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
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
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
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
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
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2 block">
                    Estado
                  </label>
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger className="[&>span]:text-foreground dark:[&>span]:text-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Aprobado">Aprobado</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
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
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
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
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
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
                              className="p-2 hover:bg-primary/10 rounded-md transition-colors group"
                              title="Descargar"
                            >
                              <Download className="w-4 h-4 text-primary group-hover:text-primary/80" />
                            </button>
                            <button
                              onClick={() => handlePreview(plano)}
                              className="p-2 hover:bg-primary/10 rounded-md transition-colors group"
                              title="Vista previa"
                            >
                              <Eye className="w-4 h-4 text-primary group-hover:text-primary/80" />
                            </button>
                            <button
                              onClick={() => handleEdit(plano)}
                              className="p-2 hover:bg-primary/10 rounded-md transition-colors group"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4 text-primary group-hover:text-primary/80" />
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

          <TabsContent value="cargas">
            <div className="bg-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-12 text-center">
              <h3 className="text-xl font-semibold text-foreground dark:text-gray-100 mb-2">
                Cargas de Planos
              </h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Esta sección estará disponible próximamente
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Modal */}
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
        </div>
      </div>
    </DashboardLayout>
  );
};
