import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Ticket, Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", to: "/admin/tickets", icon: Ticket },
  { label: "Agents", to: "/admin/agents", icon: Users },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col flex-shrink-0">
      <div className="p-6 text-xl font-bold border-b border-slate-700">
        IT Service Desk AI
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Admin</p>
            <p className="text-xs text-slate-500">admin@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, to, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200 text-sm font-medium
        ${isActive
          ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`
      }
    >
      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
      {label}
    </NavLink>
  );
}
