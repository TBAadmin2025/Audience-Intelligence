import { motion } from "motion/react";
import { ChevronRight, CheckCircle2, ShieldCheck, Lock, Info, ChartLine } from "lucide-react";
import { useState, useEffect } from "react";

export const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
    <motion.div 
      className="h-full bg-gold-metallic"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      style={{ boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)' }}
    />
  </div>
);

export const QuestionCard = ({ 
  question, 
  options, 
  onSelect, 
  value 
}: { 
  question: string; 
  options: string[]; 
  onSelect: (val: string) => void;
  value?: string;
}) => (
  <div className="space-y-16">
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-gold-metallic font-bold uppercase tracking-[0.4em] text-[10px]">
        <ShieldCheck className="w-4 h-4" />
        Private Wealth Architecture
      </div>
      <h2 className="text-5xl md:text-7xl font-serif font-medium text-marble leading-tight tracking-tight">
        {question}
      </h2>
    </div>
    <div className="grid gap-5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`group flex items-center justify-between p-10 border rounded-sm text-left transition-all duration-700 relative overflow-hidden ${
            value === opt 
              ? "bg-navy-deep text-white border-gold-metallic shadow-[0_0_40px_rgba(212,175,55,0.15)] scale-[1.01]" 
              : "bg-charcoal/40 border-white/5 hover:border-gold-metallic/30 hover:shadow-2xl hover:bg-charcoal/60"
          }`}
        >
          <div className="relative z-10 flex items-center gap-8">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-700 ${
              value === opt ? "border-gold-metallic bg-gold-metallic" : "border-white/10 group-hover:border-gold-metallic/30"
            }`}>
              {value === opt && <CheckCircle2 className="w-6 h-6 text-midnight" />}
            </div>
            <span className="text-2xl font-light tracking-tight">{opt}</span>
          </div>
          <ChevronRight className={`w-8 h-8 transition-all duration-700 relative z-10 ${
            value === opt ? "translate-x-2 text-gold-metallic opacity-100" : "group-hover:translate-x-2 text-white/10 opacity-0"
          }`} />
          {value !== opt && (
            <div className="absolute inset-0 bg-gradient-to-r from-gold-metallic/0 via-gold-metallic/5 to-gold-metallic/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}
        </button>
      ))}
    </div>
  </div>
);

export const ProcessingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [step, setStep] = useState(1);
  const totalTime = 30;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (timeLeft <= 20 && timeLeft > 10) setStep(2);
    if (timeLeft <= 10) setStep(3);
  }, [timeLeft]);

  const circumference = 2 * Math.PI * 90;
  const progress = (totalTime - timeLeft) / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center py-16 px-8 relative overflow-hidden">
      {/* Background Motif */}
      <div className="absolute inset-0 bg-[url('https://plamaotwavcwxtqwenaf.supabase.co/storage/v1/object/public/brand-assets/6b2e7cf1-13d3-4f90-a083-47644dbc2c4e/1771943769366_Vlari_Motif_20260224_0933.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      <div className="max-w-3xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="artisan-card rounded-sm p-16 md:p-24 text-center"
        >
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gold-metallic/10 rounded-full mb-10 border border-gold-metallic/20">
              <ChartLine className="w-12 h-12 text-gold-metallic" />
            </div>
            <h1 className="serif font-medium text-5xl md:text-6xl text-marble mb-8 leading-tight tracking-wide">
              Architecting Your<br/><span className="italic text-gold-gradient">Private Wealth Score</span>
            </h1>
            <p className="text-xl text-marble/50 font-light tracking-wide">
              Our structural engine is modeling your redirection opportunities.
            </p>
          </div>

          <div className="my-20 flex justify-center">
            <div className="relative inline-block">
              <svg className="transform -rotate-90" width="240" height="240">
                <circle cx="120" cy="120" r="90" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="120" 
                  cy="120" 
                  r="90" 
                  stroke="url(#gold-metallic-grad)" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gold-metallic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DFB951" />
                    <stop offset="100%" stopColor="#8A650C" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-light text-marble font-serif tabular-nums">{timeLeft}</div>
                  <div className="text-[10px] text-gold-metallic/40 uppercase tracking-[0.4em] font-bold mt-2">seconds</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10 mb-16 max-w-md mx-auto">
            <div className={`flex items-center text-left transition-all duration-700 ${step >= 1 ? "opacity-100" : "opacity-20"}`}>
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center mr-8 transition-all duration-700 border ${step > 1 ? "bg-gold-metallic border-gold-metallic" : "bg-white/5 border-white/10"}`}>
                {step > 1 ? <CheckCircle2 className="w-7 h-7 text-midnight" /> : <div className="w-2 h-2 bg-gold-metallic/40 rounded-full animate-pulse" />}
              </div>
              <div className="flex-1">
                <p className={`text-xl font-medium transition-colors duration-700 ${step >= 1 ? "text-marble" : "text-marble/30"}`}>Analyzing structural patterns</p>
                <p className="text-sm text-marble/30 font-light">Evaluating income flow architecture</p>
              </div>
            </div>

            <div className={`flex items-center text-left transition-all duration-700 ${step >= 2 ? "opacity-100" : "opacity-20"}`}>
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center mr-8 transition-all duration-700 border ${step > 2 ? "bg-gold-metallic border-gold-metallic" : "bg-white/5 border-white/10"}`}>
                {step > 2 ? <CheckCircle2 className="w-7 h-7 text-midnight" /> : <div className={`w-2 h-2 rounded-full ${step === 2 ? "bg-gold-metallic animate-pulse" : "bg-white/10"}`} />}
              </div>
              <div className="flex-1">
                <p className={`text-xl font-medium transition-colors duration-700 ${step >= 2 ? "text-marble" : "text-marble/30"}`}>Calculating redirection potential</p>
                <p className="text-sm text-marble/30 font-light">Identifying strategic wealth gaps</p>
              </div>
            </div>

            <div className={`flex items-center text-left transition-all duration-700 ${step >= 3 ? "opacity-100" : "opacity-20"}`}>
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center mr-8 transition-all duration-700 border ${step > 3 ? "bg-gold-metallic border-gold-metallic" : "bg-white/5 border-white/10"}`}>
                {step > 3 ? <CheckCircle2 className="w-7 h-7 text-midnight" /> : <div className={`w-2 h-2 rounded-full ${step === 3 ? "bg-gold-metallic animate-pulse" : "bg-white/10"}`} />}
              </div>
              <div className="flex-1">
                <p className={`text-xl font-medium transition-colors duration-700 ${step >= 3 ? "text-marble" : "text-marble/30"}`}>Finalizing private report</p>
                <p className="text-sm text-marble/30 font-light">Building custom structural recommendations</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-sm p-10 border border-white/5">
            <div className="flex items-start gap-6">
              <Info className="w-7 h-7 text-gold-metallic flex-shrink-0 mt-1 opacity-60" />
              <p className="text-sm text-marble/50 text-left leading-relaxed font-light">
                Your private wealth architecture is being modeled with precision. This diagnostic ensures that every identified opportunity is structurally sound and compliant.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-16">
          <div className="flex items-center justify-center space-x-16 text-[10px] font-bold uppercase tracking-[0.4em] text-marble/20">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-gold-metallic/40" />
              <span>Secure Architecture</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gold-metallic/40" />
              <span>Private Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
