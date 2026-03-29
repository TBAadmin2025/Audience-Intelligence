import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Activity, TriangleAlert, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { WealthRedirectionContent } from "../components/WealthRedirectionContent";
import { diagnosticConfig } from "../client/config";

const ScoreGauge = ({
  score,
  size = 200,
  strokeWidth = 12,
  color = "#B89F82",
  textClass = "text-graphite",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  textClass?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(214, 206, 196, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          strokeLinecap="butt"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`serif text-5xl md:text-7xl font-medium ${textClass}`}>
          {score}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-camel/40 mt-1">
          Score
        </span>
      </div>
    </div>
  );
};

const CTASection = ({ onFixMyFlow }: { onFixMyFlow: () => void }) => (
  <section className="bg-oxblood text-paper p-16 md:p-24 text-center relative overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-multiply"
      style={{ backgroundImage: `url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/24605d59-6de7-48d2-b31c-44af447f6598/1771939638605_DEANAR_Motif_05_the_big_bet.png')` }}
    />
    <div className="space-y-8 relative z-10 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-3 px-4 py-2 border border-camel/30 text-[10px] font-semibold uppercase tracking-[0.3em] text-camel">
        Strategic Next Step
      </div>
      <h2 className="serif text-5xl md:text-6xl font-normal text-paper leading-tight">
        Close the Gap.{" "}
        <br />
        <span className="italic font-normal text-camel">
          Before You Move Forward.
        </span>
      </h2>
      <p className="text-paper/50 font-light text-lg max-w-2xl mx-auto">
        Your diagnostic results reveal gaps in audience intelligence
        that could impact this decision. Get clear on what your
        audience is actually signaling before you move forward.
      </p>
      <button
        onClick={onFixMyFlow}
        className="btn-primary px-12 py-6 text-sm inline-flex items-center gap-3 group"
      >
        Fix My Audience Intelligence
        <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </section>
);

type Tab = "results" | "quadrants" | "fix";

