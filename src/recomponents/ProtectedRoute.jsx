import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
