import { ShieldCheck } from "lucide-react";
import { AudienceIntelligenceContent } from "../components/WealthRedirectionContent";

export default function Schedule() {
  return (
    <div className="min-h-screen deanar-bg-graphite flex flex-col">

      {/* Header */}
      <header className="border-b border-paper/5 sticky top-0 z-50 bg-graphite/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex justify-between items-center">
          <span className="serif text-xl text-paper tracking-[0.25em] uppercase">
            DEANAR
          </span>
          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-paper/30">
            <ShieldCheck className="w-3 h-3 text-camel/40" />
            Decision Intelligence Debrief
          </div>
        </div>
      </header>

      {/* Full content — no session required */}
      <AudienceIntelligenceContent />

    </div>
  );
}
