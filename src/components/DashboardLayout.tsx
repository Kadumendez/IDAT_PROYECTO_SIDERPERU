import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Upload,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Bell,
  Sparkles
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser() || "";
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isAIChatMinimized, setIsAIChatMinimized] = useState(false);

  // Determine active route from current path
  const getActiveRoute = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/planos") return "planos";
    if (path === "/revisiones") return "revisiones";
    if (path === "/usuarios") return "usuarios";
    return "dashboard";
  };

  const [activeRoute, setActiveRoute] = useState(getActiveRoute());

  // Update active route when location changes
  useEffect(() => {
    setActiveRoute(getActiveRoute());
  }, [location.pathname]);

  // Apply light theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("profile:theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { id: "planos", icon: Layers, label: "Planos (Listado y Cargas)", path: "/planos" },
    { id: "revisiones", icon: FileCheck, label: "Revisiones", path: "#" },
    { id: "usuarios", icon: Users, label: "Usuarios y Roles", path: "#" }
  ];

  const handleMenuClick = (itemId: string, path: string) => {
    setActiveRoute(itemId);
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex w-full overflow-hidden">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-card dark:bg-slate-900 border-r border-border dark:border-slate-800 flex flex-col fixed left-0 top-0 h-screen z-40">
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
              onClick={() => handleMenuClick(item.id, item.path)}
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
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - Fixed */}
        <header className="bg-card dark:bg-slate-900 border-b border-border dark:border-slate-800 px-8 py-4 flex items-center justify-end fixed top-0 right-0 left-64 z-30">
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

            <div 
              className="relative user-menu-container"
            >
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-muted dark:hover:bg-slate-800 px-3 py-2 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary dark:bg-red-600 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
              </button>

              <div className={`absolute right-0 mt-2 w-56 bg-card dark:bg-slate-800 rounded-xl shadow-lg border border-border dark:border-slate-700 py-2 z-50 transition-all duration-200 origin-top ${
                showUserMenu 
                  ? 'opacity-100 scale-y-100 translate-y-0' 
                  : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }`}>
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted dark:hover:bg-slate-700 text-left text-sm transition-colors"
                >
                  <Settings className="w-5 h-5 text-white dark:text-white" />
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
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-auto mt-[73px]">
          {children}
        </main>
      </div>

      {/* User Settings Modal */}
      <UserSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />

      {/* AI Chat Assistant */}
      {showAIChat && !isAIChatMinimized && (
        <div className="fixed bottom-6 left-6 w-96 h-[500px] bg-card dark:bg-slate-800 rounded-2xl shadow-2xl border border-border dark:border-slate-700 flex flex-col z-50 animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#fbbf24]" />
              <h3 className="font-semibold text-foreground dark:text-gray-100">Consultor IA</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAIChatMinimized(true)}
                className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Minimizar"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setShowAIChat(false);
                  setIsAIChatMinimized(false);
                }}
                className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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

      {/* AI Chat Minimized Bubble */}
      {showAIChat && isAIChatMinimized && (
        <button
          onClick={() => setIsAIChatMinimized(false)}
          className="fixed bottom-6 left-6 w-16 h-16 bg-[#3a3830] border-2 border-[#b8860b] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 animate-scale-in group"
          title="Abrir Consultor IA"
        >
          <Sparkles className="w-7 h-7 text-[#fbbf24] group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#fbbf24] rounded-full animate-pulse"></span>
        </button>
      )}
    </div>
  );
};
