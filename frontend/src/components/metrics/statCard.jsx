import { useState } from "react";
import {
  Ticket,
  AlertTriangle,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

const cardConfigs = {
  totalTickets: {
    label: "Total Tickets",
    icon: Ticket,
    gradient: "from-blue-500 to-blue-700",
    glowColor: "shadow-blue-500/25",
    hoverGlow: "hover:shadow-blue-500/40",
    ringColor: "ring-blue-400",
    iconBg: "bg-blue-400/20",
    trendColor: "text-emerald-300",
    badgeBg: "bg-blue-400/15",
    badgeText: "text-blue-100",
    accentBar: "bg-blue-300",
  },
  highRisk: {
    label: "High Risk",
    icon: AlertTriangle,
    gradient: "from-rose-500 to-red-700",
    glowColor: "shadow-rose-500/25",
    hoverGlow: "hover:shadow-rose-500/40",
    ringColor: "ring-rose-400",
    iconBg: "bg-rose-400/20",
    trendColor: "text-rose-200",
    badgeBg: "bg-rose-400/15",
    badgeText: "text-rose-100",
    accentBar: "bg-rose-300",
  },
  slaBreach: {
    label: "SLA Breach %",
    icon: Clock,
    gradient: "from-amber-500 to-orange-700",
    glowColor: "shadow-amber-500/25",
    hoverGlow: "hover:shadow-amber-500/40",
    ringColor: "ring-amber-400",
    iconBg: "bg-amber-400/20",
    trendColor: "text-amber-200",
    badgeBg: "bg-amber-400/15",
    badgeText: "text-amber-100",
    accentBar: "bg-amber-300",
  },
  avgCsat: {
    label: "AVG CSAT",
    icon: Star,
    gradient: "from-emerald-500 to-teal-700",
    glowColor: "shadow-emerald-500/25",
    hoverGlow: "hover:shadow-emerald-500/40",
    ringColor: "ring-emerald-400",
    iconBg: "bg-emerald-400/20",
    trendColor: "text-emerald-200",
    badgeBg: "bg-emerald-400/15",
    badgeText: "text-emerald-100",
    accentBar: "bg-emerald-300",
  },
};

export default function StatCard({
  type = "totalTickets",
  value = "0",
  trend = "+0%",
  trendDirection = "up",
  subtitle = "",
  onClick,
}) {
  const [isPressed, setIsPressed] = useState(false);
  const config = cardConfigs[type];
  const Icon = config.icon;
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        group relative w-full text-left overflow-hidden rounded-2xl
        bg-gradient-to-br ${config.gradient}
        shadow-lg ${config.glowColor} ${config.hoverGlow}
        hover:shadow-2xl hover:-translate-y-1
        active:translate-y-0 active:shadow-lg
        transition-all duration-300 ease-out
        ring-1 ring-white/10 hover:ring-2 ${config.ringColor}/30
        cursor-pointer select-none
        focus:outline-none focus:ring-2 ${config.ringColor}
        ${isPressed ? "scale-[0.97]" : "scale-100"}
      `}
    >
      {/* Animated background orb */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5 
        group-hover:scale-150 group-hover:bg-white/10 transition-all duration-500 ease-out" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/5 
        group-hover:scale-125 transition-all duration-700 ease-out" />

      {/* Accent bar at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentBar} opacity-60 
        group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10 p-5">
        {/* Header row: icon + trend badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${config.iconBg} backdrop-blur-sm
            group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={2} />
          </div>

          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            ${config.badgeBg} ${config.badgeText} backdrop-blur-sm`}>
            <TrendIcon className="w-3 h-3" />
            {trend}
          </div>
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-extrabold text-white tracking-tight 
            group-hover:tracking-wide transition-all duration-300">
            {value}
          </span>
        </div>

        {/* Label + subtitle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white/90">{config.label}</p>
            {subtitle && (
              <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="p-1.5 rounded-full bg-white/10 
            group-hover:bg-white/20 group-hover:translate-x-1 
            transition-all duration-300">
            <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
          </div>
        </div>

        {/* Bottom progress bar with animation */}
        <div className="mt-4 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full bg-white/40 
              group-hover:bg-white/60 transition-all duration-700 ease-out`}
            style={{
              width: isPressed ? "100%" : "65%",
              transition: "width 0.7s ease-out, background-color 0.3s",
            }}
          />
        </div>
      </div>
    </button>
  );
}
