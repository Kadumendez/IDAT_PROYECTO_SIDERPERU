import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Upload } from "lucide-react";

interface UploadPlanoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  onConfirm: (data: PlanoFormData) => void;
  existingPlanos: Array<{ nombre: string; version: number; zona: string; subzona: string; sistema: string }>;
}

export interface PlanoFormData {
  tipo: 'nuevo' | 'version';
  nombre?: string;
  zona: string;
  subzona: string;
  sistema: string;
  planoExistente?: {
    nombre: string;
    version: number;
  };
}

export const UploadPlanoModal = ({ open, onOpenChange, fileName, onConfirm, existingPlanos }: UploadPlanoModalProps) => {
  const [tipo, setTipo] = useState<'nuevo' | 'version'>('nuevo');
  const [formData, setFormData] = useState<PlanoFormData>({
    tipo: 'nuevo',
    nombre: '',
    zona: '',
    subzona: '',
    sistema: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlano, setSelectedPlano] = useState<{ nombre: string; version: number } | null>(null);

  const handleConfirm = () => {
    if (tipo === 'nuevo') {
      if (formData.nombre && formData.zona && formData.subzona && formData.sistema) {
        onConfirm({
          ...formData,
          tipo: 'nuevo',
        });
        handleReset();
      }
    } else {
      if (selectedPlano && formData.zona && formData.subzona && formData.sistema) {
        onConfirm({
          ...formData,
          tipo: 'version',
          planoExistente: selectedPlano,
        });
        handleReset();
      }
    }
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setTipo('nuevo');
    setFormData({
      tipo: 'nuevo',
      nombre: '',
      zona: '',
      subzona: '',
      sistema: '',
    });
    setSearchTerm('');
    setSelectedPlano(null);
  };

  const filteredPlanos = existingPlanos.filter(p => {
    const matchesSearch = searchTerm === '' || 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = !formData.zona || p.zona === formData.zona;
    const matchesSubzona = !formData.subzona || p.subzona === formData.subzona;
    const matchesSistema = !formData.sistema || p.sistema === formData.sistema;
    
    return matchesSearch && matchesZona && matchesSubzona && matchesSistema;
  });

  const uniquePlanos = Array.from(
    new Map(filteredPlanos.map(p => [p.nombre, p])).values()
  );

  const isFormValid = () => {
    if (tipo === 'nuevo') {
      return formData.nombre && formData.zona && formData.subzona && formData.sistema;
    } else {
      return selectedPlano && formData.zona && formData.subzona && formData.sistema;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Plano a la Plataforma</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del archivo */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-foreground dark:text-gray-200">
              Archivo: <span className="text-primary font-semibold">{fileName}</span>
            </p>
          </div>

          {/* Tipo de Plano */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tipo de Plano</Label>
            <RadioGroup
              value={tipo}
              onValueChange={(value) => {
                setTipo(value as 'nuevo' | 'version');
                setFormData({ tipo: value as 'nuevo' | 'version', nombre: '', zona: '', subzona: '', sistema: '' });
                setSelectedPlano(null);
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nuevo" id="nuevo" />
                <Label htmlFor="nuevo" className="cursor-pointer font-medium">Plano Nuevo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="version" id="version" />
                <Label htmlFor="version" className="cursor-pointer font-medium">Nueva Versión</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Campos para Plano Nuevo */}
          {tipo === 'nuevo' && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="nombre">Nombre de Plano</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Planta General Acería"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zona">Zona</Label>
                  <Select
                    value={formData.zona}
                    onValueChange={(value) => setFormData({ ...formData, zona: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laminados">Laminados</SelectItem>
                      <SelectItem value="Fundición">Fundición</SelectItem>
                      <SelectItem value="Galvanizado">Galvanizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subzona">Subzona</Label>
                  <Select
                    value={formData.subzona}
                    onValueChange={(value) => setFormData({ ...formData, subzona: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zona A">Zona A</SelectItem>
                      <SelectItem value="Zona B">Zona B</SelectItem>
                      <SelectItem value="Zona C">Zona C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sistema">Sistema</Label>
                  <Select
                    value={formData.sistema}
                    onValueChange={(value) => setFormData({ ...formData, sistema: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                      <SelectItem value="Estructuras">Estructuras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Campos para Nueva Versión */}
          {tipo === 'version' && (
            <div className="space-y-4 border-t pt-4">
              {/* Filtros de búsqueda */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar Plano</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre de plano..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Zona</Label>
                    <Select
                      value={formData.zona}
                      onValueChange={(value) => setFormData({ ...formData, zona: value })}
                    >
                      <SelectTrigger className="mt-2">
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

                  <div>
                    <Label>Subzona</Label>
                    <Select
                      value={formData.subzona}
                      onValueChange={(value) => setFormData({ ...formData, subzona: value })}
                    >
                      <SelectTrigger className="mt-2">
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

                  <div>
                    <Label>Sistema</Label>
                    <Select
                      value={formData.sistema}
                      onValueChange={(value) => setFormData({ ...formData, sistema: value })}
                    >
                      <SelectTrigger className="mt-2">
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
                </div>
              </div>

              {/* Selección de plano */}
              <div>
                <Label>Seleccionar Plano Existente</Label>
                <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                  {uniquePlanos.length > 0 ? (
                    uniquePlanos.map((plano, index) => {
                      const maxVersion = Math.max(
                        ...filteredPlanos.filter(p => p.nombre === plano.nombre).map(p => p.version)
                      );
                      const isSelected = selectedPlano?.nombre === plano.nombre;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedPlano({ nombre: plano.nombre, version: maxVersion })}
                          className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                            isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <div className="font-medium text-sm">{plano.nombre}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {plano.zona} • {plano.subzona} • {plano.sistema} • v{maxVersion} Actual
                          </div>
                          {isSelected && (
                            <div className="text-xs text-primary font-semibold mt-1">
                              Nueva versión será: v{maxVersion + 1}
                            </div>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p className="text-sm">No se encontraron planos con los filtros seleccionados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isFormValid()}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Plano
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
