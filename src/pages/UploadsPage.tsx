import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Download, Eye, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data for uploaded files
const MOCK_UPLOADS = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  codigo: `UP-${String(i + 1).padStart(4, '0')}`,
  nombre: [
    'Plano Estructural Rev-A.pdf',
    'Sistema Eléctrico Principal.dwg',
    'Layout Tubería Industrial.pdf',
    'Red Contraincendios Sector B.dwg',
    'Diagrama Unifilar Completo.pdf',
  ][i % 5],
  empresaResponsable: ['Constructora ABC', 'Ingeniería XYZ', 'Grupo Industrial'][i % 3],
  zona: ['Laminados', 'Fundición', 'Galvanizado'][i % 3],
  subzona: ['Zona A', 'Zona B', 'Zona C'][i % 3],
  sistema: ['Eléctrico', 'Hidráulico', 'Estructuras'][i % 3],
  version: Math.floor(i / 5) + 1,
  estado: ['PENDIENTE', 'APROBADO', 'COMENTADO'][i % 3],
  fechaCarga: new Date(2025, 0, 25 - i).toISOString(),
  aprobador: ['Ing. Carlos Mendoza', 'Ing. María Torres', 'Ing. Juan Pérez'][i % 3],
  tamaño: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
}));

export const UploadsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zonaFilter, setZonaFilter] = useState<string>("all");
  const [sistemaFilter, setSistemaFilter] = useState<string>("all");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");

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

  const filteredUploads = MOCK_UPLOADS.filter((upload) => {
    const matchesSearch = searchTerm === "" || 
      upload.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = zonaFilter === "all" || upload.zona === zonaFilter;
    const matchesSistema = sistemaFilter === "all" || upload.sistema === sistemaFilter;
    const matchesEstado = estadoFilter === "all" || upload.estado === estadoFilter;
    
    return matchesSearch && matchesZona && matchesSistema && matchesEstado;
  });

  // Sort by most recent
  const sortedUploads = [...filteredUploads].sort((a, b) => {
    return new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime();
  });

  const clearFilters = () => {
    setSearchTerm("");
    setZonaFilter("all");
    setSistemaFilter("all");
    setEstadoFilter("all");
  };

  return (
    <DashboardLayout pageTitle="Mis Archivos Subidos">
      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="bg-card dark:bg-slate-800 p-6 rounded-lg border border-border dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
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

            <div className="col-span-2 flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            Resultados ({sortedUploads.length})
          </p>
        </div>

        {/* Table */}
        <div className="bg-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 overflow-hidden">
          <div className="h-[600px] overflow-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Código</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Nombre</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Empresa</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Zona</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-foreground">Sistema</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Estado</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Fecha Carga</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Tamaño</TableHead>
                  <TableHead className="font-semibold bg-background dark:bg-slate-800 sticky top-0 z-10 text-center text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUploads.map((upload) => (
                  <TableRow key={upload.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm text-foreground">{upload.codigo}</TableCell>
                    <TableCell className="text-sm text-foreground font-medium">{upload.nombre}</TableCell>
                    <TableCell className="text-sm text-foreground">{upload.empresaResponsable}</TableCell>
                    <TableCell className="text-sm text-foreground">{upload.zona}</TableCell>
                    <TableCell className="text-sm text-foreground">{upload.sistema}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge className={`${getStatusColor(upload.estado)} flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium`}>
                          {getStatusIcon(upload.estado)}
                          {upload.estado}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-center text-foreground">
                      {format(new Date(upload.fechaCarga), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="text-sm text-center text-foreground">{upload.tamaño}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-muted/50 rounded-md transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4 text-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted/50 rounded-md transition-colors"
                          title="Vista previa"
                        >
                          <Eye className="w-4 h-4 text-foreground" />
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
