import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("Cusertoken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
