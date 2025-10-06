import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { validatePasswordRequirements, doPasswordsMatch } from "@/lib/passwordValidation";
import { showToast } from "@/components/Toast";
import siderperuLogo from "@/assets/siderperu-logo.png";
import { Check, X } from "lucide-react";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);

  // Extraer y validar token de la URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    
    if (!urlToken) {
      setIsValidToken(false);
      return;
    }

    setToken(urlToken);
    
    /**
     * TODO: Validación de token en producción
     * 
     * Aquí deberías hacer una llamada al backend para validar:
     * 1. Que el token existe en la base de datos
     * 2. Que no ha expirado (ej: máximo 5 minutos desde su creación)
     * 3. Que no ha sido usado previamente
     * 
     * Ejemplo:
     * const response = await fetch(`/api/validate-reset-token?token=${urlToken}`);
     * if (!response.ok) {
     *   setIsValidToken(false);
     * }
     */
    
    // Por ahora, aceptamos cualquier token para demo
    setIsValidToken(true);
  }, [searchParams]);

  const requirements = validatePasswordRequirements(newPassword);
  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = doPasswordsMatch(newPassword, confirmPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      showToast("error", "La contraseña no cumple con todos los requisitos");
      return;
    }

    if (!passwordsMatch) {
      showToast("error", "Las contraseñas no coinciden");
      return;
    }

    /**
     * TODO: Actualización de contraseña en producción
     * 
     * Aquí deberías:
     * 1. Enviar el token y la nueva contraseña al backend
     * 2. El backend valida el token nuevamente
     * 3. La contraseña se hashea (bcrypt/argon2) y se guarda en BD
     * 4. El token se marca como usado/invalidado
     * 
     * Ejemplo:
     * await fetch('/api/reset-password', {
     *   method: 'POST',
     *   body: JSON.stringify({ token, newPassword })
     * });
     */

    // Demo: solo mostrar éxito y redirigir
    showToast("success", "Contraseña restablecida con éxito. Ahora puede iniciar sesión nuevamente.");
    setTimeout(() => navigate("/login", { replace: true }), 2000);
  };

  // Mostrar mensaje de token inválido
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-8">
              <img 
                src={siderperuLogo} 
                alt="SIDERPERU" 
                className="h-14 mb-8"
              />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Enlace inválido o expirado
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  El enlace de recuperación no es válido o ha expirado. Por favor, solicita uno nuevo.
                </p>
                <Link 
                  to="/login" 
                  className="inline-block bg-gray-900 dark:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-slate-800 transition-all"
                >
                  Ir a inicio de sesión
                </Link>
              </div>
            </div>
            <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
              © 2025 Gestión de Planos — Demo UI
            </footer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={siderperuLogo} 
              alt="SIDERPERU" 
              className="h-14 mb-8"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Restablecer contraseña
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
              Complete los campos para generar nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="newPassword" 
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password requirements */}
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {req.met ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  )}
                  <span className={req.met ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
                <strong>Demo sin backend:</strong> Este cambio no se guarda todavía. En producción, la contraseña se actualizaría de forma segura en la base de datos.
              </p>
            </div>

            <button
              type="submit"
              disabled={!allRequirementsMet || !passwordsMatch}
              className="w-full bg-gray-900 dark:bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Actualizar contraseña
            </button>
          </form>

          <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            © 2025 Gestión de Planos — Demo UI
          </footer>
        </div>
      </div>
    </div>
  );
};
