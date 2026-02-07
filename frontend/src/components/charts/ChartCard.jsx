import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export default function ChartCard({ title, subtitle, icon: Icon, children, accentColor = "blue" }) {
  const [expanded, setExpanded] = useState(false);

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    rose: "from-rose-500 to-rose-600",
    amber: "from-amber-500 to-amber-600",
    emerald: "from-emerald-500 to-emerald-600",
    violet: "from-violet-500 to-violet-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-slate-200/60
        hover:shadow-lg hover:border-slate-300/80
        transition-all duration-300 ease-out
        ${expanded ? "col-span-full row-span-2" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorMap[accentColor]} shadow-sm`}>
              <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 
            hover:text-slate-600 transition-colors duration-200"
          aria-label={expanded ? "Collapse chart" : "Expand chart"}
        >
          {expanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Chart content */}
      <div className={`px-4 pb-5 ${expanded ? "h-[450px]" : "h-[280px]"} transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
