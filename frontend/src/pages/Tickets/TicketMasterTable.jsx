import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCog,
  XCircle,
  Square,
  CheckSquare,
} from "lucide-react";
import {
  getPriorityColor,
  getRiskColor,
  getStatusBadge,
  formatDate,
  getSlaCountdown,
  PRIORITY_ORDER,
} from "../../utils/ticketHelpers";

// Column definitions
const COLUMNS = [
  { key: "checkbox", label: "", sortable: false, width: "w-[40px]" },
  { key: "id", label: "Ticket ID", sortable: true, width: "w-[100px]" },
  { key: "title", label: "Title", sortable: true },
  { key: "category", label: "Category", sortable: true, width: "w-[100px]" },
  { key: "priority", label: "Priority", sortable: true, width: "w-[100px]" },
  { key: "predicted_risk", label: "SLA Risk %", sortable: true, width: "w-[110px]" },
  { key: "time_remaining", label: "Time Left", sortable: false, width: "w-[120px]" },
  { key: "assigned_agent", label: "Agent", sortable: true, width: "w-[120px]" },
  { key: "status", label: "Status", sortable: true, width: "w-[110px]" },
  { key: "created_at", label: "Created", sortable: true, width: "w-[100px]" },
  { key: "actions", label: "", sortable: false, width: "w-[100px]" },
];

// Sub-components
function SortIcon({ direction }) {
  if (!direction)
    return <ChevronsUpDown className="w-3 h-3 text-slate-300" />;
  return direction === "asc" ? (
    <ChevronUp className="w-3 h-3 text-blue-500" />
  ) : (
    <ChevronDown className="w-3 h-3 text-blue-500" />
  );
}

function PriorityBadge({ priority }) {
  const c = getPriorityColor(priority);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full ring-1 ${c.bg} ${c.text} ${c.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const c = getStatusBadge(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function RiskCell({ risk }) {
  const color = getRiskColor(risk);
  const isHigh = risk > 70;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[48px]">
        <div
          className={`h-full rounded-full ${color.bg} transition-all duration-500`}
          style={{ width: `${Math.min(risk, 100)}%` }}
        />
      </div>
      <span
        className={`text-xs tabular-nums ${color.text} ${isHigh ? "font-bold" : "font-medium"}`}
      >
        {risk}%
      </span>
    </div>
  );
}

function TimeRemainingCell({ deadline, status }) {
  if (status === "Resolved" || status === "Closed") {
    return <span className="text-[11px] text-slate-400 italic">Closed</span>;
  }
  const sla = getSlaCountdown(deadline);
  return (
    <span
      className={`text-[11px] font-semibold ${
        sla.urgent ? "text-red-600 animate-pulse" : "text-slate-600"
      }`}
    >
      {sla.label}
    </span>
  );
}

// Skeleton
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {COLUMNS.map((col) => (
        <td key={col.key} className="px-3 py-3">
          <div className="h-3.5 bg-slate-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// Row background based on risk
function getRowBg(ticket, isSelected) {
  if (isSelected) return "bg-blue-50/60";
  if (ticket.predicted_risk > 70) return "bg-red-50/50";
  if (ticket.predicted_risk >= 50) return "bg-orange-50/40";
  return "";
}

// Main Component
export default function TicketMasterTable({
  tickets = [],
  loading = false,
  pageSize = 10,
}) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("predicted_risk");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  // Sort
  const sorted = useMemo(() => {
    return [...tickets].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === "priority") {
        aVal = PRIORITY_ORDER[aVal] ?? 99;
        bVal = PRIORITY_ORDER[bVal] ?? 99;
      } else if (sortKey === "predicted_risk") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortKey === "created_at" || sortKey === "sla_deadline") {
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
  }, [tickets, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((t) => t.id)));
    }
  };

  const allSelected = paged.length > 0 && selected.size === paged.length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex-1">
      {/* Table header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Operations Queue
          </p>
          <span className="text-xs text-slate-400">
            {sorted.length} ticket{sorted.length !== 1 && "s"}
          </span>
          {selected.size > 0 && (
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
              {selected.size} selected
            </span>
          )}
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
                  className={`px-3 py-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${col.width || ""} ${
                    col.sortable
                      ? "cursor-pointer select-none hover:text-slate-600"
                      : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.key === "checkbox" ? (
                    <button
                      onClick={toggleAll}
                      className="text-slate-400 hover:text-blue-500"
                    >
                      {allSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          direction={sortKey === col.key ? sortDir : null}
                        />
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="text-center py-16 text-sm text-slate-400"
                >
                  No tickets found matching your filters.
                </td>
              </tr>
            ) : (
              paged.map((ticket) => {
                const isSelected = selected.has(ticket.id);
                const rowBg = getRowBg(ticket, isSelected);

                return (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                    className={`cursor-pointer transition-colors duration-100 ${rowBg} hover:bg-slate-100/70`}
                  >
                    {/* Checkbox */}
                    <td
                      className="px-3 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleSelect(ticket.id)}
                        className="text-slate-400 hover:text-blue-500"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>

                    {/* ID */}
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-semibold text-blue-600 font-mono">
                        {ticket.id}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-3 py-2.5">
                      <p className="text-sm font-medium text-slate-800 truncate max-w-[240px]">
                        {ticket.title}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {ticket.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-2.5">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    {/* SLA Risk */}
                    <td className="px-3 py-2.5">
                      <RiskCell risk={ticket.predicted_risk} />
                    </td>

                    {/* Time Remaining */}
                    <td className="px-3 py-2.5">
                      <TimeRemainingCell
                        deadline={ticket.sla_deadline}
                        status={ticket.status}
                      />
                    </td>

                    {/* Agent */}
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-slate-600">
                        {ticket.assigned_agent}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2.5">
                      <StatusBadge status={ticket.status} />
                    </td>

                    {/* Created */}
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] text-slate-400">
                        {formatDate(ticket.created_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-3 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() =>
                            navigate(`/admin/tickets/${ticket.id}`)
                          }
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Reassign"
                        >
                          <UserCog className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Close"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/30">
          <p className="text-[11px] text-slate-400">
            {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-0.5">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 text-[11px] font-medium rounded transition-colors ${
                  p === safePage
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
