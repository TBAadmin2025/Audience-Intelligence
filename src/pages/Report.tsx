import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Activity, TriangleAlert, Sparkles } from "lucide-react";
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
  <section className="bg-oxblood p-16 md:p-24 text-center relative overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-10"
      style={{
        backgroundImage: `url('${diagnosticConfig.brand.motifs.theBigBet}')`,
      }}
    />
    <div className="space-y-12 relative z-10 max-w-4xl mx-auto">
      <div className="space-y-6">
        <h2 className="serif text-5xl md:text-7xl font-normal text-paper leading-tight">
          Close the Gap.
          <br />
          <span className="italic font-normal text-camel">
            Before You Move Forward.
          </span>
        </h2>
        <p className="text-lg text-paper/50 font-light max-w-2xl mx-auto leading-relaxed">
          {diagnosticConfig.copy.ctaSubheadline}
        </p>
      </div>
      <button
        onClick={onFixMyFlow}
        className="bg-crimson text-paper border border-crimson px-16 py-6 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-400 hover:bg-crimson/90 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(110,22,24,0.4)] inline-flex items-center gap-3"
      >
        {diagnosticConfig.copy.ctaButtonText}
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

  const financialImpact = results.financialImpact || { low: 0, expected: 0, high: 0 };
  const score = session.overall_score || results.score || 0;
  const readinessBand = diagnosticConfig.readinessBand(score);
  const scoreInterpretation = diagnosticConfig.scoreInterpretation(score);
  const blindSpots = results.aiFlags?.blindSpots;
  const moveType = results.aiFlags?.moveType || "Not specified";
  const expectedOutcome = results.aiFlags?.expectedOutcome || "Not specified";
  const investmentSize = results.aiFlags?.investmentSize || "Not specified";
  const exposurePercent = results.aiFlags?.exposurePercent || 0;
  const investmentMidpoint = results.metrics?.investmentMidpoint || 0;

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
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 lg:px-12 py-20 space-y-20">
          {/* Score Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-camel/10 border border-camel/20 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-camel">
                Your Audience Intelligence Readout
              </div>
              <h1 className="serif text-5xl md:text-7xl font-normal text-graphite leading-[1.1]">
                Your Audience Intelligence{" "}
                <span className="italic font-normal text-camel">Score&trade;</span>
              </h1>
              <p className="text-xl text-graphite/70 font-light leading-relaxed max-w-xl">
                {scoreInterpretation}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="deanar-card p-8 space-y-3">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/60">
                    Decision Readiness Band
                  </div>
                  <div className="text-2xl serif font-medium text-graphite">
                    {readinessBand}
                  </div>
                </div>
                <div className="deanar-card p-8 space-y-3">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/60">
                    Intelligence Confidence
                  </div>
                  <div className="text-2xl serif font-medium text-graphite">
                    {readinessBand}
                  </div>
                </div>
              </div>
            </div>

            {/* Gauge Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="deanar-card-shadow p-12 w-full max-w-md text-center space-y-8">
                <div className="space-y-2">
                  <h3 className="serif text-2xl font-medium text-graphite">
                    Audience Intelligence Score&trade;
                  </h3>
                  <p className="text-[0.65rem] text-camel/30 uppercase tracking-[0.4em]">
                    Decision Readiness Index
                  </p>
                </div>
                <div className="flex justify-center py-4">
                  <ScoreGauge
                    score={score}
                    size={300}
                    strokeWidth={14}
                    color="#B89F82"
                    textClass="text-graphite"
                  />
                </div>
                <div className="pt-8 border-t border-greige space-y-4">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/30 block">
                    At-Risk Investment Value&trade;
                  </span>
                  <span className="text-4xl serif font-medium text-crimson block">
                    ${Math.round(financialImpact.expected).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-graphite/20 italic block">
                    Exposure Range: $
                    {Math.round(financialImpact.low).toLocaleString()} &mdash; $
                    {Math.round(financialImpact.high).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Context Snapshot */}
          <section className="deanar-card p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-6 space-y-3">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/60">
                  Move Type
                </div>
                <div className="serif text-xl text-graphite">{moveType}</div>
              </div>
              <div className="p-6 space-y-3 border-x border-greige">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/60">
                  Expected Outcome
                </div>
                <div className="serif text-xl text-graphite">
                  {expectedOutcome}
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/60">
                  Investment Size
                </div>
                <div className="serif text-xl text-graphite">
                  {investmentSize}
                </div>
              </div>
            </div>
          </section>

          {/* AI Strategic Interpretation */}
          {commentary && (
            <section className="deanar-card p-12 md:p-16 relative overflow-hidden">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-camel/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-camel" />
                  </div>
                  <h2 className="serif text-3xl font-medium text-graphite">
                    Strategic Intelligence Readout
                  </h2>
                </div>
                <p className="serif italic text-graphite/70 leading-relaxed whitespace-pre-wrap text-xl md:text-2xl">
                  {commentary}
                </p>
              </div>
            </section>
          )}

          {/* Blind Spot Signal */}
          {blindSpots && (
            <section className="deanar-signal-card p-10">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-camel/10">
                  <TriangleAlert className="w-6 h-6 text-camel" />
                </div>
                <div className="space-y-4">
                  <h3 className="serif text-2xl font-medium text-graphite">
                    Decision Blind Spots
                  </h3>
                  <span
                    className={`text-[0.65rem] font-bold uppercase tracking-[0.2em] px-3 py-1 inline-block ${
                      blindSpots.severity === "High"
                        ? "bg-crimson/10 text-crimson border border-crimson/20"
                        : blindSpots.severity === "Elevated"
                          ? "bg-crimson/10 text-crimson border border-crimson/20"
                          : "bg-camel/10 text-camel border border-camel/20"
                    }`}
                  >
                    {blindSpots.severity} Severity
                  </span>
                  <p className="text-graphite/60 text-base leading-relaxed font-light">
                    {blindSpots.message}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* At-Risk Breakdown */}
          <section className="deanar-card p-10 md:p-16">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                <h2 className="serif text-4xl font-normal text-graphite">
                  At-Risk Investment{" "}
                  <span className="italic font-normal text-camel">
                    Breakdown
                  </span>
                </h2>
                <p className="text-base text-graphite/40 font-light">
                  Estimated exposure based on your score and investment size.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-8 items-center">
                <div className="p-6 md:p-10 bg-paper border border-greige space-y-3 text-center">
                  <div className="text-[9px] md:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-graphite/30">
                    Conservative
                  </div>
                  <div className="text-lg md:text-2xl serif font-medium text-graphite/60">
                    ${Math.round(financialImpact.low).toLocaleString()}
                  </div>
                </div>
                <div className="p-8 md:p-12 bg-crimson text-paper space-y-3 text-center shadow-[0_20px_40px_rgba(110,22,24,0.25)]">
                  <div className="text-[9px] md:text-[0.65rem] font-bold uppercase tracking-[0.3em] text-paper/60">
                    Expected
                  </div>
                  <div className="text-2xl md:text-4xl serif font-bold">
                    ${Math.round(financialImpact.expected).toLocaleString()}
                  </div>
                </div>
                <div className="p-6 md:p-10 bg-paper border border-greige space-y-3 text-center">
                  <div className="text-[9px] md:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-graphite/30">
                    Aggressive
                  </div>
                  <div className="text-lg md:text-2xl serif font-medium text-graphite/60">
                    ${Math.round(financialImpact.high).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Confidence & Methodology */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="deanar-card p-10 space-y-6">
              <h3 className="serif text-2xl font-medium text-graphite">
                Confidence & Assumptions
              </h3>
              <div className="flex items-center gap-4 p-4 bg-paper border border-greige">
                <div className="w-3 h-3 bg-camel shadow-[0_0_10px_rgba(184,159,130,0.5)]" />
                <span className="text-[0.65rem] font-bold text-graphite uppercase tracking-[0.3em]">
                  {readinessBand} Decision Readiness
                </span>
              </div>
              <p className="text-graphite/50 text-sm leading-relaxed font-light">
                This diagnostic uses your provided inputs to model decision
                readiness based on audience intelligence indicators. Higher
                scores indicate stronger evidence-based decision foundations.
              </p>
            </div>
            <div className="deanar-card p-10 space-y-6">
              <h3 className="serif text-2xl font-medium text-graphite">
                Methodology Note
              </h3>
              <p className="text-graphite/50 text-sm leading-relaxed font-light">
                This diagnostic evaluates four dimensions of audience
                intelligence across 12 indicators. Scores reflect the degree to
                which your decision is informed by validated audience
                understanding versus assumption.
              </p>
              <div className="pt-4 flex items-center gap-6 opacity-30">
                <div className="text-[8px] font-bold uppercase tracking-[0.2em]">
                  Decision Intelligence Algorithm v1.0
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-graphite/40">
              Disclaimers
            </h4>
            <p className="text-[9px] text-graphite/30 leading-relaxed uppercase tracking-[0.1em] max-w-2xl mx-auto">
              This diagnostic is an analytical tool for strategic planning and
              does not constitute professional consulting advice. At-risk
              investment values represent estimated exposure, not guaranteed
              outcomes. Final strategy recommendations require deeper
              engagement.
            </p>
          </section>

          {/* CTA */}
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
                const findings = Array.isArray(qData.findings)
                  ? qData.findings[0]
                  : qData.findings;

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