export default function Report() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("results");

  const switchToFix = () => {
    setActiveTab("fix");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const sessionId = pathParts[pathParts.length - 1];
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    fetch(`/api/get-session?id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSession(data.session);
        }
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen deanar-bg-paper flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 border-2 border-camel/30 border-t-camel animate-spin mx-auto" />
          <p className="text-graphite/50 text-sm uppercase tracking-[0.3em]">
            Loading Report
          </p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen deanar-bg-paper flex items-center justify-center">
        <div className="deanar-card p-16 text-center space-y-8 max-w-lg">
          <h1 className="serif text-4xl text-graphite">Report Not Found</h1>
          <p className="text-graphite/50 font-light">
            {error || "This diagnostic session could not be located."}
          </p>
        </div>
      </div>
    );
  }

  const results = session.calculated_scores;
  results.proceedRecommendation = results.proceedRecommendation || "";
  results.proceedDetail = results.proceedDetail || "";
  const commentary = session.ai_commentary;

  if (!results) {
    return (
      <div className="min-h-screen deanar-bg-paper flex items-center justify-center">
        <div className="deanar-card p-16 text-center space-y-8 max-w-lg">
          <h1 className="serif text-4xl text-graphite">Report Pending</h1>
          <p className="text-graphite/50 font-light">
            This diagnostic is still in progress. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  const quadrants = diagnosticConfig.quadrants.map((q, i) => ({
    id: i + 1,
    title: q.name,
    key: q.key,
    desc: q.description,
  }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "results", label: diagnosticConfig.copy.tabs.summary },
    { id: "quadrants", label: diagnosticConfig.copy.tabs.breakdown },
    { id: "fix", label: diagnosticConfig.copy.tabs.action },
  ];

  function getScoreInterpretation(score: number): string {
    if (score >= 80) return "Your decision appears grounded in validated audience intelligence. The foundation behind this move is strong.";
    if (score >= 60) return "You have directional clarity, but gaps in audience validation could weaken performance on this move.";
    if (score >= 40) return "Your decision is partially informed. Expect inconsistency in outcomes without stronger audience intelligence.";
    return "This move is being shaped more by assumption than evidence. The risk to your expected return is elevated.";
  }

  function getReadinessBandExplainer(band: string): string {
    switch (band) {
      case "Evidence-Based": return "Your decisions are anchored in validated customer truth. You have the intelligence foundation to move with confidence.";
      case "Directionally Clear": return "You have useful signals, but there are still gaps that could weaken performance. Targeted validation before full commitment is recommended.";
      case "Partially Informed": return "This move is being shaped by partial insight. Without stronger audience validation, you're accepting meaningful execution risk.";
      case "Assumption-Driven": return "Your next move relies more on internal confidence than validated audience intelligence. This is the highest-risk posture for a significant business bet.";
      default: return "";
    }
  }

  function getProceedBorderColor(recommendation: string): string {
    switch (recommendation) {
      case "Proceed": return "border-camel";
      case "Proceed with Caution": return "border-camel/60";
      case "Pause & Validate": return "border-crimson/60";
      case "Rework": return "border-crimson";
      default: return "border-greige";
    }
  }

  function getCommentaryParagraphs(commentary: string): string[] {
    return commentary
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0)
      .slice(0, 4);
  }

  function getCommentaryLabel(index: number): string {
    const labels = [
      "Decision Readiness",
      "Where Your Gaps Are",
      "What's At Risk",
      "What Needs to Be True",
    ];
    return labels[index] || "Analysis";
  }

  function getDimensionExplainer(key: string, score: number): string {
    if (score >= 60) {
      const strong: Record<string, string> = {
        audienceClarity: "You have a reasonably clear picture of who this move is for.",
        decisionValidation: "This decision has meaningful evidence behind it.",
        behavioralEvidence: "Audience input is shaping this decision.",
        messageAlignment: "Demand signals for this move are present.",
      };
      return strong[key] || "";
    }
    const weak: Record<string, string> = {
      audienceClarity: "Who this move is for hasn't been clearly defined or validated.",
      decisionValidation: "This decision lacks sufficient real-world validation.",
      behavioralEvidence: "Internal assumptions are driving this more than audience signals.",
      messageAlignment: "Demand for this move hasn't been clearly established.",
    };
    return weak[key] || "";
  }

  return (
    <div className="min-h-screen font-sans deanar-bg-paper selection:bg-camel/30 flex flex-col">
      {/* Header */}
      <header className="bg-graphite backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center w-full">
          <span className="serif font-medium text-xl text-paper tracking-[0.25em] uppercase">
            DEANAR
          </span>
          <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-paper/30">
            <ShieldCheck className="w-4 h-4 text-camel/40" />
            Private Report &mdash; {session.first_name}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-graphite backdrop-blur-md border-b border-camel/15 sticky top-[61px] z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-stretch gap-1">
          {tabs.map((tab) => {
            const isFixTab = tab.id === "fix";
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`relative transition-all duration-500 ${
                  isFixTab
                    ? "bg-crimson text-paper px-8 py-4 my-2 text-[11px] font-bold uppercase tracking-[0.2em] fix-tab-glow hover:brightness-110 active:scale-95 ml-auto"
                    : isActive
                      ? "text-paper border-b-2 border-camel px-6 py-4 text-[11px] font-bold uppercase tracking-[0.3em]"
                      : "text-paper/40 hover:text-paper/70 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.3em]"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isFixTab && <Sparkles className="w-4 h-4" />}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* TAB 1 — Your Readout */}
      {activeTab === "results" && (
        <main className="flex-grow max-w-[1400px] w-full mx-auto px-6 lg:px-10 py-16 space-y-16">

          {/* SECTION 1 — Score Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* Left — headline + 3 stat cards */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-camel/10 border border-camel/20 text-[10px] font-semibold uppercase tracking-[0.3em] text-camel">
                <ShieldCheck className="w-3 h-3" />
                Private Diagnostic Results
              </div>

              <h1 className="serif text-5xl md:text-7xl font-normal text-graphite leading-[1.1]">
                Your Audience Intelligence{" "}
                <span className="italic font-normal text-camel">
                  Score™
                </span>
              </h1>

              <p className="text-lg text-graphite/60 font-light leading-relaxed max-w-xl">
                {getScoreInterpretation(session.overall_score)}
              </p>

              {/* 3 stat cards */}
              <div className="grid grid-cols-1 gap-4">

                {/* Card 1 — Decision Readiness Band */}
                <div className="deanar-card p-6 space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/70">
                    Decision Readiness Band
                  </div>
                  <div className="serif text-2xl font-normal text-graphite">
                    {results.confidence}
                  </div>
                  <p className="text-sm font-light text-graphite/50 leading-relaxed">
                    {getReadinessBandExplainer(results.confidence)}
                  </p>
                </div>

                {/* Card 2 — Proceed Recommendation */}
                <div className={`deanar-card p-6 space-y-3 border-l-4 ${getProceedBorderColor(results.proceedRecommendation)}`}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/70">
                    Recommendation
                  </div>
                  <div className="serif text-2xl font-normal text-graphite">
                    {results.proceedRecommendation}
                  </div>
                  <p className="text-sm font-light text-graphite/50 leading-relaxed">
                    {results.proceedDetail}
                  </p>
                </div>

                {/* Card 3 — At-Risk Exposure */}
                <div className="deanar-card p-6 space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/70">
                    At-Risk Exposure
                  </div>
                  <div className="serif text-2xl font-normal text-crimson">
                    {results.metrics?.exposurePercent || 0}% of Expected Return
                  </div>
                  <p className="text-sm font-light text-graphite/50 leading-relaxed">
                    Based on your score, this portion of your expected
                    return may be exposed to underperformance if audience
                    intelligence gaps are not addressed.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Score gauge card */}
            <div className="deanar-card p-10 text-center space-y-8">
              <div className="space-y-1">
                <h3 className="serif text-2xl font-normal text-graphite">
                  Audience Intelligence Score™
                </h3>
                <p className="text-[10px] text-graphite/30 uppercase tracking-[0.4em]">
                  Decision Readiness Index
                </p>
              </div>

              <div className="flex justify-center">
                <ScoreGauge
                  score={session.overall_score}
                  size={260}
                  strokeWidth={14}
                  color="#B89F82"
                />
              </div>

              <div className="pt-6 border-t border-greige space-y-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-graphite/30">
                  At-Risk Investment Value
                </div>
                <div className="serif text-4xl font-normal text-crimson">
                  ${Math.round(results.financialImpact.expected).toLocaleString()}
                </div>
                <p className="text-[10px] text-graphite/30 italic">
                  Based on {results.aiFlags?.sizeOfPrize || "your stated prize"} at {results.metrics?.exposurePercent || 0}% exposure
                </p>
                <div className="flex justify-between text-[10px] text-graphite/20 pt-2">
                  <span>Conservative: ${Math.round(results.financialImpact.low).toLocaleString()}</span>
                  <span>Aggressive: ${Math.round(results.financialImpact.high).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 — Context Snapshot */}
          <section className="deanar-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-greige">
              <div className="py-4 md:py-0 md:px-8 first:pl-0 space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/60">
                  Move Type
                </div>
                <div className="serif text-lg text-graphite font-normal">
                  {results.aiFlags?.moveType || "Not specified"}
                </div>
              </div>
              <div className="py-4 md:py-0 md:px-8 space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/60">
                  Size of Prize
                </div>
                <div className="serif text-lg text-graphite font-normal">
                  {results.aiFlags?.sizeOfPrize || "Not specified"}
                </div>
              </div>
              <div className="py-4 md:py-0 md:px-8 space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/60">
                  Proceed Signal
                </div>
                <div className="serif text-lg text-graphite font-normal">
                  {results.proceedRecommendation}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 — Strategic Intelligence Readout (4 cards) */}
          {commentary && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 border border-camel/30 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-camel" />
                </div>
                <h2 className="serif text-3xl font-normal text-graphite">
                  Strategic Intelligence Readout
                </h2>
              </div>

              {getCommentaryParagraphs(commentary).map((para: string, i: number) => (
                <div key={i} className="deanar-card p-8 space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/60">
                    {getCommentaryLabel(i)}
                  </div>
                  <p className="text-graphite/70 leading-relaxed font-light text-base">
                    {para}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* SECTION 4 — Decision Blind Spots */}
          {results.aiFlags?.blindSpots && (
            <section className="deanar-card p-8 border-l-4 border-crimson space-y-4">
              <div className="flex items-center gap-3">
                <TriangleAlert className="w-5 h-5 text-camel flex-shrink-0" />
                <h3 className="serif text-2xl font-normal text-graphite">
                  Decision Blind Spots
                </h3>
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-crimson/10 border border-crimson/20 text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson">
                {results.aiFlags.blindSpots.severity} Severity
              </div>
              <p className="text-graphite/60 font-light leading-relaxed">
                {results.aiFlags.blindSpots.message}
              </p>
            </section>
          )}

          {/* SECTION 5 — Dimension Score Preview */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="serif text-3xl font-normal text-graphite">
                Dimension{" "}
                <span className="italic text-camel">Breakdown</span>
              </h2>
              <button
                onClick={() => {
                  setActiveTab("quadrants");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/60 hover:text-camel transition-colors flex items-center gap-2"
              >
                View Full Breakdown
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.metrics.dimensionScores || {}).map(([key, score]: [string, any]) => (
                <div key={key} className="deanar-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-camel/60">
                        {results.metrics.dimensionLabels?.[key] || key}
                      </div>
                      <div className={`text-sm font-semibold uppercase tracking-wide ${
                        score >= 60 ? "text-graphite/60" : "text-crimson/80"
                      }`}>
                        {score >= 80 ? "Strong Foundation"
                          : score >= 60 ? "Moderate — Gaps Present"
                          : score >= 40 ? "Gap Detected — Needs Attention"
                          : "Critical Gap — High Risk"}
                      </div>
                    </div>
                    <ScoreGauge score={score} size={72} strokeWidth={7} color="#B89F82" />
                  </div>
                  <p className="text-xs text-graphite/50 font-light leading-relaxed border-t border-greige pt-3">
                    {getDimensionExplainer(key, score)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6 — At-Risk Breakdown */}
          <section className="deanar-card p-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="serif text-3xl font-normal text-graphite">
                At-Risk Investment{" "}
                <span className="italic text-camel">Breakdown</span>
              </h2>
              <p className="text-sm text-graphite/40 font-light">
                Estimated exposure based on your score and size of prize.
                This represents underperformance risk, not guaranteed loss.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="p-6 bg-paper border border-greige text-center space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-graphite/30">
                  Conservative
                </div>
                <div className="serif text-2xl font-normal text-graphite/50">
                  ${Math.round(results.financialImpact.low).toLocaleString()}
                </div>
              </div>
              <div className="p-8 bg-crimson text-paper text-center space-y-2 shadow-[0_20px_40px_rgba(110,22,24,0.25)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.4em] opacity-70">
                  Expected
                </div>
                <div className="serif text-3xl font-normal">
                  ${Math.round(results.financialImpact.expected).toLocaleString()}
                </div>
              </div>
              <div className="p-6 bg-paper border border-greige text-center space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-graphite/30">
                  Aggressive
                </div>
                <div className="serif text-2xl font-normal text-graphite/50">
                  ${Math.round(results.financialImpact.high).toLocaleString()}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7 — Methodology */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="deanar-card p-8 space-y-4">
              <h3 className="serif text-2xl font-normal text-graphite">
                Confidence & Assumptions
              </h3>
              <div className="flex items-center gap-3 p-4 bg-paper border border-greige">
                <div className="w-2 h-2 bg-camel flex-shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-graphite">
                  {results.confidence} Decision Readiness
                </span>
              </div>
              <p className="text-graphite/50 text-sm leading-relaxed font-light">
                This diagnostic evaluates four dimensions of audience
                intelligence across 12 indicators. Scores reflect the
                degree to which your decision is informed by validated
                audience understanding versus assumption.
              </p>
            </div>
            <div className="deanar-card p-8 space-y-4">
              <h3 className="serif text-2xl font-normal text-graphite">
                Methodology Note
              </h3>
              <p className="text-graphite/50 text-sm leading-relaxed font-light">
                At-risk values are calculated by applying your exposure
                percentage to your stated size of prize. This is a
                strategic modeling tool — not a financial forecast.
                Actual outcomes depend on execution, market conditions,
                and how identified gaps are addressed.
              </p>
              <div className="text-[8px] font-semibold uppercase tracking-[0.2em] text-graphite/20">
                Decision Intelligence Algorithm v1.0
              </div>
            </div>
          </section>

          {/* SECTION 8 — Disclaimers */}
          <section className="text-center max-w-3xl mx-auto space-y-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.4em] text-graphite/30">
              Disclaimers
            </h4>
            <p className="text-[9px] text-graphite/25 leading-relaxed uppercase tracking-[0.1em]">
              This diagnostic is an analytical tool for strategic planning
              purposes. Results are based on provided responses and modeled
              estimates. This does not constitute professional consulting,
              market research, or investment advice.
            </p>
          </section>

          {/* SECTION 9 — CTA */}
          <CTASection onFixMyFlow={switchToFix} />

        </main>
      )}

      {/* TAB 2 — Dimension Breakdown */}
      {activeTab === "quadrants" && (
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 lg:px-12 py-20 space-y-20">
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="serif text-5xl md:text-6xl font-normal text-graphite">
                Dimension{" "}
                <span className="italic font-normal text-camel">Breakdown</span>
              </h2>
              <p className="text-lg text-graphite/50 font-light max-w-3xl mx-auto">
                A structural breakdown of where audience intelligence gaps exist
                in your decision.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {quadrants.map((q) => {
                const qData = results.quadrants[q.key];
                if (!qData) return null;
                const dimScore = qData.score ?? 0;
                const isNotEvaluated =
                  qData.score === null ||
                  qData.status === "Not Evaluated";
                const findings = typeof qData.findings === 'string'
                  ? qData.findings
                  : Array.isArray(qData.findings) ? qData.findings[0] : qData.findings;

                return (
                  <div
                    key={q.id}
                    className="deanar-card p-10 flex flex-col hover:border-camel transition-all duration-500"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-graphite border border-camel/30 flex items-center justify-center text-camel font-medium text-lg">
                            {q.id}
                          </div>
                          <div>
                            <h3 className="serif text-2xl font-medium text-graphite">
                              {q.title}
                            </h3>
                            <span
                              className={`text-[0.65rem] font-bold uppercase tracking-[0.2em] px-3 py-1 mt-2 inline-block ${
                                qData.status === "Evaluated"
                                  ? "bg-camel/10 text-camel border border-camel/20"
                                  : "bg-paper text-graphite/30 border border-greige"
                              }`}
                            >
                              {qData.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-graphite/40 text-sm leading-relaxed font-light">
                          {q.desc}
                        </p>
                      </div>
                      {isNotEvaluated ? (
                        <div
                          className="relative flex items-center justify-center flex-shrink-0 ml-4"
                          style={{ width: 130, height: 130 }}
                        >
                          <svg className="transform -rotate-90 w-full h-full">
                            <circle
                              cx={65}
                              cy={65}
                              r={55}
                              stroke="rgba(214,206,196,0.2)"
                              strokeWidth={10}
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="serif text-4xl font-medium text-graphite/20">
                              &mdash;
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 ml-4">
                          <ScoreGauge
                            score={dimScore}
                            size={130}
                            strokeWidth={10}
                            color="#B89F82"
                            textClass="text-graphite"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-6">
                      {isNotEvaluated ? (
                        <>
                          <div className="p-4 font-bold text-center border uppercase tracking-[0.2em] text-xs bg-paper text-graphite/30 border-greige">
                            Not Evaluated
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[0.65rem] font-bold text-graphite/30 uppercase tracking-[0.4em] flex items-center gap-3">
                              <Activity className="w-3 h-3" /> Dimension
                              Analysis
                            </h4>
                            <p className="text-graphite/40 text-sm leading-relaxed font-light italic">
                              This dimension was not evaluated based on your
                              current profile.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`p-4 font-bold text-center border uppercase tracking-[0.2em] text-xs ${
                              dimScore < 60
                                ? "bg-crimson/10 text-crimson border-crimson/20"
                                : "bg-camel/10 text-camel border-camel/20"
                            }`}
                          >
                            {dimScore < 60
                              ? "Intelligence Gap Detected"
                              : "Baseline Understanding Present"}
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[0.65rem] font-bold text-camel/60 uppercase tracking-[0.4em] flex items-center gap-3">
                              <Activity className="w-3 h-3" /> Dimension
                              Analysis
                            </h4>
                            <p className="serif italic text-graphite/70 text-base leading-relaxed">
                              {findings}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <CTASection onFixMyFlow={switchToFix} />
        </main>
      )}

      {/* TAB 3 — Fix My Audience Intelligence */}
      {activeTab === "fix" && (
        <WealthRedirectionContent
          firstName={session.first_name || ""}
          email={session.email || ""}
        />
      )}
    </div>
  );
}
