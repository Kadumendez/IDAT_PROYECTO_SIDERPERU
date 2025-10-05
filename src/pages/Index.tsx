import LoginForm from "@/components/LoginForm";
import loginImage from "@/assets/login-image.jpg";

const Index = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={loginImage} 
          alt="Trabajadores industriales SIDERPERU" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-br from-muted/30 to-muted/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
        <div className="relative z-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
