import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
  LineChart, Line,
} from "recharts";
import { BarChart3, ShieldCheck, TrendingUp } from "lucide-react";

// Resolved comparison data
const resolvedData = [
  { name: "Sarah M.", resolved: 172, color: "#6366f1" },
  { name: "David K.", resolved: 140, color: "#6366f1" },
  { name: "Priya S.", resolved: 138, color: "#6366f1" },
  { name: "James L.", resolved: 110, color: "#6366f1" },
  { name: "Maria G.", resolved: 108, color: "#6366f1" },
  { name: "Alex T.", resolved: 84, color: "#6366f1" },
  { name: "Rachel C.", resolved: 102, color: "#6366f1" },
];

// SLA trend data
const slaTrend = [
  { month: "Sep", rate: 88.2 },
  { month: "Oct", rate: 90.1 },
  { month: "Nov", rate: 87.5 },
  { month: "Dec", rate: 91.8 },
  { month: "Jan", rate: 93.2 },
  { month: "Feb", rate: 92.5 },
];

// Workload distribution
const workloadData = [
  { name: "Sarah M.", workload: 62 },
  { name: "David K.", workload: 78 },
  { name: "Priya S.", workload: 45 },
  { name: "James L.", workload: 95 },
  { name: "Maria G.", workload: 58 },
  { name: "Alex T.", workload: 82 },
  { name: "Rachel C.", workload: 50 },
];

function getWorkloadBarColor(val) {
  if (val >= 85) return "#ef4444";
  if (val >= 65) return "#f59e0b";
  return "#10b981";
}

// Compact tooltip
function CompactTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs">
      <p className="font-semibold text-slate-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold">
          {p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

// Chart wrapper — smaller, analytical
function MiniChart({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
        <div className="p-1.5 rounded-md bg-indigo-50">
          <Icon className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {title}
        </h4>
      </div>
      <div className="px-3 pb-4 h-[200px]">{children}</div>
    </div>
  );
}

export default function AgentComparisonPanel() {
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <div>
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Performance Comparison
        </p>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1 — Tickets Resolved */}
        <MiniChart title="Tickets Resolved" icon={BarChart3}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={resolvedData}
              margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CompactTooltip />} />
              <Bar
                dataKey="resolved"
                radius={[3, 3, 0, 0]}
                onMouseEnter={(_, i) => setHoveredBar(i)}
                animationDuration={600}
              >
                {resolvedData.map((_, i) => (
                  <Cell
                    key={i}
                    fill="#6366f1"
                    opacity={hoveredBar === null || hoveredBar === i ? 1 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>

        {/* 2 — SLA Compliance Trend */}
        <MiniChart title="SLA Compliance Trend" icon={ShieldCheck}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slaTrend} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[82, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CompactTooltip suffix="%" />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </MiniChart>

        {/* 3 — Workload Distribution */}
        <MiniChart title="Workload Distribution" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={workloadData}
              margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CompactTooltip suffix="%" />} />
              <Bar dataKey="workload" radius={[0, 3, 3, 0]} animationDuration={600}>
                {workloadData.map((entry, i) => (
                  <Cell key={i} fill={getWorkloadBarColor(entry.workload)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      </div>
    </div>
  );
}
