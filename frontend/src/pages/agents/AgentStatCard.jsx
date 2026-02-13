import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useState } from "react";

/**
 * Gradient KPI card used on the Agents overview page.
 * Mirrors the look of the existing Dashboard StatCard but accepts
 * arbitrary icon / colors via a `config` prop so it's reusable.
 */
export default function AgentStatCard({
  icon: Icon,
  label,
  value,
  trend = "+0%",
  trendDirection = "up",
  subtitle = "",
  gradient = "from-blue-500 to-blue-700",
  glowColor = "shadow-blue-500/25",
  hoverGlow = "hover:shadow-blue-500/40",
  ringColor = "ring-blue-400",
  iconBg = "bg-blue-400/20",
  badgeBg = "bg-blue-400/15",
  badgeText = "text-blue-100",
  accentBar = "bg-blue-300",
}) {
  const [isPressed, setIsPressed] = useState(false);
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  return (
    <div
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        group relative w-full text-left overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradient}
        shadow-lg ${glowColor} ${hoverGlow}
        hover:shadow-2xl hover:-translate-y-1
        active:translate-y-0 active:shadow-lg
        transition-all duration-300 ease-out
        ring-1 ring-white/10 hover:ring-2 ${ringColor}/30
        select-none
        ${isPressed ? "scale-[0.97]" : "scale-100"}
      `}
    >
      {/* Background orbs */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5 group-hover:scale-150 group-hover:bg-white/10 transition-all duration-500 ease-out" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/5 group-hover:scale-125 transition-all duration-700 ease-out" />

      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentBar} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative z-10 p-5">
        {/* Header: icon + trend */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${iconBg} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeBg} ${badgeText} backdrop-blur-sm`}>
            <TrendIcon className="w-3 h-3" />
            {trend}
          </div>
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-extrabold text-white tracking-tight group-hover:tracking-wide transition-all duration-300">
            {value}
          </span>
        </div>

        {/* Label + subtitle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white/90">{label}</p>
            {subtitle && <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>}
          </div>
          <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300">
            <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white/40 group-hover:bg-white/60 transition-all duration-700 ease-out"
            style={{ width: isPressed ? "100%" : "65%", transition: "width 0.7s ease-out, background-color 0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}
