import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ticketsAPI, slaAPI } from "../../services/api";
import { agents } from "../../data/agentData";
import {
  Send, AlertCircle, CheckCircle2, Loader2, ShieldAlert,
  ChevronDown, ChevronLeft, X, Upload, FileText, Paperclip,
  User, Tag, MapPin, Clock, Monitor, AlertTriangle,
  Zap, Info, Trash2, Eye, RotateCcw,
} from "lucide-react";

/* ── Constants ───────────────────────────────────────────────── */
const CATEGORIES = ["Hardware", "Software", "Network", "Access/Auth", "Email", "Database", "Other"];
const SUBCATEGORIES = {
  Hardware:     ["Server", "Laptop/Desktop", "Printer", "Peripheral", "Badge Reader", "Phone", "Other"],
  Software:     ["OS", "Application", "License", "Update/Patch", "CI/CD", "Other"],
  Network:      ["VPN", "Wi-Fi", "DNS", "Firewall", "Bandwidth", "Other"],
  "Access/Auth":["SSO", "MFA", "Active Directory", "Permissions", "Password", "Other"],
  Email:        ["Outlook", "Exchange", "Spam/Filtering", "Calendar", "Other"],
  Database:     ["Backup", "Performance", "Replication", "Migration", "Other"],
  Other:        ["General", "Other"],
};
const PRIORITIES  = ["Critical", "High", "Medium", "Low"];
const IMPACTS     = ["1 - Extensive", "2 - Significant", "3 - Moderate", "4 - Minor"];
const URGENCIES   = ["1 - Critical", "2 - High", "3 - Medium", "4 - Low"];
const ENVIRONMENTS = ["Production", "Staging", "Development", "Testing", "All"];
const MAX_DESCRIPTION = 2000;
const MAX_TITLE       = 150;
const MAX_FILES        = 5;
const MAX_FILE_SIZE_MB = 10;

const PRIORITY_COLORS = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High:     "bg-orange-100 text-orange-700 border-orange-200",
  Medium:   "bg-amber-100 text-amber-700 border-amber-200",
  Low:      "bg-blue-100 text-blue-700 border-blue-200",
};

const initialForm = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  priority: "Medium",
  impact: "3 - Moderate",
  urgency: "3 - Medium",
  assignee: "",
  reporter_name: "",
  reporter_email: "",
  reporter_department: "",
  environment: "",
  location: "",
  tags: "",
};

/* ── Form-level progress (which sections are filled) ─────────── */
function calcProgress(form, attachments) {
  let filled = 0;
  let total = 6;
  if (form.title.trim()) filled++;
  if (form.description.trim()) filled++;
  if (form.category) filled++;
  if (form.priority) filled++;
  if (form.reporter_name.trim() || form.reporter_email.trim()) filled++;
  if (form.assignee || attachments.length > 0 || form.tags.trim()) filled++;
  return Math.round((filled / total) * 100);
}

/* ══════════════════════════════════════════════════════════════ */

