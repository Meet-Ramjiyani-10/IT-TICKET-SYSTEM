import { Users, UserCheck, Clock, ShieldCheck, Star } from "lucide-react";
import AgentStatCard from "../agents/AgentStatCard";
import AgentPerformanceTable from "../agents/AgentPerformanceTable";
import AgentAnalyticsCharts from "../agents/AgentAnalyticsCharts";
import { agents } from "../../data/agentData";

// ── KPI computation from mock data ──────────────────────────────
function computeKpis(data) {
  const total = data.length;
  const avgTickets = Math.round(data.reduce((s, a) => s + a.total_assigned, 0) / total);
  const avgResTime =
    (data.reduce((s, a) => s + parseFloat(a.avg_resolution_time), 0) / total).toFixed(1) + "h";
  const avgSla = (data.reduce((s, a) => s + a.sla_success_rate, 0) / total).toFixed(1);
  const avgCsat = (data.reduce((s, a) => s + a.csat_avg, 0) / total).toFixed(1);

  return [
    {
      icon: Users,
      label: "Total Agents",
      value: String(total),
      trend: "+2",
      trendDirection: "up",
      subtitle: "active this month",
      gradient: "from-blue-500 to-blue-700",
      glowColor: "shadow-blue-500/25",
      hoverGlow: "hover:shadow-blue-500/40",
      ringColor: "ring-blue-400",
      iconBg: "bg-blue-400/20",
      badgeBg: "bg-blue-400/15",
      badgeText: "text-blue-100",
      accentBar: "bg-blue-300",
    },
    {
      icon: UserCheck,
      label: "Avg Tickets / Agent",
      value: String(avgTickets),
      trend: "+8%",
      trendDirection: "up",
      subtitle: "vs last month",
      gradient: "from-violet-500 to-purple-700",
      glowColor: "shadow-violet-500/25",
      hoverGlow: "hover:shadow-violet-500/40",
      ringColor: "ring-violet-400",
      iconBg: "bg-violet-400/20",
      badgeBg: "bg-violet-400/15",
      badgeText: "text-violet-100",
      accentBar: "bg-violet-300",
    },
    {
      icon: Clock,
      label: "Avg Resolution Time",
      value: avgResTime,
      trend: "-12%",
      trendDirection: "down",
      subtitle: "improving",
      gradient: "from-amber-500 to-orange-700",
      glowColor: "shadow-amber-500/25",
      hoverGlow: "hover:shadow-amber-500/40",
      ringColor: "ring-amber-400",
      iconBg: "bg-amber-400/20",
      badgeBg: "bg-amber-400/15",
      badgeText: "text-amber-100",
      accentBar: "bg-amber-300",
    },
    {
      icon: ShieldCheck,
      label: "SLA Compliance",
      value: `${avgSla}%`,
      trend: "+3.2%",
      trendDirection: "up",
      subtitle: "team average",
      gradient: "from-emerald-500 to-teal-700",
      glowColor: "shadow-emerald-500/25",
      hoverGlow: "hover:shadow-emerald-500/40",
      ringColor: "ring-emerald-400",
      iconBg: "bg-emerald-400/20",
      badgeBg: "bg-emerald-400/15",
      badgeText: "text-emerald-100",
      accentBar: "bg-emerald-300",
    },
    {
      icon: Star,
      label: "Avg CSAT Score",
      value: avgCsat,
      trend: "+0.3",
      trendDirection: "up",
      subtitle: "out of 5.0",
      gradient: "from-rose-500 to-pink-700",
      glowColor: "shadow-rose-500/25",
      hoverGlow: "hover:shadow-rose-500/40",
      ringColor: "ring-rose-400",
      iconBg: "bg-rose-400/20",
      badgeBg: "bg-rose-400/15",
      badgeText: "text-rose-100",
      accentBar: "bg-rose-300",
    },
  ];
}

// ── Page Component ───────────────────────────────────────────────
export default function Agents() {
  const kpis = computeKpis(agents);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agent Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor performance, workload &amp; SLA compliance
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {kpis.map((kpi) => (
          <AgentStatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Performance Table */}
      <AgentPerformanceTable agents={agents} />

      {/* Analytics Charts */}
      <AgentAnalyticsCharts />
    </div>
  );
}
