
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TicketTable from "./components/TicketTable";
import Login from "./pages/Login";
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// Sample data — replace with API fetch for real-time data
const sampleTickets = [
  {
    id: "#1023",
    title: "Server not responding in production",
    category: "Hardware",
    priority: "Critical",
    risk: 92,
    status: "Open",
    assignee: "Sarah Mitchell",
    created: "2026-02-06",
  },
  {
    id: "#1024",
    title: "VPN connectivity drops intermittently",
    category: "Network",
    priority: "High",
    risk: 68,
    status: "In Progress",
    assignee: "David Kim",
    created: "2026-02-06",
  },
  {
    id: "#1025",
    title: "Email service delayed delivery",
    category: "Email",
    priority: "Medium",
    risk: 45,
    status: "Open",
    assignee: "Priya Sharma",
    created: "2026-02-05",
  },
  {
    id: "#1026",
    title: "SSO login failure for new employees",
    category: "Access/Auth",
    priority: "High",
    risk: 78,
    status: "Escalated",
    assignee: "James Lee",
    created: "2026-02-05",
  },
  {
    id: "#1027",
    title: "Printer queue stuck on 3rd floor",
    category: "Hardware",
    priority: "Low",
    risk: 12,
    status: "Open",
    assignee: "Maria Garcia",
    created: "2026-02-05",
  },
  {
    id: "#1028",
    title: "Database backup job failed overnight",
    category: "Database",
    priority: "Critical",
    risk: 88,
    status: "In Progress",
    assignee: "Alex Turner",
    created: "2026-02-04",
  },
  {
    id: "#1029",
    title: "Software license expired for Adobe suite",
    category: "Software",
    priority: "Medium",
    risk: 35,
    status: "Open",
    assignee: "Sarah Mitchell",
    created: "2026-02-04",
  },
  {
    id: "#1030",
    title: "Slow internet in Building B",
    category: "Network",
    priority: "High",
    risk: 55,
    status: "In Progress",
    assignee: "David Kim",
    created: "2026-02-04",
  },
  {
    id: "#1031",
    title: "Windows update causing BSOD",
    category: "Software",
    priority: "Critical",
    risk: 95,
    status: "Open",
    assignee: "Priya Sharma",
    created: "2026-02-03",
  },
  {
    id: "#1032",
    title: "New hire laptop provisioning request",
    category: "Hardware",
    priority: "Low",
    risk: 8,
    status: "Closed",
    assignee: "James Lee",
    created: "2026-02-03",
  },
  {
    id: "#1033",
    title: "MFA token sync issue on mobile",
    category: "Access/Auth",
    priority: "Medium",
    risk: 42,
    status: "Resolved",
    assignee: "Maria Garcia",
    created: "2026-02-03",
  },
  {
    id: "#1034",
    title: "Firewall rule blocking SaaS app",
    category: "Network",
    priority: "High",
    risk: 72,
    status: "Open",
    assignee: "Alex Turner",
    created: "2026-02-02",
  },
  {
    id: "#1035",
    title: "Shared drive permissions error",
    category: "Access/Auth",
    priority: "Medium",
    risk: 38,
    status: "In Progress",
    assignee: "Sarah Mitchell",
    created: "2026-02-02",
  },
  {
    id: "#1036",
    title: "Outlook calendar sync broken",
    category: "Email",
    priority: "Low",
    risk: 18,
    status: "Resolved",
    assignee: "David Kim",
    created: "2026-02-01",
  },
  {
    id: "#1037",
    title: "CI/CD pipeline timeout on deploy",
    category: "Software",
    priority: "High",
    risk: 65,
    status: "Open",
    assignee: "Priya Sharma",
    created: "2026-02-01",
  },
  {
    id: "#1038",
    title: "SQL query performance degradation",
    category: "Database",
    priority: "Medium",
    risk: 50,
    status: "In Progress",
    assignee: "James Lee",
    created: "2026-01-31",
  },
  {
    id: "#1039",
    title: "Badge reader not working - Main lobby",
    category: "Hardware",
    priority: "High",
    risk: 60,
    status: "Open",
    assignee: "Maria Garcia",
    created: "2026-01-31",
  },
  {
    id: "#1040",
    title: "Spam filter too aggressive",
    category: "Email",
    priority: "Low",
    risk: 15,
    status: "Closed",
    assignee: "Alex Turner",
    created: "2026-01-30",
  },
];

/*
  Routing changes summary (minimal change):
  - Added react-router-dom Routes in this file so the Login page can render
    at `/` without the dashboard layout.
  - Created an inline `Layout` component that mounts the existing
    `Sidebar` + `Navbar` and uses an <Outlet/> for nested routes. This
    preserves the original dashboard layout and keeps Dashboard UI
    unchanged.
  - Route map:
      /        -> Login (no layout)
      /dashboard -> Layout (Sidebar + Navbar) with Dashboard + TicketTable

  Reasoning: This is the minimal-change approach — keeps existing
  Dashboard and layout code intact while isolating Login at root.
*/

function Layout() {
  // Layout comp mounts the existing Sidebar and Navbar and renders
  // nested routes via <Outlet/>. Kept inline to minimize new files.
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-100">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto space-y-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Login page at root */}
      <Route path="/" element={<Login />} />

      {/* Dashboard routes render within the existing layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route
          index
          element={
            <>
              <Dashboard />
              <TicketTable tickets={sampleTickets} />
            </>
          }
        />
      </Route>
    </Routes>
  );
}
