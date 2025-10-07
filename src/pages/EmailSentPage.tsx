import { Link } from "react-router-dom";
import siderperuLogo from "@/assets/siderperu-logo.png";
import fondoIndustrial from "@/assets/fondo-industrial.jpg";

export const EmailSentPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image - full screen cover */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondoIndustrial})` }}
        aria-hidden="true"
      />

      {/* Responsive overlay - dark on desktop, white on mobile */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-md md:bg-black/30 md:backdrop-blur-sm" />

      {/* Content wrapper */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 md:justify-end md:px-8 lg:px-12">
        {/* Form card */}
        <div className="w-full max-w-md rounded-2xl bg-white/85 backdrop-blur-md shadow-xl p-6 sm:p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={siderperuLogo} 
              alt="SIDERPERU" 
              className="h-16 mb-6"
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
