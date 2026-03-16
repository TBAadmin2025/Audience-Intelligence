import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ShieldCheck, ArrowRight, Lock, Activity, TriangleAlert, TrendingUp, Video, Calculator 
} from "lucide-react";
import { runDiagnostic, DiagnosticAnswers } from "./lib/opportunityEngine";

// ==========================================
// INLINED VLARI UI COMPONENTS
// ==========================================
const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full h-1 bg-white/5 relative z-50">
      <motion.div 
        className="h-full bg-gold-gradient"
        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

const QuestionCard = ({ question, options, onSelect, value }: any) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <h2 className="font-serif text-4xl md:text-6xl text-[#EBE6DF] leading-tight font-normal">
        {question}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {options.map((opt: string, idx: number) => (
          <motion.button
            key={opt}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(opt)}
            className={`w-full text-left p-6 md:p-8 rounded-sm border transition-all duration-300 flex items-center justify-between group ${
              value === opt ? "bg-[#D4AF37]/10 border-[#D4AF37]" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/50"
            }`}
          >
            <span className={`text-lg md:text-xl font-light tracking-wide ${value === opt ? "text-[#D4AF37]" : "text-[#EBE6DF]"}`}>
              {opt}
            </span>
            <div className={`w-4 h-4 rounded-full border flex-shrink-0 transition-colors ${
              value === opt ? "border-[#D4AF37] bg-[#D4AF37]" : "border-white/20 group-hover:border-[#D4AF37]/50"
            }`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const ProcessingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: "Initializing Redirection", sub: "Establishing secure 256-bit connection..." },
    { label: "Parsing Financial Footprint", sub: "Analyzing income flow and entity structure..." },
    { label: "Running Tax Drag Simulation", sub: "Modeling 2026 progressive tax impact..." },
    { label: "Optimizing Wealth Vehicles", sub: "Identifying redirection capture points..." },
    { label: "Finalizing Private Report", sub: "Synthesizing strategic interpretation..." }
  ];

  useEffect(() => {
    const totalDuration = 30000; // 30 seconds
    const interval = 100;
    const increment = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepDuration = 30000 / steps.length;
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepDuration);
    return () => clearInterval(stepTimer);
  }, [steps.length]);

  return (
    <div className="min-h-screen vlari-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-[0.05] mix-blend-overlay"></div>
      
      <div className="relative z-10 w-full max-w-2xl text-center space-y-16">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gold-metallic/10 blur-[80px] rounded-full"></div>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
              <motion.circle 
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gold-metallic"
                strokeDasharray={553} initial={{ strokeDashoffset: 553 }} animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl serif font-medium text-marble">{Math.round(progress)}%</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold-metallic/50">Processing</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <h2 className="serif text-4xl md:text-5xl text-marble font-normal">{steps[currentStep].label}</h2>
              <p className="text-gold-metallic/60 text-sm font-bold uppercase tracking-[0.3em]">{steps[currentStep].sub}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 w-8 rounded-full transition-all duration-700 ${i <= currentStep ? "bg-gold-metallic shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-white/10"}`} />
            ))}
          </div>
        </div>

        <div className="pt-12 flex items-center justify-center gap-8 opacity-30">
          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-marble"><Lock className="w-3 h-3 text-gold-metallic" /> Encrypted Analysis</div>
          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-marble"><ShieldCheck className="w-3 h-3 text-gold-metallic" /> Secure 256-Bit</div>
        </div>
      </div>
    </div>
  );
};

const ScoreGauge = ({ score, size = 200, strokeWidth = 12, color = "#D4AF37" }: any) => {
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

// ==========================================
// MAIN APP COMPONENT (PRESERVING YOUR LOGIC)
// ==========================================
type Step = "intro" | "questions" | "contact" | "processing" | "results";

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({});
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [results, setResults] = useState<any>(null);
  const [commentary, setCommentary] = useState("");
  const [loading, setLoading] = useState(false);

  // YOUR ORIGINAL QUESTIONS
  const questions = [
    { id: "filingStatus", q: "What’s your tax filing status?", options: ["Single", "Married Filing Jointly", "Head of Household", "Married Filing Separately"] },
    { id: "incomeRange", q: "Which range best reflects your approximate annual income?", options: ["Under $250,000", "$250,000 – $500,000", "$500,000 – $1M", "$1M – $3M", "$3M – $10M", "$10M+"] },
    { id: "taxesPaidRange", q: "Approximately how much did you pay in total taxes last year?", options: ["Less than $75,000", "$75,000 – $150,000", "$150,000 – $300,000", "$300,000 – $600,000", "$600,000 – $1.2M", "More than $1.2M", "I’m not sure"] },
    { id: "ownsBusiness", q: "Do you own a business or businesses?", options: ["Yes", "No"] },
    { id: "businessTaxType", q: "How is your primary business taxed?", options: ["Sole proprietor / Single-member LLC", "Partnership / Multi-member LLC", "S-Corporation", "C-Corporation", "Not sure"], condition: (a: any) => a.ownsBusiness === "Yes" },
    { id: "businessProfitRange", q: "Which range best reflects your business’s annual net profit?", options: ["Under $100,000", "$100,000 – $250,000", "$250,000 – $750,000", "$750,000 – $2M", "$2M+", "Not sure"], condition: (a: any) => a.ownsBusiness === "Yes" },
    { id: "subjectToSE", q: "Is any of your income subject to self-employment tax?", options: ["Yes", "No", "Not sure"] },
    { id: "runningPayroll", q: "Are you currently running payroll for yourself?", options: ["Yes", "No", "Not applicable"] },
    { id: "ownerSalary", q: "What is your approximate annual owner salary?", options: ["$0", "Under $50,000", "$50,000 – $150,000", "$150,000 – $300,000", "$300,000+", "Not applicable"], condition: (a: any) => a.ownsBusiness === "Yes" },
    { id: "contributesRetirement", q: "Do you actively contribute to retirement accounts?", options: ["Yes", "No"] },
    { id: "strategyReviewed", q: "Has your tax strategy been proactively reviewed in the last 12 months?", options: ["Yes", "No"] },
    { id: "usingAdvancedStrategies", q: "Are you currently using advanced tax-reduction strategies beyond standard deductions?", options: ["Yes", "No", "Not sure"] },
    { id: "ownsAssets", q: "Do you own investment or income-producing assets?", options: ["Yes", "No"] },
    { id: "offersBenefits", q: "If you have employees — do you offer benefits?", options: ["Yes", "No", "No employees"] },
    { id: "highInsuranceCosts", q: "Would you consider your insurance/protection costs high? (~$50k+)", options: ["Yes", "No", "Not sure"] },
    { id: "developingIP", q: "Does your business involve developing IP, systems, or processes?", options: ["Yes", "No", "Not sure"] },
    { id: "wealthRedirectPreference", q: "If you legally reduced your tax burden, where would you prefer that capital redirected?", options: ["Investments", "Asset acquisition", "Liquidity / cash flow", "Wealth preservation"] },
  ];

  const activeQuestions = questions.filter(q => !q.condition || q.condition(answers));

  // YOUR ORIGINAL LOGIC
  const handleAnswer = (val: string) => {
    const qId = activeQuestions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [qId]: val }));
    // Added a slight delay for UI polish before advancing
    setTimeout(() => {
      if (currentQuestion < activeQuestions.length - 1) setCurrentQuestion(prev => prev + 1);
      else setStep("contact");
    }, 400);
  };

  // YOUR ORIGINAL API CALLS
  const generateResults = async () => {
    setLoading(true);
    const diagnosticInput: DiagnosticAnswers = {
      ...answers,
      ownsBusiness: answers.ownsBusiness === "Yes",
      subjectToSE: answers.subjectToSE === "Yes",
      runningPayroll: answers.runningPayroll === "Yes",
      contributesRetirement: answers.contributesRetirement === "Yes",
      strategyReviewed: answers.strategyReviewed === "Yes",
      usingAdvancedStrategies: answers.usingAdvancedStrategies === "Yes",
      ownsAssets: answers.ownsAssets === "Yes",
      offersBenefits: answers.offersBenefits === "Yes",
      highInsuranceCosts: answers.highInsuranceCosts === "Yes",
      developingIP: answers.developingIP === "Yes",
      ownerSalary: answers.ownerSalary || "Not applicable",
    } as DiagnosticAnswers;

    const res = runDiagnostic(diagnosticInput);
    setResults(res);

    try {
      await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: diagnosticInput, contact, results: res })
      });
      const aiRes = await fetch("/api/ai-commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: res, profile: answers })
      });
      const aiData = await aiRes.json();
      setCommentary(aiData.commentary);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setStep("processing"); }
  };

  // --- RENDERS ---

  if (step === "intro") {
    return (
      <div className="font-sans vlari-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#121E38]/30 via-[#0A111F]/90 to-[#0A111F]"></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-16 relative z-10 max-w-5xl w-full">
          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-[0.15em] uppercase text-gold-gradient drop-shadow-2xl">Vlari</h1>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-60"></div>
          </div>

          <div className="space-y-8 artisan-card p-12 md:p-20 border-none shadow-none bg-transparent">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] opacity-80 mb-4">Strategic Wealth Diagnostic</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] font-normal text-[#EBE6DF]">
              Instead of paying the IRS, <br/><span className="italic text-gold-gradient">pay you.</span>
            </h2>
            <p className="text-lg md:text-xl text-[#EBE6DF]/70 font-light max-w-2xl mx-auto leading-relaxed pt-6">
              We restructure how your income hits your tax return—so more of what you’re currently sending to the IRS is redirected into vehicles you own.
            </p>
          </div>

          <div className="pt-4">
            <button onClick={() => setStep("questions")} className="group px-14 py-6 btn-primary text-[11px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 mx-auto rounded-sm">
              Begin Diagnostic <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-16 opacity-40">
             <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#EBE6DF]"><Lock className="w-3 h-3 text-[#D4AF37]" /> Secure Redirection</div>
             <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#EBE6DF]"><ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> Private Encryption</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="min-h-screen font-sans vlari-bg flex flex-col relative overflow-hidden">
        <ProgressBar current={currentQuestion + 1} total={activeQuestions.length} />
        
        <header className="p-8 md:p-12 flex justify-between items-center relative z-10 border-b border-white/5">
          <div className="flex items-center">
            <span className="font-serif font-medium text-2xl text-gold-gradient tracking-widest uppercase">Vlari</span>
          </div>
          <div className="flex items-center gap-3 text-[#EBE6DF]/40 text-[9px] font-bold uppercase tracking-[0.4em]">
            <Activity className="w-3 h-3 text-[#D4AF37]/50" />
            Section 0{Math.floor(currentQuestion / 3) + 1}
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full py-12 px-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <QuestionCard 
                question={activeQuestions[currentQuestion].q}
                options={activeQuestions[currentQuestion].options}
                onSelect={handleAnswer}
                value={answers[activeQuestions[currentQuestion].id as keyof DiagnosticAnswers]}
              />
              
              <div className="mt-24 flex items-center justify-between max-w-4xl mx-auto border-t border-white/5 pt-8">
                <button 
                  onClick={() => currentQuestion > 0 ? setCurrentQuestion(prev => prev - 1) : setStep("intro")} 
                  className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.4em] text-[#EBE6DF]/30 hover:text-[#D4AF37] transition-all group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#EBE6DF]/10 hidden md:block">
                  Diagnostic Module v3.0
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (step === "contact") {
    return (
      <div className="min-h-screen font-sans vlari-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="artisan-card max-w-2xl w-full p-10 md:p-16 space-y-12 relative z-10 rounded-sm">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-sm flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#EBE6DF]">Secure Your <span className="italic text-gold-gradient">Analysis</span></h2>
            <p className="text-base text-[#EBE6DF]/60 font-light leading-relaxed px-4">
              Your structural footprint has been logged. Provide your details below to generate your private wealth redirection report.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); generateResults(); }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80 ml-1">First Name</label>
                <input required type="text" className="w-full glass-input p-4 rounded-sm text-sm"
                  value={contact.firstName} onChange={(e) => setContact(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80 ml-1">Last Name</label>
                <input required type="text" className="w-full glass-input p-4 rounded-sm text-sm"
                  value={contact.lastName} onChange={(e) => setContact(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80 ml-1">Professional Email</label>
              <input required type="email" className="w-full glass-input p-4 rounded-sm text-sm"
                value={contact.email} onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80 ml-1">Direct Phone (Optional)</label>
              <input type="tel" className="w-full glass-input p-4 rounded-sm text-sm"
                value={contact.phone} onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <button type="submit" disabled={!contact.email || !contact.firstName || loading} className="w-full py-5 btn-primary text-[11px] font-bold uppercase tracking-[0.3em] rounded-sm mt-8">
              {loading ? "Processing..." : "Generate Private Report"}
            </button>
          </form>

          <div className="pt-8 text-center text-[9px] font-light tracking-[0.2em] text-[#EBE6DF]/20 uppercase">
            Strictly Confidential &bull; SSL Encrypted
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === "processing") return <ProcessingScreen onComplete={() => setStep("results")} />;

  if (step === "results" && results) {
    const quadrants = [
      { id: 1, title: "Income Flow Structure", key: "structure", color: "#D4AF37", desc: "Measures inefficiencies related to business entity selection, compensation design, and SE tax exposure." },
      { id: 2, title: "Deduction System Leak", key: "deduction", color: "#AA7C11", desc: "Measures likelihood of missed allowable deductions and reactive tax behavior." },
      { id: 3, title: "Asset & Depreciation Leak", key: "asset", color: "#D4AF37", desc: "Measures inefficiencies tied to asset purchase timing and depreciation strategy." },
      { id: 4, title: "Wealth Vehicle Leak", key: "wealthVehicle", color: "#AA7C11", desc: "Measures potential underutilization of tax-advantaged wealth vehicles and deferral mechanisms." },
    ];

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

    return (
      <div className="min-h-screen font-sans vlari-bg selection:bg-gold-metallic/30 flex flex-col">
        <header className="bg-midnight/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-10 py-6 flex justify-between items-center w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gold-metallic rounded-sm flex items-center justify-center mr-4 shadow-2xl">
                <span className="text-midnight font-serif font-bold text-lg">V</span>
              </div>
              <span className="serif font-medium text-xl text-marble tracking-[0.2em] uppercase">Vlari</span>
            </div>
            <button className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-[0_10px_30px_rgba(170,124,17,0.2)] hover:scale-105">
              Book Strategy Session
            </button>
          </div>
        </header>

        <main className="flex-grow max-w-[1400px] w-full mx-auto px-10 py-24 space-y-32">
          
          {/* SECTION 1 — Score Overview (Hero Panel) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="inline-flex items-center gap-4 px-6 py-2 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic">
                <ShieldCheck className="w-4 h-4" /> Private Diagnostic Results
              </div>
              <h1 className="serif text-6xl md:text-8xl font-medium text-marble leading-[1.1]">
                Your Wealth <br/><span className="italic text-gold-gradient">Redirection Score™</span>
              </h1>
              <p className="text-2xl text-marble/50 font-light leading-relaxed max-w-2xl">
                {getScoreInterpretation(results.score)} We have identified structural opportunities to redirect capital back into your control.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="artisan-card p-8 space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Opportunity Band</div>
                  <div className="text-3xl serif font-medium text-marble">{getOpportunityBand(results.totalOpportunity.expected)}</div>
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
                  <ScoreGauge score={results.score} size={320} strokeWidth={16} />
                </div>
                <div className="pt-10 border-t border-white/5 space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-marble/30">Annual Redirection Potential</span>
                    <span className="text-4xl md:text-5xl serif font-medium text-gold-gradient">${results.totalOpportunity.expected.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-marble/20 italic tracking-widest">
                    Modeled Range: ${results.totalOpportunity.low.toLocaleString()} — ${results.totalOpportunity.high.toLocaleString()}
                  </div>
                </div>
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

          {/* SECTION 2 — Tax Profile Snapshot */}
          <section className="bg-navy-deep/40 backdrop-blur-md border border-white/5 rounded-sm p-16 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Modeled Federal Tax (2026)</div>
                <div className="text-3xl md:text-4xl lg:text-5xl serif font-medium text-marble">${results.baselineFedTax.toLocaleString()}</div>
                <p className="text-[10px] text-marble/20 tracking-widest uppercase">Estimated Exposure</p>
              </div>
              <div className="space-y-4 border-x border-white/5 px-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Tax Drag Ratio</div>
                <div className="text-3xl md:text-4xl lg:text-5xl serif font-medium text-marble">{Math.round(results.taxDragRatio * 100)}%</div>
                <p className="text-[10px] text-marble/20 tracking-widest uppercase">{getTaxDragInterpretation(results.taxDragRatio)}</p>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic/60">Effective Tax Rate</div>
                <div className="text-3xl md:text-4xl lg:text-5xl serif font-medium text-marble">{Math.round(results.effectiveRate * 100)}%</div>
                <p className="text-[10px] text-marble/20 tracking-widest uppercase">Blended Exposure</p>
              </div>
            </div>
          </section>

          {/* Business Entity Structure Signal */}
          {results.entitySignal && (
            <section className="artisan-card p-12 border-l-4 border-gold-metallic">
              <div className="flex items-start gap-8">
                <div className="p-4 bg-gold-metallic/10 rounded-sm">
                  <TriangleAlert className="w-8 h-8 text-gold-metallic" />
                </div>
                <div className="space-y-4">
                  <h3 className="serif text-3xl font-medium text-marble">Entity Redirection Signal</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-sm ${
                      results.entitySignal.severity === "High" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-gold-metallic/20 text-gold-metallic border border-gold-metallic/30"
                    }`}>
                      {results.entitySignal.severity} Severity Mismatch
                    </span>
                  </div>
                  <p className="text-marble/60 text-lg leading-relaxed font-light">
                    {results.entitySignal.message}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3 — Quadrant Analysis */}
          <section className="space-y-16">
            <div className="text-center space-y-6">
              <h2 className="serif text-5xl md:text-7xl font-medium text-marble">Quadrant <span className="italic text-gold-gradient">Diagnostics</span></h2>
              <p className="text-2xl text-marble/50 font-light max-w-3xl mx-auto leading-relaxed">
                A structural breakdown of where wealth is leaking from your current financial structure.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {quadrants.map((q) => (
                <div key={q.id} className="artisan-card p-12 flex flex-col hover:shadow-[0_0_60px_rgba(170,124,17,0.1)] transition-all duration-700 group">
                  <div className="flex items-start justify-between mb-10">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-midnight border border-gold-metallic/30 rounded-full flex items-center justify-center text-gold-metallic font-medium text-2xl shadow-2xl group-hover:border-gold-metallic transition-colors">{q.id}</div>
                        <div>
                          <h3 className="serif text-3xl font-medium text-marble">{q.title}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-sm mt-2 inline-block ${
                            results.quadrants[q.key].status === "Evaluated" ? "bg-gold-metallic/10 text-gold-metallic border border-gold-metallic/20" : 
                            results.quadrants[q.key].status === "Insufficient Data" ? "bg-white/5 text-marble/30 border border-white/10" : 
                            "bg-white/5 text-marble/30 border border-white/10"
                          }`}>
                            {results.quadrants[q.key].status}
                          </span>
                        </div>
                      </div>
                      <p className="text-marble/40 text-sm leading-relaxed font-light">{q.desc}</p>
                    </div>
                    <ScoreGauge score={results.quadrants[q.key].score} size={140} strokeWidth={10} color={q.color} />
                  </div>
                  <div className="flex-1 space-y-10">
                    <div className={`p-6 rounded-sm font-bold text-center border uppercase tracking-[0.2em] text-xs ${results.quadrants[q.key].score < 60 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-gold-metallic/10 text-gold-metallic border-gold-metallic/20"}`}>
                      {results.quadrants[q.key].score < 60 ? "Critical Optimization Needed" : "Foundation Secured"}
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold text-gold-metallic/60 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Activity className="w-3 h-3" /> Diagnostic Commentary
                      </h4>
                      <p className="text-marble/70 text-base leading-relaxed font-light italic">
                        {results.quadrants[q.key].findings}
                      </p>
                    </div>
                    <div className="pt-8 border-t border-white/5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-marble/20 mb-4">
                        <span>Wealth Impact</span>
                        <span>Capture Potential</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-marble/40 text-xs tracking-widest">${results.quadrants[q.key].low.toLocaleString()} — ${results.quadrants[q.key].high.toLocaleString()}</span>
                        <span className="text-3xl serif font-medium text-marble">${results.quadrants[q.key].expected.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4 — Total Wealth Redirection Opportunity */}
          <section className="artisan-card p-20 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-gold-metallic/5 via-transparent to-transparent opacity-50"></div>
            <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
              <div className="space-y-6">
                <h2 className="serif text-5xl font-medium text-marble">Total Redirection <span className="italic text-gold-gradient">Potential</span></h2>
                <p className="text-xl text-marble/40 font-light tracking-wide">The aggregate value of identified structural inefficiencies.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                <div className="p-10 bg-white/5 border border-white/5 rounded-sm space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-marble/30">Conservative</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl serif font-medium text-marble/60">${results.totalOpportunity.low.toLocaleString()}</div>
                </div>
                <div className="p-14 bg-gradient-to-br from-gold-antique to-gold-metallic text-midnight rounded-sm transform scale-110 shadow-[0_30px_60px_rgba(170,124,17,0.3)] space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Expected Annual</div>
                  <div className="text-4xl md:text-5xl lg:text-6xl serif font-bold tracking-tight">${results.totalOpportunity.expected.toLocaleString()}</div>
                </div>
                <div className="p-10 bg-white/5 border border-white/5 rounded-sm space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-marble/30">Aggressive</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl serif font-medium text-marble/60">${results.totalOpportunity.high.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 & 6 — Confidence & Methodology */}
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

          {/* SECTION 7 — Final CTA & Disclaimers */}
          <section className="bg-gradient-to-br from-navy-deep to-midnight border border-gold-metallic/20 rounded-sm shadow-2xl p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            
            <div className="space-y-12 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic">
                  Strategic Next Step
                </div>
                <h2 className="serif text-6xl md:text-8xl font-medium text-marble leading-tight">
                  Redirect Your Wealth. <br /> <span className="italic text-gold-gradient">Secure Your Future.</span>
                </h2>
                <p className="text-2xl text-marble/50 font-light max-w-3xl mx-auto leading-relaxed">
                  Your diagnostic results reveal significant opportunities. Now let's build the tactical strategy to capture them. Book a complimentary 30-minute Strategy Session.
                </p>
              </div>
              <button className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-24 py-10 rounded-sm text-2xl font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-[0_30px_60px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95">
                Improve My Structure
              </button>
              <div className="flex flex-wrap items-center justify-center gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-marble/30 pt-8">
                <div className="flex items-center gap-4"><Video className="w-5 h-5 text-gold-metallic/50" /> 30-Min Strategy Call</div>
                <div className="flex items-center gap-4"><Calculator className="w-5 h-5 text-gold-metallic/50" /> Custom Optimization Plan</div>
                <div className="flex items-center gap-4"><ShieldCheck className="w-5 h-5 text-gold-metallic/50" /> 100% Confidential</div>
              </div>
            </div>
          </section>

          <section className="text-center max-w-4xl mx-auto space-y-6 pt-12 pb-24">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-marble/20">Disclaimers</h4>
            <p className="text-[9px] text-marble/10 leading-relaxed uppercase tracking-[0.1em] max-w-2xl mx-auto">
              Estimates based on provided inputs. Final outcomes require document review. Strategy eligibility varies by jurisdiction and specific financial circumstances. This is a diagnostic tool for structural analysis and does not constitute formal tax, legal, or investment advice.
            </p>
          </section>
        </main>

        <footer className="bg-black py-32 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-24">
            <div className="space-y-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gold-metallic rounded-sm flex items-center justify-center mr-4">
                  <span className="text-midnight font-serif font-bold text-xl">V</span>
                </div>
                <span className="serif font-medium text-2xl text-marble tracking-widest uppercase">Vlari</span>
              </div>
              <p className="text-marble/30 text-xs leading-relaxed font-light tracking-wide">
                Strategic wealth redirection for high-net-worth individuals and business owners.
              </p>
            </div>
            <div className="space-y-8">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-metallic">Wealth Redirection</h5>
              <ul className="space-y-4 text-xs text-marble/40 font-light tracking-widest">
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Entity Design</li>
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Tax Optimization</li>
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Wealth Vehicles</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-metallic">Company</h5>
              <ul className="space-y-4 text-xs text-marble/40 font-light tracking-widest">
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">About Vlari</li>
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Security</li>
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-metallic">Legal</h5>
              <ul className="space-y-4 text-xs text-marble/40 font-light tracking-widest">
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-gold-metallic transition-colors cursor-pointer">Disclosures</li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto px-10 pt-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] text-marble/10 uppercase tracking-[0.3em]">© 2026 Vlari Strategic Wealth Redirection. All Rights Reserved.</p>
            <div className="flex gap-10 opacity-20">
               <ShieldCheck className="w-5 h-5 text-marble" />
               <Lock className="w-5 h-5 text-marble" />
               <Activity className="w-5 h-5 text-marble" />
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return null;
}