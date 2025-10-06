# Sistema de Gestión de Planos SIDERPERU

## 🔐 Usuarios Demo

Para probar el sistema, utiliza estos usuarios válidos:
- `kadudesposorio.macris@gmail.com`
- `admin`
- `supervisor`

**Contraseña (case-sensitive):** `ContraseñaSegura123`

## 📋 Características

### Autenticación
- Login con validación de usuario y contraseña
- Bloqueo automático tras 3 intentos fallidos (6 minutos)
- Sistema de recuperación de contraseña (modo simulado)
- Persistencia de sesión con localStorage
- Redirección automática si ya está autenticado

### Seguridad
- Validación de contraseñas con requisitos:
  - Mínimo 8 caracteres
  - Una mayúscula y una minúscula
  - Al menos un número
  - Carácter especial
- Mensajes de error específicos para cada caso
- Contador de bloqueo visible en tiempo real

### Dashboard
- **Tema oscuro por defecto** (corporativo)
- Sidebar con navegación
- 3 métricas principales (datos demo)
- Feed de actividad reciente
- Accesos rápidos
- Modal de configuración de usuario
- Cierre de sesión con confirmación

### Notificaciones
- Toast personalizado con animación slide-in
- Tipos: success y error
- Auto-hide a los 5 segundos
- Posición fija bottom-right

## 🎨 Personalización

### Cambiar Métricas del Dashboard
Edita en `src/pages/DashboardPage.tsx`:
```typescript
const METRICS = [
  { icon: Folder, label: "Planos totales", value: 128 },
  { icon: RotateCcw, label: "Revisiones pendientes", value: 5 },
  { icon: FolderUp, label: "Subidos esta semana", value: 12 }
];
```

### Cambiar Actividad Reciente
Edita en `src/pages/DashboardPage.tsx`:
```typescript
const ACTIVITIES = [
  { time: "10:45 am", text: "PL-0045 revisado por José..." },
  // ... más actividades
];
```

### Activar EmailJS (opcional)
Para enviar correos reales desde recuperación de contraseña:

1. Instala EmailJS:
```bash
npm install @emailjs/browser
```

2. Edita `src/pages/ForgotPasswordPage.tsx`:
```typescript
const SERVICE_ID = "tu_service_id";
const TEMPLATE_ID = "tu_template_id";
const PUBLIC_KEY = "tu_public_key";
const useMockEmail = false; // Cambiar a false
```

## 🛠️ Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons (iconos)
- localStorage (persistencia)

## 📁 Estructura

```
src/
├── assets/
│   ├── siderperu-logo.png
│   └── fondo-industrial.jpg
├── components/
│   ├── Toast.tsx
│   ├── ToastContainer.tsx
│   ├── ProtectedRoute.tsx
│   └── UserSettingsModal.tsx
├── lib/
│   ├── auth.ts
│   ├── passwordValidation.ts
│   └── utils.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── EmailSentPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── DashboardPage.tsx
│   ├── PlanosPage.tsx (en construcción)
│   ├── HistorialPage.tsx (en construcción)
│   └── UploadsPage.tsx (en construcción)
└── App.tsx
```

## 🚀 Ejecutar

```bash
npm install
npm run dev
```

## 📝 Notas

- El sistema usa localStorage para autenticación demo
- La diagonal del login va de top-left a bottom-right
- El dashboard está en tema oscuro por defecto
- Los toasts se auto-descartan a los 5 segundos
- El bloqueo de usuario persiste incluso al recargar
