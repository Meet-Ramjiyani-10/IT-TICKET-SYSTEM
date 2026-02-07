export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      
      <div className="p-6 text-xl font-bold border-b border-slate-700">
        IT Service Desk AI
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <SidebarItem label="Dashboard" />
        <SidebarItem label="Tickets" />
        <SidebarItem label="Create Ticket" />
        <SidebarItem label="Agents" />
        <SidebarItem label="SLA Monitor" />
        <SidebarItem label="System Status" />
      </nav>

    </div>
  )
}

function SidebarItem({ label }) {
  return (
    <div className="px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800 transition duration-200">
      {label}
    </div>
  )
}
