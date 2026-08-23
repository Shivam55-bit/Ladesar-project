import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Sparkles, 
  Send, 
  Leaf, 
  ShoppingBag, 
  Heart, 
  CheckCircle2, 
  Bot, 
  Loader2, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const AiWellnessAdvisor: React.FC = () => {
  const { isAiAdvisorOpen, setIsAiAdvisorOpen, products, addToCart, setView } = useStore();

  const [query, setQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('Immunity & Vitality');
  const [selectedDosha, setSelectedDosha] = useState('Vata-Pitta Balance');
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  if (!isAiAdvisorOpen) return null;

  const quickGoals = [
    'Immunity & Vitality',
    'Gut Health & Agni',
    'Joint & Bone Mobility',
    'Deep Restful Sleep',
    'Glowing Radiant Skin',
    'Detox & Cleanse (Ama)'
  ];

  const handleConsultation = async (customText?: string) => {
    const textToSend = customText || query || `Ayurvedic organic protocol for ${selectedGoal}`;
    setIsLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          healthGoal: selectedGoal,
          userDosha: selectedDosha,
          pantryIngredients: pantryIngredients || 'A2 Ghee, Turmeric, Mustard Oil, Honey'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiResponse(data.data);
      }
    } catch {
      // Fallback
      setAiResponse({
        title: "Ayurvedic Rasayana & Organic Nutrition Protocol",
        summary: "In authentic Ayurveda, pure unadulterated cold-processed food is the highest medicine.",
        doshaAnalysis: "A2 Bilona Desi Ghee balances excess Vata body dryness while Lakadong Turmeric kindles digestive Agni.",
        recommendedProducts: [
          {
            name: "A2 Bilona Vedic Desi Gir Cow Ghee",
            reason: "High in butyric acid and natural fat-soluble vitamins to lubricate joints and tissues.",
            productId: "ghee-01"
          },
          {
            name: "Lakadong High-Curcumin Turmeric Powder",
            reason: "7.8% natural active Curcumin eliminates oxidative stress and cleanses liver channels.",
            productId: "spice-02"
          }
        ],
        ayurvedicRitual: "Prepare warm Golden Milk: Simmer 1 cup of warm milk with 1/2 tsp Lakadong Turmeric, 1/2 tsp A2 Ghee, and a pinch of black pepper. Drink at bedtime.",
        dietaryTip: "Always prefer cold-pressed wood-ghani oils over industrially processed refined oils."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (productId: string) => {
    const prod = products.find(p => p.id === productId) || products[0];
    addToCart(prod, prod.variants[0], 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/80 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0F3823]/95 backdrop-blur-md text-[#FAF7F2] p-5 relative border-b border-[#D4AF37]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FAF7F2] flex items-center justify-center text-[#0F3823] shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-luxury flex items-center gap-2">
                AI Ayurvedic Vaidya & Nutrition Scientist
              </h3>
              <p className="text-xs text-[#D4AF37]">
                Personalized Organic Remedies & Farm Recipe Consultation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAdvisorOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Quick Health Goals Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0F3823] block mb-2">
              Select Your Primary Health Goal:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickGoals.map(goal => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    selectedGoal === goal
                      ? 'bg-[#0F3823] text-[#FAF7F2] shadow-sm font-semibold'
                      : 'bg-white/70 backdrop-blur-xs text-gray-700 hover:bg-white border border-white/80 shadow-2xs'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Question Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0F3823] block">
              Or Ask Any Organic Health & Cooking Question:
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. How to use Lakadong Turmeric and A2 Ghee for daily immunity? Or what spices aid digestion?"
                className="glass-input w-full text-xs sm:text-sm p-3.5 rounded-2xl border focus:outline-none shadow-2xs resize-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleConsultation()}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#0F3823] to-[#164E31] hover:from-[#164E31] hover:to-[#0F3823] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 border border-white/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> Generating Vedic Protocol...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Consult AI Vaidya
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/80 shadow-xs text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#0F3823] shadow-xs">
                <Leaf className="w-6 h-6 animate-spin text-[#D4AF37]" />
              </div>
              <div className="text-sm font-bold text-[#0F3823]">
                Analyzing Classical Vedic Principles & Pure Ladesar Harvests...
              </div>
              <p className="text-xs text-gray-500">
                Evaluating bio-active curcumin, butyric acid fatty profile, and dosha balance.
              </p>
            </div>
          )}

          {/* AI Result Card */}
          {aiResponse && !isLoading && (
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/90 p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Title & Summary */}
              <div className="border-b border-gray-200/60 pb-3">
                <div className="flex items-center gap-1.5 text-xs text-[#B8860B] font-bold uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tailored Vedic Protocol
                </div>
                <h4 className="text-lg font-bold text-[#0F3823] font-serif-luxury">
                  {aiResponse.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {aiResponse.summary}
                </p>
              </div>

              {/* Dosha Analysis */}
              {aiResponse.doshaAnalysis && (
                <div className="bg-white/70 backdrop-blur-xs p-3.5 rounded-xl border border-white/80 text-xs shadow-2xs">
                  <span className="font-bold text-[#0F3823]">🌿 Dosha Dynamics: </span>
                  <span className="text-gray-700">{aiResponse.doshaAnalysis}</span>
                </div>
              )}

              {/* Step-by-Step Daily Ritual */}
              {aiResponse.ayurvedicRitual && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F3823] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" /> Recommended Preparation / Ritual
                  </h5>
                  <div className="bg-amber-50/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed shadow-2xs">
                    {aiResponse.ayurvedicRitual}
                  </div>
                </div>
              )}

              {/* Recommended Ladesar Products */}
              {aiResponse.recommendedProducts && aiResponse.recommendedProducts.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F3823]">
                    Recommended Organic Staples for this Protocol:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiResponse.recommendedProducts.map((rec: any, i: number) => {
                      const matched = products.find(p => p.id === rec.productId || p.name.toLowerCase().includes(rec.name.toLowerCase())) || products[0];
                      return (
                        <div
                          key={i}
                          className="bg-white/75 backdrop-blur-xs p-3 rounded-2xl border border-white/80 flex flex-col justify-between shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <img
                                src={matched.heroImage}
                                alt={rec.name}
                                className="w-10 h-10 object-cover rounded-xl border border-white/80"
                              />
                              <div>
                                <div className="text-xs font-bold text-[#0F3823] line-clamp-1">
                                  {rec.name}
                                </div>
                                <div className="text-[11px] text-[#B8860B] font-semibold">
                                  ₹{matched.variants[0]?.price}
                                </div>
                              </div>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-snug line-clamp-2 mb-2">
                              {rec.reason}
                            </p>
                          </div>

                          <button
                            onClick={() => handleQuickAdd(matched.id)}
                            className="w-full bg-[#0F3823] hover:bg-[#164E31] text-white text-[11px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <ShoppingBag className="w-3 h-3 text-[#D4AF37]" /> Add to Bag
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dietary Tip */}
              {aiResponse.dietaryTip && (
                <div className="text-[11px] text-gray-500 italic pt-2 border-t border-gray-200/60 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span><strong>Vedic Wisdom:</strong> {aiResponse.dietaryTip}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
