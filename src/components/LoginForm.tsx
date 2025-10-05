import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import siderperu from "@/assets/siderperu-logo.png";

type ErrorState = "none" | "user-not-found" | "wrong-password" | "user-blocked";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState>("none");

  const errorMessages = {
    "user-not-found": "Correo o usuario incorrecto, verifíquelo y vuelva a intentar.",
    "wrong-password": "Contraseña incorrecta, verifíquela y vuelva a intentar.",
    "user-blocked": "Usuario bloqueado, vuelva a intentarlo en unos minutos.",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: simulación de estados de error
    // En producción, aquí iría la lógica de autenticación real
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-8">
      <img 
        src={siderperu} 
        alt="SIDERPERU" 
        className="h-16 mb-8"
      />
      
      <div className="w-full mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bienvenido!
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingrese sus Credenciales para acceder a su cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Dirección de correo electrónico o Nombre de Usuario
          </label>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo o nombre de usuario"
            className="h-12 bg-white/80 border-border focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <a 
              href="#" 
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              ¿Has olvidado tu contraseña?
            </a>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            className="h-12 bg-white/80 border-border focus:border-primary focus:ring-primary"
          />
        </div>

        {errorState !== "none" && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              {errorMessages[errorState]}
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="remember"
            className="text-sm text-foreground cursor-pointer"
          >
            Recuérdame
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium transition-colors"
        >
          Ingresar
        </Button>
      </form>

      <footer className="mt-12 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Gestión de Planos — Demo UI
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
