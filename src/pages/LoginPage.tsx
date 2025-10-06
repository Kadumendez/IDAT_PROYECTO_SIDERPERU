import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getRemainingLockTime, isAuthenticated } from "@/lib/auth";
import { showToast } from "@/components/Toast";
import siderperuLogo from "@/assets/siderperu-logo.png";
import fondoIndustrial from "@/assets/fondo-industrial.jpg";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

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
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Left side - Industrial background image (50% width) */}
      <div className="absolute inset-0 w-1/2">
        <img 
          src={fondoIndustrial} 
          alt="Trabajadores industriales SIDERPERU" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form with diagonal edge */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-end">
        {/* Diagonal white overlay with backdrop blur */}
        <div 
          className="absolute inset-0 bg-white/70 backdrop-blur-md dark:bg-slate-900/70"
          style={{
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 50% 100%)',
          }}
        />
        
        {/* Form content */}
        <div className="relative z-10 w-full max-w-md mr-12 lg:mr-24 px-8">
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                placeholder="Ingrese su contraseña"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                required
              />
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
