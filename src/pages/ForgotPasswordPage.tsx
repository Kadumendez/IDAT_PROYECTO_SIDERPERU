import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "@/components/Toast";
import { sendResetEmail } from "@/lib/email";
import siderperuLogo from "@/assets/siderperu-logo.png";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("error", "Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);

    try {
      // Generar token mock para demo (en producción esto debe hacerse en backend)
      const token = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
      const resetLink = `${window.location.origin}/reset-password?token=${token}`;

      // Enviar email real con EmailJS
      await sendResetEmail(email, resetLink);

      // Mensaje neutral por seguridad (no revelar si el email existe)
      showToast("success", "Si el correo existe, te enviaremos un enlace para restablecer tu contraseña");
      navigate("/email-sent");
    } catch (error: any) {
      console.error("Error en recuperación de contraseña:", error);
      showToast("error", "No pudimos enviar el correo, intenta de nuevo");
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed">
              Se enviará un enlace para poder restablecer la contraseña. (El enlace expira en 5 minutos)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Dirección de correo electrónico o Nombre de Usuario
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su correo o nombre de usuario"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full bg-gray-900 dark:bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Volver a inicio de sesión
            </Link>
          </div>

          <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            © 2025 Gestión de Planos — Demo UI
          </footer>
        </div>
      </div>
    </div>
  );
};
