import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "@/components/Toast";
import siderperuLogo from "@/assets/siderperu-logo.png";

/**
 * OPTIONAL: EmailJS Integration
 * To enable real email sending:
 * 1. Install: npm install @emailjs/browser
 * 2. Replace SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY with your EmailJS credentials
 * 3. Set useMockEmail to false
 */

// const SERVICE_ID = "your_service_id";
// const TEMPLATE_ID = "your_template_id";
// const PUBLIC_KEY = "your_public_key";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const useMockEmail = true; // Set to false to use real EmailJS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (useMockEmail) {
        // SIMULATED mode - just wait and show success
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast("success", "Enlace enviado, expira en 5 minutos");
        navigate("/email-sent");
      } else {
        // REAL EmailJS mode (uncomment when ready)
        // const emailjs = await import("@emailjs/browser");
        // await emailjs.send(
        //   SERVICE_ID,
        //   TEMPLATE_ID,
        //   {
        //     to_email: email,
        //     reset_link: `${window.location.origin}/reset-password`
        //   },
        //   PUBLIC_KEY
        // );
        showToast("success", "Enlace enviado, expira en 5 minutos");
        navigate("/email-sent");
      }
    } catch (error) {
      showToast("error", "Error al enviar el correo. Inténtelo nuevamente.");
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
              className="w-full bg-gray-900 dark:bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Solicitar Código"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              "Volver a inicio de sesión"
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
