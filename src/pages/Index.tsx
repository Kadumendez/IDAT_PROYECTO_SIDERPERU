import LoginForm from "@/components/LoginForm";
import loginImage from "@/assets/login-image.jpg";

const Index = () => {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Left side - Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={loginImage} 
          alt="Trabajadores industriales SIDERPERU" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form with diagonal edge */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        {/* Diagonal white overlay with backdrop blur */}
        <div 
          className="absolute inset-0 bg-white/70 backdrop-blur-md"
          style={{
            clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 50% 100%)',
          }}
        />
        
        {/* Form content */}
        <div className="relative z-10 ml-auto mr-8 lg:mr-24">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
