import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import {
  getSlaColor, getCsatColor, getStatusConfig,
  getWorkloadColor,
} from "../../data/agentData";

// Column definitions
const COLUMNS = [
  { key: "name", label: "Agent", sortable: true },
  { key: "department", label: "Dept", sortable: true, width: "w-[100px]" },
  { key: "total_assigned", label: "Assigned", sortable: true, width: "w-[80px]" },
  { key: "total_resolved", label: "Resolved", sortable: true, width: "w-[80px]" },
  { key: "open_tickets", label: "Open", sortable: true, width: "w-[65px]" },
  { key: "avg_resolution_time", label: "Avg Time", sortable: true, width: "w-[85px]" },
  { key: "sla_success_rate", label: "SLA %", sortable: true, width: "w-[90px]" },
  { key: "csat_avg", label: "CSAT", sortable: true, width: "w-[70px]" },
  { key: "workload_percentage", label: "Workload", sortable: true, width: "w-[120px]" },
  { key: "availability_status", label: "Status", sortable: true, width: "w-[100px]" },
];

function SortIcon({ direction }) {
  if (!direction) return <ChevronsUpDown className="w-3 h-3 text-slate-300" />;
  return direction === "asc"
    ? <ChevronUp className="w-3 h-3 text-indigo-500" />
    : <ChevronDown className="w-3 h-3 text-indigo-500" />;
}

export default function AgentPerformanceTable({ agents = [] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sortKey, setSortKey] = useState("sla_success_rate");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Unique departments
  const departments = useMemo(
    () => [...new Set(agents.map((a) => a.department))].sort(),
    [agents]
  );

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
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
          a.id.toLowerCase().includes(q)
      );
    }
    if (department) {
      list = list.filter((a) => a.department === department);
    }
    list = [...list].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "avg_resolution_time") {
        va = parseFloat(va) || 0;
        vb = parseFloat(vb) || 0;
      } else if (typeof va === "string") {
        va = va.toLowerCase();
        vb = (vb || "").toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [agents, search, department, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Agent Performance
          </p>
          <p className="text-[11px] text-slate-400">{filtered.length} agents</p>
        </div>

        {/* Department filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
            className="appearance-none text-sm bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-1.5 text-slate-600 font-medium min-w-[120px] hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors cursor-pointer"
          >
            <option value="">All Depts</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${
                    col.sortable ? "cursor-pointer select-none hover:text-slate-600" : ""
                  } ${col.width || ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon direction={sortKey === col.key ? sortDir : null} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((agent) => {
              const sla = getSlaColor(agent.sla_success_rate);
              const csatClr = getCsatColor(agent.csat_avg);
              const status = getStatusConfig(agent.availability_status);
              const wl = agent.workload_percentage || 0;
              const wlColor = getWorkloadColor(wl);

              return (
                <tr
                  key={agent.id}
                  onClick={() => navigate(`/admin/agents/${agent.id}`)}
                  className="hover:bg-indigo-50/40 cursor-pointer transition-colors duration-100"
                >
                  {/* Agent Name + Avatar */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{agent.name}</p>
                        <p className="text-[10px] text-slate-400">{agent.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {agent.department}
                    </span>
                  </td>

                  {/* Assigned */}
                  <td className="px-3 py-2.5 text-sm font-semibold text-slate-700 tabular-nums">{agent.total_assigned}</td>

                  {/* Resolved */}
                  <td className="px-3 py-2.5 text-sm font-semibold text-emerald-600 tabular-nums">{agent.total_resolved}</td>

                  {/* Open */}
                  <td className="px-3 py-2.5 text-sm font-semibold text-slate-600 tabular-nums">{agent.open_tickets}</td>

                  {/* Avg Resolution */}
                  <td className="px-3 py-2.5 text-xs text-slate-600">{agent.avg_resolution_time}</td>

                  {/* SLA % */}
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-full ring-1 ${sla.bg} ${sla.text} ${sla.ring}`}>
                      {agent.sla_success_rate}%
                    </span>
                  </td>

                  {/* CSAT */}
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-bold tabular-nums ${csatClr}`}>{agent.csat_avg}</span>
                  </td>

                  {/* Workload */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[60px]">
                        <div className={`h-full rounded-full ${wlColor} transition-all duration-500`} style={{ width: `${Math.min(wl, 100)}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 tabular-nums">{wl}%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ${status.bg} ${status.text}`}>
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
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/30">
          <p className="text-[11px] text-slate-400">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 text-[11px] font-medium rounded transition-colors ${
                  n === page ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
