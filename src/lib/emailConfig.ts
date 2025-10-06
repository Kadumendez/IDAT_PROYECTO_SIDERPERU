/**
 * EmailJS Configuration
 * 
 * IMPORTANTE: Este archivo contiene las credenciales de EmailJS.
 * En producción, considera usar un sistema de secrets más seguro.
 * 
 * Para obtener estas credenciales:
 * 1. Crea una cuenta en https://www.emailjs.com/
 * 2. Service ID: En "Email Services"
 * 3. Template ID: En "Email Templates"
 * 4. Public Key: En "Account" > "API Keys"
 */

export const emailConfig = {
  serviceId: "service_20s7oqj",
  templateId: "template_0cv8moj",
  publicKey: "jal1IWZaTn2qRlNZx",
  appName: "SIDERPERU",
  supportEmail: "kadudesposoriomendez@gmail.com"
} as const;

// Validación de configuración
export const validateEmailConfig = (): boolean => {
  const { serviceId, templateId, publicKey } = emailConfig;
  
  if (!serviceId || !templateId || !publicKey) {
    console.error("❌ Configuración de EmailJS incompleta. Verifica src/lib/emailConfig.ts");
    return false;
  }
  
  return true;
};
