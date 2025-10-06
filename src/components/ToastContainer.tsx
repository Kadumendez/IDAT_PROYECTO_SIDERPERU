import { Toast, useToastContainer } from "./Toast";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastContainer();

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};
