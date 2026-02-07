import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import { Timer } from "lucide-react";
import ChartCard from "./ChartCard";

const data = [
  { range: "<1h", count: 185, cumulative: 14.4 },
  { range: "1-4h", count: 342, cumulative: 41.1 },
  { range: "4-8h", count: 278, cumulative: 62.8 },
  { range: "8-24h", count: 215, cumulative: 79.5 },
  { range: "1-2d", count: 148, cumulative: 91.0 },
  { range: "2-5d", count: 82, cumulative: 97.4 },
  { range: "5d+", count: 34, cumulative: 100 },
];

const barColors = ["#10b981", "#22d3ee", "#3b82f6", "#8b5cf6", "#f59e0b", "#f97316", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const countEntry = payload.find((p) => p.dataKey === "count");
  const cumEntry = payload.find((p) => p.dataKey === "cumulative");

  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2 text-slate-300">Resolution: {label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-400">Tickets:</span>
          <span className="font-semibold">{countEntry?.value}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Cumulative:</span>
          <span className="font-semibold">{cumEntry?.value}%</span>
        </div>
      </div>
    </div>
  );
};

export default function ResolutionTimeChart() {
  return (
    <ChartCard
      title="Resolution Time Distribution"
      subtitle="How fast tickets are being resolved"
      icon={Timer}
      accentColor="cyan"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="range" tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            yAxisId="right" orientation="right"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle" iconSize={8}
          />
          <Bar
            yAxisId="left" dataKey="count" name="Ticket Count"
            radius={[6, 6, 0, 0]} barSize={36}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={barColors[index]} opacity={0.85} />
            ))}
          </Bar>
          <Line
            yAxisId="right" type="monotone" dataKey="cumulative"
            name="Cumulative %" stroke="#10b981" strokeWidth={2.5}
            dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: "#10b981", fill: "#fff", strokeWidth: 2 }}
            animationDuration={1200}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
