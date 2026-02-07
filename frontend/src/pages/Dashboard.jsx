import { useState } from "react";
import StatCard from "../components/statCard";
import TicketVolumeChart from "../components/charts/TicketVolumeChart";
import CategoryDistributionChart from "../components/charts/CategoryDistributionChart";
import PriorityBarChart from "../components/charts/PriorityBarChart";
import SLATrendChart from "../components/charts/SLATrendChart";
import AgentPerformanceChart from "../components/charts/AgentPerformanceChart";
import ResolutionTimeChart from "../components/charts/ResolutionTimeChart";

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState(null);

  const kpiData = [
    {
      type: "totalTickets",
      value: "1,284",
      trend: "+12.5%",
      trendDirection: "up",
      subtitle: "vs last month",
    },
    {
      type: "highRisk",
      value: "47",
      trend: "+8.3%",
      trendDirection: "up",
      subtitle: "needs attention",
    },
    {
      type: "slaBreach",
      value: "4.2%",
      trend: "-2.1%",
      trendDirection: "down",
      subtitle: "improving",
    },
    {
      type: "avgCsat",
      value: "4.6",
      trend: "+0.3",
      trendDirection: "up",
      subtitle: "out of 5.0",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time IT service desk metrics
        </p>
      </div>

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
          <TicketVolumeChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryDistributionChart />
        </div>
      </div>

      {/* Charts Grid — Row 2: Priority + SLA Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <PriorityBarChart />
        <SLATrendChart />
      </div>

      {/* Charts Grid — Row 3: Agent Performance + Resolution Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AgentPerformanceChart />
        <ResolutionTimeChart />
      </div>
    </div>
  );
}
