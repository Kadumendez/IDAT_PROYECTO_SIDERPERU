import { useState, useEffect } from "react";
import { X, Upload, User as UserIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { showToast } from "./Toast";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettingsModal = ({ isOpen, onClose }: UserSettingsModalProps) => {
  const currentUser = getCurrentUser() || "";
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Load saved settings
  useEffect(() => {
    const savedAvatar = localStorage.getItem("profile:avatar") || "";
    setAvatarPreview(savedAvatar);
  }, [isOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("profile:avatar", avatarPreview);
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
          {/* Avatar/Photo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Foto o Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary dark:bg-red-600 flex items-center justify-center text-white overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Subir imagen
                </div>
              </label>
            </div>
          </div>

          {/* Full Name - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value="Kadú Desposorio"
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Email - Read Only */}
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

          {/* Password - Button to change */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Cambiar contraseña
            </button>
          </div>

          {/* Role - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol o cargo
            </label>
            <input
              type="text"
              value="Administrador"
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
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
