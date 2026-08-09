import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ClientLayout() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="font-mono text-xs text-cyan tracking-widest mb-2">CLIENT PORTAL</p>
      <h1 className="font-display text-3xl mb-8">Welcome back, {user?.name?.split(" ")[0]}.</h1>
      <Outlet />
    </div>
  );
}
