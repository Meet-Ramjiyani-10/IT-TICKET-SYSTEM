import {
  Ticket,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
} from "lucide-react";

const statConfigs = [
  {
    key: "total",
    label: "Total Tickets",
    icon: Ticket,
    accent: "border-l-blue-500",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    key: "open",
    label: "Open",
    icon: AlertTriangle,
    accent: "border-l-amber-500",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    key: "highRisk",
    label: "High Risk",
    icon: ShieldAlert,
    accent: "border-l-red-500",
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
  {
    key: "nearBreach",
    label: "Near Breach",
    icon: Clock,
    accent: "border-l-orange-500",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    key: "resolvedToday",
    label: "Resolved Today",
    icon: CheckCircle2,
    accent: "border-l-emerald-500",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
];

export default function TicketStats({ tickets = [] }) {
  const total = tickets.length;
  const open = tickets.filter(
    (t) => t.status === "Open" || t.status === "Escalated"
  ).length;
  const highRisk = tickets.filter((t) => t.predicted_risk > 70).length;

  // Near breach: active tickets with SLA deadline within 6 hours or already breached
  const nearBreach = tickets.filter((t) => {
    if (!t.sla_deadline) return false;
    if (t.status === "Resolved" || t.status === "Closed") return false;
    const hoursLeft =
      (new Date(t.sla_deadline) - new Date()) / (1000 * 60 * 60);
    return hoursLeft <= 6;
  }).length;

  const resolvedToday = tickets.filter((t) => {
    if (!t.resolved_at) return false;
    const today = new Date().toDateString();
    return new Date(t.resolved_at).toDateString() === today;
  }).length;

  const values = {
    total,
    open,
    highRisk,
    nearBreach,
    resolvedToday,
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
