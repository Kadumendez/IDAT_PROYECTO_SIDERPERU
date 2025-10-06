import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getRemainingLockTime, isAuthenticated } from "@/lib/auth";
import { showToast } from "@/components/Toast";
import { Eye, EyeOff } from "lucide-react";
import siderperuLogo from "@/assets/siderperu-logo.png";
import fondoIndustrial from "@/assets/fondo-industrial.jpg";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Check lock status on mount and when username changes
  useEffect(() => {
    if (username) {
      const remaining = getRemainingLockTime(username);
      if (remaining > 0) {
        setIsLocked(true);
        setLockTimeRemaining(remaining);
      } else {
        setIsLocked(false);
        setLockTimeRemaining(0);
      }
    }
  }, [username]);

  // Update lock countdown
  useEffect(() => {
    if (lockTimeRemaining > 0) {
      const timer = setInterval(() => {
        const remaining = getRemainingLockTime(username);
        setLockTimeRemaining(remaining);
        
        if (remaining === 0) {
          setIsLocked(false);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockTimeRemaining, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = login(username, password);
    
    if (result.success) {
      showToast("success", "Inicio de sesión exitoso");
      navigate("/dashboard", { replace: true });
    } else {
      showToast("error", result.error || "Error al iniciar sesión");
      
      // Check if user is now locked
      const remaining = getRemainingLockTime(username);
      if (remaining > 0) {
        setIsLocked(true);
        setLockTimeRemaining(remaining);
      }
    }
  };

  const formatLockTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Bienvenido!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Ingrese sus Credenciales para acceder a su cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Dirección de correo electrónico o Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked}
                placeholder="Ingrese su correo o nombre de usuario"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Contraseña
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLocked}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label 
                htmlFor="remember" 
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Recuérdame
              </label>
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className="w-full bg-gray-900 dark:bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ingresar
            </button>

            {isLocked && (
              <p className="text-center text-sm text-red-600 dark:text-red-400 font-medium">
                Usuario bloqueado: {formatLockTime(lockTimeRemaining)}
              </p>
            )}
          </form>

          <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 Gestión de Planos — Demo UI
          </footer>
        </div>
      </div>
    </div>
  );
};
