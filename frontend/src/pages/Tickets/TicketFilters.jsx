import { Search, Download, RefreshCw, Layers, Calendar } from "lucide-react";
import { AGENTS, CATEGORIES } from "../../data/ticketData";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed", "Escalated"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const RISK_LEVELS = ["High", "Medium", "Low"];

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none text-sm bg-slate-50 border border-slate-200 rounded-lg
        pl-3 pr-7 py-2 text-slate-600 font-medium min-w-[130px]
        hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
        transition-colors duration-150 cursor-pointer"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function TicketFilters({ filters, onChange, onRefresh, loading }) {
  const handleChange = (key) => (val) => {
    onChange({ ...filters, [key]: val });
  };

  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined && v !== null
  ).length;

  const clearAll = () => {
    onChange({
      search: "",
      status: "",
      priority: "",
      category: "",
      agent: "",
      risk: "",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ID or title..."
            value={filters.search}
            onChange={(e) => handleChange("search")(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg
              text-slate-700 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
              transition-colors duration-150"
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Filters */}
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={handleChange("status")}
          options={STATUSES}
        />
        <FilterSelect
          label="Priority"
          value={filters.priority}
          onChange={handleChange("priority")}
          options={PRIORITIES}
        />
        <FilterSelect
          label="SLA Risk"
          value={filters.risk}
          onChange={handleChange("risk")}
          options={RISK_LEVELS}
        />
        <FilterSelect
          label="Agent"
          value={filters.agent}
          onChange={handleChange("agent")}
          options={AGENTS}
        />

        {/* Date placeholder */}
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Date</span>
        </button>

        {/* Clear filters */}
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-2 transition-colors"
          >
            Clear ({activeCount})
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bulk Action</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
