"use client";

import { useState, type ReactNode } from "react";
import {
  BarChart3,
  DollarSign,
  Globe2,
  LineChart,
  MessageSquare,
  Rocket,
  Send,
  Sparkles,
  TrendingUp,
  ArrowUp,
  Home as HomeIcon,
  History,
  Plus,
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

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "user",
      content: "How do I know if customers really need my product?",
    },
    {
      role: "assistant",
      content:
        "Start by interviewing potential customers before building. Focus on understanding their current pain, then validate demand with a simple version of the product.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);

  const [startupForm, setStartupForm] = useState({
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

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
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
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(startupForm),
      });

      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      alert("Prediction error. Please make sure the backend is running.");
    } finally {
      setPredictionLoading(false);
    }
  };

  const probabilityPercent = predictionResult
    ? Math.round(predictionResult.success_probability * 100)
    : 0;

  return (
  <div className="flex min-h-screen bg-[#F5F7FA] text-[#0A192F]">
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

      <button className="mb-6 flex items-center gap-3 rounded-xl bg-[#008080] px-4 py-3 font-semibold text-white transition hover:bg-[#006666]">
        <Plus size={18} />
        New Chat
      </button>

      <nav className="space-y-2 text-sm font-medium text-slate-600">
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-[#0A192F]">
          <MessageSquare size={18} />
          AI Coach Chat
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100">
          <BarChart3 size={18} />
          Startup Prediction
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100">
          <History size={18} />
          Prediction History
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100">
          <HomeIcon size={18} />
          Landing Page
        </div>
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
        <div className="mb-2 flex items-center gap-2 font-semibold text-[#008080]">
          <Sparkles size={14} />
          RAG + ML + Supabase
        </div>
        MVP demo mode
      </div>
    </aside>

    <main className="ml-72 min-h-screen flex-1 px-8 py-8">
      
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-[#0A192F]" size={30} />
              <h2 className="text-2xl font-bold">AI Coach Chat</h2>
            </div>

            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-[#008080]">
              RAG Enabled
            </span>
          </div>

          <div className="h-[430px] overflow-y-auto space-y-4 rounded-2xl bg-transparent p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 shadow-sm ${
                  msg.role === "user"
                    ? "max-w-[80%] bg-white text-slate-700"
                    : "ml-auto max-w-[85%] whitespace-pre-wrap bg-[#0A192F] text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="ml-auto max-w-[85%] rounded-2xl bg-[#0A192F] p-4 text-white shadow-sm">
                <p>Loading...</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="flex-1 rounded-2xl 
              border border-slate-200 px-5 py-4 outline-none
              focus:border-[#008080]"
              placeholder="Ask your StartupCoach anything..."
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="flex h-14 w-14 
              items-center justify-center rounded-full bg-[#008080] 
              text-white hover:bg-[#006666]"
            >
              <ArrowUp size={20} />
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
              <span className="text-2xl font-extrabold">
                {predictionResult ? predictionResult.success_percentage : "No prediction yet"}
              </span>
              <TrendingUp className="mb-2 text-[#00B3B3]" size={32} />
            </div>

            <div className="mt-6 h-3 rounded-full bg-white/20">
              <div
                className="h-3 rounded-full bg-[#00B3B3]"
                style={{ width: `${probabilityPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <input
              type="number"
              value={startupForm.funding_total_usd}
              onChange={(e) =>
                setStartupForm({
                  ...startupForm,
                  funding_total_usd: Number(e.target.value),
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
              placeholder="Funding total"
            />

            <input
              type="number"
              value={startupForm.funding_rounds}
              onChange={(e) =>
                setStartupForm({
                  ...startupForm,
                  funding_rounds: Number(e.target.value),
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
              placeholder="Funding rounds"
            />

            <input
              type="number"
              value={startupForm.founded_year}
              onChange={(e) =>
                setStartupForm({
                  ...startupForm,
                  founded_year: Number(e.target.value),
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
              placeholder="Founded year"
            />

            <select
              value={startupForm.market}
              onChange={(e) =>
                setStartupForm({
                  ...startupForm,
                  market: e.target.value,
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
            >
              <option value="Software">Software</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Mobile">Mobile</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={startupForm.country_code}
              onChange={(e) =>
                setStartupForm({
                  ...startupForm,
                  country_code: e.target.value,
                })
              }
              className="col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008080]"
            >
              <option value="USA">USA</option>
              <option value="ISR">ISR</option>
              <option value="GBR">GBR</option>
              <option value="CAN">CAN</option>
              <option value="DEU">DEU</option>
              <option value="Other">Other</option>
            </select>
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
              <FactorRow
                icon={<DollarSign size={20} />}
                label="Funding"
                value={startupForm.funding_total_usd.toLocaleString()}
                width="85%"
              />
              <FactorRow
                icon={<LineChart size={20} />}
                label="Market"
                value={startupForm.market}
                width="70%"
              />
              <FactorRow
                icon={<Globe2 size={20} />}
                label="Country"
                value={startupForm.country_code}
                width="62%"
              />
            </div>
          </div>
        </aside>
      </section>
    </main>
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