export default function CreateTicket() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  /* ── State ─────────────────────────────────────────────────── */
  const [form, setForm]                 = useState(initialForm);
  const [fieldErrors, setFieldErrors]   = useState({});
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(null);
  const [slaPrediction, setSlaPrediction] = useState(null);
  const [predicting, setPredicting]     = useState(false);
  const [attachments, setAttachments]   = useState([]);
  const [showPreview, setShowPreview]   = useState(false);
  const [activeSection, setActiveSection] = useState("details");

  const progress = calcProgress(form, attachments);

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Reset subcategory when category changes
      if (name === "category") next.subcategory = "";
      return next;
    });

    // Clear field error on change
    setFieldErrors((prev) => ({ ...prev, [name]: null }));

    // Auto-predict SLA when key fields change
    if (["category", "priority", "impact", "urgency"].includes(name)) {
      const data = { ...form, [name]: value };
      predictSLA(data);
    }
  }, [form]);

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

  /* ── File Attachments ──────────────────────────────────────── */
  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, [attachments]);

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).slice(0, MAX_FILES - attachments.length);
    const valid = newFiles.filter((f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
    if (valid.length < newFiles.length) {
      setError(`Some files exceed ${MAX_FILE_SIZE_MB}MB limit and were skipped.`);
    }
    setAttachments((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  };

  const removeFile = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ── Validation ────────────────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.length > MAX_TITLE) errs.title = `Title must be under ${MAX_TITLE} characters`;
    if (!form.category) errs.category = "Please select a category";
    if (!form.description.trim()) errs.description = "Description is required";
    else if (form.description.length > MAX_DESCRIPTION) errs.description = `Description must be under ${MAX_DESCRIPTION} characters`;
    if (form.reporter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reporter_email)) {
      errs.reporter_email = "Invalid email format";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setActiveSection("details");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await ticketsAPI.create({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        opened_at: new Date().toISOString(),
        slaPrediction,
        attachments: attachments.map((f) => f.name),
      });
      setSuccess("Ticket created successfully! Redirecting...");
      setForm(initialForm);
      setSlaPrediction(null);
      setAttachments([]);
      setTimeout(() => navigate("/admin/tickets"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setSlaPrediction(null);
    setAttachments([]);
    setShowPreview(false);
  };

  /* ── Computed ──────────────────────────────────────────────── */
  const subcats = SUBCATEGORIES[form.category] || [];
  const selectedAgent = agents.find((a) => a.name === form.assignee);

  /* ── Section navigation ────────────────────────────────────── */
  const sections = [
    { id: "details",   label: "Issue Details",   icon: FileText },
    { id: "classify",  label: "Classification",  icon: Tag },
    { id: "contact",   label: "Contact Info",    icon: User },
    { id: "extra",     label: "Additional",      icon: Paperclip },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* ── Breadcrumb + Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/admin/tickets" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              Tickets
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Create New Ticket</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit a new IT support request — SLA breach risk is predicted automatically
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600">{progress}%</span>
          </div>
        </div>
      </div>

      {/* ── Section Tabs ─────────────────────────────────────── */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm overflow-x-auto">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center
                ${isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">

          {/* ====== Section: Issue Details ===================== */}
          {activeSection === "details" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Issue Details</h2>
                  <p className="text-xs text-slate-400">Describe the problem clearly</p>
                </div>
              </div>

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
                  maxLength={MAX_TITLE}
                  placeholder="e.g., Server not responding in production"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                    transition-colors ${fieldErrors.title ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                />
                <div className="flex justify-between mt-1">
                  {fieldErrors.title && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.title}
                    </span>
                  )}
                  <span className={`text-xs ml-auto ${form.title.length > MAX_TITLE * 0.9 ? "text-amber-500" : "text-slate-400"}`}>
                    {form.title.length}/{MAX_TITLE}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={MAX_DESCRIPTION}
                  placeholder="Provide detailed information: what happened, when it started, steps to reproduce, error messages, affected users/systems..."
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg resize-none
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                    transition-colors ${fieldErrors.description ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                />
                <div className="flex justify-between mt-1">
                  {fieldErrors.description && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.description}
                    </span>
                  )}
                  <span className={`text-xs ml-auto ${form.description.length > MAX_DESCRIPTION * 0.9 ? "text-amber-500" : "text-slate-400"}`}>
                    {form.description.length}/{MAX_DESCRIPTION}
                  </span>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Attachments <span className="text-xs font-normal text-slate-400">(max {MAX_FILES} files, {MAX_FILE_SIZE_MB}MB each)</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer
                    hover:border-blue-400 hover:bg-blue-50/30 transition-colors group"
                >
                  <Upload className="w-8 h-8 mx-auto text-slate-300 group-hover:text-blue-400 transition-colors mb-2" />
                  <p className="text-sm text-slate-500">
                    <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, PDF, LOG, TXT up to {MAX_FILE_SIZE_MB}MB
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".png,.jpg,.jpeg,.pdf,.log,.txt,.csv,.zip"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>

                {attachments.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {attachments.map((file, i) => (
                      <li key={i} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 truncate">{file.name}</span>
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ====== Section: Classification =================== */}
          {activeSection === "classify" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Tag className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Classification & Priority</h2>
                  <p className="text-xs text-slate-400">Categorize and set severity levels</p>
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SelectField
                    label="Category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    options={CATEGORIES}
                    required
                    error={fieldErrors.category}
                  />
                </div>
                <div>
                  <SelectField
                    label="Subcategory"
                    name="subcategory"
                    value={form.subcategory}
                    onChange={handleChange}
                    options={subcats}
                    disabled={!form.category}
                    placeholder={form.category ? "Select subcategory" : "Select category first"}
                  />
                </div>
              </div>

              {/* Priority with visual indicators */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, priority: p }));
                        predictSLA({ ...form, priority: p });
                      }}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all
                        ${form.priority === p
                          ? `${PRIORITY_COLORS[p]} ring-2 ring-offset-1 ring-current shadow-sm`
                          : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {p === "Critical" && <Zap className="w-3.5 h-3.5" />}
                        {p === "High" && <AlertTriangle className="w-3.5 h-3.5" />}
                        {p === "Medium" && <Clock className="w-3.5 h-3.5" />}
                        {p === "Low" && <Info className="w-3.5 h-3.5" />}
                        {p}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Impact"
                  name="impact"
                  value={form.impact}
                  onChange={handleChange}
                  options={IMPACTS}
                  hint="How many users/services are affected?"
                />
                <SelectField
                  label="Urgency"
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                  options={URGENCIES}
                  hint="How quickly does this need resolution?"
                />
              </div>

              {/* Environment */}
              <SelectField
                label="Environment"
                name="environment"
                value={form.environment}
                onChange={handleChange}
                options={ENVIRONMENTS}
              />

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tags <span className="text-xs font-normal text-slate-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g., vpn, remote-work, urgent"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                    placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                    transition-colors"
                />
                {form.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.split(",").map((tag, i) =>
                      tag.trim() ? (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                          <Tag className="w-2.5 h-2.5" />
                          {tag.trim()}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== Section: Contact Info ====================== */}
          {activeSection === "contact" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Reporter & Contact Information</h2>
                  <p className="text-xs text-slate-400">Who is reporting this issue?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    name="reporter_name"
                    value={form.reporter_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                      transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="reporter_email"
                    value={form.reporter_email}
                    onChange={handleChange}
                    placeholder="user@company.com"
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                      transition-colors ${fieldErrors.reporter_email ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                  />
                  {fieldErrors.reporter_email && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.reporter_email}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    name="reporter_department"
                    value={form.reporter_department}
                    onChange={handleChange}
                    placeholder="e.g., Engineering, Sales, HR"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg
                      placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                      transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Location / Floor
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g., Building A, Floor 3"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg
                        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
                        transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== Section: Additional / Assignment ========== */}
          {activeSection === "extra" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Monitor className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Agent Assignment</h2>
                  <p className="text-xs text-slate-400">Assign to an agent or leave blank for auto-assignment</p>
                </div>
              </div>

              {/* Agent Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assign To
                </label>

                {/* Auto-assign option */}
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, assignee: "" }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all mb-2
                    ${!form.assignee
                      ? "border-blue-300 bg-blue-50/50 ring-2 ring-blue-400/20"
                      : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-700">Auto-Assign (AI Recommended)</p>
                    <p className="text-xs text-slate-400">System will assign based on workload & expertise</p>
                  </div>
                  {!form.assignee && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto flex-shrink-0" />
                  )}
                </button>

                {/* Agent list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {agents.map((agent) => {
                    const isSelected = form.assignee === agent.name;
                    const wlColor =
                      agent.workload_percentage >= 90 ? "bg-red-500"
                      : agent.workload_percentage >= 70 ? "bg-amber-500"
                      : "bg-emerald-500";
                    const statusColor =
                      agent.availability_status === "Available" ? "bg-emerald-500"
                      : agent.availability_status === "Busy" ? "bg-amber-500"
                      : "bg-red-500";

                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, assignee: agent.name }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all
                          ${isSelected
                            ? "border-blue-300 bg-blue-50/50 ring-2 ring-blue-400/20"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-600">
                            {agent.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColor}`} />
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-700 truncate">{agent.name}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">
                              {agent.specialization}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${wlColor} rounded-full`} style={{ width: `${agent.workload_percentage}%` }} />
                              </div>
                              <span className="text-[10px] text-slate-400">{agent.workload_percentage}%</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{agent.open_tickets} open</span>
                            <span className="text-[10px] text-slate-400">SLA {agent.sla_success_rate}%</span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Messages ─────────────────────────────────────── */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button type="button" onClick={() => setError(null)} className="ml-auto hover:text-red-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* ── Action Buttons ────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700
                bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm hover:shadow transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview Ticket
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white
                bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Form
          </button>
        </form>

        {/* ── Right Sidebar ──────────────────────────────────── */}
        <div className="space-y-5">
          {/* SLA Prediction Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800">SLA Risk Prediction</h3>
            </div>

            {predicting ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <p className="text-xs text-slate-400">Analyzing risk...</p>
              </div>
            ) : slaPrediction ? (
              <div className="space-y-4">
                {/* Risk gauge */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4
                    ${slaPrediction.breach_flag
                      ? "border-red-400 bg-red-50"
                      : "border-emerald-400 bg-emerald-50"
                    }`}>
                    <span className={`text-2xl font-bold
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

          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
              Ticket Summary
            </h4>
            <dl className="space-y-2.5 text-xs">
              <SummaryRow label="Title" value={form.title || "—"} />
              <SummaryRow label="Category" value={form.category || "—"} />
              <SummaryRow label="Priority" value={
                form.priority ? (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${PRIORITY_COLORS[form.priority]}`}>
                    {form.priority}
                  </span>
                ) : "—"
              } />
              <SummaryRow label="Impact" value={form.impact} />
              <SummaryRow label="Urgency" value={form.urgency} />
              <SummaryRow label="Assignee" value={form.assignee || "Auto-assign"} />
              <SummaryRow label="Attachments" value={`${attachments.length} file(s)`} />
            </dl>
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
                Include error messages or screenshots
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                Add environment & location for context
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                High-risk tickets are auto-escalated
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                Leave assignee blank for AI-based routing
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Preview Modal ──────────────────────────────────── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800">Ticket Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title & Priority */}
              <div>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-800">
                      {form.title || "Untitled Ticket"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Created: {new Date().toLocaleString()}
                    </p>
                  </div>
                  {form.priority && (
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${PRIORITY_COLORS[form.priority]}`}>
                      {form.priority}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</h5>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {form.description || "No description provided."}
                </p>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-4">
                <PreviewField label="Category" value={form.category} />
                <PreviewField label="Subcategory" value={form.subcategory} />
                <PreviewField label="Impact" value={form.impact} />
                <PreviewField label="Urgency" value={form.urgency} />
                <PreviewField label="Environment" value={form.environment} />
                <PreviewField label="Location" value={form.location} />
                <PreviewField label="Reporter" value={form.reporter_name} />
                <PreviewField label="Email" value={form.reporter_email} />
                <PreviewField label="Department" value={form.reporter_department} />
                <PreviewField label="Assigned To" value={form.assignee || "Auto-assign"} />
              </div>

              {/* Tags */}
              {form.tags && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tags</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.split(",").map((tag, i) =>
                      tag.trim() ? (
                        <span key={i} className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                          {tag.trim()}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {attachments.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Attachments ({attachments.length})
                  </h5>
                  <ul className="space-y-1">
                    {attachments.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                        {f.name}
                        <span className="text-xs text-slate-400">({(f.size / 1024).toFixed(0)} KB)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SLA */}
              {slaPrediction && (
                <div className={`px-4 py-3 rounded-lg flex items-center gap-3
                  ${slaPrediction.breach_flag
                    ? "bg-red-50 border border-red-200"
                    : "bg-emerald-50 border border-emerald-200"
                  }`}>
                  <ShieldAlert className={`w-5 h-5 ${slaPrediction.breach_flag ? "text-red-500" : "text-emerald-500"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${slaPrediction.breach_flag ? "text-red-700" : "text-emerald-700"}`}>
                      {slaPrediction.breach_flag ? "High SLA Risk" : "Low SLA Risk"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Breach probability: {Math.round((slaPrediction.breach_probability ?? 0) * 100)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={(e) => { setShowPreview(false); handleSubmit(e); }}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800
                  disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Reusable small components ────────────────────────────────── */

function SelectField({ label, name, value, onChange, options, required, disabled, error, hint, placeholder }) {
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
          disabled={disabled}
          className={`w-full appearance-none px-4 py-2.5 text-sm border rounded-lg
            bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400
            transition-colors cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${error ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
        >
          <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && (
        <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-400 mt-1">{hint}</p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-700 font-medium text-right max-w-[60%] truncate">
        {typeof value === "string" ? (value || "—") : value}
      </dd>
    </div>
  );
}

function PreviewField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value || "—"}</p>
    </div>
  );
}
