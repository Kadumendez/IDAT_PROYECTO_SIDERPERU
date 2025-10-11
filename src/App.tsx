import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "./components/ToastContainer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { EmailSentPage } from "./pages/EmailSentPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PlanosPage } from "./pages/PlanosPage";
import { RevisionesPage } from "./pages/RevisionesPage";
import { UsuariosPage } from "./pages/UsuariosPage";
import { HistorialPage } from "./pages/HistorialPage";
import { UploadsPage } from "./pages/UploadsPage";
import { ConfiguracionPage } from "./pages/ConfiguracionPage";
import { NotificacionesPage } from "./pages/NotificacionesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/planos" 
          element={
            <ProtectedRoute>
              <PlanosPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/revisiones" 
          element={
            <ProtectedRoute>
              <RevisionesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute>
              <UsuariosPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/historial" 
          element={
            <ProtectedRoute>
              <HistorialPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/uploads" 
          element={
            <ProtectedRoute>
              <UploadsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracion" 
          element={
            <ProtectedRoute>
              <ConfiguracionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notificaciones" 
          element={
            <ProtectedRoute>
              <NotificacionesPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
