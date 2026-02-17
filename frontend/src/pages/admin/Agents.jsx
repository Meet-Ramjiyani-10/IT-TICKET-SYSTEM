import { Activity } from "lucide-react";
import AgentSummaryBar from "../agents/AgentSummaryBar";
import AgentPerformanceTable from "../agents/AgentPerformanceTable";
import AgentComparisonPanel from "../agents/AgentComparisonPanel";
import AgentWorkloadPanel from "../agents/AgentWorkloadPanel";
import { agents } from "../../data/agentData";

// ── Page Component ───────────────────────────────────────────────
export default function Agents() {
  return (
    <div className="space-y-4">
      {/* Page header — analytical / indigo accent */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-50">
          <Activity className="w-5 h-5 text-indigo-600" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">
            Agent Performance Center
          </h1>
          <p className="text-xs text-slate-400">
            Workforce analytics &bull; SLA monitoring &bull; Workload distribution
          </p>
        </div>
      </div>

      {/* Section 1 — Summary Bar */}
      <AgentSummaryBar agents={agents} />

      {/* Section 2 — Performance Table (dominant) */}
      <AgentPerformanceTable agents={agents} />

      {/* Section 3 + 4 — Comparison & Workload side-by-side on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AgentComparisonPanel agents={agents} />
        <AgentWorkloadPanel agents={agents} />
      </div>
    </div>
  );
}
