import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Briefcase, Award, Clock, ShieldCheck, Star,
  TrendingUp, AlertTriangle, Ticket, CheckCircle2, UserCircle,
} from "lucide-react";
import {
  agents, agentTickets,
  getSlaColor, getCsatColor, getStatusConfig,
  getSlaRiskColor, getSlaRiskBg,
} from "../../data/agentData";

// ── Small stat block used in the Performance Stats Grid ──────────
function StatBlock({ icon: Icon, label, value, color = "text-slate-800", subtitle }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-slate-100`}>
          <Icon className={`w-4 h-4 ${color}`} strokeWidth={2} />
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {priority}
    </span>
  );
}

const STATUS_CFG = {
  Open:          { bg: "bg-slate-100", text: "text-slate-700" },
  "In Progress": { bg: "bg-blue-50", text: "text-blue-700" },
  Escalated:     { bg: "bg-purple-50", text: "text-purple-700" },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.Open;
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${c.bg} ${c.text}`}>
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
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Agents
        </button>
      </div>
    );
  }

  const statusCfg = getStatusConfig(agent.availability_status);
  const slaCfg = getSlaColor(agent.sla_success_rate);
  const csatClr = getCsatColor(agent.csat_avg);
  const initials = agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/agents")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Agents
      </button>

      {/* ── HEADER SECTION ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
            {initials}
          </div>

          {/* Info grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Agent Name</p>
              <p className="text-lg font-bold text-slate-800">{agent.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Agent ID</p>
              <p className="text-sm font-semibold text-slate-600">{agent.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Department</p>
              <p className="text-sm font-semibold text-slate-600">{agent.department}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Specialization</p>
              <p className="text-sm font-semibold text-slate-600">{agent.specialization}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm font-semibold text-slate-600">{agent.experience}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {agent.availability_status}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Tickets Active</p>
              <p className="text-sm font-bold text-blue-600">{agent.open_tickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PERFORMANCE STATS GRID ──────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Performance Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatBlock icon={Ticket} label="Total Handled" value={agent.total_assigned} color="text-blue-600" subtitle="lifetime tickets" />
          <StatBlock icon={Clock} label="Avg Resolution" value={agent.avg_resolution_time} color="text-amber-600" subtitle="per ticket" />
          <StatBlock icon={AlertTriangle} label="Escalation Rate" value={`${agent.escalation_rate}%`} color={agent.escalation_rate > 5 ? "text-red-600" : "text-emerald-600"} subtitle={agent.escalation_rate > 5 ? "above threshold" : "below threshold"} />
          <StatBlock icon={ShieldCheck} label="SLA Compliance" value={`${agent.sla_success_rate}%`} color={slaCfg.text} subtitle="success rate" />
          <StatBlock icon={Star} label="CSAT Avg" value={`⭐ ${agent.csat_avg}`} color={csatClr} subtitle="out of 5.0" />
        </div>
      </div>

      {/* ── ACTIVE TICKETS TABLE ────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Active Tickets</h3>
          <p className="text-xs text-slate-400 mt-0.5">{tickets.length} open / in-progress tickets</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                {["Ticket ID", "Title", "Priority", "SLA Risk %", "Time Remaining", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-4 py-3 font-medium text-blue-600">{t.id}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{t.title}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[60px]">
                        <div className={`h-full rounded-full ${getSlaRiskBg(t.sla_risk)} transition-all duration-500`} style={{ width: `${Math.min(t.sla_risk, 100)}%` }} />
                      </div>
                      <span className={`text-xs font-bold tabular-nums ${getSlaRiskColor(t.sla_risk)}`}>{t.sla_risk}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium tabular-nums">{t.time_remaining}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
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
