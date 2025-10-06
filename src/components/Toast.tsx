import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

export type ToastType = "error" | "success";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ type, message, onClose, duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-hide after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 280); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = type === "error" 
    ? {
        bg: "bg-red-50 dark:bg-red-950/50",
        border: "border-red-600 dark:border-red-500",
        text: "text-red-900 dark:text-red-200",
        icon: <AlertCircle className="w-5 h-5" />
      }
    : {
        bg: "bg-green-50 dark:bg-green-950/50",
        border: "border-green-600 dark:border-green-500",
        text: "text-green-900 dark:text-green-200",
        icon: <CheckCircle className="w-5 h-5" />
      };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm transition-all duration-280 ${
        styles.bg
      } ${styles.border} ${styles.text} ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 280);
        }}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// Toast manager hook
let toastCounter = 0;

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

const toastListeners: Array<(toast: ToastData) => void> = [];

export const showToast = (type: ToastType, message: string) => {
  const toast: ToastData = {
    id: toastCounter++,
    type,
    message
  };
  toastListeners.forEach(listener => listener(toast));
};

export const useToastContainer = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (toast: ToastData) => {
      setToasts(prev => [...prev, toast]);
    };

    toastListeners.push(listener);

    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, removeToast };
};
