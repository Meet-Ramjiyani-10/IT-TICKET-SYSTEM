import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Users } from "lucide-react";
import ChartCard from "./ChartCard";

const FALLBACK = [
  { agent: "Sarah M.", resolved: 142, avgTime: 2.1, csat: 4.8 },
  { agent: "David K.", resolved: 128, avgTime: 2.4, csat: 4.6 },
  { agent: "Priya S.", resolved: 118, avgTime: 1.9, csat: 4.9 },
  { agent: "James L.", resolved: 105, avgTime: 3.1, csat: 4.3 },
  { agent: "Maria G.", resolved: 98, avgTime: 2.7, csat: 4.5 },
  { agent: "Alex T.", resolved: 89, avgTime: 3.5, csat: 4.1 },
];

const getBarColor = (csat) => {
  if (csat >= 4.7) return "#10b981";
  if (csat >= 4.4) return "#3b82f6";
  if (csat >= 4.0) return "#f59e0b";
  return "#ef4444";
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2 text-white">{d.agent}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Resolved:</span>
          <span className="font-semibold">{d.resolved} tickets</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Avg Time:</span>
          <span className="font-semibold">{d.avgTime}h</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">CSAT:</span>
          <span className="font-semibold">⭐ {d.csat}</span>
        </div>
      </div>
    </div>
  );
};

export default function AgentPerformanceChart({ data: propData, loading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const data = propData ?? FALLBACK;

  return (
    <ChartCard
      title="Agent Performance"
      subtitle="Top agents by resolved tickets"
      icon={Users}
      accentColor="emerald"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          barCategoryGap="18%"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category" dataKey="agent" width={65}
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
          <Bar
            dataKey="resolved" radius={[0, 6, 6, 0]}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={getBarColor(entry.csat)}
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.35}
                className="transition-opacity duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
