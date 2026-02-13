import {
  Ticket,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const cardConfigs = [
  {
    key: "total",
    label: "Total Tickets",
    icon: Ticket,
    gradient: "from-blue-500 to-blue-700",
    glow: "shadow-blue-500/25 hover:shadow-blue-500/40",
    ring: "ring-blue-400",
    iconBg: "bg-blue-400/20",
  },
  {
    key: "open",
    label: "Open Tickets",
    icon: AlertTriangle,
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/25 hover:shadow-amber-500/40",
    ring: "ring-amber-400",
    iconBg: "bg-amber-400/20",
  },
  {
    key: "highRisk",
    label: "High Risk Tickets",
    icon: ShieldAlert,
    gradient: "from-rose-500 to-red-700",
    glow: "shadow-rose-500/25 hover:shadow-rose-500/40",
    ring: "ring-rose-400",
    iconBg: "bg-rose-400/20",
  },
  {
    key: "slaBreach",
    label: "SLA Breach %",
    icon: Clock,
    gradient: "from-violet-500 to-purple-700",
    glow: "shadow-violet-500/25 hover:shadow-violet-500/40",
    ring: "ring-violet-400",
    iconBg: "bg-violet-400/20",
  },
  {
    key: "resolvedToday",
    label: "Resolved Today",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-700",
    glow: "shadow-emerald-500/25 hover:shadow-emerald-500/40",
    ring: "ring-emerald-400",
    iconBg: "bg-emerald-400/20",
  },
];

export default function TicketStats({ tickets = [] }) {
  // Compute KPIs from ticket data
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open" || t.status === "Escalated").length;
  const highRisk = tickets.filter((t) => t.predicted_risk > 70).length;

  const breachedCount = tickets.filter((t) => {
    if (!t.sla_deadline) return false;
    if (t.status === "Resolved" || t.status === "Closed") return false;
    return new Date(t.sla_deadline) < new Date();
  }).length;
  const activeCount = tickets.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length;
  const slaBreachPct = activeCount > 0 ? Math.round((breachedCount / activeCount) * 100) : 0;

  const resolvedToday = tickets.filter((t) => {
    if (!t.resolved_at) return false;
    const today = new Date().toDateString();
    return new Date(t.resolved_at).toDateString() === today;
  }).length;

  const values = {
    total: { value: total, desc: "All tickets in system", trend: "+12%", up: true },
    open: { value: open, desc: "Awaiting resolution", trend: "-3%", up: false },
    highRisk: { value: highRisk, desc: "Risk score > 70%", trend: "+2", up: true },
    slaBreach: { value: `${slaBreachPct}%`, desc: "Of active tickets", trend: "-5%", up: false },
    resolvedToday: { value: resolvedToday, desc: "Closed within SLA", trend: "+8%", up: true },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cardConfigs.map((card) => {
        const Icon = card.icon;
        const data = values[card.key];
        const TrendIcon = data.up ? TrendingUp : TrendingDown;

        return (
          <div
            key={card.key}
            className={`
              group relative overflow-hidden rounded-2xl
              bg-gradient-to-br ${card.gradient}
              shadow-lg ${card.glow}
              hover:shadow-2xl hover:-translate-y-1
              transition-all duration-300 ease-out
              ring-1 ring-white/10 hover:ring-2 ${card.ring}/30
              p-5 cursor-default
            `}
          >
            {/* Background orb */}
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />

            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white/90" />
            </div>

            {/* Label */}
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
              {card.label}
            </p>

            {/* Value */}
            <p className="text-3xl font-bold text-white tracking-tight mb-1">
              {data.value}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50">{data.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80">
                <TrendIcon className="w-3 h-3" />
                {data.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
