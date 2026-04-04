import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  const { localePath } = useI18n();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to={localePath("/")} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
