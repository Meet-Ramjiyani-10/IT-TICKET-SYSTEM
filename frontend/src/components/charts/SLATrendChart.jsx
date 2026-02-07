import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { ShieldAlert } from "lucide-react";
import ChartCard from "./ChartCard";

const FALLBACK = [
  { week: "W1", breachRate: 6.2, target: 5, resolved: 94 },
  { week: "W2", breachRate: 5.8, target: 5, resolved: 92 },
  { week: "W3", breachRate: 7.1, target: 5, resolved: 89 },
  { week: "W4", breachRate: 5.4, target: 5, resolved: 95 },
  { week: "W5", breachRate: 4.8, target: 5, resolved: 96 },
  { week: "W6", breachRate: 4.2, target: 5, resolved: 97 },
  { week: "W7", breachRate: 3.9, target: 5, resolved: 96 },
  { week: "W8", breachRate: 5.1, target: 5, resolved: 93 },
  { week: "W9", breachRate: 4.5, target: 5, resolved: 95 },
  { week: "W10", breachRate: 3.6, target: 5, resolved: 97 },
  { week: "W11", breachRate: 3.2, target: 5, resolved: 98 },
  { week: "W12", breachRate: 4.2, target: 5, resolved: 96 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const breach = payload.find((p) => p.dataKey === "breachRate");
  const met = payload.find((p) => p.dataKey === "resolved");
  const isAboveTarget = breach?.value > 5;

  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2 text-slate-300">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isAboveTarget ? "bg-red-400" : "bg-emerald-400"}`} />
          <span className="text-slate-400">Breach Rate:</span>
          <span className={`font-semibold ${isAboveTarget ? "text-red-300" : "text-emerald-300"}`}>
            {breach?.value}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-400">SLA Met:</span>
          <span className="font-semibold">{met?.value}%</span>
        </div>
      </div>
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const isBreach = payload.breachRate > 5;
  return (
    <circle
      cx={cx} cy={cy} r={4}
      fill={isBreach ? "#ef4444" : "#10b981"}
      stroke="#fff" strokeWidth={2}
      className="drop-shadow-sm"
    />
  );
};

export default function SLATrendChart({ data: propData, loading = false }) {
  const data = propData ?? FALLBACK;

  return (
    <ChartCard
      title="SLA Compliance Trend"
      subtitle="Weekly breach rate vs 5% target"
      icon={ShieldAlert}
      accentColor="rose"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false} tickLine={false}
            domain={[0, 10]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle" iconSize={8}
          />
          <ReferenceLine
            y={5} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1.5}
            label={{ value: "Target 5%", position: "right", fontSize: 10, fill: "#ef4444" }}
          />
          <Line
            type="monotone" dataKey="breachRate" name="Breach Rate"
            stroke="#f97316" strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#f97316" }}
            animationDuration={1200}
          />
          <Line
            type="monotone" dataKey="resolved" name="SLA Met %"
            stroke="#3b82f6" strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#3b82f6" }}
            yAxisId={0}
            hide
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
