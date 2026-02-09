import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TicketTable from "../components/TicketTable";
import { ticketsAPI } from "../services/api";
import { RefreshCw, AlertCircle, PlusCircle } from "lucide-react";

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ticketsAPI.getAll();
      setTickets(res.data.tickets ?? res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track all support tickets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={fetchTickets} className="ml-auto text-red-600 underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <TicketTable
        tickets={tickets}
        loading={loading}
        onRowClick={(ticket) => console.log("Clicked ticket:", ticket)}
      />
    </div>
  );
}
