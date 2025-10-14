/**
 * EmailJS Configuration (desde variables de entorno)
 * – En front solo van claves públicas (PUBLIC KEY). Nunca claves privadas.
 * – Los IDs de service/template no son secretos, pero mejor no hardcodearlos.
 */

export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "",
  appName: "Gestión de Planos",

  // Puedes dejar correos visibles si no son secretos
  supportName: "Soporte SIDERPERU",
  supportEmail: "kadudesposoriomendez@gmail.com",
} as const;

// Validación de configuración
export const validateEmailConfig = (): boolean => {
  const { serviceId, templateId, publicKey } = emailConfig;
  if (!serviceId || !templateId || !publicKey) {
    console.error("❌ EmailJS mal configurado. Completa VITE_EMAILJS_* en tu .env");
    return false;
  }
  return true;
};
