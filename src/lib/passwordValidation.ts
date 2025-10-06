export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const validatePasswordRequirements = (password: string): PasswordRequirement[] => {
  return [
    {
      label: "Mínimo 8 caracteres",
      met: password.length >= 8
    },
    {
      label: "Una mayúscula y una minúscula",
      met: /[A-Z]/.test(password) && /[a-z]/.test(password)
    },
    {
      label: "Al menos un número",
      met: /\d/.test(password)
    },
    {
      label: "Carácter especial",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];
};

export const isPasswordValid = (password: string): boolean => {
  const requirements = validatePasswordRequirements(password);
  return requirements.every(req => req.met);
};

export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};
