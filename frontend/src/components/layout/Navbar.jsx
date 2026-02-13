import { useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/": "Dashboard Overview",
  "/dashboard": "Dashboard Overview",
  "/tickets": "Ticket Management",
  "/admin/tickets": "Ticket Management",
  "/admin/agents": "Agent Performance",
  "/agents": "Agent Performance",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { user = null, logout = async () => {} } = auth;

  const title = pageTitles[location.pathname]
    || (location.pathname.startsWith("/admin/tickets/") ? "Ticket Details" : null)
    || "IT Service Desk";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400">Real-time IT service desk metrics</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <span className="text-sm text-slate-600 font-medium">
          {user?.name || "Admin"}
        </span>

        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
