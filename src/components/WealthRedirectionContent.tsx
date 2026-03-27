import { useState } from "react";
import { CheckCircle2, ArrowRight, X, Sparkles } from "lucide-react";
import { diagnosticConfig } from "../client/config";

export const PreQualModal = ({
  onClose,
  firstName,
  email,
}: {
  onClose: () => void;
  firstName: string;
  email: string;
}) => {
  const [step, setStep] = useState<"intro" | number | "calendar">("intro");
  const [answers, setAnswers] = useState<string[]>(
    diagnosticConfig.preQual.questions.map(() => "")
  );
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
      setStep(
        step + 1 <= preQualQuestions.length - 1 ? step + 1 : "calendar"
      );
    }
  };

  const encodedAnswers = encodeURIComponent(
    preQualQuestions.map((_, i) => `Q${i + 1}: ${answers[i]}`).join(" | ")
  );

  const calendarParams = [
    firstName && `first_name=${encodeURIComponent(firstName)}`,
    email && `email=${encodeURIComponent(email)}`,
    `${diagnosticConfig.ghl.fieldKeys.prequalAnswers}=${encodedAnswers}`,
  ]
    .filter(Boolean)
    .join("&");

  const calendarSrc = `${diagnosticConfig.vsl.calendarUrl}?${calendarParams}`;

  const progress =
    typeof step === "number"
      ? step + 1
      : step === "calendar"
        ? preQualQuestions.length
        : 0;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-graphite/95 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-8 min-h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right z-20 p-2 text-paper/40 hover:text-paper transition-colors"
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
                    progress >= n + 1 ? "text-crimson" : "text-paper/20"
                  }`}
                >
                  Q{n + 1}
                </span>
              ))}
            </div>
            <div className="h-1 bg-white/5 overflow-hidden">
              <div
                className="h-full bg-crimson transition-all duration-500"
                style={{
                  width: `${(progress / preQualQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Intro screen */}
        {step === "intro" && (
          <div className="text-center space-y-12 py-16">
            <p className="text-paper/70 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
              {diagnosticConfig.preQual.intro}
            </p>
            <button
              onClick={() => setStep(0)}
              className="bg-crimson text-paper border border-crimson px-16 py-6 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:bg-oxblood hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(110,22,24,0.4)]"
            >
              Begin
            </button>
          </div>
        )}

        {/* Question screens (multiple choice) */}
        {typeof step === "number" && preQualQuestions[step].options && (
          <div className="space-y-10 py-8">
            <p className="serif text-paper text-2xl md:text-3xl font-light leading-relaxed text-center">
              {preQualQuestions[step].question}
            </p>
            <div className="space-y-4 max-w-xl mx-auto">
              {preQualQuestions[step].options!.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left p-6 border transition-all duration-300 ${
                    selected === option.value
                      ? "border-camel bg-camel/10 text-paper shadow-[0_0_20px_rgba(184,159,130,0.15)]"
                      : "border-paper/10 bg-paper/5 text-paper/60 hover:border-paper/20 hover:bg-paper/10"
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
                  className="bg-crimson text-paper border border-crimson px-14 py-5 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:bg-oxblood hover:-translate-y-0.5"
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
            <p className="serif text-paper text-2xl md:text-3xl font-light leading-relaxed text-center">
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
                className="w-full bg-paper/5 border border-paper/10 p-6 text-paper text-base font-light leading-relaxed focus:outline-none focus:border-camel/50 focus:ring-1 focus:ring-camel/30 resize-none placeholder:text-paper/20"
                placeholder="Type your answer here..."
              />
            </div>
            {answers[step].trim() && (
              <div className="text-center">
                <button
                  onClick={handleTextNext}
                  className="bg-crimson text-paper border border-crimson px-14 py-5 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:bg-oxblood hover:-translate-y-0.5"
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
              <h2 className="serif text-3xl md:text-4xl font-normal text-paper">
                Schedule Your{" "}
                <span className="italic font-normal text-camel">
                  Decision Intelligence Debrief
                </span>
              </h2>
              <p className="text-paper/40 text-sm font-light">
                Select a time that works best for you.
              </p>
            </div>
            <div className="bg-white overflow-hidden border border-greige shadow-2xl">
              <iframe
                src={calendarSrc}
                style={{ width: "100%", minHeight: 900, border: "none" }}
                scrolling="yes"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WealthRedirectionContent = ({
  firstName,
  email,
}: {
  firstName?: string;
  email?: string;
}) => {
  const [showPreQual, setShowPreQual] = useState(false);

  const { vsl } = diagnosticConfig;

  return (
    <>
      <main className="flex-grow bg-graphite">
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-20 space-y-24">
          {/* Hero */}
          <section className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-5 py-2 border border-camel/30 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-camel">
              {vsl.callName}
            </div>
            <h1 className="serif text-5xl md:text-7xl font-normal text-paper leading-[1.1]">
              You&rsquo;ve Seen the Gaps.{" "}
              <span className="italic font-normal text-camel">
                Now Let&rsquo;s Close Them.
              </span>
            </h1>
            <p className="text-xl text-paper/50 font-light leading-relaxed max-w-3xl mx-auto">
              {vsl.subheadline}
            </p>
          </section>

          {/* Video (if URL exists) */}
          {vsl.videoUrl && (
            <section className="max-w-4xl mx-auto space-y-10">
              <div className="w-full overflow-hidden border border-paper/10 shadow-2xl">
                <video
                  className="w-full aspect-video"
                  controls
                  playsInline
                  preload="metadata"
                  src={vsl.videoUrl}
                />
              </div>
            </section>
          )}

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setShowPreQual(true)}
              className="bg-crimson text-paper border border-crimson px-16 py-7 text-base font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:bg-oxblood hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(110,22,24,0.4)] inline-flex items-center gap-3 group"
            >
              {vsl.bookingButtonText}
              <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-paper/40 text-sm font-light max-w-xl mx-auto mt-4">
              {vsl.bookingButtonMicrocopy}
            </p>
          </div>

          {/* Offer Blocks */}
          <section className="space-y-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="serif text-4xl md:text-5xl font-normal text-paper">
                What Happens Inside Your{" "}
                <span className="italic font-normal text-camel">
                  Decision Intelligence Debrief
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vsl.offerBlocks.map((block, i) => (
                <div
                  key={i}
                  className="deanar-card-dark p-10 space-y-6 hover:border-paper/15 transition-all duration-500"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-camel/10 border border-camel/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-camel" />
                    </div>
                    <h3 className="serif text-xl font-medium text-paper">
                      {block.title}
                    </h3>
                  </div>
                  <p className="text-paper/50 text-sm leading-relaxed font-light">
                    {block.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* If We Decide to Work Together */}
          <section className="max-w-4xl mx-auto">
            <div className="bg-oxblood/40 border border-paper/5 p-10 md:p-16 space-y-8">
              <h2 className="serif text-3xl md:text-4xl font-normal text-paper">
                {vsl.ifWeWorkTogether.heading}
              </h2>
              <p className="text-paper/60 text-base leading-relaxed font-light">
                {vsl.ifWeWorkTogether.body}
              </p>
              <div className="space-y-2 border-t border-paper/5 pt-8">
                <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-camel/60 mb-6">
                  What You&rsquo;ll Get
                </h4>
                <ul className="space-y-4">
                  {vsl.ifWeWorkTogether.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-paper/60 text-base font-light"
                    >
                      <ArrowRight className="w-4 h-4 text-camel flex-shrink-0 mt-1" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Who This Is For */}
          <section className="max-w-4xl mx-auto">
            <div className="deanar-card-dark p-10 md:p-16 space-y-8">
              <h3 className="serif text-3xl font-normal text-paper">
                {vsl.qualifierHeading}
              </h3>
              <ul className="space-y-4 pl-2">
                {vsl.qualifierBullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-paper/60 text-base font-light"
                  >
                    <CheckCircle2 className="w-5 h-5 text-camel flex-shrink-0 mt-0.5" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <p className="text-paper/40 text-sm italic pt-4">
                {vsl.investmentContext}
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-oxblood p-16 md:p-24 text-center relative overflow-hidden max-w-5xl mx-auto">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{
                backgroundImage: `url('${diagnosticConfig.brand.motifs.intersections}')`,
              }}
            />
            <div className="space-y-10 relative z-10">
              <h2 className="serif text-4xl md:text-6xl font-normal text-paper leading-tight">
                Ready to See{" "}
                <span className="italic font-normal text-camel">
                  What Your Audience Is Actually Signaling?
                </span>
              </h2>
              <button
                onClick={() => setShowPreQual(true)}
                className="bg-crimson text-paper border border-crimson px-16 py-7 text-base font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:bg-crimson/90 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(110,22,24,0.4)] inline-flex items-center gap-3 group"
              >
                {vsl.finalCtaButtonText}
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-paper/40 text-sm font-light max-w-xl mx-auto">
                {vsl.finalCtaMicrocopy}
              </p>
            </div>
          </section>
        </div>
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
