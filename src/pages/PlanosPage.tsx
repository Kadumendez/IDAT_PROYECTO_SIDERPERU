import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Pencil, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data
const MOCK_PLANOS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  codigo: `PL-${String(i + 1).padStart(4, '0')}`,
  nombre: `Plano ${i + 1}`,
  zona: ['Zona A', 'Zona B', 'Zona C'][i % 3],
  subzona: ['Subzona 1', 'Subzona 2', 'Subzona 3'][i % 3],
  sistema: ['Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Mecánico'][i % 3],
  version: `v${Math.floor(i / 10) + 1}.${i % 10}`,
  estado: ['Activo', 'Revisión', 'Aprobado', 'Obsoleto'][i % 4],
  actualizado: new Date(2025, 0, (i % 28) + 1).toISOString(),
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
  const [visibleCount, setVisibleCount] = useState(20);
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
    const matchesVersion = !versionFilter || plano.version === versionFilter;
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

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (!target) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        if (visibleCount < filteredPlanos.length) {
          setVisibleCount(prev => Math.min(prev + 20, filteredPlanos.length));
        }
      }
    };

    const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [visibleCount, filteredPlanos.length]);

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'Activo': return 'default';
      case 'Aprobado': return 'default';
      case 'Revisión': return 'secondary';
      case 'Obsoleto': return 'destructive';
      default: return 'outline';
    }
  };

  const handleDownload = (plano: Plano) => {
    console.log('Descargando:', plano.codigo);
  };

  const handlePreview = (plano: Plano) => {
    setPreviewPlano(plano);
  };

  const handleEdit = (plano: Plano) => {
    console.log('Editando:', plano.codigo);
  };

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-foreground dark:text-gray-100 mb-6">
          Planos (Listado y Cargas)
        </h1>

        <Tabs defaultValue="listado" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="listado">Listado</TabsTrigger>
            <TabsTrigger value="cargas">Cargas</TabsTrigger>
          </TabsList>

          <TabsContent value="listado" className="space-y-6">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 bg-card dark:bg-slate-800 p-4 rounded-lg border border-border dark:border-slate-700">
              <Input
                placeholder="Nombre o código (PL-0001)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2"
              />

              <Select value={zonaFilter} onValueChange={setZonaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Zona A">Zona A</SelectItem>
                  <SelectItem value="Zona B">Zona B</SelectItem>
                  <SelectItem value="Zona C">Zona C</SelectItem>
                </SelectContent>
              </Select>

              <Select value={subzonaFilter} onValueChange={setSubzonaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subzona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Subzona 1">Subzona 1</SelectItem>
                  <SelectItem value="Subzona 2">Subzona 2</SelectItem>
                  <SelectItem value="Subzona 3">Subzona 3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sistemaFilter} onValueChange={setSistemaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Sistema Eléctrico">Sistema Eléctrico</SelectItem>
                  <SelectItem value="Sistema Hidráulico">Sistema Hidráulico</SelectItem>
                  <SelectItem value="Sistema Mecánico">Sistema Mecánico</SelectItem>
                </SelectContent>
              </Select>

              <Select value={versionFilter} onValueChange={setVersionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Versión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="v1.0">v1.0</SelectItem>
                  <SelectItem value="v2.0">v2.0</SelectItem>
                  <SelectItem value="v3.0">v3.0</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Revisión">Revisión</SelectItem>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="Obsoleto">Obsoleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Encabezado de resultados */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground dark:text-gray-100">
                Resultados ({filteredPlanos.length})
              </p>
            </div>

            {/* Tabla */}
            <div className="bg-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700">
              <ScrollArea ref={scrollRef} className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plano</TableHead>
                      <TableHead>Zona</TableHead>
                      <TableHead>Subzona</TableHead>
                      <TableHead>Sistema</TableHead>
                      <TableHead>Versión</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Actualizado</TableHead>
                      <TableHead className="text-center">Descargar</TableHead>
                      <TableHead className="text-center">Vista previa</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visiblePlanos.map((plano) => (
                      <TableRow key={plano.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground dark:text-gray-100">
                              {plano.nombre}
                            </div>
                            <div className="text-xs text-muted-foreground dark:text-gray-400">
                              {plano.codigo}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground dark:text-gray-200">{plano.zona}</TableCell>
                        <TableCell className="text-foreground dark:text-gray-200">{plano.subzona}</TableCell>
                        <TableCell className="text-foreground dark:text-gray-200">{plano.sistema}</TableCell>
                        <TableCell className="text-foreground dark:text-gray-200">{plano.version}</TableCell>
                        <TableCell>
                          <Badge variant={getEstadoBadgeVariant(plano.estado)}>
                            {plano.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground dark:text-gray-200">
                          {format(new Date(plano.actualizado), 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleDownload(plano)}
                            className="p-2 hover:bg-muted dark:hover:bg-slate-700 rounded-md transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4 text-foreground dark:text-gray-300" />
                          </button>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handlePreview(plano)}
                            className="p-2 hover:bg-muted dark:hover:bg-slate-700 rounded-md transition-colors"
                            title="Vista previa"
                          >
                            <Eye className="w-4 h-4 text-foreground dark:text-gray-300" />
                          </button>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleEdit(plano)}
                            className="p-2 hover:bg-muted dark:hover:bg-slate-700 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4 text-foreground dark:text-gray-300" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {visibleCount >= filteredPlanos.length && filteredPlanos.length > 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground dark:text-gray-400">
                    No hay más resultados
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
      </div>

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
  );
};
