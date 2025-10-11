import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Save, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ConfiguracionPage = () => {
  const { toast } = useToast();
  const [notificationsConfig, setNotificationsConfig] = useState({
    // Screen notifications
    screenNewUpload: true,
    screenStatusChange: true,
    screenNewComment: true,
    screenApprovalRequest: true,
    screenPermissionChange: false,
    
    // Email notifications
    emailNewUpload: true,
    emailStatusChange: true,
    emailNewComment: false,
    emailApprovalRequest: true,
    emailPermissionChange: true,
  });

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Tus preferencias de notificaciones han sido actualizadas.",
    });
  };

  const toggleNotification = (key: keyof typeof notificationsConfig) => {
    setNotificationsConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <DashboardLayout pageTitle="Configuración">
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuración de Notificaciones</h1>
            <p className="text-sm text-muted-foreground">
              Personaliza cómo y cuándo deseas recibir notificaciones
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Screen Notifications Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Notificaciones en Pantalla</CardTitle>
              </div>
              <CardDescription>
                Estas notificaciones aparecerán en la campana de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-upload" className="text-foreground font-medium">
                    Nueva carga de plano
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando se suba un nuevo plano al sistema
                  </p>
                </div>
                <Switch
                  id="screen-upload"
                  checked={notificationsConfig.screenNewUpload}
                  onCheckedChange={() => toggleNotification('screenNewUpload')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-status" className="text-foreground font-medium">
                    Cambio de estado
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando cambie el estado de aprobación
                  </p>
                </div>
                <Switch
                  id="screen-status"
                  checked={notificationsConfig.screenStatusChange}
                  onCheckedChange={() => toggleNotification('screenStatusChange')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-comment" className="text-foreground font-medium">
                    Nuevos comentarios
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando agreguen comentarios a un plano
                  </p>
                </div>
                <Switch
                  id="screen-comment"
                  checked={notificationsConfig.screenNewComment}
                  onCheckedChange={() => toggleNotification('screenNewComment')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-approval" className="text-foreground font-medium">
                    Solicitud de aprobación
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando requieran tu aprobación
                  </p>
                </div>
                <Switch
                  id="screen-approval"
                  checked={notificationsConfig.screenApprovalRequest}
                  onCheckedChange={() => toggleNotification('screenApprovalRequest')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-permission" className="text-foreground font-medium">
                    Cambio de permisos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando modifiquen tus permisos de acceso
                  </p>
                </div>
                <Switch
                  id="screen-permission"
                  checked={notificationsConfig.screenPermissionChange}
                  onCheckedChange={() => toggleNotification('screenPermissionChange')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle className="text-foreground">Notificaciones por Correo</CardTitle>
              </div>
              <CardDescription>
                Recibirás estas notificaciones en tu correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-upload" className="text-foreground font-medium">
                    Nueva carga de plano
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando se suba un nuevo plano al sistema
                  </p>
                </div>
                <Switch
                  id="email-upload"
                  checked={notificationsConfig.emailNewUpload}
                  onCheckedChange={() => toggleNotification('emailNewUpload')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-status" className="text-foreground font-medium">
                    Cambio de estado
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando cambie el estado de aprobación
                  </p>
                </div>
                <Switch
                  id="email-status"
                  checked={notificationsConfig.emailStatusChange}
                  onCheckedChange={() => toggleNotification('emailStatusChange')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-comment" className="text-foreground font-medium">
                    Nuevos comentarios
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando agreguen comentarios a un plano
                  </p>
                </div>
                <Switch
                  id="email-comment"
                  checked={notificationsConfig.emailNewComment}
                  onCheckedChange={() => toggleNotification('emailNewComment')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-approval" className="text-foreground font-medium">
                    Solicitud de aprobación
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando requieran tu aprobación
                  </p>
                </div>
                <Switch
                  id="email-approval"
                  checked={notificationsConfig.emailApprovalRequest}
                  onCheckedChange={() => toggleNotification('emailApprovalRequest')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-permission" className="text-foreground font-medium">
                    Cambio de permisos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cuando modifiquen tus permisos de acceso
                  </p>
                </div>
                <Switch
                  id="email-permission"
                  checked={notificationsConfig.emailPermissionChange}
                  onCheckedChange={() => toggleNotification('emailPermissionChange')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
