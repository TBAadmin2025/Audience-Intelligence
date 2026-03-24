import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Activity, TriangleAlert, TrendingUp, Sparkles } from "lucide-react";
import { WealthRedirectionContent } from "../components/WealthRedirectionContent";
import { diagnosticConfig } from "../client/config";

const ScoreGauge = ({ score, size = 200, strokeWidth = 12, color = "var(--color-accent)" }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="transparent" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="serif text-5xl md:text-7xl font-medium text-marble">{score}</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold-metallic/40 mt-1">Score</span>
      </div>
    </div>
  );
};

const CTASection = ({ onFixMyFlow }: { onFixMyFlow: () => void }) => (
  <section className="bg-gradient-to-br from-navy-deep to-midnight border border-gold-metallic/20 rounded-sm shadow-2xl p-24 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
    <div className="space-y-12 relative z-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-4 px-6 py-2 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic">
          Strategic Next Step
        </div>
        <h2 className="serif text-6xl md:text-8xl font-medium text-marble leading-tight">
          {diagnosticConfig.copy.ctaHeadline} <br /> <span className="italic text-gold-gradient">Secure Your Future.</span>
        </h2>
        <p className="text-2xl text-marble/50 font-light max-w-3xl mx-auto leading-relaxed">
          {diagnosticConfig.copy.ctaSubheadline}
        </p>
      </div>
      <button
        onClick={onFixMyFlow}
        className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-24 py-10 rounded-sm text-2xl font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-[0_30px_60px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
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
      <div className="min-h-screen vlari-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 border-2 border-gold-metallic/30 border-t-gold-metallic rounded-full animate-spin mx-auto" />
          <p className="text-marble/50 text-sm uppercase tracking-[0.3em]">Loading Report</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen vlari-bg flex items-center justify-center">
        <div className="artisan-card p-16 text-center space-y-8 max-w-lg">
          <h1 className="serif text-4xl text-marble">Report Not Found</h1>
          <p className="text-marble/50 font-light">{error || "This diagnostic session could not be located."}</p>
        </div>
      </div>
    );
  }

  const results = session.calculated_scores;
  const commentary = session.ai_commentary;

  if (!results) {
    return (
      <div className="min-h-screen vlari-bg flex items-center justify-center">
        <div className="artisan-card p-16 text-center space-y-8 max-w-lg">
          <h1 className="serif text-4xl text-marble">Report Pending</h1>
          <p className="text-marble/50 font-light">This diagnostic is still in progress. Please check back shortly.</p>
        </div>
      </div>
    );
  }

  // Support both old (totalOpportunity) and new (financialImpact) result shapes
  const financialImpact = results.financialImpact || results.totalOpportunity;

  const quadrants = diagnosticConfig.quadrants.map((q, i) => ({
    id: i + 1,
    title: q.name,
    key: q.key,
    color: i % 2 === 0 ? diagnosticConfig.brand.accentColor : diagnosticConfig.brand.accentSecondary,
    desc: q.description,
  }));

  const getOpportunityBand = (val: number) => {
    if (val < 50000) return "Controlled";
    if (val < 150000) return "Moderate";
    if (val < 350000) return "Elevated";
    return "Significant";
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return "Your financial structure shows relatively strong efficiency with targeted optimization opportunities.";
    if (score >= 50) return "Detectable structural inefficiencies are likely reducing wealth retention.";
    return "Your current structure suggests elevated wealth leakage and optimization gaps.";
  };

  const getTaxDragInterpretation = (ratio: number) => {
    if (ratio < 0.15) return "Low Drag";
    if (ratio < 0.25) return "Normal";
    if (ratio < 0.35) return "Elevated";
    return "High Pressure";
  };

  // Support both old and new metric locations
  const taxDragRatio = results.metrics?.taxDragRatio ?? results.taxDragRatio;
  const effectiveRate = results.metrics?.effectiveRate ?? results.effectiveRate;
  const baselineFedTax = results.metrics?.baselineFedTax ?? results.baselineFedTax;
  const entitySignal = results.aiFlags?.entitySignal ?? results.entitySignal;

  const tabs: { id: Tab; label: string }[] = [
    { id: "results", label: diagnosticConfig.copy.tabs.summary },
    { id: "quadrants", label: diagnosticConfig.copy.tabs.breakdown },
    { id: "fix", label: diagnosticConfig.copy.tabs.action },
  ];

  return (
    <div className="min-h-screen font-sans vlari-bg selection:bg-gold-metallic/30 flex flex-col">
      {/* Header */}
      <header className="bg-midnight/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-10 py-6 flex justify-between items-center w-full">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gold-metallic rounded-sm flex items-center justify-center mr-4 shadow-2xl">
              <span className="text-midnight font-serif font-bold text-lg">{diagnosticConfig.brand.appName[0]}</span>
            </div>
            <span className="serif font-medium text-xl text-marble tracking-[0.2em] uppercase">{diagnosticConfig.brand.appName}</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-marble/30">
            <ShieldCheck className="w-4 h-4 text-gold-metallic/40" />
            Private Report — {session.first_name} {session.last_name}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-midnight/80 backdrop-blur-md border-b border-gold-metallic/15 border-t border-t-white/5 sticky top-[73px] z-40 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-[1400px] mx-auto px-10 flex items-stretch gap-1">
          {tabs.map((tab) => {
            const isFixTab = tab.id === "fix";
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`relative transition-all duration-500 ${
                  isFixTab
                    ? "bg-[#C9A84C] text-midnight px-10 py-5 my-3 text-[12px] font-extrabold uppercase tracking-[0.25em] rounded-sm fix-tab-glow hover:brightness-110 active:scale-95 ml-auto"
                    : isActive
                      ? "text-white border-b-2 border-gold-metallic px-8 py-5 text-[11px] font-bold uppercase tracking-[0.3em]"
                      : "text-marble/40 hover:text-marble/70 px-8 py-5 text-[11px] font-bold uppercase tracking-[0.3em]"
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

      {/* TAB 1 — Your Results */}
      {activeTab === "results" && (
        <main className="flex-grow max-w-[1400px] w-full mx-auto px-10 py-24 space-y-32">
          {/* Score Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="inline-flex items-center gap-4 px-6 py-2 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic">
                <ShieldCheck className="w-4 h-4" /> Private Diagnostic Results
              </div>
              <h1 className="serif text-6xl md:text-8xl font-medium text-marble leading-[1.1]">
                Your Wealth <br/><span className="italic text-gold-gradient">Redirection Score™</span>
              </h1>
              <p className="text-2xl text-marble/50 font-light leading-relaxed max-w-2xl">
                {getScoreInterpretation(session.overall_score)} We have identified structural opportunities to redirect capital back into your control.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="artisan-card p-8 space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Opportunity Band</div>
                  <div className="text-3xl serif font-medium text-marble">{getOpportunityBand(financialImpact.expected)}</div>
                </div>
                <div className="artisan-card p-8 space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Confidence Level</div>
                  <div className="text-3xl serif font-medium text-marble">{results.confidence}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-gold-metallic/10 blur-[120px] rounded-full"></div>
              <div className="artisan-card p-16 w-full max-w-lg text-center space-y-10 relative z-10">
                <div className="space-y-2">
                  <h3 className="serif text-3xl font-medium text-marble">Wealth Redirection Score™</h3>
                  <p className="text-[10px] text-marble/30 uppercase tracking-[0.4em]">Structural Efficiency Index</p>
                </div>
                <div className="flex justify-center py-4">
                  <ScoreGauge score={session.overall_score} size={320} strokeWidth={16} />
                </div>
                <div className="pt-10 border-t border-white/5 space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-marble/30">Annual Redirection Potential</span>
                    <span className="text-4xl md:text-5xl serif font-medium text-gold-gradient">${Math.round(financialImpact.expected).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-marble/20 italic tracking-widest">
                    Modeled Range: ${Math.round(financialImpact.low).toLocaleString()} — ${Math.round(financialImpact.high).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tax Profile Snapshot */}
          <section className="bg-navy-deep/40 backdrop-blur-md border border-white/5 rounded-sm p-16 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="space-y-4 overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Modeled Federal Tax (2026)</div>
                <div className="text-sm sm:text-2xl md:text-3xl serif font-medium text-marble truncate">${Math.round(baselineFedTax).toLocaleString()}</div>
                <p className="text-[10px] text-marble/20 tracking-widest uppercase">Estimated Exposure</p>
              </div>
              <div className="space-y-4 border-x border-white/5 px-8 overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Tax Drag Ratio</div>
                <div className="text-sm sm:text-2xl md:text-3xl serif font-medium text-marble">{Math.round(taxDragRatio * 100)}%</div>
                <p className="text-[10px] text-marble/20 tracking-widest uppercase">{getTaxDragInterpretation(taxDragRatio)}</p>
              </div>
              <div className="space-y-4 overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Effective Tax Rate</div>
                <div className="text-sm sm:text-2xl md:text-3xl serif font-medium text-marble">{Math.round(effectiveRate * 100)}%</div>
                <p className="text-[10px] text-marble/20 tracking-widest uppercase">Blended Exposure</p>
              </div>
            </div>
          </section>

          {/* AI Strategic Interpretation */}
          {commentary && (
            <section className="artisan-card p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <TrendingUp className="w-64 h-64 text-gold-metallic" />
              </div>
              <div className="space-y-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm flex items-center justify-center">
                    <Activity className="w-5 h-5 text-gold-metallic" />
                  </div>
                  <h2 className="serif text-4xl font-medium text-marble">Strategic Interpretation</h2>
                </div>
                <p className="text-marble/70 leading-relaxed space-y-6 whitespace-pre-wrap italic font-light text-xl md:text-2xl">
                  {commentary}
                </p>
              </div>
            </section>
          )}

          {/* Entity Signal */}
          {entitySignal && (
            <section className="artisan-card p-12 border-l-4 border-gold-metallic">
              <div className="flex items-start gap-8">
                <div className="p-4 bg-gold-metallic/10 rounded-sm">
                  <TriangleAlert className="w-8 h-8 text-gold-metallic" />
                </div>
                <div className="space-y-4">
                  <h3 className="serif text-3xl font-medium text-marble">Entity Redirection Signal</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-sm ${
                      entitySignal.severity === "High" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-gold-metallic/20 text-gold-metallic border border-gold-metallic/30"
                    }`}>
                      {entitySignal.severity} Severity Mismatch
                    </span>
                  </div>
                  <p className="text-marble/60 text-lg leading-relaxed font-light">
                    {entitySignal.message}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Total Redirection Potential */}
          <section className="artisan-card p-12 md:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-metallic/5 via-transparent to-transparent opacity-50"></div>
            <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
              <div className="space-y-6">
                <h2 className="serif text-5xl font-medium text-marble">Total Redirection <span className="italic text-gold-gradient">Potential</span></h2>
                <p className="text-xl text-marble/40 font-light tracking-wide">The aggregate value of identified structural inefficiencies.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-12 items-center">
                <div className="p-4 md:p-10 bg-white/5 border border-white/5 rounded-sm space-y-3 overflow-hidden text-center">
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-marble/30">Conservative</div>
                  <div className="text-sm md:text-2xl lg:text-3xl serif font-medium text-marble/60 truncate">${Math.round(financialImpact.low).toLocaleString()}</div>
                </div>
                <div className="p-6 md:p-14 bg-gradient-to-br from-gold-antique to-gold-metallic text-midnight rounded-sm shadow-[0_30px_60px_rgba(170,124,17,0.3)] space-y-3 overflow-hidden text-center">
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60">Expected Annual</div>
                  <div className="text-lg md:text-4xl lg:text-5xl serif font-bold truncate">${Math.round(financialImpact.expected).toLocaleString()}</div>
                </div>
                <div className="p-4 md:p-10 bg-white/5 border border-white/5 rounded-sm space-y-3 overflow-hidden text-center">
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-marble/30">Aggressive</div>
                  <div className="text-sm md:text-2xl lg:text-3xl serif font-medium text-marble/60 truncate">${Math.round(financialImpact.high).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Confidence & Methodology */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="artisan-card p-12 space-y-8">
              <h3 className="serif text-3xl font-medium text-marble">Confidence & Assumptions</h3>
              <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-sm">
                <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)] ${results.confidence === "High" ? "bg-gold-metallic" : "bg-gold-antique"}`} />
                <span className="text-[10px] font-bold text-marble uppercase tracking-[0.3em]">{results.confidence} Confidence Level</span>
              </div>
              <p className="text-marble/50 text-base leading-relaxed font-light">
                This diagnostic uses your provided inputs to model structural outcomes. Higher confidence scores indicate more complete data points across income, entity, and tax clarity. Ranges are adjusted based on data certainty.
              </p>
            </div>
            <div className="artisan-card p-12 space-y-8">
              <h3 className="serif text-3xl font-medium text-marble">Methodology Panel</h3>
              <p className="text-marble/50 text-base leading-relaxed font-light">
                This diagnostic applies 2026 federal tax parameters, progressive tax modeling, and structural efficiency algorithms to estimate potential tax savings and wealth redirection opportunities.
              </p>
              <div className="pt-4 flex items-center gap-6 opacity-30">
                <div className="text-[8px] font-bold uppercase tracking-[0.2em]">Algorithm v4.2.0</div>
                <div className="text-[8px] font-bold uppercase tracking-[0.2em]">Tax Code 2026-Ready</div>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="text-center max-w-4xl mx-auto space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-marble/40">Disclaimers</h4>
            <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-[0.1em] max-w-2xl mx-auto">
              Estimates based on provided inputs. Final outcomes require document review. Strategy eligibility varies by jurisdiction and specific financial circumstances. This is a diagnostic tool for structural analysis and does not constitute formal tax, legal, or investment advice.
            </p>
          </section>

          {/* CTA */}
          <CTASection onFixMyFlow={switchToFix} />
        </main>
      )}

      {/* TAB 2 — Quadrant Diagnostics */}
      {activeTab === "quadrants" && (
        <main className="flex-grow max-w-[1400px] w-full mx-auto px-10 py-24 space-y-32">
          <section className="space-y-16">
            <div className="text-center space-y-6">
              <h2 className="serif text-5xl md:text-7xl font-medium text-marble">Quadrant <span className="italic text-gold-gradient">Diagnostics</span></h2>
              <p className="text-2xl text-marble/50 font-light max-w-3xl mx-auto leading-relaxed">
                A structural breakdown of where wealth is leaking from your current financial structure.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {quadrants.map((q) => {
                const qData = results.quadrants[q.key];
                const isNotEvaluated = qData.score === null || qData.status === "Not Evaluated";
                // Support both old (low/expected/high) and new (opportunity.low/expected/high) shapes
                const opp = qData.opportunity || qData;
                const findings = Array.isArray(qData.findings) ? qData.findings[0] : qData.findings;
                return (
                <div key={q.id} className="artisan-card p-12 flex flex-col hover:shadow-[0_0_60px_rgba(170,124,17,0.1)] transition-all duration-700 group">
                  <div className="flex items-start justify-between mb-10">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-midnight border border-gold-metallic/30 rounded-full flex items-center justify-center text-gold-metallic font-medium text-2xl shadow-2xl group-hover:border-gold-metallic transition-colors">{q.id}</div>
                        <div>
                          <h3 className="serif text-3xl font-medium text-marble">{q.title}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-sm mt-2 inline-block ${
                            qData.status === "Evaluated" ? "bg-gold-metallic/10 text-gold-metallic border border-gold-metallic/20" :
                            "bg-white/5 text-marble/30 border border-white/10"
                          }`}>
                            {qData.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-marble/40 text-sm leading-relaxed font-light">{q.desc}</p>
                    </div>
                    {isNotEvaluated ? (
                      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
                        <svg className="transform -rotate-90 w-full h-full">
                          <circle cx={70} cy={70} r={60} stroke="rgba(255,255,255,0.05)" strokeWidth={10} fill="transparent" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="serif text-5xl font-medium text-marble/20">—</span>
                        </div>
                      </div>
                    ) : (
                      <ScoreGauge score={qData.score} size={140} strokeWidth={10} color={q.color} />
                    )}
                  </div>
                  <div className="flex-1 space-y-10">
                    {isNotEvaluated ? (
                      <>
                        <div className="p-6 rounded-sm font-bold text-center border uppercase tracking-[0.2em] text-xs bg-white/5 text-marble/30 border-white/10">
                          Not Evaluated
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-bold text-marble/30 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Activity className="w-3 h-3" /> Diagnostic Commentary
                          </h4>
                          <p className="text-marble/40 text-base leading-relaxed font-light italic">
                            This area was not evaluated based on your current profile. Your strategy session will assess this in full context.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`p-6 rounded-sm font-bold text-center border uppercase tracking-[0.2em] text-xs ${qData.score < 60 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-gold-metallic/10 text-gold-metallic border-gold-metallic/20"}`}>
                          {qData.score < 60 ? "Critical Optimization Needed" : "Foundation Secured"}
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-bold text-gold-metallic/60 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Activity className="w-3 h-3" /> Diagnostic Commentary
                          </h4>
                          <p className="text-marble/70 text-base leading-relaxed font-light italic">
                            {findings}
                          </p>
                        </div>
                        <div className="pt-8 border-t border-white/5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-marble/20 mb-4">
                            <span>Wealth Impact</span>
                            <span>Capture Potential</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-marble/40 text-xs tracking-widest">${Math.round(opp.low).toLocaleString()} — ${Math.round(opp.high).toLocaleString()}</span>
                            <span className="text-3xl serif font-medium text-marble">${Math.round(opp.expected).toLocaleString()}</span>
                          </div>
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

      {/* TAB 3 — Fix My Flow */}
      {activeTab === "fix" && (
        <WealthRedirectionContent
          firstName={session.first_name || ""}
          email={session.email || ""}
        />
      )}

      {/* Pulse glow animation for Redirect My Wealth tab */}
      <style>{`
        .fix-tab-glow {
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.4), 0 0 40px rgba(201, 168, 76, 0.15);
          animation: fixGlow 2s ease-in-out infinite;
        }
        @keyframes fixGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 168, 76, 0.4), 0 0 40px rgba(201, 168, 76, 0.15); }
          50% { box-shadow: 0 0 35px rgba(201, 168, 76, 0.7), 0 0 60px rgba(201, 168, 76, 0.35); }
        }
      `}</style>
    </div>
  );
}
