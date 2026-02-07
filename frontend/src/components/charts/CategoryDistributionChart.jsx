import { useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Sector, Legend, Tooltip,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import ChartCard from "./ChartCard";

const data = [
  { name: "Hardware", value: 285, color: "#3b82f6" },
  { name: "Software", value: 340, color: "#8b5cf6" },
  { name: "Network", value: 195, color: "#06b6d4" },
  { name: "Access/Auth", value: 158, color: "#f59e0b" },
  { name: "Email", value: 120, color: "#10b981" },
  { name: "Database", value: 96, color: "#ef4444" },
  { name: "Other", value: 90, color: "#64748b" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#1e293b" className="text-lg font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" className="text-sm">
        {payload.value} tickets ({(percent * 100).toFixed(1)}%)
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
    </g>
  );
};

const CustomLegend = ({ payload, activeIndex, onLegendEnter, onLegendLeave }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
    {payload?.map((entry, index) => (
      <button
        key={index}
        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all duration-200
          ${activeIndex === index ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"}`}
        onMouseEnter={() => onLegendEnter(index)}
        onMouseLeave={onLegendLeave}
      >
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-slate-600">{entry.value}</span>
      </button>
    ))}
  </div>
);

export default function CategoryDistributionChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback((_, index) => setActiveIndex(index), []);

  return (
    <ChartCard
      title="Category Distribution"
      subtitle={`${total.toLocaleString()} total tickets by category`}
      icon={PieIcon}
      accentColor="violet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="45%"
            innerRadius="55%"
            outerRadius="75%"
            dataKey="value"
            onMouseEnter={onPieEnter}
            strokeWidth={2}
            stroke="#fff"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                opacity={activeIndex === index ? 1 : 0.7}
                className="transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Legend
            content={
              <CustomLegend
                activeIndex={activeIndex}
                onLegendEnter={(i) => setActiveIndex(i)}
                onLegendLeave={() => {}}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
