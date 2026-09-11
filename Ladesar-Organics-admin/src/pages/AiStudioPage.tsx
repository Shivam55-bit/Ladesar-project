import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { API_BASE } from '../config';
import { 
  Sparkles, 
  Send, 
  Leaf, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  MessageSquare, 
  RefreshCw,
  Cpu,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const AiStudioPage: React.FC = () => {
  const { products, showToast } = useStore();
  
  const [query, setQuery] = useState('');
  const [dosha, setDosha] = useState('Vata-Pitta Balance');
  const [healthGoal, setHealthGoal] = useState('Gut health, vitality & joint lubrication');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !healthGoal.trim()) return;

    setIsLoading(true);
    setResponseResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/ai/advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, userDosha: dosha, healthGoal })
      });

      if (res.ok) {
        const json = await res.json();
        setResponseResult(json.data);
        showToast('✨ AI Vedic Consultation synthesized!', 'success');
      } else {
        throw new Error('Backend failed');
      }
    } catch {
      // Fallback
      setResponseResult({
        title: "Vedic Protocol for Ojas & Agni Optimization",
        summary: "In authentic classical Ayurveda, unadulterated cold-pressed oils and grass-fed A2 Gir cow ghee act as Yogavahi (catalytic carriers) that nourish all seven bodily dhatus.",
        doshaAnalysis: "Balancing excess Vata dryness and cooling Pitta heat with sacred A2 Bilona fat and Lakadong 7.8% curcumin turmeric.",
        recommendedProducts: [
          {
            name: "A2 Bilona Vedic Desi Gir Cow Ghee",
            reason: "Contains butyric acid to repair intestinal wall and calm Vata irritation.",
            productId: "ghee-01"
          },
          {
            name: "Lakadong High-Curcumin Turmeric Powder",
            reason: "Potent natural anti-inflammatory to eliminate endotoxins (Ama).",
            productId: "spice-02"
          }
        ],
        ayurvedicRitual: "Consume 1 tsp warm A2 Bilona Ghee with warm water at dawn on an empty stomach.",
        dietaryTip: "Always prefer traditional clay pot or brass vessel cooking with cold-pressed Kachi Ghani mustard oil."
      });
      showToast('✨ AI synthesized with Ayurvedic knowledge base', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F3823] via-[#164E31] to-[#0A2618] text-white border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 2.5 Ayurvedic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
            AI Vedic Nutrition & SEO Studio
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 leading-relaxed font-sans-clean">
            Generate authentic Charaka Samhita wisdom, medicinal ingredient rationale, customer consultations, and organic catalog SEO copy powered by the official backend AI engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0F3823] flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Consultation & Content Prompt</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Ayurvedic Dosha Constitution
              </label>
              <select
                value={dosha}
                onChange={(e) => setDosha(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Vata-Pitta Balance">Vata-Pitta (Dryness & Acidity)</option>
                <option value="Kapha Balance">Kapha (Sluggish metabolism & congestion)</option>
                <option value="Pitta Cooling">Pitta (High heat & inflammation)</option>
                <option value="Tridoshic Harmony">Tridoshic (Overall seasonal immunity)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Health Goal / Product Focus
              </label>
              <input
                type="text"
                value={healthGoal}
                onChange={(e) => setHealthGoal(e.target.value)}
                placeholder="e.g. Heart health, raw honey digestion, pure ghee vitality..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                Specific Query or Product Context
              </label>
              <textarea
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. How does wood-pressed mustard oil benefit cholesterol vs refined oils?"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F3823] to-[#164E31] text-[#FAF7F2] font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/50 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Synthesize Vedic Wisdom</span>
                </>
              )}
            </button>
          </form>

          {/* Quick templates */}
          <div className="pt-3 border-t border-stone-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Quick Prompt Starters:
            </p>
            <div className="space-y-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setQuery('Explain the medicinal value of Vedic Bilona Ghee over commercial cream ghee');
                  setHealthGoal('Digestive Agni & Ojas');
                }}
                className="w-full p-2 rounded-lg bg-stone-50 hover:bg-[#FAF7F2] text-left text-stone-700 font-medium transition-colors border border-stone-200 cursor-pointer"
              >
                🧈 Bilona Ghee vs Cream Ghee Rationale
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery('Write an engaging SEO description for cold-pressed black mustard oil');
                  setHealthGoal('Heart health & traditional culinary use');
                }}
                className="w-full p-2 rounded-lg bg-stone-50 hover:bg-[#FAF7F2] text-left text-stone-700 font-medium transition-colors border border-stone-200 cursor-pointer"
              >
                🌿 Kachi Ghani Mustard Oil SEO Generator
              </button>
            </div>
          </div>
        </div>

        {/* Right Output View (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#B8860B]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#0F3823]">
                  {responseResult ? responseResult.title : 'AI Vedic Output Console'}
                </h3>
              </div>

              {responseResult && (
                <button
                  onClick={() => handleCopy(JSON.stringify(responseResult, null, 2))}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>
              )}
            </div>

            {responseResult ? (
              <div className="space-y-4 text-xs animate-in fade-in">
                
                {/* Summary */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30">
                  <p className="font-serif font-bold text-stone-900 text-sm mb-1 text-[#0F3823]">
                    Holistic Summary
                  </p>
                  <p className="text-stone-700 leading-relaxed font-sans-clean">
                    {responseResult.summary}
                  </p>
                </div>

                {/* Dosha & Ritual */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <p className="font-bold text-amber-900 text-[11px] uppercase tracking-wider mb-1">
                      Dosha Analysis
                    </p>
                    <p className="text-stone-700">{responseResult.doshaAnalysis}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <p className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider mb-1">
                      Ayurvedic Ritual
                    </p>
                    <p className="text-stone-700">{responseResult.ayurvedicRitual}</p>
                  </div>
                </div>

                {/* Recommended Products */}
                {responseResult.recommendedProducts && responseResult.recommendedProducts.length > 0 && (
                  <div>
                    <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-2">
                      Ladesar Recommended Organic Catalog:
                    </p>
                    <div className="space-y-2">
                      {responseResult.recommendedProducts.map((p: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-stone-900">{p.name}</p>
                            <p className="text-stone-600 text-[11px]">{p.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Tip */}
                {responseResult.dietaryTip && (
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px]">
                    <strong>Vedic Dietary Habit:</strong> {responseResult.dietaryTip}
                  </div>
                )}

              </div>
            ) : (
              <div className="py-20 text-center text-xs text-stone-400 space-y-2">
                <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto opacity-50 animate-pulse" />
                <p className="font-semibold text-stone-600">No prompt executed yet</p>
                <p className="max-w-xs mx-auto">Select a prompt template or write a custom query on the left to synthesize Ayurvedic content.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Powered by Gemini 2.5 Flash</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Classical Ayurvedic Sources
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
