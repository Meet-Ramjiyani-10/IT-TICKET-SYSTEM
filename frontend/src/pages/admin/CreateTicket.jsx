import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsAPI, slaAPI } from "../../services/api";
import {
  Send, AlertCircle, CheckCircle2, Loader2, ShieldAlert,
  ChevronDown, X,
} from "lucide-react";

const CATEGORIES = ["Hardware", "Software", "Network", "Access/Auth", "Email", "Database", "Other"];
const PRIORITIES = ["Critical", "High", "Medium", "Low", "Info"];
const IMPACTS = ["1 - Extensive", "2 - Significant", "3 - Moderate", "4 - Minor"];
const URGENCIES = ["1 - Critical", "2 - High", "3 - Medium", "4 - Low"];

const initialForm = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  priority: "Medium",
  impact: "3 - Moderate",
  urgency: "3 - Medium",
  assignee: "",
};

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [slaPrediction, setSlaPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Auto-predict SLA when key fields change
    if (["category", "priority", "impact", "urgency"].includes(name)) {
      predictSLA({ ...form, [name]: value });
    }
  };

  const predictSLA = async (data) => {
    if (!data.category || !data.priority) return;
    setPredicting(true);
    try {
      const res = await slaAPI.predict({
        priority: PRIORITIES.indexOf(data.priority) + 1 + "",
        impact: data.impact.charAt(0),
        urgency: data.urgency.charAt(0),
        category: data.category,
        subcategory: data.subcategory || data.category,
        opened_at: new Date().toISOString(),
      });
      setSlaPrediction(res.data);
    } catch {
      setSlaPrediction(null);
    } finally {
      setPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.category) {
      setError("Please fill in all required fields (Title, Category).");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await ticketsAPI.create({
        ...form,
        opened_at: new Date().toISOString(),
        slaPrediction,
      });
      setSuccess("Ticket created successfully!");
      setForm(initialForm);
      setSlaPrediction(null);
      setTimeout(() => navigate("/tickets"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit a new IT support request — SLA risk is predicted automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                  transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Provide detailed information about the issue..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg resize-none
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                  transition-colors"
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                options={CATEGORIES}
                required
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  placeholder="e.g., Email, VPN, Printer"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                    transition-colors"
                />
              </div>
            </div>

            {/* Priority */}
            <SelectField
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              options={PRIORITIES}
            />

            {/* Impact & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Impact"
                name="impact"
                value={form.impact}
                onChange={handleChange}
                options={IMPACTS}
              />
              <SelectField
                label="Urgency"
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                options={URGENCIES}
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Assign To (optional)
              </label>
              <input
                type="text"
                name="assignee"
                value={form.assignee}
                onChange={handleChange}
                placeholder="Agent name or leave blank for auto-assignment"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                  placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                  transition-colors"
              />
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white
              bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow
              disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create Ticket
              </>
            )}
          </button>
        </form>

        {/* SLA Prediction Panel */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800">SLA Risk Prediction</h3>
            </div>

            {predicting ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : slaPrediction ? (
              <div className="space-y-4">
                {/* Risk gauge */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4
                    ${slaPrediction.breach_flag
                      ? "border-red-400 bg-red-50"
                      : "border-emerald-400 bg-emerald-50"
                    }`}>
                    <span className={`text-xl font-bold
                      ${slaPrediction.breach_flag ? "text-red-600" : "text-emerald-600"}`}>
                      {Math.round((slaPrediction.breach_probability ?? 0) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Breach Probability</p>
                </div>

                {/* Risk flag */}
                <div className={`px-4 py-3 rounded-lg text-center text-sm font-semibold
                  ${slaPrediction.breach_flag
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                  {slaPrediction.breach_flag ? "⚠ High SLA Risk" : "✓ Low SLA Risk"}
                </div>

                <p className="text-xs text-slate-400 text-center">
                  Prediction updates as you fill fields
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">
                  Fill in category & priority to see SLA risk prediction
                </p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
              Quick Tips
            </h4>
            <ul className="space-y-2 text-xs text-blue-700/80">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                Be specific in the title for faster routing
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                Include error messages in the description
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                High-risk tickets are auto-escalated
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none px-4 py-2.5 text-sm border border-slate-200 rounded-lg
            text-slate-700 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
            transition-colors cursor-pointer"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
