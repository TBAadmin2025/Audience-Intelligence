import { ShieldCheck } from "lucide-react";
import { WealthRedirectionContent } from "../components/WealthRedirectionContent";

export default function Schedule() {
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
            Decision Intelligence Debrief
          </div>
        </div>
      </header>

      <WealthRedirectionContent />
    </div>
  );
}
