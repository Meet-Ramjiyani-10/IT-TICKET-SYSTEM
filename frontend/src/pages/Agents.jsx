import { useState, useEffect } from "react";
import { agentsAPI } from "../services/api";
import { Users, RefreshCw, AlertCircle, Star, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await agentsAPI.getAll();
      setAgents(res.data.agents ?? res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agents</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor team performance and workload
          </p>
        </div>
        <button
          onClick={fetchAgents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={fetchAgents} className="ml-auto text-red-600 underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-32" />
                  <div className="h-3 bg-slate-100 rounded w-24" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-100 rounded" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agent cards */}
      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <AgentCard key={agent.id || agent.name} agent={agent} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && agents.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-400">No agents found</p>
          <p className="text-xs text-slate-400 mt-1">Agent data will appear once the backend is connected</p>
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }) {
  const initials = agent.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  const csatColor =
    (agent.csat ?? 0) >= 4.5 ? "text-emerald-600" :
    (agent.csat ?? 0) >= 4.0 ? "text-blue-600" :
    (agent.csat ?? 0) >= 3.5 ? "text-amber-600" : "text-red-600";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Agent header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 truncate">{agent.name || "Unknown"}</h3>
          <p className="text-xs text-slate-400">{agent.role || "Support Agent"}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full
          ${agent.status === "online" ? "bg-emerald-50 text-emerald-700" :
            agent.status === "busy" ? "bg-amber-50 text-amber-700" :
            "bg-slate-100 text-slate-500"}`}>
          {agent.status || "offline"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatItem icon={CheckCircle2} label="Resolved" value={agent.resolved ?? 0} color="text-emerald-600" />
        <StatItem icon={Clock} label="Avg Time" value={`${agent.avgTime ?? 0}h`} color="text-blue-600" />
        <StatItem icon={Star} label="CSAT" value={agent.csat ?? "—"} color={csatColor} />
        <StatItem icon={TrendingUp} label="Active" value={agent.activeTickets ?? 0} color="text-violet-600" />
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}
