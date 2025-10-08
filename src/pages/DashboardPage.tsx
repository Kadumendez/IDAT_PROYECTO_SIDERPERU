import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Folder,
  RotateCcw,
  History,
  BarChart3,
  FolderUp,
  FileCheck
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * DEMO DATA
 * Change these arrays to customize metrics and activity feed
 */
const METRICS = [
  { icon: Folder, label: "Planos totales", value: 128, trend: "+12%", trendUp: true, color: "blue" },
  { icon: RotateCcw, label: "Revisiones pendientes", value: 5, trend: "-3%", trendUp: false, color: "orange" },
  { icon: FolderUp, label: "Subidos esta semana", value: 12, trend: "+8%", trendUp: true, color: "green" },
  { icon: FileCheck, label: "Planos aprobados", value: 98, trend: "+5%", trendUp: true, color: "purple" }
];

const ACTIVITIES = [
  { time: "10:45 am", text: "PL-0045 revisado por José (Estructuras • v1)" },
  { time: "10:45 am", text: "PL-0028 aprobado por Supervisor (Tuberías)" },
  { time: "10:45 am", text: "PL-0037 subido por Nayeli (Pintura • v3)" },
  { time: "10:45 am", text: "Nueva versión PL-0015 v4 (Mecánico)" },
  { time: "Ayer", text: "Carga masiva de 4 planos (Calderería)" },
  { time: "Ayer", text: "PL-0022 rechazado por Supervisor (Instrumentación)" },
  { time: "Ayer", text: "PL-0050 subido por Gino (Civil • v1)" },
  { time: "Ayer", text: "PL-0039 corregido por Miranda (Eléctrico • v2)" },
  { time: "Ayer", text: "PL-0048 aprobado por QA (Fundición)" },
  { time: "Ayer", text: "Carga masiva de 8 planos (Galvanizado)" }
].slice(0, 10);

const QUICK_ACCESS = [
  { icon: BarChart3, label: "Ir a Planos (Listado)", path: "/planos" },
  { icon: History, label: "Historial y versiones", path: "/historial" },
  { icon: FolderUp, label: "Mis archivos subidos", path: "/uploads" }
];

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Metrics Cards */}
        <TooltipProvider delayDuration={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {METRICS.map((metric, index) => {
              const iconClasses = {
                blue: "text-blue-600",
                orange: "text-orange-600",
                green: "text-green-600",
                purple: "text-purple-600"
              };
              const iconBgClasses = {
                blue: "bg-blue-500/20",
                orange: "bg-orange-500/20",
                green: "bg-green-500/20",
                purple: "bg-purple-500/20"
              };
              
              return (
                <div
                  key={index}
                  className="bg-card dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${iconBgClasses[metric.color as keyof typeof iconBgClasses]}`}>
                        <metric.icon className={`w-6 h-6 ${iconClasses[metric.color as keyof typeof iconClasses]}`} />
                      </div>
                      <p className="text-3xl font-bold text-foreground dark:text-gray-100">
                        {metric.value}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg cursor-help ${
                          metric.trendUp 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {metric.trend}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Este porcentaje muestra el cambio respecto al período anterior (mes pasado).</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Activity Feed */}
        <div className="bg-card dark:bg-slate-800/50 border border-border dark:border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <RotateCcw className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">
              Actividad reciente
            </h2>
            <span className="text-sm text-muted-foreground/80 dark:text-gray-400">(Últimos 10)</span>
          </div>

          <div className="space-y-3">
            {ACTIVITIES.map((activity, index) => (
              <div
                key={index}
                className="flex gap-4 py-2.5 border-b border-border dark:border-slate-700 last:border-0"
              >
                <span className="text-sm font-medium text-muted-foreground dark:text-gray-500 w-20 flex-shrink-0">
                  {activity.time}
                </span>
                <span className="text-sm text-foreground dark:text-gray-300 flex-1">
                  {activity.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
