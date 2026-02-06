import { useState, useMemo } from "react";
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Filter, X,
} from "lucide-react";

// ── Priority & status config ────────────────────────────────────
const PRIORITY_CONFIG = {
  Critical: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-500" },
  High:     { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", dot: "bg-orange-500" },
  Medium:   { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  Low:      { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200", dot: "bg-green-500" },
  Info:     { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500" },
};

const STATUS_CONFIG = {
  Open:          { bg: "bg-slate-100", text: "text-slate-700" },
  "In Progress": { bg: "bg-blue-50", text: "text-blue-700" },
  Resolved:      { bg: "bg-emerald-50", text: "text-emerald-700" },
  Closed:        { bg: "bg-slate-50", text: "text-slate-500" },
  Escalated:     { bg: "bg-purple-50", text: "text-purple-700" },
};

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };

function getRiskColor(risk) {
  if (risk >= 75) return "text-red-600";
  if (risk >= 50) return "text-orange-500";
  if (risk >= 25) return "text-amber-500";
  return "text-green-600";
}

function getRiskBg(risk) {
  if (risk >= 75) return "bg-red-500";
  if (risk >= 50) return "bg-orange-400";
  if (risk >= 25) return "bg-amber-400";
  return "bg-green-500";
}

// ── Column definitions ──────────────────────────────────────────
const COLUMNS = [
  { key: "id", label: "Ticket ID", sortable: true, width: "w-[100px]" },
  { key: "title", label: "Title", sortable: true },
  { key: "category", label: "Category", sortable: true, width: "w-[130px]" },
  { key: "priority", label: "Priority", sortable: true, width: "w-[110px]" },
  { key: "risk", label: "SLA Risk", sortable: true, width: "w-[120px]" },
  { key: "status", label: "Status", sortable: true, width: "w-[120px]" },
  { key: "assignee", label: "Assignee", sortable: true, width: "w-[130px]" },
  { key: "created", label: "Created", sortable: true, width: "w-[110px]" },
];

// ── Sub-components ──────────────────────────────────────────────
function SortIcon({ direction }) {
  if (!direction) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />;
  return direction === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />;
}

function PriorityBadge({ priority }) {
  const c = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.Open;
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}

function RiskBar({ risk }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[60px]">
        <div
          className={`h-full rounded-full ${getRiskBg(risk)} transition-all duration-500`}
          style={{ width: `${Math.min(risk, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${getRiskColor(risk)}`}>
        {risk}%
      </span>
    </div>
  );
}

function FilterDropdown({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg 
          pl-3 pr-7 py-2 text-slate-600 font-medium
          hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
          transition-colors duration-200 cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function TicketTable({
  tickets = [],
  pageSize = 8,
  loading = false,
  onRowClick,
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("created");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Extract unique values for filter dropdowns
  const priorities = useMemo(
    () => [...new Set(tickets.map((t) => t.priority))].sort((a, b) => (PRIORITY_ORDER[a] ?? 99) - (PRIORITY_ORDER[b] ?? 99)),
    [tickets]
  );
  const statuses = useMemo(
    () => [...new Set(tickets.map((t) => t.status))],
    [tickets]
  );

  // Filter → Search → Sort pipeline
  const processed = useMemo(() => {
    let result = [...tickets];

    // Filters
    if (priorityFilter) result = result.filter((t) => t.priority === priorityFilter);
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id?.toLowerCase().includes(q) ||
          t.title?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.assignee?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === "priority") {
        aVal = PRIORITY_ORDER[aVal] ?? 99;
        bVal = PRIORITY_ORDER[bVal] ?? 99;
      } else if (sortKey === "risk") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortKey === "created") {
        aVal = new Date(aVal).getTime() || 0;
        bVal = new Date(bVal).getTime() || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tickets, search, sortKey, sortDir, priorityFilter, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = processed.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset page when filters change
  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const activeFilters = [priorityFilter, statusFilter].filter(Boolean).length;

  const clearFilters = () => {
    setPriorityFilter("");
    setStatusFilter("");
    setSearch("");
    setPage(1);
  };

  // ── Render cell content ───────────────────────────────────────
  const renderCell = (ticket, colKey) => {
    switch (colKey) {
      case "id":
        return <span className="font-mono text-xs font-semibold text-blue-600">{ticket.id}</span>;
      case "title":
        return (
          <span className="font-medium text-slate-800 line-clamp-1" title={ticket.title}>
            {ticket.title}
          </span>
        );
      case "category":
        return <span className="text-xs text-slate-500">{ticket.category || "—"}</span>;
      case "priority":
        return <PriorityBadge priority={ticket.priority} />;
      case "risk":
        return <RiskBar risk={ticket.risk} />;
      case "status":
        return <StatusBadge status={ticket.status} />;
      case "assignee":
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {ticket.assignee?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
            </div>
            <span className="text-xs text-slate-600 truncate">{ticket.assignee || "Unassigned"}</span>
          </div>
        );
      case "created":
        return <span className="text-xs text-slate-400 tabular-nums">{ticket.created || "—"}</span>;
      default:
        return ticket[colKey] ?? "—";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">Recent Tickets</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {processed.length} ticket{processed.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search tickets..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56
              placeholder:text-slate-400 text-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
              transition-colors duration-200"
          />
        </div>

        {/* Filters */}
        <FilterDropdown
          label="Priority" options={priorities}
          value={priorityFilter} onChange={handleFilterChange(setPriorityFilter)}
        />
        <FilterDropdown
          label="Status" options={statuses}
          value={statusFilter} onChange={handleFilterChange(setStatusFilter)}
        />

        {activeFilters > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-y border-slate-100">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider 
                    ${col.width || ""} 
                    ${col.sortable ? "cursor-pointer select-none hover:text-slate-700 transition-colors" : ""}`}
                  onClick={() => col.sortable && handleSort(col.key)}
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
            {loading ? (
              // Skeleton rows
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-5 py-3.5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-5 py-16 text-center">
                  <div className="text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No tickets found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((ticket, index) => (
                <tr
                  key={ticket.id || index}
                  onClick={() => onRowClick?.(ticket)}
                  className={`
                    group hover:bg-blue-50/40 transition-colors duration-150
                    ${onRowClick ? "cursor-pointer" : ""}
                  `}
                >
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-5 py-3.5">
                      {renderCell(ticket, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      {!loading && processed.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, processed.length)} of {processed.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-300">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                      ${safePage === item
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}