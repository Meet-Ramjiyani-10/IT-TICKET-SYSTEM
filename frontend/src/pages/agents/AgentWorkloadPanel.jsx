import { Flame } from "lucide-react";

function getHeatColor(pct) {
  if (pct >= 85) return { bar: "bg-red-500", bg: "bg-red-50", text: "text-red-700", label: "Overloaded" };
  if (pct >= 65) return { bar: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", label: "Heavy" };
  if (pct >= 45) return { bar: "bg-indigo-400", bg: "bg-indigo-50", text: "text-indigo-700", label: "Moderate" };
  return { bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", label: "Light" };
}

export default function AgentWorkloadPanel({ agents = [] }) {
  // Sort by workload descending
  const sorted = [...agents].sort(
    (a, b) => (b.workload_percentage || 0) - (a.workload_percentage || 0)
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-1.5 rounded-md bg-orange-50">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Workload Heat Map
          </h4>
          <p className="text-[10px] text-slate-400">Agents ranked by current workload</p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-2.5">
        {sorted.map((agent) => {
          const wl = agent.workload_percentage || 0;
          const heat = getHeatColor(wl);
          const initials = agent.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div key={agent.id} className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {initials}
              </div>

              {/* Name */}
              <p className="text-xs font-medium text-slate-700 w-24 truncate shrink-0">
                {agent.name}
              </p>

              {/* Bar */}
              <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${heat.bar} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(wl, 100)}%` }}
                />
              </div>

              {/* Percentage */}
              <span className="text-[11px] font-bold tabular-nums text-slate-600 w-9 text-right">
                {wl}%
              </span>

              {/* Status label */}
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${heat.bg} ${heat.text} w-20 text-center shrink-0`}
              >
                {heat.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
        {[
          { color: "bg-emerald-500", label: "< 45%" },
          { color: "bg-indigo-400", label: "45–65%" },
          { color: "bg-amber-500", label: "65–85%" },
          { color: "bg-red-500", label: "> 85%" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[10px] text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
