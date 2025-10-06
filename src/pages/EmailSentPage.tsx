import { Link } from "react-router-dom";
import siderperuLogo from "@/assets/siderperu-logo.png";

export const EmailSentPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Revisa tu correo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed">
              Enlace enviado, puedes cerrar esta página y reanudar la recuperación de tu cuenta desde este enlace.
            </p>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Volver a inicio de sesión
            </Link>
          </div>

          <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
            © 2025 Gestión de Planos — Demo UI
          </footer>
        </div>
      </div>
    </div>
  );
};
