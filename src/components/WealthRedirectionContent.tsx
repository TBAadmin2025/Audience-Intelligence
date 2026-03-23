import { useState } from "react";
import { CheckCircle2, Sparkles, ArrowRight, X } from "lucide-react";

const PREQUAL_QUESTIONS = [
  {
    question: "Have you had a federal tax liability of $250,000 or more in the last 12 months?",
    options: [
      "Yes — my tax bill has been $250K or more",
      "No — I'm not at that level yet",
    ],
  },
  {
    question: "Are you currently working with a CPA or tax professional?",
    options: [
      "Yes — I have a CPA handling my taxes",
      "No — I'm not currently working with one",
    ],
  },
  {
    question: "If we identify a strategy that could significantly reduce your tax liability and redirect those savings into wealth-building vehicles you own — is an investment of $10,000 to make that happen feasible for you right now?",
    options: [
      "Yes — that's a feasible investment for the right outcome",
      "No — I'm not in a position to invest at that level right now",
    ],
  },
  {
    question: "What specific questions do you need answered on this call in order to feel confident moving forward?",
    options: null,
  },
  {
    question: "If all of your questions are answered and you feel this is the right fit — are you prepared to make a decision on the call?",
    options: [
      "Yes — if it's the right fit, I'm ready to move forward",
      "No — I'll need more time after the call",
    ],
  },
];

const OFFER_BLOCKS = [
  { title: "Full Strategic Analysis", body: "We go beyond the diagnostic and evaluate your complete financial structure\u2014 including income flow, tax exposure, entity design, and wealth positioning." },
  { title: "Identify the Highest-Leverage Opportunity", body: "We isolate the single most impactful move available to you\u2014 the one that creates the greatest financial shift with the least disruption." },
  { title: "Immediate Activation Strategy", body: "You don\u2019t leave with theory. You leave with a clear, executable plan that can be implemented right away\u2014 either with your CPA or through coordinated support." },
  { title: "Designed for Real Financial Impact", body: "This is not about small adjustments. This is about restructuring how your income works\u2014 so you can begin retaining and redirecting more of your capital." },
];

