import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import ChartCard from "./ChartCard";

const FALLBACK = [
  { month: "Jan", opened: 180, resolved: 165, pending: 15 },
  { month: "Feb", opened: 210, resolved: 195, pending: 30 },
  { month: "Mar", opened: 195, resolved: 188, pending: 37 },
  { month: "Apr", opened: 240, resolved: 220, pending: 57 },
  { month: "May", opened: 225, resolved: 230, pending: 52 },
  { month: "Jun", opened: 260, resolved: 248, pending: 64 },
  { month: "Jul", opened: 235, resolved: 242, pending: 57 },
  { month: "Aug", opened: 280, resolved: 265, pending: 72 },
  { month: "Sep", opened: 310, resolved: 295, pending: 87 },
  { month: "Oct", opened: 290, resolved: 285, pending: 92 },
  { month: "Nov", opened: 275, resolved: 278, pending: 89 },
  { month: "Dec", opened: 320, resolved: 305, pending: 104 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2 text-slate-300">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TicketVolumeChart({ data: propData, loading = false }) {
  const [activeArea, setActiveArea] = useState(null);
  const data = propData ?? FALLBACK;

  return (
    <ChartCard
      title="Ticket Volume Trends"
      subtitle="Monthly opened vs resolved tickets"
      icon={TrendingUp}
      accentColor="blue"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="gradOpened" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle" iconSize={8}
          />
          <Area
            type="monotone" dataKey="opened" name="Opened"
            stroke="#3b82f6" fill="url(#gradOpened)" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            onMouseEnter={() => setActiveArea("opened")}
            opacity={!activeArea || activeArea === "opened" ? 1 : 0.3}
          />
          <Area
            type="monotone" dataKey="resolved" name="Resolved"
            stroke="#10b981" fill="url(#gradResolved)" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            onMouseEnter={() => setActiveArea("resolved")}
            opacity={!activeArea || activeArea === "resolved" ? 1 : 0.3}
          />
          <Area
            type="monotone" dataKey="pending" name="Pending"
            stroke="#f59e0b" fill="url(#gradPending)" strokeWidth={2}
            dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            onMouseEnter={() => setActiveArea("pending")}
            opacity={!activeArea || activeArea === "pending" ? 1 : 0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
