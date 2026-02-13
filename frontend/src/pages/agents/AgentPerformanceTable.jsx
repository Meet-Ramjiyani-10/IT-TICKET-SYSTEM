import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  getSlaColor, getCsatColor, getStatusConfig,
  getWorkloadPercent, getWorkloadColor,
} from "../../data/agentData";

// ── Column definitions ───────────────────────────────────────────
const COLUMNS = [
  { key: "name", label: "Agent Name", sortable: true },
  { key: "department", label: "Department", sortable: true, width: "w-[120px]" },
  { key: "total_assigned", label: "Assigned", sortable: true, width: "w-[90px]" },
  { key: "total_resolved", label: "Resolved", sortable: true, width: "w-[90px]" },
  { key: "open_tickets", label: "Open", sortable: true, width: "w-[70px]" },
  { key: "avg_resolution_time", label: "Avg Time", sortable: true, width: "w-[90px]" },
  { key: "sla_success_rate", label: "SLA %", sortable: true, width: "w-[100px]" },
  { key: "csat_avg", label: "CSAT", sortable: true, width: "w-[80px]" },
  { key: "workload", label: "Workload", sortable: false, width: "w-[130px]" },
  { key: "availability_status", label: "Status", sortable: true, width: "w-[110px]" },
];

function SortIcon({ direction }) {
  if (!direction) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />;
  return direction === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />;
}

// ── Main Table Component ─────────────────────────────────────────
export default function AgentPerformanceTable({ agents = [] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let list = agents;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.availability_status.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [agents, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-800">Agent Performance</h3>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} agents</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none hover:text-slate-700" : ""
                  } ${col.width || ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon direction={sortKey === col.key ? sortDir : null} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((agent) => {
              const sla = getSlaColor(agent.sla_success_rate);
              const csatClr = getCsatColor(agent.csat_avg);
              const status = getStatusConfig(agent.availability_status);
              const wl = getWorkloadPercent(agent);
              const wlColor = getWorkloadColor(wl);

              return (
                <tr
                  key={agent.id}
                  onClick={() => navigate(`/admin/agents/${agent.id}`)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors duration-150"
                >
                  {/* Agent Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 text-slate-600">{agent.department}</td>

                  {/* Assigned */}
                  <td className="px-4 py-3 font-semibold text-slate-700 tabular-nums">{agent.total_assigned}</td>

                  {/* Resolved */}
                  <td className="px-4 py-3 font-semibold text-emerald-600 tabular-nums">{agent.total_resolved}</td>

                  {/* Open */}
                  <td className="px-4 py-3 font-semibold text-slate-700 tabular-nums">{agent.open_tickets}</td>

                  {/* Avg Resolution Time */}
                  <td className="px-4 py-3 text-slate-600">{agent.avg_resolution_time}</td>

                  {/* SLA % */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ring-1 ${sla.bg} ${sla.text} ${sla.ring}`}>
                      {agent.sla_success_rate}%
                    </span>
                  </td>

                  {/* CSAT */}
                  <td className="px-4 py-3">
                    <span className={`font-bold ${csatClr}`}>⭐ {agent.csat_avg}</span>
                  </td>

                  {/* Workload */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-[80px]">
                        <div className={`h-full rounded-full ${wlColor} transition-all duration-500`} style={{ width: `${Math.min(wl, 100)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 tabular-nums">{wl}%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {agent.availability_status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-sm text-slate-400">
                  No agents match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${n === page ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}>{n}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
