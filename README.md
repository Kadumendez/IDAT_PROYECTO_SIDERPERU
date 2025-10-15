# 🏗️ IDAT_PROYECTO_SIDERPERU

Aplicación web desarrollada con **React + Vite + TypeScript**, conectada a **Supabase** como backend.  
Permite la **gestión de planos técnicos**, usuarios y zonas dentro de una empresa siderúrgica.  
El proyecto se desarrolló como parte del módulo de **Proyecto Integrador 1** del programa de **Desarrollo de Tecnología de la Información** en IDAT.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React + Vite** → Frontend moderno y rápido.  
- 🧠 **TypeScript** → Tipado fuerte y mantenimiento limpio.  
- 🗄️ **Supabase** → Base de datos PostgreSQL, autenticación JWT, API REST y almacenamiento.  
- 🎨 **TailwindCSS** → Estilos responsivos y consistentes.  
- 🧩 **GitHub** → Control de versiones y publicación del código fuente.  

---

## 🧩 Arquitectura general del sistema

La aplicación está estructurada en capas claras para facilitar el mantenimiento y escalabilidad:

Frontend (React)
├─ src/
│ ├─ pages/ → Vistas principales (Dashboard, Planos, Usuarios, Configuración)
│ ├─ components/ui/ → Componentes reutilizables (Layout, Modales, Inputs, Toasts)
│ ├─ components/supabase/ → Servicios de conexión (users.tsx, planos.tsx)
│ ├─ types/ → Tipados de entidades (plano, usuario, zona, etc.)
│ ├─ lib/ → Configuración del cliente Supabase
│ └─ hooks/ → Lógica compartida (autenticación, estados)
│
└─ .env → Variables de entorno con claves del proyecto



### 🧱 Backend (Supabase)
- **Base de datos:** PostgreSQL (tablas, vistas y relaciones)
- **API REST automática:** generada por Supabase (`/rest/v1/`)
- **Autenticación JWT**
- **Reglas RLS (Row-Level Security)** para proteger los datos por usuario
- **Almacenamiento de archivos (Storage)**, preparado para guardar planos técnicos

---

## ⚙️ Instalación y ejecución local

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Kadumendez/IDAT_PROYECTO_SIDERPERU.git
cd IDAT_PROYECTO_SIDERPERU


###2️⃣ Instalar dependencias
npm install

### 3️⃣ Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

xxxxxx