export const PreQualModal = ({ onClose, firstName, email }: { onClose: () => void; firstName: string; email: string }) => {
  const [step, setStep] = useState<"intro" | number | "calendar">("intro");
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (typeof step === "number") {
      const updated = [...answers];
      updated[step] = selected || answers[step];
      setAnswers(updated);
      setSelected(null);
      if (step < 4) {
        setStep(step + 1);
      } else {
        setStep("calendar");
      }
    }
  };

  const handleTextNext = () => {
    if (typeof step === "number" && answers[step].trim()) {
      setStep(step + 1 <= 4 ? step + 1 : "calendar");
    }
  };

  const encodedAnswers = encodeURIComponent(
    `Q1: ${answers[0]} | Q2: ${answers[1]} | Q3: ${answers[2]} | Q4: ${answers[3]} | Q5: ${answers[4]}`
  );

  const calendarParams = [
    firstName && `first_name=${encodeURIComponent(firstName)}`,
    email && `email=${encodeURIComponent(email)}`,
    `diagnostic_prequal_questions=${encodedAnswers}`,
  ].filter(Boolean).join("&");

  const calendarSrc = `https://links.quietwealthengine.com/widget/booking/fA95vEUfzE9zbdjRnefn?${calendarParams}`;

  const progress = typeof step === "number" ? step + 1 : step === "calendar" ? 5 : 0;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-midnight/95 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-8 min-h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right z-20 p-2 text-marble/40 hover:text-marble transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress bar */}
        {step !== "intro" && (
          <div className="mb-12">
            <div className="flex justify-between mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] ${
                    progress >= n ? "text-gold-metallic" : "text-marble/20"
                  }`}
                >
                  Q{n}
                </span>
              ))}
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-antique to-gold-metallic rounded-full transition-all duration-500"
                style={{ width: `${(progress / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Intro screen */}
        {step === "intro" && (
          <div className="text-center space-y-12 py-16">
            <p className="text-marble/70 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
              This strategy session is designed for high-income earners and business owners who are ready to move beyond basic tax compliance into structured wealth redirection. To make sure this is the right fit before we get on a call, please answer the following questions honestly.
            </p>
            <button
              onClick={() => setStep(0)}
              className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-16 py-6 rounded-sm text-lg font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_20px_40px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
            >
              Begin
            </button>
          </div>
        )}

        {/* Question screens (multiple choice) */}
        {typeof step === "number" && PREQUAL_QUESTIONS[step].options && (
          <div className="space-y-10 py-8">
            <p className="text-marble text-2xl md:text-3xl font-light leading-relaxed text-center">
              {PREQUAL_QUESTIONS[step].question}
            </p>
            <div className="space-y-4 max-w-xl mx-auto">
              {PREQUAL_QUESTIONS[step].options!.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-6 rounded-sm border transition-all duration-300 ${
                    selected === option
                      ? "border-gold-metallic bg-gold-metallic/10 text-marble shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                      : "border-white/10 bg-white/5 text-marble/60 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="text-base font-light">{option}</span>
                </button>
              ))}
            </div>
            {selected && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-14 py-5 rounded-sm text-base font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_20px_40px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Question screen (textarea — Q4) */}
        {typeof step === "number" && !PREQUAL_QUESTIONS[step].options && (
          <div className="space-y-10 py-8">
            <p className="text-marble text-2xl md:text-3xl font-light leading-relaxed text-center">
              {PREQUAL_QUESTIONS[step].question}
            </p>
            <div className="max-w-xl mx-auto">
              <textarea
                value={answers[step]}
                onChange={(e) => {
                  const updated = [...answers];
                  updated[step] = e.target.value;
                  setAnswers(updated);
                }}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-sm p-6 text-marble text-base font-light leading-relaxed focus:outline-none focus:border-gold-metallic/50 focus:ring-1 focus:ring-gold-metallic/30 resize-none placeholder:text-marble/20"
                placeholder="Type your answer here..."
              />
            </div>
            {answers[step].trim() && (
              <div className="text-center">
                <button
                  onClick={handleTextNext}
                  className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-14 py-5 rounded-sm text-base font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_20px_40px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calendar embed */}
        {step === "calendar" && (
          <div className="space-y-8 py-8">
            <div className="text-center space-y-4">
              <h2 className="serif text-3xl md:text-4xl font-medium text-marble">
                Schedule Your <span className="italic text-gold-gradient">Strategy Session</span>
              </h2>
              <p className="text-marble/40 text-sm font-light">Select a time that works best for you.</p>
            </div>
            <div className="bg-white rounded-sm overflow-hidden shadow-2xl">
              <iframe
                src={calendarSrc}
                style={{ width: "100%", minHeight: 900, border: "none" }}
                scrolling="yes"
                id="fA95vEUfzE9zbdjRnefn_1774290834981"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WealthRedirectionContent = ({ firstName, email }: { firstName?: string; email?: string }) => {
  const [showPreQual, setShowPreQual] = useState(false);

  return (
    <>
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-10 py-24 space-y-32">
        {/* Hero */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic">
            <Sparkles className="w-4 h-4" /> Wealth Redirection Activation
          </div>
          <h1 className="serif text-5xl md:text-7xl font-medium text-marble leading-[1.1]">
            You've Seen the Numbers. <br/><span className="italic text-gold-gradient">Now Let's Turn Them Into Strategy.</span>
          </h1>
          <p className="text-2xl text-marble/50 font-light leading-relaxed max-w-3xl mx-auto">
            Identify your highest-leverage opportunity—and activate it immediately.
          </p>
        </section>

        {/* Video */}
        <section className="max-w-4xl mx-auto space-y-10">
          <div className="w-full rounded-sm overflow-hidden border border-white/10 shadow-2xl">
            <video
              className="w-full aspect-video"
              controls
              playsInline
              preload="metadata"
              src="https://assets.cdn.filesafe.space/5acTuTfeFkOQRwxAXWLx/media/69c14a17b0d6d740ee237f71.mp4"
            />
          </div>
          <div className="text-center space-y-6">
            <button
              onClick={() => setShowPreQual(true)}
              className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-20 py-8 rounded-sm text-xl font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-[0_30px_60px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
            >
              Schedule Your Wealth Redirection Session
            </button>
            <p className="text-marble/40 text-sm font-light max-w-xl mx-auto">
              A complimentary strategy session to determine your highest-impact opportunity.
            </p>
          </div>
        </section>

        {/* Offer Blocks */}
        <section className="space-y-16 max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="serif text-4xl md:text-5xl font-medium text-marble">
              What Happens Inside Your <span className="italic text-gold-gradient">Wealth Redirection Activation</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {OFFER_BLOCKS.map((block, i) => (
              <div key={i} className="artisan-card p-10 space-y-6 hover:shadow-[0_0_60px_rgba(170,124,17,0.1)] transition-all duration-700">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gold-metallic/10 border border-gold-metallic/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-gold-metallic" />
                  </div>
                  <h3 className="serif text-2xl font-medium text-marble">{block.title}</h3>
                </div>
                <p className="text-marble/50 text-base leading-relaxed font-light">{block.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Conversation Matters */}
        <section className="artisan-card p-16 max-w-4xl mx-auto space-y-10">
          <h2 className="serif text-4xl font-medium text-marble">Why This Conversation <span className="italic text-gold-gradient">Matters</span></h2>
          <p className="text-marble/60 text-lg leading-relaxed font-light">
            Most high earners are operating within compliant systems— but not optimized ones. That gap is where significant financial opportunity often exists. This session is designed to determine:
          </p>
          <ul className="space-y-4 pl-2">
            <li className="flex items-start gap-4 text-marble/60 text-lg font-light">
              <ArrowRight className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
              Whether those opportunities exist in your current structure
            </li>
            <li className="flex items-start gap-4 text-marble/60 text-lg font-light">
              <ArrowRight className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
              What your highest-impact move would be
            </li>
            <li className="flex items-start gap-4 text-marble/60 text-lg font-light">
              <ArrowRight className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
              And whether it makes sense to move forward
            </li>
          </ul>
        </section>

        {/* Qualifier */}
        <section className="bg-navy-deep/40 backdrop-blur-md border border-white/5 rounded-sm p-16 max-w-4xl mx-auto space-y-10">
          <h3 className="serif text-3xl font-medium text-marble">This is best suited for individuals who:</h3>
          <ul className="space-y-4 pl-2">
            <li className="flex items-start gap-4 text-marble/60 text-lg font-light">
              <CheckCircle2 className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
              Have experienced a six-figure tax liability
            </li>
            <li className="flex items-start gap-4 text-marble/60 text-lg font-light">
              <CheckCircle2 className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
              Have established income or business revenue
            </li>
            <li className="flex items-start gap-4 text-marble/60 text-lg font-light">
              <CheckCircle2 className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
              Are ready to move beyond basic tax preparation into strategy
            </li>
          </ul>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-navy-deep to-midnight border border-gold-metallic/20 rounded-sm shadow-2xl p-24 text-center relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="space-y-10 relative z-10">
            <h2 className="serif text-5xl md:text-6xl font-medium text-marble leading-tight">
              Ready to See <span className="italic text-gold-gradient">What's Possible?</span>
            </h2>
            <button
              onClick={() => setShowPreQual(true)}
              className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-20 py-8 rounded-sm text-xl font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-[0_30px_60px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
            >
              Book Your Wealth Redirection Session
            </button>
            <p className="text-marble/40 text-sm font-light max-w-xl mx-auto">
              We'll walk through your results and identify your highest-impact next move.
            </p>
          </div>
        </section>
      </main>

      {/* Pre-Qualification Modal */}
      {showPreQual && (
        <PreQualModal
          onClose={() => setShowPreQual(false)}
          firstName={firstName || ""}
          email={email || ""}
        />
      )}
    </>
  );
};
