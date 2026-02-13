// ── Ticket helper utilities ─────────────────────────────────────

/**
 * Returns Tailwind classes for priority badge styling.
 */
export function getPriorityColor(priority) {
  const map = {
    Critical: {
      bg: "bg-red-50",
      text: "text-red-700",
      ring: "ring-red-200",
      dot: "bg-red-500",
      badge: "bg-red-100 text-red-700 border-red-200",
    },
    High: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      ring: "ring-orange-200",
      dot: "bg-orange-500",
      badge: "bg-orange-100 text-orange-700 border-orange-200",
    },
    Medium: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
      dot: "bg-amber-500",
      badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    Low: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-200",
      dot: "bg-blue-500",
      badge: "bg-blue-100 text-blue-700 border-blue-200",
    },
  };
  return map[priority] || map.Medium;
}

/**
 * Returns Tailwind classes for SLA risk percentage.
 */
export function getRiskColor(risk) {
  if (risk > 70) return { text: "text-red-600", bg: "bg-red-500", light: "bg-red-100", badge: "bg-red-50 text-red-700 border-red-200" };
  if (risk >= 40) return { text: "text-orange-500", bg: "bg-orange-400", light: "bg-orange-100", badge: "bg-orange-50 text-orange-700 border-orange-200" };
  return { text: "text-green-600", bg: "bg-green-500", light: "bg-green-100", badge: "bg-green-50 text-green-700 border-green-200" };
}

/**
 * Returns Tailwind classes for status badge styling.
 */
export function getStatusBadge(status) {
  const map = {
    Open: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
    "In Progress": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    Resolved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    Closed: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-300" },
    Escalated: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  };
  return map[status] || map.Open;
}

/**
 * Priority sort order (lower = more urgent).
 */
export const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

/**
 * Simple sort helper.
 */
export function sortTickets(tickets, key, direction = "asc") {
  return [...tickets].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    if (key === "priority") {
      aVal = PRIORITY_ORDER[aVal] ?? 99;
      bVal = PRIORITY_ORDER[bVal] ?? 99;
    } else if (key === "predicted_risk") {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
    } else if (key === "created_at" || key === "sla_deadline") {
      aVal = new Date(aVal).getTime() || 0;
      bVal = new Date(bVal).getTime() || 0;
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Format ISO date string to readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format ISO date string to readable date+time.
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Compute time remaining until SLA deadline.
 */
export function getSlaCountdown(deadline) {
  if (!deadline) return { label: "No deadline", urgent: false };
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target - now;

  if (diffMs <= 0) return { label: "BREACHED", urgent: true };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { label: `${days}d ${hours % 24}h remaining`, urgent: false };
  }
  if (hours >= 4) return { label: `${hours}h ${minutes}m remaining`, urgent: false };
  return { label: `${hours}h ${minutes}m remaining`, urgent: true };
}

/**
 * Get risk level label from numeric value.
 */
export function getRiskLevel(risk) {
  if (risk > 70) return "High";
  if (risk >= 40) return "Medium";
  return "Low";
}
