import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Paperclip,
  Send,
  Brain,
  Shield,
  AlertTriangle,
  UserCog,
  ArrowUpCircle,
  Star,
  MessageSquare,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { mockTickets, AGENTS } from "../../data/ticketData";
import {
  getPriorityColor,
  getRiskColor,
  getStatusBadge,
  formatDateTime,
  getSlaCountdown,
  getRiskLevel,
} from "../../utils/ticketHelpers";

// Mock comments timeline
const mockComments = [
  {
    id: 1,
    author: "Sarah Mitchell",
    role: "Agent",
    text: "Investigating the issue. Initial diagnostics show the service is unreachable from all regions.",
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "System",
    role: "AI",
    text: "SLA risk prediction updated to 92%. Recommended escalation to Tier 2 support.",
    time: "1 hour ago",
  },
  {
    id: 3,
    author: "Alex Turner",
    role: "Agent",
    text: "Escalated to infrastructure team. Identified potential root cause: misconfigured load balancer after last night's deployment.",
    time: "45 min ago",
  },
];

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");

  // Find ticket by id
  const ticket = mockTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Ticket Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The ticket "{id}" doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/admin/tickets")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>
      </div>
    );
  }

  const priorityStyle = getPriorityColor(ticket.priority);
  const statusStyle = getStatusBadge(ticket.status);
  const riskColor = getRiskColor(ticket.predicted_risk);
  const sla = getSlaCountdown(ticket.sla_deadline);
  const isResolved = ticket.status === "Resolved" || ticket.status === "Closed";

  return (
    <div className="space-y-6">
      {/* Back button + Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/tickets")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-800">{ticket.id}</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.ring}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
              {ticket.priority}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {ticket.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{ticket.title}</p>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── LEFT SIDE (2/3) ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {ticket.description}
            </p>

            {/* Meta row */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User className="w-4 h-4 text-slate-400" />
                <span>Created by <strong className="text-slate-700">{ticket.created_by}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDateTime(ticket.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Tag className="w-4 h-4 text-slate-400" />
                <span>{ticket.category}</span>
              </div>
            </div>
          </div>

          {/* Attachments placeholder */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-slate-400" />
              Attachments
            </h3>
            <div className="flex items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-sm text-slate-400">
                No attachments yet. Drag & drop files here.
              </p>
            </div>
          </div>

          {/* Comments Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Activity Timeline
            </h3>

            <div className="space-y-0">
              {mockComments.map((c, idx) => (
                <div key={c.id} className="flex gap-3">
                  {/* Vertical line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        c.role === "AI"
                          ? "bg-violet-100 text-violet-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {c.role === "AI" ? (
                        <Brain className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    {idx < mockComments.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-700">
                        {c.author}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          c.role === "AI"
                            ? "bg-violet-50 text-violet-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {c.role}
                      </span>
                      <span className="text-xs text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="mt-2 pt-4 border-t border-slate-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg
                      text-slate-700 placeholder:text-slate-400
                      focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                      transition-colors"
                  />
                  <button className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE (1/3) ─── */}
        <div className="space-y-5">
          {/* AI Prediction Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-violet-700 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Predictions
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {/* Predicted Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Predicted Category</span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {ticket.predicted_category}
                </span>
              </div>
              {/* Predicted Priority */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Predicted Priority</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    getPriorityColor(ticket.predicted_priority).badge
                  }`}
                >
                  {ticket.predicted_priority}
                </span>
              </div>
              {/* Predicted Risk */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">SLA Risk Score</span>
                  <span className={`text-sm font-bold ${riskColor.text}`}>
                    {ticket.predicted_risk}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${riskColor.bg} transition-all duration-700`}
                    style={{ width: `${ticket.predicted_risk}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Risk Level: {getRiskLevel(ticket.predicted_risk)}
                </p>
              </div>
              {/* Suggested Agent */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Suggested Agent</span>
                <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
                  {ticket.assigned_agent}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <UserCog className="w-4 h-4 text-slate-400" />
                Assignment
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">
                  Current Agent
                </label>
                <p className="text-sm font-medium text-slate-700">
                  {ticket.assigned_agent}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">
                  Reassign To
                </label>
                <select
                  value={assignedAgent}
                  onChange={(e) => setAssignedAgent(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg
                    px-3 py-2.5 text-slate-700
                    focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                    transition-colors"
                >
                  <option value="">Select agent...</option>
                  {AGENTS.filter((a) => a !== ticket.assigned_agent).map(
                    (agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <UserCog className="w-4 h-4" />
                  Reassign
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
                  <ArrowUpCircle className="w-4 h-4" />
                  Escalate
                </button>
              </div>
            </div>
          </div>

          {/* SLA Countdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                SLA Status
              </h3>
            </div>
            <div className="p-5">
              <div
                className={`text-center py-6 rounded-xl ${
                  sla.urgent
                    ? "bg-red-50 border border-red-200"
                    : "bg-emerald-50 border border-emerald-200"
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    sla.urgent ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {sla.label}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Deadline: {formatDateTime(ticket.sla_deadline)}
                </p>
              </div>
            </div>
          </div>

          {/* CSAT Score (if resolved) */}
          {isResolved && ticket.csat_score && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Star className="w-4 h-4 text-slate-400" />
                  Customer Satisfaction
                </h3>
              </div>
              <div className="p-5">
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(ticket.csat_score)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-slate-700">
                    {ticket.csat_score}
                    <span className="text-sm font-normal text-slate-400">
                      /5.0
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Resolved on {formatDateTime(ticket.resolved_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Ticket ID</span>
                <span className="font-semibold text-blue-600">{ticket.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-700">{ticket.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Created</span>
                <span className="font-medium text-slate-700">
                  {formatDateTime(ticket.created_at)}
                </span>
              </div>
              {ticket.resolved_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Resolved</span>
                  <span className="font-medium text-emerald-600">
                    {formatDateTime(ticket.resolved_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
