// ── Mock Agent Data ──────────────────────────────────────────────
// Centralized data used by Agents page & AgentProfile page.

export const agents = [
  {
    id: "AGT-001",
    name: "Sarah Mitchell",
    department: "Infrastructure",
    specialization: "Server & Network",
    experience: "6 years",
    total_assigned: 186,
    total_resolved: 172,
    open_tickets: 14,
    avg_resolution_time: "2.1h",
    sla_success_rate: 96.2,
    csat_avg: 4.8,
    escalation_rate: 3.1,
    availability_status: "Available",
  },
  {
    id: "AGT-002",
    name: "David Kim",
    department: "Networking",
    specialization: "VPN & Firewall",
    experience: "4 years",
    total_assigned: 158,
    total_resolved: 140,
    open_tickets: 18,
    avg_resolution_time: "2.4h",
    sla_success_rate: 91.5,
    csat_avg: 4.6,
    escalation_rate: 5.2,
    availability_status: "Busy",
  },
  {
    id: "AGT-003",
    name: "Priya Sharma",
    department: "Software",
    specialization: "Application Support",
    experience: "5 years",
    total_assigned: 145,
    total_resolved: 138,
    open_tickets: 7,
    avg_resolution_time: "1.9h",
    sla_success_rate: 98.1,
    csat_avg: 4.9,
    escalation_rate: 1.8,
    availability_status: "Available",
  },
  {
    id: "AGT-004",
    name: "James Lee",
    department: "Security",
    specialization: "Access & Auth",
    experience: "7 years",
    total_assigned: 132,
    total_resolved: 110,
    open_tickets: 22,
    avg_resolution_time: "3.1h",
    sla_success_rate: 78.4,
    csat_avg: 4.3,
    escalation_rate: 8.7,
    availability_status: "Overloaded",
  },
  {
    id: "AGT-005",
    name: "Maria Garcia",
    department: "Hardware",
    specialization: "Endpoint & Peripherals",
    experience: "3 years",
    total_assigned: 120,
    total_resolved: 108,
    open_tickets: 12,
    avg_resolution_time: "2.7h",
    sla_success_rate: 88.3,
    csat_avg: 4.5,
    escalation_rate: 4.6,
    availability_status: "Available",
  },
  {
    id: "AGT-006",
    name: "Alex Turner",
    department: "Database",
    specialization: "SQL & Backup",
    experience: "8 years",
    total_assigned: 98,
    total_resolved: 84,
    open_tickets: 14,
    avg_resolution_time: "3.5h",
    sla_success_rate: 82.1,
    csat_avg: 4.1,
    escalation_rate: 6.9,
    availability_status: "Busy",
  },
  {
    id: "AGT-007",
    name: "Rachel Chen",
    department: "Software",
    specialization: "Cloud & DevOps",
    experience: "5 years",
    total_assigned: 110,
    total_resolved: 102,
    open_tickets: 8,
    avg_resolution_time: "2.0h",
    sla_success_rate: 94.7,
    csat_avg: 4.7,
    escalation_rate: 2.5,
    availability_status: "Available",
  },
];

