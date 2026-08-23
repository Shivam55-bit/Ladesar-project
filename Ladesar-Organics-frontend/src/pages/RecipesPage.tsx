import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MOCK_RECIPES } from '../data/mockData';
import { 
  Sparkles, 
  Clock, 
  Users, 
  Leaf, 
  ShoppingBag, 
  ChevronRight, 
  BookOpen, 
  Heart 
} from 'lucide-react';

export const RecipesPage: React.FC = () => {
  const { products, addToCart, showToast } = useStore();
  const [selectedRecipe, setSelectedRecipe] = useState(MOCK_RECIPES[0]);

  const handleAddAllIngredients = (recipe: typeof MOCK_RECIPES[0]) => {
    recipe.ingredients.forEach(ing => {
      const pid = ing.matchedProductId || ing.productId;
      if (pid) {
        const prod = products.find(p => p.id === pid);
        if (prod) {
          addToCart(prod, prod.variants[0], 1);
        }
      }
    });
    showToast(`Added pure organic staples for "${recipe.title}" to bag!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] text-[#0F3823] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50">
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" /> Ayurvedic Rasayana & Healing Kitchen
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0F3823] font-serif-luxury">
          Ancestral Recipes & Daily Remedies
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Ancient Charaka Samhita kitchen formulas prepared with pure A2 Bilona Ghee, cold-pressed oils, and stone-ground medicinal spices.
        </p>
      </div>

      {/* Featured Recipe Hero Spotlight */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 relative aspect-square lg:aspect-auto">
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#0F3823] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            🌿 Featured Vedic Ritual
          </div>
        </div>

        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold mb-2">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#B8860B]" /> {selectedRecipe.prepTime}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#B8860B]" /> Serves {selectedRecipe.servings}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">100% Ayurvedic</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F3823] font-serif-luxury">
              {selectedRecipe.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {selectedRecipe.description}
            </p>

            {/* Ayurvedic Benefits */}
            <div className="mt-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#0F3823]/10 text-xs">
              <span className="font-bold text-[#0F3823] block mb-1">🌿 Dosha & Health Action:</span>
              <span className="text-gray-700">{selectedRecipe.ayurvedicBenefits}</span>
            </div>

            {/* Ingredients checklist */}
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Ingredients Required:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="font-medium text-gray-800">{ing.item}</span>
                    <span className="text-[#B8860B] font-bold">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Method of Preparation:
              </h3>
              <ol className="space-y-1.5 list-decimal list-inside text-xs text-gray-700">
                {selectedRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleAddAllIngredients(selectedRecipe)}
              className="bg-[#0F3823] hover:bg-[#164E31] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Add All Recipe Staples to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Directory Browser */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#0F3823] font-serif-luxury">
          Explore Healing Recipe Collection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                setSelectedRecipe(recipe);
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-lg flex flex-col justify-between ${
                selectedRecipe.id === recipe.id
                  ? 'border-2 border-[#0F3823] ring-2 ring-[#D4AF37]/30'
                  : 'border-gray-200 hover:border-[#D4AF37]'
              }`}
            >
              <div>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-1">
                  <span>{recipe.prepTime}</span>
                  <span>•</span>
                  <span>Serves {recipe.servings}</span>
                </div>
                <h4 className="text-sm font-bold text-[#0F3823] line-clamp-1">{recipe.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{recipe.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#0F3823]">
                <span>View Full Recipe</span>
                <ChevronRight className="w-4 h-4 text-[#B8860B]" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
