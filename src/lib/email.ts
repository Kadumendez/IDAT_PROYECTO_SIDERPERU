import emailjs from "@emailjs/browser";
import { emailConfig, validateEmailConfig } from "./emailConfig";

/**
 * Envía un correo de recuperación de contraseña usando EmailJS
 * 
 * @param toEmail - Email del destinatario
 * @param resetLink - URL completa con el token de reset
 * @returns Promise que se resuelve cuando el email se envía correctamente
 * 
 * @example
 * const token = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
 * const resetLink = `${window.location.origin}/reset-password?token=${token}`;
 * await sendResetEmail("user@example.com", resetLink);
 */
export const sendResetEmail = async (
  toEmail: string,
  resetLink: string
): Promise<void> => {
  // Validar configuración
  if (!validateEmailConfig()) {
    throw new Error(
      "Configuración de EmailJS incompleta. Revisa src/lib/emailConfig.ts"
    );
  }

  const { serviceId, templateId, publicKey, appName, supportEmail } = emailConfig;

  // Parámetros que deben coincidir EXACTAMENTE con tu plantilla de EmailJS
  const templateParams = {
    to_email: toEmail,
    reset_link: resetLink,
    app_name: appName,
    support_email: supportEmail
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      { publicKey }
    );

    console.log("✅ Email enviado correctamente:", response.status, response.text);
  } catch (error: any) {
    console.error("❌ Error al enviar email:", error);
    
    // Mensajes de error más descriptivos
    if (error.text) {
      throw new Error(`Error de EmailJS: ${error.text}`);
    }
    
    throw new Error("No se pudo enviar el correo. Verifica tu conexión a internet.");
  }
};

/**
 * TODO: Seguridad para producción
 * 
 * Este sistema actualmente es solo para DEMO. Para producción necesitas:
 * 
 * 1. Backend que genere tokens seguros:
 *    - Usar crypto.randomBytes(32).toString('hex')
 *    - Guardar en BD con timestamp de expiración (ej: 5 minutos)
 *    - Asociar token al email del usuario
 * 
 * 2. Endpoint para validar token:
 *    - Verificar que el token existe en BD
 *    - Verificar que no ha expirado
 *    - Marcar token como usado (no reutilizable)
 * 
 * 3. Endpoint para actualizar contraseña:
 *    - Validar token nuevamente
 *    - Hashear la nueva contraseña (bcrypt, argon2)
 *    - Actualizar en base de datos
 *    - Invalidar el token
 * 
 * 4. Rate limiting:
 *    - Limitar intentos por IP (ej: 3 por hora)
 *    - Prevenir ataques de fuerza bruta
 */
