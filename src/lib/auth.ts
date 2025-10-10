/**
 * DEMO AUTHENTICATION SYSTEM
 * Valid demo users: ["kadudesposorio.macris@gmail.com", "admin", "supervisor"]
 * Demo password (case-sensitive): "ContraseñaSegura123"
 */

const DEMO_USERS = [
  "kadudesposorio.macris@gmail.com",
  "admin", 
  "supervisor",
  "nayelidelacruz@gmail.com",
  "natalysalcedo@gmail.com"
];

const USER_NAMES: Record<string, string> = {
  "kadudesposorio.macris@gmail.com": "Kadú Desposorio",
  "admin": "Administrador",
  "supervisor": "Supervisor",
  "nayelidelacruz@gmail.com": "Nayeli De la Cruz",
  "natalysalcedo@gmail.com": "Nataly Salcedo"
};

const DEMO_PASSWORD = "ContraseñaSegura123";
const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 6 * 60 * 1000; // 6 minutes in milliseconds

interface LockInfo {
  lockedUntil: number;
  attempts: number;
}

export const checkUserExists = (username: string): boolean => {
  return DEMO_USERS.includes(username.toLowerCase());
};

export const validatePassword = (password: string): boolean => {
  return password === DEMO_PASSWORD;
};

export const getLockInfo = (username: string): LockInfo | null => {
  const key = `auth:lock:${username.toLowerCase()}`;
  const lockData = localStorage.getItem(key);
  
  if (!lockData) return null;
  
  const lockInfo = JSON.parse(lockData);
  
  // Check if lock has expired
  if (Date.now() > lockInfo.lockedUntil) {
    localStorage.removeItem(key);
    return null;
  }
  
  return lockInfo;
};

export const getRemainingLockTime = (username: string): number => {
  const lockInfo = getLockInfo(username);
  if (!lockInfo) return 0;
  
  const remaining = lockInfo.lockedUntil - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
};

export const incrementFailedAttempts = (username: string): void => {
  const key = `auth:lock:${username.toLowerCase()}`;
  const lockData = localStorage.getItem(key);
  
  let attempts = 1;
  
  if (lockData) {
    const lockInfo = JSON.parse(lockData);
    attempts = lockInfo.attempts + 1;
  }
  
  if (attempts >= MAX_ATTEMPTS) {
    // Lock the user
    const lockInfo: LockInfo = {
      lockedUntil: Date.now() + LOCK_DURATION,
      attempts: 0 // Reset attempts after lock
    };
    localStorage.setItem(key, JSON.stringify(lockInfo));
  } else {
    // Just increment attempts
    const lockInfo: LockInfo = {
      lockedUntil: 0,
      attempts
    };
    localStorage.setItem(key, JSON.stringify(lockInfo));
  }
};

export const resetFailedAttempts = (username: string): void => {
  const key = `auth:lock:${username.toLowerCase()}`;
  localStorage.removeItem(key);
};

export const login = (username: string, password: string): { success: boolean; error?: string } => {
  const normalizedUsername = username.toLowerCase();
  
  // Check if user is locked
  const lockInfo = getLockInfo(normalizedUsername);
  if (lockInfo) {
    const remainingSeconds = getRemainingLockTime(normalizedUsername);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return { 
      success: false, 
      error: `Usuario bloqueado: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` 
    };
  }
  
  // Check if user exists
  if (!checkUserExists(normalizedUsername)) {
    return { 
      success: false, 
      error: "Correo o usuario incorrecto. Verifíquelo e inténtelo nuevamente." 
    };
  }
  
  // Check password
  if (!validatePassword(password)) {
    incrementFailedAttempts(normalizedUsername);
    return { 
      success: false, 
      error: "Contraseña incorrecta. Vuelva a intentarlo." 
    };
  }
  
  // Success - reset attempts and store auth
  resetFailedAttempts(normalizedUsername);
  localStorage.setItem('auth:user', username);
  localStorage.setItem('auth:token', 'demo-token-' + Date.now());
  
  return { success: true };
};

export const logout = (): void => {
  localStorage.removeItem('auth:user');
  localStorage.removeItem('auth:token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth:token');
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem('auth:user');
};

export const getCurrentUserName = (): string => {
  const user = getCurrentUser();
  if (!user) return "Usuario";
  return USER_NAMES[user.toLowerCase()] || user;
};
