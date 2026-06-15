import {
  BarChart3,
  Bot,
  ClipboardList,
  DollarSign,
  Globe2,
  LineChart,
  MessageSquare,
  Rocket,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] px-8 py-10 text-[#0A192F]">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A192F] text-white shadow-lg">
            <Rocket size={34} />
          </div>

          <div>
            <h1 className="text-5xl font-bold tracking-tight">StartupCoach</h1>
            <p className="mt-2 text-lg font-medium text-[#008080]">
              AI-Powered Startup Advisor
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm md:flex">
          <Sparkles size={16} className="text-[#008080]" />
          RAG + ML + Supabase
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-[#0A192F]" size={30} />
              <h2 className="text-3xl font-bold">AI Coach Chat</h2>
            </div>

            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-[#008080]">
              RAG Enabled
            </span>
          </div>

          <div className="min-h-[310px] rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-5 max-w-[80%] rounded-2xl bg-white p-4 text-slate-700 shadow-sm">
              How do I know if customers really need my product?
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-[#0A192F] p-4 text-white shadow-sm">
              Start by interviewing potential customers before building. Focus
              on understanding their current pain, then validate demand with a
              simple version of the product.
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <input
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#008080] focus:ring-2 focus:ring-teal-100"
              placeholder="Ask your StartupCoach anything..."
            />

            <button className="flex items-center gap-2 rounded-xl bg-[#008080] px-5 py-3 font-semibold text-white transition hover:bg-[#006666]">
              <Send size={18} />
              Send
            </button>
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70">
          <div className="mb-6 flex items-center gap-3">
            <BarChart3 className="text-[#0A192F]" size={30} />
            <h2 className="text-3xl font-bold">Startup Prediction</h2>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#0A192F] to-[#113B5C] p-6 text-white">
            <p className="text-sm font-medium text-teal-100">
              Success Probability
            </p>

            <div className="mt-3 flex items-end gap-3">
              <span className="text-6xl font-extrabold">78%</span>
              <TrendingUp className="mb-2 text-[#00B3B3]" size={32} />
            </div>

            <div className="mt-6 h-3 rounded-full bg-white/20">
              <div className="h-3 w-[78%] rounded-full bg-[#00B3B3]" />
            </div>
          </div>

          <div className="mt-7">
            <h3 className="mb-4 text-xl font-bold">Key Business Signals</h3>

            <div className="space-y-4">
              <FactorRow
                icon={<DollarSign size={20} />}
                label="Funding"
                value="Strong"
                width="85%"
              />
              <FactorRow
                icon={<LineChart size={20} />}
                label="Market"
                value="Relevant"
                width="70%"
              />
              <FactorRow
                icon={<Globe2 size={20} />}
                label="Country"
                value="Matched"
                width="62%"
              />
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-3xl border-l-4 border-[#FFAB00] bg-white p-6 shadow-lg shadow-slate-200/60">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-orange-50 p-3 text-[#FFAB00]">
            <ClipboardList size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">StartupCoach Homework</h2>
            <p className="mt-2 text-slate-600">
              Interview 3 potential customers and ask about their current
              problem, not about your solution.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function FactorRow({
  icon,
  label,
  value,
  width,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <span className="text-[#008080]">{icon}</span>
          {label}
        </div>
        <span className="text-slate-500">{value}</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-[#008080]"
          style={{ width }}
        />
      </div>
    </div>
  );
}