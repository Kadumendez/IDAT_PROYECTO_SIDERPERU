import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "@/lib/auth";
import { showToast } from "@/components/Toast";
import { UserSettingsModal } from "@/components/UserSettingsModal";
import siderperuLogo from "@/assets/siderperu-logo.png";
import { X } from "lucide-react";
import { 
  LayoutDashboard, 
  Layers, 
  FileCheck, 
  Users, 
  Folder,
  RotateCcw,
  Upload,
  Settings,
  LogOut,
  ChevronDown,
  History,
  BarChart3,
  FolderUp,
  User,
  Bell,
  Sparkles
} from "lucide-react";

/**
 * DEMO DATA
 * Change these arrays to customize metrics and activity feed
 */
const METRICS = [
  { icon: Folder, label: "Planos totales", value: 128 },
  { icon: RotateCcw, label: "Revisiones pendientes", value: 5 },
  { icon: FolderUp, label: "Subidos esta semana", value: 12 }
];

const ACTIVITIES = [
  { time: "10:45 am", text: "PL-0045 revisado por José (Estructuras • v1)" },
  { time: "10:45 am", text: "PL-0028 aprobado por Supervisor (Tuberías)" },
  { time: "10:45 am", text: "PL-0037 subido por Nayeli (Pintura • v3)" },
  { time: "10:45 am", text: "Nueva versión PL-0015 v4 (Mecánico)" },
  { time: "Ayer", text: "Carga masiva de 4 planos (Calderería)" },
  { time: "Ayer", text: "PL-0022 rechazado por Supervisor (Instrumentación)" },
  { time: "Ayer", text: "PL-0050 subido por Gino (Civil • v1)" },
  { time: "Ayer", text: "PL-0039 corregido por Miranda (Eléctrico • v2)" },
  { time: "Ayer", text: "PL-0048 aprobado por QA (Fundición)" },
  { time: "Ayer", text: "Carga masiva de 8 planos (Galvanizado)" }
];

const QUICK_ACCESS = [
  { icon: BarChart3, label: "Ir a Planos (Listado)", path: "/planos" },
  { icon: History, label: "Historial y versiones", path: "/historial" },
  { icon: FolderUp, label: "Mis archivos subidos", path: "/uploads" }
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser() || "";
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [showAIChat, setShowAIChat] = useState(false);

  // Apply light theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("profile:theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogout = () => {
    logout();
    showToast("success", "Sesión cerrada");
    navigate("/login", { replace: true });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = getInitials(currentUser);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "planos", icon: Layers, label: "Planos (Listado y Cargas)" },
    { id: "revisiones", icon: FileCheck, label: "Revisiones" },
    { id: "usuarios", icon: Users, label: "Usuarios y Roles" }
  ];

  return (
    <div className="min-h-screen bg-background dark flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-card dark:bg-slate-900 border-r border-border dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-border dark:border-slate-800">
          <img src={siderperuLogo} alt="SIDERPERU" className="h-12 mb-4" />
          <h1 className="text-xl font-bold text-foreground dark:text-gray-100">
            Gestión de Planos
          </h1>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Bitácora • Versiones
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveRoute(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeRoute === item.id
                  ? "bg-primary/10 dark:bg-red-500/10 text-primary dark:text-red-400 border border-primary/20 dark:border-red-500/20"
                  : "text-muted-foreground dark:text-gray-400 hover:bg-muted dark:hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card dark:bg-slate-900 border-b border-border dark:border-slate-800 px-8 py-4 flex items-center justify-end">
          {/* Right side user info with buttons */}
          <div className="flex items-center gap-3">
            {/* Consultor IA - Yellow/Amber style */}
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3a3830] border border-[#b8860b] text-[#fbbf24] hover:bg-[#454035] transition-all font-medium text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-[#fbbf24]"></div>
              Consultor IA
            </button>
            
            {/* Subir DWG/PDF - Green style */}
            <button
              onClick={() => navigate("/planos")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a3a2a] border border-[#34d399] text-[#34d399] hover:bg-[#234d38] transition-all font-medium text-sm"
            >
              <Upload className="w-4 h-4" />
              Subir DWG/PDF
            </button>

            <span className="text-sm font-medium text-foreground dark:text-gray-200 ml-2">
              Kadú Desposorio
            </span>
            
            <button className="relative p-2 hover:bg-muted dark:hover:bg-slate-800 rounded-xl transition-all">
              <Bell className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-muted dark:hover:bg-slate-800 px-3 py-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary dark:bg-red-600 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card dark:bg-slate-800 rounded-xl shadow-lg border border-border dark:border-slate-700 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted dark:hover:bg-slate-700 text-left text-sm transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-foreground dark:text-gray-200">Ajustes de usuario</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted dark:hover:bg-slate-700 text-left text-sm text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {METRICS.map((metric, index) => (
              <div
                key={index}
                className="bg-card dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl font-bold text-foreground dark:text-gray-100 mb-2">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {metric.label}
                    </p>
                  </div>
                  <metric.icon className="w-10 h-10 text-muted-foreground dark:text-gray-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="bg-card dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <RotateCcw className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">
                Actividad reciente
              </h2>
            </div>

            <div className="space-y-3">
              {ACTIVITIES.map((activity, index) => (
                <div
                  key={index}
                  className="flex gap-4 py-2.5 border-b border-border dark:border-slate-700 last:border-0"
                >
                  <span className="text-sm font-medium text-muted-foreground dark:text-gray-500 w-20 flex-shrink-0">
                    {activity.time}
                  </span>
                  <span className="text-sm text-foreground dark:text-gray-300 flex-1">
                    {activity.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-card dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">
                Accesos rápidos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUICK_ACCESS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-muted dark:bg-slate-700/50 border border-border dark:border-slate-600 hover:bg-muted/80 dark:hover:bg-slate-700 transition-all text-left"
                >
                  <item.icon className="w-5 h-5 text-foreground dark:text-gray-300" />
                  <span className="text-sm font-medium text-foreground dark:text-gray-200">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* User Settings Modal */}
      <UserSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />

      {/* AI Chat Assistant */}
      {showAIChat && (
        <div className="fixed bottom-6 left-6 w-96 h-[500px] bg-card dark:bg-slate-800 rounded-2xl shadow-2xl border border-border dark:border-slate-700 flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary dark:text-red-400" />
              <h3 className="font-semibold text-foreground dark:text-gray-100">Consultor IA</h3>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            <div className="space-y-4">
              <div className="bg-muted dark:bg-slate-700 rounded-xl p-3 max-w-[80%]">
                <p className="text-sm text-foreground dark:text-gray-200">
                  ¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 rounded-xl border border-border dark:border-slate-600 bg-background dark:bg-slate-900 text-foreground dark:text-gray-100 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
