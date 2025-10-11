import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, FileText, CheckCircle, AlertCircle, Clock, Trash2, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock notifications data
const MOCK_NOTIFICATIONS = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  tipo: ['upload', 'approval', 'comment', 'status'][i % 4],
  titulo: [
    'Nueva carga de plano pendiente de aprobación',
    'Plano aprobado correctamente',
    'Nuevo comentario en plano',
    'Cambio de estado de plano',
  ][i % 4],
  descripcion: [
    'La empresa Constructora ABC ha subido el plano "Sistema Eléctrico Principal.dwg" para su revisión.',
    'El plano "Planta General Acería" ha sido aprobado por el Ing. Carlos Mendoza.',
    'El Ing. María Torres agregó un comentario en el plano "Layout Tubería Industrial".',
    'El estado del plano "Red Contraincendios" cambió a COMENTADO.',
  ][i % 4],
  plano: [
    'Sistema Eléctrico Principal.dwg',
    'Planta General Acería',
    'Layout Tubería Industrial',
    'Red Contraincendios',
  ][i % 4],
  fecha: new Date(2025, 0, 25 - Math.floor(i / 2), 10 - i % 10).toISOString(),
  leido: i > 10,
}));

export const NotificacionesPage = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'upload':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'comment':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'status':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesType = filterType === "all" || notif.tipo === filterType;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "unread" && !notif.leido) ||
      (filterStatus === "read" && notif.leido);
    return matchesType && matchesStatus;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, leido: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, leido: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.leido).length;

  return (
    <DashboardLayout pageTitle="Notificaciones">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Todas las Notificaciones</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
              </p>
            </div>
          </div>
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <Check className="w-4 h-4" />
            Marcar todas como leídas
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="w-48">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="[&>span]:text-foreground">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="upload">Cargas</SelectItem>
                <SelectItem value="approval">Aprobaciones</SelectItem>
                <SelectItem value="comment">Comentarios</SelectItem>
                <SelectItem value="status">Cambios de estado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="[&>span]:text-foreground">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">No leídas</SelectItem>
                <SelectItem value="read">Leídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {sortedNotifications.map((notif) => (
            <Card 
              key={notif.id}
              className={`transition-all ${!notif.leido ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notif.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${!notif.leido ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notif.titulo}
                          </h3>
                          {!notif.leido && (
                            <Badge variant="default" className="h-5 px-2 text-[10px]">
                              Nueva
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notif.descripcion}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {notif.plano}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(notif.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notif.leido && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notif.id)}
                            className="h-8 px-2"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notif.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay notificaciones con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
