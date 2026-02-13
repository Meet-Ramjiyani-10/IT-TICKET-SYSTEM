import { useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
  BarChart, Bar, Cell,
  PieChart as RechartsPie, Pie, Sector,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import ChartCard from "../../components/charts/ChartCard";

// ── Data ────────────────────────────────────────────────────────
const volumeData = [
  { day: "Mon", opened: 24, resolved: 20, pending: 4 },
  { day: "Tue", opened: 18, resolved: 22, pending: 0 },
  { day: "Wed", opened: 32, resolved: 25, pending: 7 },
  { day: "Thu", opened: 27, resolved: 28, pending: 6 },
  { day: "Fri", opened: 35, resolved: 30, pending: 11 },
  { day: "Sat", opened: 12, resolved: 14, pending: 9 },
  { day: "Sun", opened: 8, resolved: 10, pending: 7 },
];

const priorityData = [
  { priority: "Critical", count: 4, color: "#ef4444" },
  { priority: "High", count: 6, color: "#f97316" },
  { priority: "Medium", count: 5, color: "#eab308" },
  { priority: "Low", count: 3, color: "#3b82f6" },
];

const CATEGORY_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#fb7185", "#06b6d4"];
const categoryData = [
  { name: "Hardware", value: 28, color: "#3b82f6" },
  { name: "Network", value: 22, color: "#10b981" },
  { name: "Software", value: 20, color: "#8b5cf6" },
  { name: "Access/Auth", value: 16, color: "#f59e0b" },
  { name: "Email", value: 8, color: "#fb7185" },
  { name: "Database", value: 6, color: "#06b6d4" },
];

const slaData = [
  { week: "W1", breachRate: 12, target: 8, met: 88 },
  { week: "W2", breachRate: 8, target: 8, met: 92 },
  { week: "W3", breachRate: 15, target: 8, met: 85 },
  { week: "W4", breachRate: 6, target: 8, met: 94 },
  { week: "W5", breachRate: 10, target: 8, met: 90 },
  { week: "W6", breachRate: 5, target: 8, met: 95 },
  { week: "W7", breachRate: 7, target: 8, met: 93 },
  { week: "W8", breachRate: 4, target: 8, met: 96 },
];

// ── Shared custom tooltip ───────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
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
}

// ── 1. Volume Trend (Area Chart) ────────────────────────────────
function VolumeChart() {
  const [activeArea, setActiveArea] = useState(null);

  return (
    <ChartCard
      title="Ticket Volume Trend"
      subtitle="Daily opened vs resolved tickets"
      icon={TrendingUp}
      accentColor="blue"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={volumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          onMouseLeave={() => setActiveArea(null)}
        >
          <defs>
            <linearGradient id="ta-gradOpened" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="ta-gradResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="ta-gradPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<DarkTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
          <Area
            type="monotone" dataKey="opened" name="Opened"
            stroke="#3b82f6" fill="url(#ta-gradOpened)" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            onMouseEnter={() => setActiveArea("opened")}
            opacity={!activeArea || activeArea === "opened" ? 1 : 0.25}
            animationDuration={800} animationEasing="ease-out"
          />
          <Area
            type="monotone" dataKey="resolved" name="Resolved"
            stroke="#10b981" fill="url(#ta-gradResolved)" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            onMouseEnter={() => setActiveArea("resolved")}
            opacity={!activeArea || activeArea === "resolved" ? 1 : 0.25}
            animationDuration={800} animationEasing="ease-out"
          />
          <Area
            type="monotone" dataKey="pending" name="Pending"
            stroke="#f59e0b" fill="url(#ta-gradPending)" strokeWidth={2}
            dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            onMouseEnter={() => setActiveArea("pending")}
            opacity={!activeArea || activeArea === "pending" ? 1 : 0.25}
            animationDuration={800} animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ── 2. Priority Distribution (Bar Chart) ────────────────────────
const PriorityTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = priorityData.reduce((s, p) => s + p.count, 0);
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

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <g>
      <defs>
        <linearGradient id={`ta-barGrad-${fill}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.65} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={`url(#ta-barGrad-${fill})`} />
    </g>
  );
};

function PriorityChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <ChartCard
      title="Priority Distribution"
      subtitle="Tickets grouped by priority level"
      icon={BarChart3}
      accentColor="amber"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={priorityData}
          margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
          barCategoryGap="20%"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="priority" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<PriorityTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
          <Bar
            dataKey="count" shape={<CustomBarShape />}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            animationDuration={800} animationEasing="ease-out"
          >
            {priorityData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
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

// ── 3. Category Distribution (Donut / Pie Chart) ────────────────
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#1e293b" className="text-sm font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" className="text-xs">
        {payload.value} tickets ({(percent * 100).toFixed(1)}%)
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill} opacity={0.9}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 15}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill} opacity={0.4}
      />
    </g>
  );
};

function CategoryChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback((_, index) => setActiveIndex(index), []);
  const total = categoryData.reduce((s, d) => s + d.value, 0);

  return (
    <ChartCard
      title="Category Distribution"
      subtitle={`${total} total tickets by category`}
      icon={PieChart}
      accentColor="violet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={categoryData}
            cx="50%" cy="45%"
            innerRadius="55%" outerRadius="75%"
            dataKey="value"
            onMouseEnter={onPieEnter}
            strokeWidth={2} stroke="#fff"
            animationDuration={800} animationEasing="ease-out"
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                opacity={activeIndex === index ? 1 : 0.7}
                className="transition-opacity duration-200 cursor-pointer"
              />
            ))}
          </Pie>
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
            content={({ payload }) => (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
                {payload?.map((entry, index) => (
                  <button
                    key={index}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all duration-200
                      ${activeIndex === index ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"}`}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-600">{entry.value}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ── 4. SLA Breach Trend (Line Chart) ────────────────────────────
const SlaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const breach = payload.find((p) => p.dataKey === "breachRate");
  const met = payload.find((p) => p.dataKey === "met");
  const isAboveTarget = breach?.value > 8;
  return (
    <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
      <p className="font-bold mb-2 text-slate-300">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isAboveTarget ? "bg-red-400" : "bg-emerald-400"}`} />
          <span className="text-slate-400">Breach Rate:</span>
          <span className={`font-semibold ${isAboveTarget ? "text-red-300" : "text-emerald-300"}`}>{breach?.value}%</span>
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

const SlaDot = (props) => {
  const { cx, cy, payload } = props;
  const isBreach = payload.breachRate > 8;
  return (
    <circle
      cx={cx} cy={cy} r={4}
      fill={isBreach ? "#ef4444" : "#10b981"}
      stroke="#fff" strokeWidth={2}
      className="drop-shadow-sm"
    />
  );
};

function SlaChart() {
  return (
    <ChartCard
      title="SLA Breach Trend"
      subtitle="Weekly breach rate vs 8% target"
      icon={Activity}
      accentColor="rose"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={slaData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<SlaTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
          <ReferenceLine
            y={8} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1.5}
            label={{ value: "Target 8%", position: "right", fill: "#ef4444", fontSize: 10 }}
          />
          <Line
            type="monotone" dataKey="breachRate" name="Breach Rate"
            stroke="#ef4444" strokeWidth={2.5}
            dot={<SlaDot />}
            activeDot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#ef4444" }}
            animationDuration={800} animationEasing="ease-out"
          />
          <Line
            type="monotone" dataKey="met" name="SLA Met %"
            stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#3b82f6" }}
            animationDuration={800} animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ── Main Export ──────────────────────────────────────────────────
export default function TicketAnalytics() {
  return (
    <div>
      {/* Section divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-transparent" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Ticket Analytics
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-slate-200 via-slate-300 to-transparent" />
      </div>

      {/* Row 1: Volume (wide) + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-3">
          <VolumeChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryChart />
        </div>
      </div>

      {/* Row 2: Priority Bar + SLA Breach Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PriorityChart />
        <SlaChart />
      </div>
    </div>
  );
}
