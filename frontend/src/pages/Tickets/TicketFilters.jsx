import { useState } from "react";
import { Search, SlidersHorizontal, X, Calendar } from "lucide-react";
import { AGENTS, CATEGORIES } from "../../data/ticketData";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed", "Escalated"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const RISK_LEVELS = ["High", "Medium", "Low"];

function SelectDropdown({ label, value, onChange, options, icon: Icon }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-sm bg-white border border-slate-200 rounded-lg
          pl-3 pr-8 py-2.5 text-slate-600 font-medium w-full min-w-[140px]
          hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
          transition-colors duration-200 cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      )}
    </div>
  );
}

export default function TicketFilters({ filters, onChange }) {
  const [expanded, setExpanded] = useState(false);

  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined && v !== null
  ).length;

  const handleChange = (key) => (val) => {
    onChange({ ...filters, [key]: val });
  };

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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Top bar: Search + Toggle + Clear */}
      <div className="flex flex-wrap items-center gap-3 p-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Ticket ID or Title..."
            value={filters.search}
            onChange={(e) => handleChange("search")(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg
              text-slate-700 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
              transition-colors duration-200"
          />
        </div>

        {/* Quick filters (always visible) */}
        <SelectDropdown
          label="All Statuses"
          value={filters.status}
          onChange={handleChange("status")}
          options={STATUSES}
        />
        <SelectDropdown
          label="All Priorities"
          value={filters.priority}
          onChange={handleChange("priority")}
          options={PRIORITIES}
        />

        {/* Toggle extra filters */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors duration-200
            ${
              expanded
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
              {activeCount}
            </span>
          )}
        </button>

        {/* Clear all */}
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filter row */}
      {expanded && (
        <div className="flex flex-wrap items-center gap-3 px-4 pb-4 pt-1 border-t border-slate-100">
          <SelectDropdown
            label="All Categories"
            value={filters.category}
            onChange={handleChange("category")}
            options={CATEGORIES}
          />
          <SelectDropdown
            label="All Agents"
            value={filters.agent}
            onChange={handleChange("agent")}
            options={AGENTS}
          />
          <SelectDropdown
            label="SLA Risk"
            value={filters.risk}
            onChange={handleChange("risk")}
            options={RISK_LEVELS}
          />

          {/* Date range placeholder */}
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 bg-white border border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
        </div>
      )}
    </div>
  );
}
