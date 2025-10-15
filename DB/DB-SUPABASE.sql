CREATE TABLE public.evento_control (
  id_evento uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo_evento text NOT NULL,
  entidad text NOT NULL,
  entidad_id uuid,
  accion text,
  antes_json jsonb,
  despues_json jsonb,
  codigo text,
  severidad text,
  estado text,
  descripcion text,
  responsable text,
  fecha_objetivo date,
  evidencia_url text,
  actor_id uuid,
  creado_en timestamp with time zone DEFAULT now(),
  CONSTRAINT evento_control_pkey PRIMARY KEY (id_evento)
);
CREATE TABLE public.maquina (
  id_maquina uuid NOT NULL DEFAULT gen_random_uuid(),
  id_subzona uuid NOT NULL,
  codigo text NOT NULL,
  nombre text NOT NULL,
  tipo text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT maquina_pkey PRIMARY KEY (id_maquina),
  CONSTRAINT maquina_id_subzona_fkey FOREIGN KEY (id_subzona) REFERENCES public.subzona(id_subzona)
);
CREATE TABLE public.plano (
  id_plano uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nombre text NOT NULL,
  estado text NOT NULL DEFAULT 'Borrador'::text,
  id_zona uuid,
  id_subzona uuid,
  id_maquina uuid,
  creado_por uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT plano_pkey PRIMARY KEY (id_plano),
  CONSTRAINT plano_id_zona_fkey FOREIGN KEY (id_zona) REFERENCES public.zona(id_zona),
  CONSTRAINT plano_id_subzona_fkey FOREIGN KEY (id_subzona) REFERENCES public.subzona(id_subzona),
  CONSTRAINT plano_id_maquina_fkey FOREIGN KEY (id_maquina) REFERENCES public.maquina(id_maquina),
  CONSTRAINT plano_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id)
);
CREATE TABLE public.planoarchivo (
  id_archivo uuid NOT NULL DEFAULT gen_random_uuid(),
  id_version uuid NOT NULL,
  storage_path text NOT NULL,
  formato text NOT NULL,
  tamano_bytes bigint,
  checksum text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT planoarchivo_pkey PRIMARY KEY (id_archivo),
  CONSTRAINT planoarchivo_id_version_fkey FOREIGN KEY (id_version) REFERENCES public.planoversion(id_version)
);
CREATE TABLE public.planoversion (
  id_version uuid NOT NULL DEFAULT gen_random_uuid(),
  id_plano uuid NOT NULL,
  nro_version integer NOT NULL,
  estado text NOT NULL DEFAULT 'Vigente'::text,
  comentarios text,
  creado_por uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT planoversion_pkey PRIMARY KEY (id_version),
  CONSTRAINT planoversion_id_plano_fkey FOREIGN KEY (id_plano) REFERENCES public.plano(id_plano),
  CONSTRAINT planoversion_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuario(id)
);
CREATE TABLE public.subzona (
  id_subzona uuid NOT NULL DEFAULT gen_random_uuid(),
  id_zona uuid NOT NULL,
  codigo text NOT NULL,
  nombre text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subzona_pkey PRIMARY KEY (id_subzona),
  CONSTRAINT subzona_id_zona_fkey FOREIGN KEY (id_zona) REFERENCES public.zona(id_zona)
);
CREATE TABLE public.usuario (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  role text,
  tipo text,
  empresa text,
  zonas ARRAY,
  CONSTRAINT usuario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.zona (
  id_zona uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nombre text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT zona_pkey PRIMARY KEY (id_zona)
);
