import { Users, UserCheck, Clock, ShieldCheck, Star } from "lucide-react";

const statConfigs = [
  {
    key: "totalAgents",
    label: "Active Agents",
    icon: Users,
    accent: "border-l-indigo-500",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
  },
  {
    key: "avgTickets",
    label: "Avg Tickets / Agent",
    icon: UserCheck,
    accent: "border-l-violet-500",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
  },
  {
    key: "avgResTime",
    label: "Avg Resolution",
    icon: Clock,
    accent: "border-l-sky-500",
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
  },
  {
    key: "slaCompliance",
    label: "SLA Compliance",
    icon: ShieldCheck,
    accent: "border-l-emerald-500",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    key: "avgCsat",
    label: "Avg CSAT",
    icon: Star,
    accent: "border-l-amber-500",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
];

export default function AgentSummaryBar({ agents = [] }) {
  const total = agents.length;
  const avgTickets = total
    ? Math.round(agents.reduce((s, a) => s + a.total_assigned, 0) / total)
    : 0;
  const avgResTime = total
    ? (
        agents.reduce((s, a) => s + parseFloat(a.avg_resolution_time), 0) /
        total
      ).toFixed(1) + "h"
    : "—";
  const slaCompliance = total
    ? (
        agents.reduce((s, a) => s + a.sla_success_rate, 0) / total
      ).toFixed(1) + "%"
    : "—";
  const avgCsat = total
    ? (agents.reduce((s, a) => s + a.csat_avg, 0) / total).toFixed(1)
    : "—";

  const values = {
    totalAgents: total,
    avgTickets,
    avgResTime,
    slaCompliance,
    avgCsat,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statConfigs.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className={`
              bg-white rounded-lg border border-slate-200 border-l-[3px] ${stat.accent}
              px-4 py-3 flex items-center gap-3
              hover:shadow-sm transition-shadow duration-200
            `}
          >
            <div
              className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide leading-none mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-slate-800 leading-none tabular-nums">
                {values[stat.key]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
