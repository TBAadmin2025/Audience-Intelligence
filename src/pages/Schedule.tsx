import { ShieldCheck } from "lucide-react";
import { WealthRedirectionContent } from "../components/WealthRedirectionContent";

export default function Schedule() {
  return (
    <div className="min-h-screen font-sans vlari-bg selection:bg-gold-metallic/30 flex flex-col">
      {/* Header */}
      <header className="bg-midnight/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-10 py-6 flex justify-between items-center w-full">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gold-metallic rounded-sm flex items-center justify-center mr-4 shadow-2xl">
              <span className="text-midnight font-serif font-bold text-lg">V</span>
            </div>
            <span className="serif font-medium text-xl text-marble tracking-[0.2em] uppercase">Vlari</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-marble/30">
            <ShieldCheck className="w-4 h-4 text-gold-metallic/40" />
            Wealth Redirection Strategy
          </div>
        </div>
      </header>

      <WealthRedirectionContent />
    </div>
  );
}
