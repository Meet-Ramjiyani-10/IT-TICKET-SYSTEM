import { useState, useEffect } from "react";
import StatCard from "../../components/metrics/statCard";
import TicketVolumeChart from "../../components/charts/TicketVolumeChart";
import CategoryDistributionChart from "../../components/charts/CategoryDistributionChart";
import PriorityBarChart from "../../components/charts/PriorityBarChart";
import SLATrendChart from "../../components/charts/SLATrendChart";
import AgentPerformanceChart from "../../components/charts/AgentPerformanceChart";
import ResolutionTimeChart from "../../components/charts/ResolutionTimeChart";
import TicketTable from "../../components/ui/TicketTable";
import { dashboardAPI, ticketsAPI } from "../../services/api";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

// Fallback static data used when the API is unreachable
const FALLBACK_KPI = [
  { type: "totalTickets", value: "—", trend: "—", trendDirection: "up", subtitle: "awaiting data" },
  { type: "highRisk", value: "—", trend: "—", trendDirection: "up", subtitle: "awaiting data" },
  { type: "slaBreach", value: "—", trend: "—", trendDirection: "down", subtitle: "awaiting data" },
  { type: "avgCsat", value: "—", trend: "—", trendDirection: "up", subtitle: "awaiting data" },
];

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState(null);
  const [kpiData, setKpiData] = useState(FALLBACK_KPI);
  const [tickets, setTickets] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ticketsRes, volumeRes, categoryRes, priorityRes, slaRes, agentRes, resTimeRes] =
        await Promise.allSettled([
          dashboardAPI.getStats(),
          ticketsAPI.getAll({ limit: 20, sort: "-created" }),
          dashboardAPI.getTicketVolume(),
          dashboardAPI.getCategoryDistribution(),
          dashboardAPI.getPriorityDistribution(),
          dashboardAPI.getSlaTrend(),
          dashboardAPI.getAgentPerformance(),
          dashboardAPI.getResolutionTime(),
        ]);

      // KPI stats
      if (statsRes.status === "fulfilled") {
        const s = statsRes.value.data;
        setKpiData([
          { type: "totalTickets", value: s.totalTickets?.toLocaleString() ?? "0", trend: s.totalTicketsTrend ?? "+0%", trendDirection: s.totalTicketsTrendDir ?? "up", subtitle: "vs last month" },
          { type: "highRisk", value: String(s.highRisk ?? 0), trend: s.highRiskTrend ?? "+0%", trendDirection: s.highRiskTrendDir ?? "up", subtitle: "needs attention" },
          { type: "slaBreach", value: `${s.slaBreach ?? 0}%`, trend: s.slaBreachTrend ?? "0%", trendDirection: s.slaBreachTrendDir ?? "down", subtitle: s.slaBreachSubtitle ?? "improving" },
          { type: "avgCsat", value: String(s.avgCsat ?? 0), trend: s.avgCsatTrend ?? "+0", trendDirection: s.avgCsatTrendDir ?? "up", subtitle: "out of 5.0" },
        ]);
      }

      // Recent tickets
      if (ticketsRes.status === "fulfilled") {
        setTickets(ticketsRes.value.data.tickets ?? ticketsRes.value.data ?? []);
      }

      // Chart data
      const cd = {};
      if (volumeRes.status === "fulfilled") cd.volume = volumeRes.value.data;
      if (categoryRes.status === "fulfilled") cd.category = categoryRes.value.data;
      if (priorityRes.status === "fulfilled") cd.priority = priorityRes.value.data;
      if (slaRes.status === "fulfilled") cd.sla = slaRes.value.data;
      if (agentRes.status === "fulfilled") cd.agent = agentRes.value.data;
      if (resTimeRes.status === "fulfilled") cd.resolution = resTimeRes.value.data;
      setChartData(cd);
    } catch (err) {
      setError("Failed to load dashboard data. Showing fallback data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-9">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time IT service desk metrics
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiData.map((kpi) => (
          <StatCard
            key={kpi.type}
            type={kpi.type}
            value={kpi.value}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
            subtitle={kpi.subtitle}
            onClick={() => setActiveCard(kpi.type)}
          />
        ))}
      </div>

      {/* Charts Section Header */}
      <div className="mt-10 mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-transparent" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Analytics & Insights
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-slate-200 via-slate-300 to-transparent" />
      </div>

      {/* Charts Grid — Row 1: Volume (wide) + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-3">
          <TicketVolumeChart data={chartData.volume} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <CategoryDistributionChart data={chartData.category} loading={loading} />
        </div>
      </div>

      {/* Charts Grid — Row 2: Priority + SLA Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <PriorityBarChart data={chartData.priority} loading={loading} />
        <SLATrendChart data={chartData.sla} loading={loading} />
      </div>

      {/* Charts Grid — Row 3: Agent Performance + Resolution Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <AgentPerformanceChart data={chartData.agent} loading={loading} />
        <ResolutionTimeChart data={chartData.resolution} loading={loading} />
      </div>

      {/* Recent Tickets Table */}
      <TicketTable tickets={tickets} loading={loading} />
    </div>
  );
}