// ── Per-Agent Active Tickets (keyed by agent id) ─────────────────
export const agentTickets = {
  "AGT-001": [
    { id: "#1023", title: "Server not responding in production", priority: "Critical", sla_risk: 92, time_remaining: "1h 15m", status: "Open" },
    { id: "#1041", title: "Load balancer health check failing", priority: "High", sla_risk: 65, time_remaining: "3h 20m", status: "In Progress" },
    { id: "#1055", title: "Disk I/O latency on DB server", priority: "Medium", sla_risk: 40, time_remaining: "5h 45m", status: "Open" },
  ],
  "AGT-002": [
    { id: "#1024", title: "VPN connectivity drops intermittently", priority: "High", sla_risk: 68, time_remaining: "2h 30m", status: "In Progress" },
    { id: "#1030", title: "Slow internet in Building B", priority: "High", sla_risk: 55, time_remaining: "4h 10m", status: "In Progress" },
    { id: "#1034", title: "Firewall rule blocking SaaS app", priority: "High", sla_risk: 72, time_remaining: "2h 00m", status: "Open" },
    { id: "#1048", title: "DNS resolution intermittent failure", priority: "Medium", sla_risk: 38, time_remaining: "6h 15m", status: "Open" },
  ],
  "AGT-003": [
    { id: "#1037", title: "CI/CD pipeline timeout on deploy", priority: "High", sla_risk: 65, time_remaining: "3h 45m", status: "Open" },
    { id: "#1031", title: "Windows update causing BSOD", priority: "Critical", sla_risk: 95, time_remaining: "0h 45m", status: "In Progress" },
  ],
  "AGT-004": [
    { id: "#1026", title: "SSO login failure for new employees", priority: "High", sla_risk: 78, time_remaining: "1h 50m", status: "Escalated" },
    { id: "#1035", title: "Shared drive permissions error", priority: "Medium", sla_risk: 38, time_remaining: "5h 30m", status: "In Progress" },
    { id: "#1042", title: "MFA enrollment failures", priority: "Critical", sla_risk: 88, time_remaining: "1h 00m", status: "Open" },
    { id: "#1049", title: "LDAP sync delay impacting logins", priority: "High", sla_risk: 72, time_remaining: "2h 20m", status: "Open" },
    { id: "#1053", title: "Service account password expiry", priority: "Medium", sla_risk: 45, time_remaining: "4h 40m", status: "Open" },
  ],
  "AGT-005": [
    { id: "#1027", title: "Printer queue stuck on 3rd floor", priority: "Low", sla_risk: 12, time_remaining: "8h 00m", status: "Open" },
    { id: "#1039", title: "Badge reader not working - Main lobby", priority: "High", sla_risk: 60, time_remaining: "3h 10m", status: "Open" },
  ],
  "AGT-006": [
    { id: "#1028", title: "Database backup job failed overnight", priority: "Critical", sla_risk: 88, time_remaining: "1h 30m", status: "In Progress" },
    { id: "#1038", title: "SQL query performance degradation", priority: "Medium", sla_risk: 50, time_remaining: "4h 15m", status: "In Progress" },
    { id: "#1050", title: "Replication lag on read replica", priority: "High", sla_risk: 70, time_remaining: "2h 45m", status: "Open" },
  ],
  "AGT-007": [
    { id: "#1044", title: "Kubernetes pod CrashLoopBackOff", priority: "Critical", sla_risk: 90, time_remaining: "0h 55m", status: "In Progress" },
    { id: "#1051", title: "Terraform state lock conflict", priority: "Medium", sla_risk: 35, time_remaining: "6h 00m", status: "Open" },
  ],
};

// ── Helper utils ─────────────────────────────────────────────────

/** SLA color: green >90, orange 70-90, red <70 */
export function getSlaColor(rate) {
  if (rate >= 90) return { text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" };
  if (rate >= 70) return { text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200" };
  return { text: "text-red-600", bg: "bg-red-50", ring: "ring-red-200" };
}

/** CSAT color */
export function getCsatColor(score) {
  if (score >= 4.7) return "text-emerald-600";
  if (score >= 4.3) return "text-blue-600";
  if (score >= 3.8) return "text-amber-600";
  return "text-red-600";
}

/** Status badge config */
export function getStatusConfig(status) {
  switch (status) {
    case "Available":
      return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    case "Busy":
      return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    case "Overloaded":
      return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  }
}

/** Workload % — open / assigned */
export function getWorkloadPercent(agent) {
  if (!agent.total_assigned) return 0;
  return Math.round((agent.open_tickets / agent.total_assigned) * 100);
}

/** Workload bar color */
export function getWorkloadColor(pct) {
  if (pct >= 20) return "bg-red-500";
  if (pct >= 12) return "bg-amber-500";
  return "bg-emerald-500";
}

/** SLA risk color for ticket tables */
export function getSlaRiskColor(risk) {
  if (risk >= 75) return "text-red-600";
  if (risk >= 50) return "text-amber-600";
  return "text-emerald-600";
}

export function getSlaRiskBg(risk) {
  if (risk >= 75) return "bg-red-500";
  if (risk >= 50) return "bg-amber-400";
  return "bg-emerald-500";
}
