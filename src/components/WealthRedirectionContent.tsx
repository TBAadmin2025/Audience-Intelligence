import { useState } from "react";
import { CheckCircle2, Sparkles, ArrowRight, X } from "lucide-react";
import { diagnosticConfig } from "../client/config";

export const PreQualModal = ({ onClose, firstName, email }: { onClose: () => void; firstName: string; email: string }) => {
  const [step, setStep] = useState<"intro" | number | "calendar">("intro");
  const [answers, setAnswers] = useState<string[]>(diagnosticConfig.preQual.questions.map(() => ""));
  const [selected, setSelected] = useState<string | null>(null);

  const preQualQuestions = diagnosticConfig.preQual.questions;

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (typeof step === "number") {
      const updated = [...answers];
      updated[step] = selected || answers[step];
      setAnswers(updated);
      setSelected(null);
      if (step < preQualQuestions.length - 1) {
        setStep(step + 1);
      } else {
        setStep("calendar");
      }
    }
  };

  const handleTextNext = () => {
    if (typeof step === "number" && answers[step].trim()) {
      setStep(step + 1 <= preQualQuestions.length - 1 ? step + 1 : "calendar");
    }
  };

  const encodedAnswers = encodeURIComponent(
    preQualQuestions.map((_, i) => `Q${i + 1}: ${answers[i]}`).join(" | ")
  );

  const calendarParams = [
    firstName && `first_name=${encodeURIComponent(firstName)}`,
    email && `email=${encodeURIComponent(email)}`,
    `${diagnosticConfig.ghl.fieldKeys.prequalAnswers}=${encodedAnswers}`,
  ].filter(Boolean).join("&");

  const calendarSrc = `${diagnosticConfig.vsl.calendarUrl}?${calendarParams}`;

  const progress = typeof step === "number" ? step + 1 : step === "calendar" ? preQualQuestions.length : 0;

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
              {preQualQuestions.map((_, n) => (
                <span
                  key={n}
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] ${
                    progress >= n + 1 ? "text-gold-metallic" : "text-marble/20"
                  }`}
                >
                  Q{n + 1}
                </span>
              ))}
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-antique to-gold-metallic rounded-full transition-all duration-500"
                style={{ width: `${(progress / preQualQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Intro screen */}
        {step === "intro" && (
          <div className="text-center space-y-12 py-16">
            <p className="text-marble/70 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
              {diagnosticConfig.preQual.intro}
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
        {typeof step === "number" && preQualQuestions[step].options && (
          <div className="space-y-10 py-8">
            <p className="text-marble text-2xl md:text-3xl font-light leading-relaxed text-center">
              {preQualQuestions[step].question}
            </p>
            <div className="space-y-4 max-w-xl mx-auto">
              {preQualQuestions[step].options!.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left p-6 rounded-sm border transition-all duration-300 ${
                    selected === option.value
                      ? "border-gold-metallic bg-gold-metallic/10 text-marble shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                      : "border-white/10 bg-white/5 text-marble/60 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="text-base font-light">{option.label}</span>
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

        {/* Question screen (textarea) */}
        {typeof step === "number" && !preQualQuestions[step].options && (
          <div className="space-y-10 py-8">
            <p className="text-marble text-2xl md:text-3xl font-light leading-relaxed text-center">
              {preQualQuestions[step].question}
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

  const { vsl } = diagnosticConfig;

  return (
    <>
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-10 py-24 space-y-32">
        {/* Hero */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-gold-metallic/10 border border-gold-metallic/20 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-metallic">
            <Sparkles className="w-4 h-4" /> Wealth Redirection Activation
          </div>
          <h1 className="serif text-5xl md:text-7xl font-medium text-marble leading-[1.1]">
            {vsl.headline} <br/><span className="italic text-gold-gradient">Now Let's Turn Them Into Strategy.</span>
          </h1>
          <p className="text-2xl text-marble/50 font-light leading-relaxed max-w-3xl mx-auto">
            {vsl.subheadline}
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
              src={vsl.videoUrl}
            />
          </div>
          <div className="text-center space-y-6">
            <button
              onClick={() => setShowPreQual(true)}
              className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-20 py-8 rounded-sm text-xl font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-[0_30px_60px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
            >
              {vsl.bookingButtonText}
            </button>
            <p className="text-marble/40 text-sm font-light max-w-xl mx-auto">
              {vsl.bookingButtonMicrocopy}
            </p>
          </div>
        </section>

        {/* Offer Blocks */}
        <section className="space-y-16 max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="serif text-4xl md:text-5xl font-medium text-marble">
              {vsl.offerSectionHeading.split("Wealth Redirection Activation")[0]}<span className="italic text-gold-gradient">Wealth Redirection Activation</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {vsl.offerBlocks.map((block, i) => (
              <div key={i} className="artisan-card p-10 space-y-6 hover:shadow-[0_0_60px_rgba(170,124,17,0.1)] transition-all duration-700">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gold-metallic/10 border border-gold-metallic/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-gold-metallic" />
                  </div>
                  <h3 className="serif text-2xl font-medium text-marble">{block.title}</h3>
                </div>
                <p className="text-marble/50 text-base leading-relaxed font-light">{block.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Conversation Matters */}
        <section className="artisan-card p-16 max-w-4xl mx-auto space-y-10">
          <h2 className="serif text-4xl font-medium text-marble">{vsl.whyMattersHeading.split("Matters")[0]}<span className="italic text-gold-gradient">Matters</span></h2>
          <p className="text-marble/60 text-lg leading-relaxed font-light">
            {vsl.whyMattersBody}
          </p>
          <ul className="space-y-4 pl-2">
            {vsl.whyMattersBullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-4 text-marble/60 text-lg font-light">
                <ArrowRight className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        {/* Qualifier */}
        <section className="bg-navy-deep/40 backdrop-blur-md border border-white/5 rounded-sm p-16 max-w-4xl mx-auto space-y-10">
          <h3 className="serif text-3xl font-medium text-marble">{vsl.qualifierHeading}</h3>
          <ul className="space-y-4 pl-2">
            {vsl.qualifierBullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-4 text-marble/60 text-lg font-light">
                <CheckCircle2 className="w-5 h-5 text-gold-metallic flex-shrink-0 mt-1" />
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-navy-deep to-midnight border border-gold-metallic/20 rounded-sm shadow-2xl p-24 text-center relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="space-y-10 relative z-10">
            <h2 className="serif text-5xl md:text-6xl font-medium text-marble leading-tight">
              {vsl.finalCtaHeading.split("What's Possible?")[0]}<span className="italic text-gold-gradient">What's Possible?</span>
            </h2>
            <button
              onClick={() => setShowPreQual(true)}
              className="bg-gradient-to-r from-gold-antique to-gold-metallic text-midnight px-20 py-8 rounded-sm text-xl font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-[0_30px_60px_rgba(170,124,17,0.3)] hover:scale-105 active:scale-95"
            >
              {vsl.finalCtaButtonText}
            </button>
            <p className="text-marble/40 text-sm font-light max-w-xl mx-auto">
              {vsl.finalCtaMicrocopy}
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
