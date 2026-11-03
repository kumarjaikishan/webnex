import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { WebnexLogoIcon } from "../../components/BrandLogo.jsx";

export default function ClientLayout() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-2">
        <WebnexLogoIcon className="w-4 h-5 drop-shadow-[0_0_8px_rgba(245,184,66,0.3)]" />
        <p className="font-mono text-xs text-[#f5b842] tracking-widest font-semibold uppercase">WEBNEX CLIENT PORTAL</p>
      </div>
      <h1 className="font-display text-3xl mb-8">Welcome back, {user?.name?.split(" ")[0]}.</h1>
      <Outlet />
    </div>
  );
}
