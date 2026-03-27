import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { runScoring, DiagnosticAnswers } from "./client/scoring";
import { questions, contextQuestions } from "./client/questions";
import { diagnosticConfig } from "./client/config";

// ==========================================
// DEANAR UI COMPONENTS
// ==========================================
const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full h-[2px] bg-greige relative z-50">
      <motion.div
        className="h-full bg-crimson"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

const QuestionCard = ({ question, options, onSelect, value }: any) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <h2 className="serif text-4xl md:text-6xl text-paper leading-tight font-normal">
        {question}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {options.map((opt: string, idx: number) => (
          <motion.button
            key={opt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(opt)}
            className={`w-full text-left p-6 md:p-8 border transition-all duration-300 flex items-center justify-between group ${
              value === opt
                ? "border-camel bg-camel/10 text-paper"
                : "border-greige/20 bg-paper/5 text-paper/70 hover:border-camel/50 hover:bg-paper/10"
            }`}
          >
            <span className="font-light text-lg md:text-xl">{opt}</span>
            <div
              className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                value === opt ? "border-camel bg-camel" : "border-greige/40"
              }`}
            >
              {value === opt && <div className="w-2 h-2 bg-paper" />}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const ProcessingScreen = ({
  progress,
  currentStep,
}: {
  progress: number;
  currentStep: number;
}) => {
  const steps = diagnosticConfig.processingSteps;
  const size = 240;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen deanar-bg-oxblood flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-multiply"
        style={{
          backgroundImage: `url('${diagnosticConfig.brand.motifs.intersections}')`,
        }}
      />
      <div className="relative z-10 text-center space-y-16 max-w-2xl mx-auto">
        {/* Circular gauge */}
        <div className="flex justify-center">
          <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(214,206,196,0.1)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#B89F82"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                strokeLinecap="butt"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="serif text-5xl font-medium text-paper">
                {Math.round(progress)}%
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-camel/50 mt-1">
                Analyzing
              </span>
            </div>
          </div>
        </div>

        {/* Step label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="serif text-3xl md:text-4xl text-paper font-normal">
              {steps[currentStep]?.heading}
            </h3>
            <p className="text-[11px] uppercase tracking-[0.3em] text-camel/60">
              {steps[currentStep]?.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 ${
                i <= currentStep ? "w-8 bg-camel" : "w-8 bg-paper/10"
              }`}
            />
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-8 text-paper/30">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em]">
            <Lock className="w-3 h-3" /> Private Analysis
          </div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em]">
            <ShieldCheck className="w-3 h-3" /> Confidential Session
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================
type Step = "intro" | "contact" | "questions" | "context" | "processing";

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    investmentSize: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [direction, setDirection] = useState(1);

  // Context screen answers
  const [contextAnswers, setContextAnswers] = useState<Record<string, string>>(
    {}
  );

  // Processing state
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [apisFinished, setApisFinished] = useState(false);

  // Active (non-conditional) questions
  const activeQuestions = questions.filter(
    (q) => !q.condition || q.condition(answers)
  );

  // Get current dimension section number
  const currentDimension = activeQuestions[currentQ]?.dimension;
  const dimensionIndex = diagnosticConfig.quadrants.findIndex(
    (q) => q.key === currentDimension
  );

  // ---- Processing animation ----
  useEffect(() => {
    if (step !== "processing") return;

    const stepCount = diagnosticConfig.processingSteps.length;
    const stepDuration = 2000;
    const totalDuration = stepCount * stepDuration;

    // Step counter
    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev < stepCount - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    // Progress — hold at 90% until APIs finish
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        const target = apisFinished ? 100 : 90;
        if (prev >= target) return target;
        return prev + 1;
      });
    }, totalDuration / 90);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [step, apisFinished]);

  // Redirect when processing complete
  useEffect(() => {
    if (step === "processing" && processingProgress >= 100 && apisFinished) {
      const timer = setTimeout(() => {
        window.location.href = `/report/${sessionId}`;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, processingProgress, apisFinished, sessionId]);

  // ---- Handlers ----
  const handleContactSubmit = async () => {
    try {
      const res = await fetch("/api/save-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);

      // Fire-and-forget GHL start
      fetch("/api/ghl-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      }).catch(() => {});

      setStep("questions");
    } catch {
      setStep("questions");
    }
  };

  const handleAnswer = (value: string) => {
    const q = activeQuestions[currentQ];
    const updated = { ...answers, [q.id]: value };
    setAnswers(updated);

    setTimeout(() => {
      if (currentQ < activeQuestions.length - 1) {
        setDirection(1);
        setCurrentQ(currentQ + 1);
      } else {
        // All 12 questions done — go to context screen
        setStep("context");
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ(currentQ - 1);
    }
  };

  const handleContextSubmit = () => {
    // Merge context answers and start processing
    const allAnswers: DiagnosticAnswers = {
      ...answers,
      ...contextAnswers,
      investmentSize: contact.investmentSize,
    };

    setStep("processing");
    generateResults(allAnswers);
  };

  const generateResults = async (allAnswers: DiagnosticAnswers) => {
    try {
      const results = runScoring(allAnswers);

      // Build raw answers array
      const rawAnswers = [
        ...questions.map((q) => ({
          question: q.q,
          answer: allAnswers[q.id] || "",
        })),
        ...contextQuestions.map((q) => ({
          question: q.q,
          answer: allAnswers[q.id] || "",
        })),
        {
          question: "Investment Size",
          answer: contact.investmentSize,
        },
      ];

      // AI commentary
      let commentary = "";
      try {
        const aiRes = await fetch("/api/ai-commentary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            results,
            profile: { firstName: contact.firstName },
          }),
        });
        const aiData = await aiRes.json();
        commentary = aiData.commentary || "";
      } catch {
        commentary = "";
      }

      // Save session
      await fetch("/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          results,
          rawAnswers,
          commentary,
        }),
      });

      // GHL complete (fire-and-forget)
      fetch("/api/ghl-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          results,
          sessionId,
          commentary,
        }),
      }).catch(() => {});

      setApisFinished(true);
    } catch (err) {
      console.error("Result generation failed:", err);
      setApisFinished(true);
    }
  };

  // ==========================================
  // RENDER: INTRO
  // ==========================================
  if (step === "intro") {
    return (
      <div className="min-h-screen deanar-bg-graphite flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('${diagnosticConfig.brand.motifs.structuralLogic}')`,
          }}
        />
        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-10">
          {/* Brand name */}
          <h2 className="serif text-3xl text-paper tracking-[0.3em] uppercase">
            DEANAR
          </h2>

          {/* Thin line */}
          <div className="w-16 h-px bg-camel mx-auto opacity-60" />

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-camel/30 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-camel">
            Audience Intelligence Diagnostic
          </div>

          {/* Main heading */}
          <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-normal text-paper leading-tight">
            Are You Making Your Big Bets{" "}
            <span className="italic font-normal text-camel">
              in the Right Place?
            </span>
          </h1>

          {/* Description */}
          <p className="font-light text-paper/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {diagnosticConfig.copy.introSubheadline}
          </p>

          {/* CTA */}
          <button
            onClick={() => setStep("contact")}
            className="btn-primary px-10 py-6 text-sm inline-flex items-center gap-3 group"
          >
            Begin Diagnostic
            <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-8 text-paper/30 pt-6">
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em]">
              <Lock className="w-3 h-3" /> Confidential
            </div>
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em]">
              <ShieldCheck className="w-3 h-3" /> Private
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: CONTACT
  // ==========================================
  if (step === "contact") {
    const isValid =
      contact.firstName.trim() &&
      contact.lastName.trim() &&
      contact.email.trim() &&
      contact.investmentSize;

    return (
      <div className="min-h-screen deanar-bg-paper flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl deanar-card p-10 md:p-16 space-y-10">
          {/* Icon */}
          <div className="w-12 h-12 border border-crimson/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-camel" />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="serif text-4xl md:text-5xl text-graphite font-normal">
              Where Should We Send Your{" "}
              <span className="italic font-normal text-camel">Results?</span>
            </h1>
            <p className="font-light text-graphite/60 text-base">
              Tell us where to send your Audience Intelligence Readout.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-crimson/80">
                  First Name
                </label>
                <input
                  type="text"
                  value={contact.firstName}
                  onChange={(e) =>
                    setContact({ ...contact, firstName: e.target.value })
                  }
                  className="w-full glass-input p-4"
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-crimson/80">
                  Last Name
                </label>
                <input
                  type="text"
                  value={contact.lastName}
                  onChange={(e) =>
                    setContact({ ...contact, lastName: e.target.value })
                  }
                  className="w-full glass-input p-4"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-crimson/80">
                Email
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="w-full glass-input p-4"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-crimson/80">
                Phone{" "}
                <span className="text-graphite/30 normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                className="w-full glass-input p-4"
                placeholder="(555) 000-0000"
              />
            </div>

            {/* Investment Size (Q15) */}
            <div className="space-y-3">
              <label className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-crimson/80">
                Investment Size
              </label>
              <div className="grid grid-cols-1 gap-3">
                {diagnosticConfig.investmentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setContact({ ...contact, investmentSize: opt.label })
                    }
                    className={`w-full text-left p-4 border transition-all duration-300 text-sm ${
                      contact.investmentSize === opt.label
                        ? "border-crimson bg-crimson/5 text-graphite"
                        : "border-greige bg-paper text-graphite/70 hover:border-greige hover:bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleContactSubmit}
            disabled={!isValid}
            className="w-full btn-primary px-8 py-5 inline-flex items-center justify-center gap-3 group"
          >
            Begin Diagnostic
            <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </button>

          {/* Footer */}
          <p className="text-center text-graphite/20 text-[9px] uppercase tracking-[0.25em]">
            Strictly Confidential &bull; Private Session
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: QUESTIONS (Q1-Q12)
  // ==========================================
  if (step === "questions") {
    const q = activeQuestions[currentQ];

    return (
      <div className="min-h-screen deanar-bg-graphite flex flex-col relative">
        {/* Progress bar */}
        <ProgressBar current={currentQ + 1} total={activeQuestions.length} />

        {/* Header */}
        <header className="px-6 lg:px-12 py-6 flex justify-between items-center">
          <span className="serif text-paper tracking-[0.25em] text-lg uppercase">
            DEANAR
          </span>
          <span className="text-paper/40 text-[9px] uppercase tracking-[0.4em]">
            Section {String(dimensionIndex + 1).padStart(2, "0")}
          </span>
        </header>

        {/* Question */}
        <div className="flex-1 flex items-center px-6 lg:px-12 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <QuestionCard
                question={q.q}
                options={q.options}
                onSelect={handleAnswer}
                value={answers[q.id] || ""}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back button */}
        {currentQ > 0 && (
          <div className="px-6 lg:px-12 pb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-paper/30 hover:text-camel transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER: CONTEXT SCREEN (Q13 + Q14)
  // ==========================================
  if (step === "context") {
    const allContextAnswered = contextQuestions.every(
      (cq) => contextAnswers[cq.id]
    );

    return (
      <div className="min-h-screen deanar-bg-paper flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl deanar-card p-10 md:p-16 space-y-10">
          {/* Heading */}
          <div className="space-y-3">
            <h1 className="serif text-4xl md:text-5xl text-graphite font-normal">
              One Last Thing Before Your{" "}
              <span className="italic font-normal text-camel">Readout</span>
            </h1>
            <p className="font-light text-graphite/60 text-base">
              This helps us tailor your analysis to your specific decision.
            </p>
          </div>

          {/* Context questions */}
          <div className="space-y-10">
            {contextQuestions.map((cq) => (
              <div key={cq.id} className="space-y-4">
                <h3 className="serif text-xl md:text-2xl text-graphite font-normal">
                  {cq.q}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {cq.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setContextAnswers({ ...contextAnswers, [cq.id]: opt })
                      }
                      className={`w-full text-left p-4 border transition-all duration-300 text-sm ${
                        contextAnswers[cq.id] === opt
                          ? "border-crimson bg-crimson/5 text-graphite"
                          : "border-greige bg-paper text-graphite/70 hover:border-greige hover:bg-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleContextSubmit}
            disabled={!allContextAnswered}
            className="w-full btn-primary px-8 py-5 inline-flex items-center justify-center gap-3 group"
          >
            Generate My Readout
            <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: PROCESSING
  // ==========================================
  if (step === "processing") {
    return (
      <ProcessingScreen
        progress={processingProgress}
        currentStep={processingStep}
      />
    );
  }

  return null;
}
