export interface EventoControl {
    id_evento: string;
    tipo_evento: string;
    entidad: string;
    entidad_id: string;
    accion: string;
    antes_json: Record<string, any> | null;
    despues_json: Record<string, any> | null;
    codigo: string;
    severidad: string;
    estado: string;
    descripcion: string;
    responsable: string;
    fecha_objetivo: string | null;
    evidencia_url: string;
    actor_id: string;
    creado_en: string;
}
