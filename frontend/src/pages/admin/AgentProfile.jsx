import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, ShieldCheck, Star,
  AlertTriangle, Ticket, CheckCircle2, UserCircle,
  Briefcase, Gauge, Activity,
} from "lucide-react";
import {
  agents, agentTickets,
  getSlaColor, getCsatColor, getStatusConfig,
  getSlaRiskColor, getSlaRiskBg, getWorkloadColor,
} from "../../data/agentData";

// ── Compact stat pill used in the metrics row ────────────────────
function MetricPill({ icon: Icon, label, value, accent = "indigo" }) {
  const accentMap = {
    indigo: "border-indigo-400 bg-indigo-50 text-indigo-600",
    amber: "border-amber-400 bg-amber-50 text-amber-600",
    red: "border-red-400 bg-red-50 text-red-600",
    emerald: "border-emerald-400 bg-emerald-50 text-emerald-600",
    violet: "border-violet-400 bg-violet-50 text-violet-600",
  };
  const c = accentMap[accent] || accentMap.indigo;
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3 border-l-[3px]" style={{ borderLeftColor: `var(--color-${accent}-400)` }}>
      <div className={`p-1.5 rounded-md ${c.split(" ").slice(1, 3).join(" ")}`}>
        <Icon className={`w-3.5 h-3.5 ${c.split(" ")[2]}`} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-base font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Priority badge ───────────────────────────────────────────────
const PRIO = {
  Critical: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-500" },
  High:     { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", dot: "bg-orange-500" },
  Medium:   { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  Low:      { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200", dot: "bg-green-500" },
};

function PriorityBadge({ priority }) {
  const c = PRIO[priority] || PRIO.Medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {priority}
    </span>
  );
}

const STATUS_CFG = {
  Open:          { bg: "bg-slate-100", text: "text-slate-700" },
  "In Progress": { bg: "bg-indigo-50", text: "text-indigo-700" },
  Escalated:     { bg: "bg-purple-50", text: "text-purple-700" },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.Open;
  return (
    <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}

// ── Main Page Component ──────────────────────────────────────────
export default function AgentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const agent = agents.find((a) => a.id === id);
  const tickets = agentTickets[id] || [];

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <UserCircle className="w-16 h-16 text-slate-300" />
        <p className="text-lg font-semibold text-slate-500">Agent not found</p>
        <button
          onClick={() => navigate("/admin/agents")}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Agents
        </button>
      </div>
    );
  }

  const statusCfg = getStatusConfig(agent.availability_status);
  const slaCfg = getSlaColor(agent.sla_success_rate);
  const csatClr = getCsatColor(agent.csat_avg);
  const wl = agent.workload_percentage || 0;
  const wlColor = getWorkloadColor(wl);
  const initials = agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Back nav */}
      <button
        onClick={() => navigate("/admin/agents")}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Performance Center
      </button>

      {/* ── HEADER CARD ─────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-500/15 shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-lg font-bold text-slate-800">{agent.name}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {agent.availability_status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="font-mono text-slate-400">{agent.id}</span>
              <span>{agent.department}</span>
              <span>{agent.specialization}</span>
              <span>{agent.experience}</span>
            </div>

            {/* Workload bar inline */}
            <div className="mt-3 flex items-center gap-3 max-w-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide w-14 shrink-0">Workload</span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${wlColor} transition-all duration-500`} style={{ width: `${wl}%` }} />
              </div>
              <span className="text-xs font-bold tabular-nums text-slate-600">{wl}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── METRICS ROW ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricPill icon={Ticket} label="Total Handled" value={agent.total_assigned} accent="indigo" />
        <MetricPill icon={Clock} label="Avg Resolution" value={agent.avg_resolution_time} accent="amber" />
        <MetricPill icon={AlertTriangle} label="Escalation Rate" value={`${agent.escalation_rate}%`} accent={agent.escalation_rate > 5 ? "red" : "emerald"} />
        <MetricPill icon={ShieldCheck} label="SLA Compliance" value={`${agent.sla_success_rate}%`} accent={agent.sla_success_rate >= 90 ? "emerald" : agent.sla_success_rate >= 80 ? "amber" : "red"} />
        <MetricPill icon={Star} label="CSAT Score" value={agent.csat_avg} accent="violet" />
      </div>

      {/* ── ACTIVE TICKETS TABLE ────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-indigo-50">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Active Tickets</h3>
            <p className="text-[10px] text-slate-400">{tickets.length} open / in-progress</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80">
                {["Ticket ID", "Title", "Priority", "SLA Risk", "Time Left", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                  <td className="px-4 py-2.5 font-medium text-indigo-600">{t.id}</td>
                  <td className="px-4 py-2.5 text-slate-700 max-w-xs truncate">{t.title}</td>
                  <td className="px-4 py-2.5"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[50px]">
                        <div className={`h-full rounded-full ${getSlaRiskBg(t.sla_risk)} transition-all duration-500`} style={{ width: `${Math.min(t.sla_risk, 100)}%` }} />
                      </div>
                      <span className={`text-[11px] font-bold tabular-nums ${getSlaRiskColor(t.sla_risk)}`}>{t.sla_risk}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 font-medium tabular-nums">{t.time_remaining}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={t.status} /></td>
                </tr>
              ))}

              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-300 mb-2" />
                    No active tickets — all clear!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
