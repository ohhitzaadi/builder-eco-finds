import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/state/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }
  return children;
}
