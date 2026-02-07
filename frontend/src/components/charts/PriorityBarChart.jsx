import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import ChartCard from "./ChartCard";

const PRIORITY_COLORS = {
  Critical: { color: "#ef4444", bg: "#fef2f2" },
  High: { color: "#f97316", bg: "#fff7ed" },
  Medium: { color: "#eab308", bg: "#fefce8" },
  Low: { color: "#22c55e", bg: "#f0fdf4" },
  Info: { color: "#3b82f6", bg: "#eff6ff" },
};

const FALLBACK = [
  { priority: "Critical", count: 47, color: "#ef4444", bg: "#fef2f2" },
  { priority: "High", count: 156, color: "#f97316", bg: "#fff7ed" },
  { priority: "Medium", count: 428, color: "#eab308", bg: "#fefce8" },
  { priority: "Low", count: 389, color: "#22c55e", bg: "#f0fdf4" },
  { priority: "Info", count: 264, color: "#3b82f6", bg: "#eff6ff" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = payload[0]?.payload?._totalCount || 1;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
        <span className="font-bold">{d.priority}</span>
      </div>
      <p className="text-slate-300">{d.count} tickets</p>
      <p className="text-slate-400">{((d.count / total) * 100).toFixed(1)}% of total</p>
    </div>
  );
};

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <g>
      <defs>
        <linearGradient id={`barGrad-${fill}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <rect
        x={x} y={y} width={width} height={height}
        rx={6} ry={6}
        fill={`url(#barGrad-${fill})`}
      />
    </g>
  );
};

export default function PriorityBarChart({ data: propData, loading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const data = (propData ?? FALLBACK).map((d) => ({
    ...d,
    color: d.color || PRIORITY_COLORS[d.priority]?.color || "#94a3b8",
    bg: d.bg || PRIORITY_COLORS[d.priority]?.bg || "#f8fafc",
  }));
  const totalCount = data.reduce((s, d) => s + d.count, 0);
  // Attach totalCount to each item so the tooltip (defined outside) can access it
  const chartData = data.map((d) => ({ ...d, _totalCount: totalCount }));

  return (
    <ChartCard
      title="Priority Distribution"
      subtitle="Tickets grouped by priority level"
      icon={BarChart3}
      accentColor="amber"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
          barCategoryGap="20%"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
          <Bar
            dataKey="count" shape={<CustomBar />}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                className="transition-opacity duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
