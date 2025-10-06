import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { showToast } from "./Toast";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettingsModal = ({ isOpen, onClose }: UserSettingsModalProps) => {
  const currentUser = getCurrentUser() || "";
  const [name, setName] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"es" | "en">("es");

  // Load saved settings
  useEffect(() => {
    const savedName = localStorage.getItem("profile:name") || "";
    const savedTheme = (localStorage.getItem("profile:theme") as "dark" | "light") || "dark";
    const savedLang = (localStorage.getItem("profile:lang") as "es" | "en") || "es";
    
    setName(savedName);
    setTheme(savedTheme);
    setLanguage(savedLang);
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("profile:name", name);
    localStorage.setItem("profile:theme", theme);
    localStorage.setItem("profile:lang", language);

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    showToast("success", "Configuración guardada exitosamente");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ajustes de usuario
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={currentUser}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tema
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "dark" | "light")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="dark">Oscuro (Dark)</option>
              <option value="light">Claro (Light)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "es" | "en")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="es">Español (ES)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
