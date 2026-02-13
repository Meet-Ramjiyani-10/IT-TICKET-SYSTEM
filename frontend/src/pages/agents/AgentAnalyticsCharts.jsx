import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";
import ChartCard from "../../components/charts/ChartCard";

// ── Resolved-tickets trend data (last 7 weeks) ──────────────────
const resolvedTrend = [
  { week: "W1", Sarah: 28, David: 22, Priya: 25, James: 18, Maria: 20, Alex: 14, Rachel: 19 },
  { week: "W2", Sarah: 32, David: 25, Priya: 27, James: 20, Maria: 18, Alex: 16, Rachel: 21 },
  { week: "W3", Sarah: 26, David: 28, Priya: 30, James: 16, Maria: 22, Alex: 12, Rachel: 24 },
  { week: "W4", Sarah: 34, David: 24, Priya: 28, James: 22, Maria: 19, Alex: 18, Rachel: 20 },
  { week: "W5", Sarah: 30, David: 26, Priya: 32, James: 19, Maria: 24, Alex: 15, Rachel: 22 },
  { week: "W6", Sarah: 36, David: 30, Priya: 29, James: 21, Maria: 21, Alex: 17, Rachel: 26 },
  { week: "W7", Sarah: 38, David: 27, Priya: 35, James: 24, Maria: 23, Alex: 20, Rachel: 28 },
];

const agentColors = {
  Sarah: "#3b82f6",
  David: "#10b981",
  Priya: "#f59e0b",
  James: "#ef4444",
  Maria: "#8b5cf6",
  Alex: "#06b6d4",
  Rachel: "#ec4899",
};

// ── SLA compliance trend data ────────────────────────────────────
const slaTrend = [
  { month: "Sep", rate: 88.2 },
  { month: "Oct", rate: 90.1 },
  { month: "Nov", rate: 87.5 },
  { month: "Dec", rate: 91.8 },
  { month: "Jan", rate: 93.2 },
  { month: "Feb", rate: 92.5 },
];

// ── Workload distribution (bar chart) ────────────────────────────
const workloadData = [
  { name: "Sarah M.", open: 14, resolved: 172 },
  { name: "David K.", open: 18, resolved: 140 },
  { name: "Priya S.", open: 7, resolved: 138 },
  { name: "James L.", open: 22, resolved: 110 },
  { name: "Maria G.", open: 12, resolved: 108 },
  { name: "Alex T.", open: 14, resolved: 84 },
  { name: "Rachel C.", open: 8, resolved: 102 },
];

// ── Tooltips ─────────────────────────────────────────────────────
function ResolvedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex justify-between gap-6">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.dataKey}
            </span>
            <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-1">{label}</p>
      <p className="text-emerald-300 font-semibold">{payload[0].value}% compliance</p>
    </div>
  );
}

function WorkloadTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2">{d.name}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Open:</span>
          <span className="font-semibold text-amber-300">{d.open}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Resolved:</span>
          <span className="font-semibold text-emerald-300">{d.resolved}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function AgentAnalyticsCharts() {
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-transparent" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Agent Analytics
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-slate-200 via-slate-300 to-transparent" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1 — Tickets Resolved Trend */}
        <ChartCard
          title="Tickets Resolved Trend"
          subtitle="Weekly resolution by agent"
          icon={TrendingUp}
          accentColor="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={resolvedTrend} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ResolvedTooltip />} />
              {Object.keys(agentColors).map((name) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={agentColors[name]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2 — SLA Compliance Trend */}
        <ChartCard
          title="SLA Compliance Trend"
          subtitle="Monthly team SLA rate"
          icon={ShieldCheck}
          accentColor="emerald"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slaTrend} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<SlaTooltip />} />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 3 — Workload Distribution (full width) */}
      <div className="grid grid-cols-1 gap-5">
        <ChartCard
          title="Workload Distribution"
          subtitle="Open vs resolved tickets per agent"
          icon={BarChart3}
          accentColor="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} barCategoryGap="20%" onMouseLeave={() => setHoveredBar(null)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<WorkloadTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
              <Bar dataKey="resolved" radius={[4, 4, 0, 0]} onMouseEnter={(_, i) => setHoveredBar(i)} animationDuration={800}>
                {workloadData.map((_, i) => (
                  <Cell key={i} fill="#3b82f6" opacity={hoveredBar === null || hoveredBar === i ? 1 : 0.35} />
                ))}
              </Bar>
              <Bar dataKey="open" radius={[4, 4, 0, 0]} animationDuration={800}>
                {workloadData.map((_, i) => (
                  <Cell key={i} fill="#f59e0b" opacity={hoveredBar === null || hoveredBar === i ? 1 : 0.35} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}
