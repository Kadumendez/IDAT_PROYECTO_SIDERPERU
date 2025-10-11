import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Download, Eye, History, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data for history and versions
const MOCK_HISTORY = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  codigo: `PL-${String(Math.floor(i / 3) + 1).padStart(4, '0')}`,
  nombre: [
    'Planta General Acería',
    'Sistema Eléctrico Principal',
    'Layout Tubería Industrial',
    'Red Contraincendios',
    'Diagrama Unifilar Completo',
  ][Math.floor(i / 3) % 5],
  empresaResponsable: ['Constructora ABC', 'Ingeniería XYZ', 'Grupo Industrial'][i % 3],
  zona: ['Laminados', 'Fundición', 'Galvanizado'][i % 3],
  sistema: ['Eléctrico', 'Hidráulico', 'Estructuras'][i % 3],
  version: (i % 3) + 1,
  estado: ['PENDIENTE', 'APROBADO', 'COMENTADO'][i % 3],
  fechaCambio: new Date(2025, 0, 25 - Math.floor(i / 2)).toISOString(),
  modificadoPor: ['Ing. Carlos Mendoza', 'Ing. María Torres', 'Ing. Juan Pérez'][i % 3],
  accion: ['Subida inicial', 'Revisión aprobada', 'Comentarios agregados', 'Nueva versión'][i % 4],
}));

export const HistorialPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zonaFilter, setZonaFilter] = useState<string>("all");
  const [sistemaFilter, setSistemaFilter] = useState<string>("all");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [accionFilter, setAccionFilter] = useState<string>("all");

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
        return 'bg-[#1a3a2a] border border-[#34d399] text-[#34d399]';
      case 'PENDIENTE':
        return 'bg-[#3a3830] border border-[#fbbf24] text-[#fbbf24]';
      case 'COMENTADO':
        return 'bg-[#2a3a4a] border border-[#60a5fa] text-[#60a5fa]';
      default:
        return 'bg-[#3a2a2a] border border-[#f87171] text-[#f87171]';
    }
  };

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = zonaFilter === "all" || item.zona === zonaFilter;
    const matchesSistema = sistemaFilter === "all" || item.sistema === sistemaFilter;
    const matchesEstado = estadoFilter === "all" || item.estado === estadoFilter;
    const matchesAccion = accionFilter === "all" || item.accion === accionFilter;
    
    return matchesSearch && matchesZona && matchesSistema && matchesEstado && matchesAccion;
  });

  // Sort by most recent
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    return new Date(b.fechaCambio).getTime() - new Date(a.fechaCambio).getTime();
  });

  const clearFilters = () => {
    setSearchTerm("");
    setZonaFilter("all");
    setSistemaFilter("all");
    setEstadoFilter("all");
    setAccionFilter("all");
  };

  return (
    <DashboardLayout pageTitle="Historial y Versiones">
      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="bg-card dark:bg-slate-800 p-6 rounded-lg border border-border dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre o código"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-foreground"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Zona
              </label>
              <Select value={zonaFilter} onValueChange={setZonaFilter}>
                <SelectTrigger className="[&>span]:text-foreground">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las zonas</SelectItem>
                  <SelectItem value="Laminados">Laminados</SelectItem>
                  <SelectItem value="Fundición">Fundición</SelectItem>
                  <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sistema
              </label>
              <Select value={sistemaFilter} onValueChange={setSistemaFilter}>
                <SelectTrigger className="[&>span]:text-foreground">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sistemas</SelectItem>
                  <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                  <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                  <SelectItem value="Estructuras">Estructuras</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Estado
              </label>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="[&>span]:text-foreground">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="APROBADO">APROBADO</SelectItem>
                  <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                  <SelectItem value="COMENTADO">COMENTADO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Acción
              </label>
              <Select value={accionFilter} onValueChange={setAccionFilter}>
                <SelectTrigger className="[&>span]:text-foreground">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  <SelectItem value="Subida inicial">Subida inicial</SelectItem>
                  <SelectItem value="Revisión aprobada">Revisión aprobada</SelectItem>
                  <SelectItem value="Comentarios agregados">Comentarios agregados</SelectItem>
                  <SelectItem value="Nueva versión">Nueva versión</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            Resultados ({sortedHistory.length})
          </p>
        </div>

        {/* Table */}
        <div className="bg-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 overflow-hidden">
          <div className="h-[600px] overflow-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Plano</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Empresa</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Zona</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Versión</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Estado</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Acción</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Modificado Por</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Fecha</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-foreground">{item.nombre}</div>
                        <div className="text-xs text-muted-foreground">{item.codigo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{item.empresaResponsable}</TableCell>
                    <TableCell className="text-sm text-foreground">{item.zona}</TableCell>
                    <TableCell className="text-sm text-center text-foreground">v{item.version}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge className={`${getStatusColor(item.estado)} flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium`}>
                          {getStatusIcon(item.estado)}
                          {item.estado}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{item.accion}</TableCell>
                    <TableCell className="text-sm text-foreground">{item.modificadoPor}</TableCell>
                    <TableCell className="text-sm text-center text-foreground">
                      {format(new Date(item.fechaCambio), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-muted/50 rounded-md transition-colors"
                          title="Ver detalles"
                        >
                          <History className="w-4 h-4 text-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted/50 rounded-md transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
