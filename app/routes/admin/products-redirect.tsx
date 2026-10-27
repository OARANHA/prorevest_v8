import { Navigate, useLocation } from "react-router-dom";

export default function ProductsRedirect() {
  const location = useLocation();
  return <Navigate to={`/admin/products${location.search}${location.hash}`} replace />;
}
