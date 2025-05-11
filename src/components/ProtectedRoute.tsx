
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading spinner or skeleton while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-taskPurple"></div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to the login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}
