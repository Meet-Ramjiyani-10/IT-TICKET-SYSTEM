import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Radio } from "lucide-react";
import { mockTickets } from "../../data/ticketData";
import { getRiskLevel } from "../../utils/ticketHelpers";
import TicketStats from "./TicketStats";
import TicketFilters from "./TicketFilters";
import TicketMasterTable from "./TicketMasterTable";

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
    <div className="space-y-4">
      {/* Page header — compact operational style */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              Ticket Operations
            </h1>
            <p className="text-[11px] text-slate-400 uppercase tracking-wide">
              Monitor &middot; Triage &middot; Resolve
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/create-ticket")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Section 1: Compact Operational Stats */}
      <TicketStats tickets={mockTickets} />

      {/* Section 2: Filter + Action Control Panel */}
      <TicketFilters
        filters={filters}
        onChange={setFilters}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Section 3: Master Operations Table */}
      <TicketMasterTable tickets={filteredTickets} loading={loading} />
    </div>
  );
}
