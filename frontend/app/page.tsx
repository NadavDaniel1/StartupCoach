"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowUp,
  BarChart3,
  DollarSign,
  Globe2,
  History,
  Home as HomeIcon,
  LineChart,
  MessageSquare,
  Plus,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type PredictionResult = {
  success_probability: number;
  success_percentage: string;
  prediction: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type StartupForm = {
  startup_name: string;
  funding_total_usd: number;
  funding_rounds: number;
  founded_year: number;
  seed: number;
  venture: number;
  debt_financing: number;
  angel: number;
  grant: number;
  round_A: number;
  round_B: number;
  round_C: number;
  round_D: number;
  round_E: number;
  round_F: number;
  market: string;
  country_code: string;
};

type PredictionHistoryItem = {
  id: number;
  created_at?: string;
  startup_name?: string | null;
  funding_total_usd?: number;
  market?: string;
  country_code?: string;
  success_probability?: number;
  predicted_class?: number;
  prediction_label?: string;
};

const backendUrl = "http://127.0.0.1:8000";

const initialMessages: ChatMessage[] = [
  {
    role: "user",
    content: "How do I know if customers really need my product?",
  },
  {
    role: "assistant",
    content:
      "Start by interviewing potential customers before building. Focus on understanding their current pain, then validate demand with a simple version of the product.",
  },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);

  const [activePage, setActivePage] = useState<
    "chat" | "prediction" | "history" | "landing"
  >("chat");

  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  const [startupForm, setStartupForm] = useState<StartupForm>({
    startup_name: "",
    funding_total_usd: 500000,
    funding_rounds: 2,
    founded_year: 2020,
    seed: 1,
    venture: 1,
    debt_financing: 0,
    angel: 0,
    grant: 0,
    round_A: 1,
    round_B: 0,
    round_C: 0,
    round_D: 0,
    round_E: 0,
    round_F: 0,
    market: "Software",
    country_code: "USA",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const probabilityPercent = predictionResult
    ? Math.round(predictionResult.success_probability * 100)
    : 0;

  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getPredictionColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const fetchPredictionHistory = async () => {
    try {
      const response = await fetch(`${backendUrl}/history`);

      if (!response.ok) {
        console.warn("History endpoint returned:", response.status);
        setPredictionHistory([]);
        return;
      }

      const data = await response.json();
      setPredictionHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History fetch error:", error);
      setPredictionHistory([]);
    }
  };

  const startNewChat = () => {
    setActivePage("chat");
    setMessages(initialMessages);
    setMessage("");
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message.trim();

    setMessages((prev) => [...prev, { role: "user", content: currentMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "No response returned." },
      ]);
    } catch (error) {
      console.error("Chat fetch error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setPredictionLoading(true);

    try {
      const response = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(startupForm),
      });

      if (!response.ok) {
        throw new Error(`Prediction request failed: ${response.status}`);
      }

      const data = await response.json();
      setPredictionResult(data);
      await fetchPredictionHistory();
    } catch (error) {
      console.error("Prediction fetch error:", error);
      alert("Prediction error. Please make sure the backend is running.");
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA] text-[#0A192F]">
      <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A192F] text-white shadow-md">
            <Rocket size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">StartupCoach</h1>
            <p className="text-sm font-medium text-[#008080]">AI Startup Advisor</p>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="mb-6 flex items-center gap-3 rounded-xl bg-[#008080] px-4 py-3 font-semibold text-white transition hover:bg-[#006666]"
        >
          <Plus size={18} />
          New Chat
        </button>

        <nav className="space-y-2 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActivePage("chat")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activePage === "chat" ? "bg-slate-100 text-[#0A192F]" : "hover:bg-slate-100"
            }`}
          >
            <MessageSquare size={18} />
            AI Coach Chat
          </button>

          <button
            onClick={() => setActivePage("prediction")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activePage === "prediction" ? "bg-slate-100 text-[#0A192F]" : "hover:bg-slate-100"
            }`}
          >
            <BarChart3 size={18} />
            Startup Prediction
          </button>

          <button
            onClick={() => {
              setActivePage("history");
              fetchPredictionHistory();
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activePage === "history" ? "bg-slate-100 text-[#0A192F]" : "hover:bg-slate-100"
            }`}
          >
            <History size={18} />
            Prediction History
          </button>

          <button
            onClick={() => setActivePage("landing")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activePage === "landing" ? "bg-slate-100 text-[#0A192F]" : "hover:bg-slate-100"
            }`}
          >
            <HomeIcon size={18} />
            Landing Page
          </button>
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
          <div className="mb-2 flex items-center gap-2 font-semibold text-[#008080]">
            <Sparkles size={14} />
            RAG + ML + Supabase
          </div>
          MVP demo mode
        </div>
      </aside>

      <main className="ml-72 h-screen flex-1 overflow-y-auto px-8 py-8">
        {(activePage === "chat" || activePage === "prediction") && (
          <section className="grid h-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex min-h-0 flex-col rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70">
              <div className="mb-6 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-[#0A192F]" size={30} />
                  <h2 className="text-3xl font-bold">AI Coach Chat</h2>
                </div>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-[#008080]">
                  RAG Enabled
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-transparent p-5">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl p-4 shadow-sm ${
                        msg.role === "user"
                          ? "max-w-[80%] bg-white text-slate-700"
                          : "ml-auto max-w-[85%] bg-[#0A192F] text-white"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown
                          components={{
                            h2: ({ children }) => (
                              <h2 className="mb-2 mt-4 text-xl font-bold text-white first:mt-0">
                                {children}
                              </h2>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2 leading-relaxed text-white">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-2 list-disc space-y-1 pl-5 text-white">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="leading-relaxed text-white">{children}</li>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="ml-auto max-w-[85%] rounded-2xl bg-[#0A192F] p-4 text-white shadow-sm">
                      StartupCoach is thinking...
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="mt-5 flex shrink-0 gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-[#008080]"
                  placeholder="Ask your StartupCoach anything..."
                />

                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#008080] text-white transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowUp size={24} />
                </button>
              </div>
            </div>

            <aside className="min-h-0 overflow-y-auto rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70">
              <div className="mb-6 flex items-center gap-3">
                <BarChart3 className="text-[#0A192F]" size={30} />
                <h2 className="text-3xl font-bold">Startup Prediction</h2>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-[#0A192F] to-[#113B5C] p-6 text-white">
                <p className="text-sm font-medium text-teal-100">Success Probability</p>

                <div className="mt-3 flex items-end gap-3">
                  <span className={predictionResult ? "text-4xl font-extrabold" : "text-xl font-extrabold"}>
                    {predictionResult ? predictionResult.success_percentage : "No prediction yet"}
                  </span>
                  <TrendingUp className="mb-2 text-[#00B3B3]" size={32} />
                </div>

                <div className="mt-6 h-3 rounded-full bg-white/20">
                  <div className="h-3 rounded-full bg-[#00B3B3]" style={{ width: `${probabilityPercent}%` }} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Startup name
                  </label>
                  <input
                    type="text"
                    value={startupForm.startup_name}
                    onChange={(e) => setStartupForm({ ...startupForm, startup_name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
                    placeholder="Enter startup name"
                  />
                </div>

                <Field label="Funding total">
                  <input
                    type="number"
                    value={startupForm.funding_total_usd}
                    onChange={(e) => setStartupForm({ ...startupForm, funding_total_usd: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
                  />
                </Field>

                <Field label="Funding rounds">
                  <input
                    type="number"
                    value={startupForm.funding_rounds}
                    onChange={(e) => setStartupForm({ ...startupForm, funding_rounds: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
                  />
                </Field>

                <Field label="Founded year">
                  <input
                    type="number"
                    value={startupForm.founded_year}
                    onChange={(e) => setStartupForm({ ...startupForm, founded_year: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
                  />
                </Field>

                <Field label="Market">
                  <select
                    value={startupForm.market}
                    onChange={(e) => setStartupForm({ ...startupForm, market: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
                  >
                    <option value="Software">Software</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Country</label>
                  <select
                    value={startupForm.country_code}
                    onChange={(e) => setStartupForm({ ...startupForm, country_code: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
                  >
                    <option value="USA">USA</option>
                    <option value="ISR">ISR</option>
                    <option value="GBR">GBR</option>
                    <option value="CAN">CAN</option>
                    <option value="DEU">DEU</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runPrediction}
                disabled={predictionLoading}
                className="mt-5 w-full rounded-xl bg-[#008080] px-5 py-3 font-semibold text-white transition hover:bg-[#006666] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {predictionLoading ? "Calculating..." : "Run Startup Prediction"}
              </button>

              {predictionResult && (
                <p className="mt-3 text-center text-sm font-semibold text-slate-600">
                  Prediction: {predictionResult.prediction}
                </p>
              )}

              <div className="mt-7">
                <h3 className="mb-4 text-xl font-bold">Key Business Signals</h3>
                <div className="space-y-4">
                  <FactorRow icon={<DollarSign size={20} />} label="Funding" value={startupForm.funding_total_usd.toLocaleString()} width="85%" />
                  <FactorRow icon={<LineChart size={20} />} label="Market" value={startupForm.market} width="70%" />
                  <FactorRow icon={<Globe2 size={20} />} label="Country" value={startupForm.country_code} width="62%" />
                </div>
              </div>
            </aside>
          </section>
        )}

        {activePage === "history" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h2 className="text-4xl font-bold text-[#0A192F]">Prediction History</h2>
              <p className="mt-3 text-slate-600">Previous startup evaluations stored in StartupCoach.</p>
            </div>

            {predictionHistory.length === 0 ? (
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <p className="text-slate-600">No predictions yet, or backend history is not available.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {predictionHistory.map((item) => {
                  const score = Number(item.success_probability ?? 0) * 100;
                  const roundedScore = Math.round(score);

                  return (
                    <div key={item.id} className="rounded-3xl bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[#0A192F]">
                            {item.startup_name?.trim() || `Startup ${item.id}`}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Predicted on {item.created_at ? item.created_at.split("T")[0] : "Unknown date"}
                          </p>
                        </div>

                        <span className={`rounded-full px-4 py-2 font-semibold ${getPredictionColor(score)}`}>
                          {roundedScore}% {item.prediction_label || (item.predicted_class === 1 ? "Success" : "Failure")}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Funding</p>
                          <p className="font-semibold">
                            ${Number(item.funding_total_usd ?? 0).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Market</p>
                          <p className="font-semibold">{item.market || "-"}</p>
                        </div>

                        <div>
                          <p className="text-slate-500">Country</p>
                          <p className="font-semibold">{item.country_code || "-"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activePage === "landing" && (
          <div className="space-y-8">
            <section className="rounded-3xl bg-white p-10 shadow-xl">
              <div className="max-w-4xl">
                <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-[#008080]">
                  AI Startup Advisor
                </span>

                <h1 className="mt-6 text-5xl font-extrabold text-[#0A192F]">
                  Build smarter startup decisions with StartupCoach
                </h1>

                <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">
                  StartupCoach combines RAG-based startup mentoring, machine learning prediction,
                  and Supabase history to help early-stage founders validate ideas, test assumptions,
                  and make better business decisions.
                </p>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setActivePage("chat")}
                    className="rounded-xl bg-[#008080] px-6 py-3 font-semibold text-white hover:bg-[#006666]"
                  >
                    Start Coaching
                  </button>

                  <button
                    onClick={() => setActivePage("prediction")}
                    className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-[#0A192F] hover:bg-slate-50"
                  >
                    Run Prediction
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <FeatureCard title="RAG Startup Coach" text="Answers founder questions using curated startup knowledge instead of generic advice." />
              <FeatureCard title="ML Success Prediction" text="Estimates startup success probability from business signals such as funding, market, year, and country." />
              <FeatureCard title="Supabase History" text="Stores previous predictions so founders can review decisions and track learning over time." />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white p-7 shadow-lg">
      <h3 className="text-xl font-bold text-[#0A192F]">{title}</h3>
      <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function FactorRow({
  icon,
  label,
  value,
  width,
}: {
  icon: ReactNode;
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
        <div className="h-2 rounded-full bg-[#008080]" style={{ width }} />
      </div>
    </div>
  );
}
