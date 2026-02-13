import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  ArrowRight,
  Bot,
  Zap,
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Inline dashboard preview — replaces the Figma asset import so the
    page works without external image dependencies.                    */
/* ------------------------------------------------------------------ */
function DashboardPreview() {
  return (
    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-4 shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-slate-500 font-mono">IT Service Desk — Dashboard</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Open Tickets", value: "142", color: "text-blue-400" },
          { label: "Avg Resolution", value: "4.2 h", color: "text-teal-400" },
          { label: "SLA Compliance", value: "96%", color: "text-green-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-slate-800 rounded-lg p-3 text-center"
          >
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Fake chart area */}
      <div className="bg-slate-800 rounded-lg h-28 flex items-end px-3 pb-3 gap-1.5">
        {[40, 65, 50, 80, 55, 90, 70, 60, 85, 45, 75, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-blue-500/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Fake ticket rows */}
      <div className="space-y-2">
        {[
          { id: "#1023", title: "Server not responding", pri: "Critical", priColor: "bg-red-500" },
          { id: "#1024", title: "VPN drops intermittently", pri: "High", priColor: "bg-orange-500" },
          { id: "#1025", title: "Email delivery delayed", pri: "Medium", priColor: "bg-yellow-500" },
        ].map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">{t.id}</span>
              <span className="text-xs text-slate-300">{t.title}</span>
            </div>
            <span
              className={`text-[10px] text-white px-2 py-0.5 rounded-full ${t.priColor}`}
            >
              {t.pri}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Landing Page                                                       */
/* ================================================================== */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-blue-500 size-8" />
            <span className="text-xl font-semibold text-white">
              IT Service Desk AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-white transition"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-white transition"
            >
              Pricing
            </a>
            <Button
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <span className="text-blue-400 text-sm font-medium">
                  AI-Powered Ticket Classification
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your IT Support with{" "}
                <span className="text-blue-500">Intelligent</span> Automation
              </h1>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Automatically classify, prioritize, and route IT tickets with
                advanced AI. Reduce response time by 70% and improve customer
                satisfaction.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 blur-3xl" />
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Modern IT Teams
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to streamline your IT support operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <Bot className="size-12 text-white mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-white mb-3">
                AI Classification
              </h3>
              <p className="text-blue-100">
                Automatically categorize tickets using advanced machine learning
                algorithms. Save hours of manual sorting and routing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <Shield className="size-12 text-white mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Priority Detection
              </h3>
              <p className="text-red-100">
                Identify high-risk and urgent tickets instantly. Ensure critical
                issues get immediate attention from your team.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <Clock className="size-12 text-white mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-white mb-3">
                SLA Monitoring
              </h3>
              <p className="text-orange-100">
                Track and predict SLA breaches before they happen. Maintain
                compliance and keep your service levels high.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <Zap className="size-12 text-white mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Smart Routing
              </h3>
              <p className="text-teal-100">
                Route tickets to the right team or agent automatically. Improve
                first-contact resolution rates dramatically.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <BarChart3 className="size-12 text-white mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Analytics & Insights
              </h3>
              <p className="text-purple-100">
                Get real-time insights into ticket trends, team performance, and
                customer satisfaction metrics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CheckCircle className="size-12 text-white mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Multi-Channel Support
              </h3>
              <p className="text-pink-100">
                Consolidate tickets from email, chat, phone, and social media
                into one unified platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400">
              Get started in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Connect Your Tools
              </h3>
              <p className="text-slate-400">
                Integrate with your existing helpdesk, email, and communication
                platforms in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Train the AI
              </h3>
              <p className="text-slate-400">
                Our AI learns from your historical tickets to understand your
                unique classification needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Automate & Scale
              </h3>
              <p className="text-slate-400">
                Watch as tickets are automatically classified, prioritized, and
                routed in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your IT Support?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of IT teams already using AI to deliver faster, smarter support.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/login")}
          >
            Get Started Free
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="text-blue-500 size-6" />
                <span className="font-semibold text-white">
                  IT Service Desk AI
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Intelligent ticket classification and automation for modern IT
                teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            &copy; 2026 IT Service Desk AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
