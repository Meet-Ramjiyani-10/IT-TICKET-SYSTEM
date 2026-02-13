import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, PlusCircle } from "lucide-react";
import { mockTickets } from "../../data/ticketData";
import { getRiskLevel } from "../../utils/ticketHelpers";
import TicketStats from "./TicketStats";
import TicketFilters from "./TicketFilters";
import TicketMasterTable from "./TicketMasterTable";
import TicketAnalytics from "./TicketAnalytics";

export default function AdminTickets() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
    agent: "",
    risk: "",
  });

  // Simulate refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  // Filter pipeline
  const filteredTickets = useMemo(() => {
    let result = [...mockTickets];

    // Search by ID or Title
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q)
      );
    }

    // Status
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    // Priority
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Category
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Agent
    if (filters.agent) {
      result = result.filter((t) => t.assigned_agent === filters.agent);
    }

    // Risk level from predicted_risk
    if (filters.risk) {
      result = result.filter(
        (t) => getRiskLevel(t.predicted_risk) === filters.risk
      );
    }

    return result;
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Ticket Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, triage, and resolve support tickets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => navigate("/create-ticket")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <TicketStats tickets={mockTickets} />

      {/* Filters */}
      <TicketFilters filters={filters} onChange={setFilters} />

      {/* Master Table */}
      <TicketMasterTable tickets={filteredTickets} loading={loading} />

      {/* Analytics */}
      <TicketAnalytics />
    </div>
  );
}
