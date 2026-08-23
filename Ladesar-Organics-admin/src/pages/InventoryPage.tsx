import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  RefreshCw, 
  Package, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { products, categories, updateProduct, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'healthy'>('all');

  const lowStockItems = products.filter(p => p.variants.some(v => v.stock < 30));
  const healthyStockItems = products.filter(p => p.variants.every(v => v.stock >= 30));

  const filtered = products.filter(p => {
    const isLow = p.variants.some(v => v.stock < 30);
    const matchesFilter = filterType === 'all' ? true : filterType === 'low' ? isLow : !isLow;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleQuickRestock = async (product: Product, amount: number = 50) => {
    const updated: Product = {
      ...product,
      variants: product.variants.map((v, i) => i === 0 ? { ...v, stock: v.stock + amount } : v)
    };
    await updateProduct(updated);
    showToast(`Restocked +${amount} units for "${product.name}"`, 'success');
  };

  const handleSetStock = async (product: Product, newStock: number) => {
    const updated: Product = {
      ...product,
      variants: product.variants.map((v, i) => i === 0 ? { ...v, stock: Math.max(0, newStock) } : v)
    };
    await updateProduct(updated);
    showToast(`Updated stock to ${newStock} for "${product.name}"`, 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-amber-200">
            <Layers className="w-3 h-3" />
            <span>Farm & Warehouse Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3823]">
            Inventory & Stock Manager
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans-clean">
            Track batch availability, cold-pressed reserves, and warehouse replenishment
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterType('all')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            filterType === 'all' ? 'bg-[#0F3823] text-white border-[#D4AF37]' : 'bg-white text-stone-800 border-stone-200'
          }`}
        >
          <p className="text-xs uppercase font-bold tracking-wider opacity-70">Total Catalog SKUs</p>
          <h3 className="text-2xl font-serif font-bold mt-1">{products.length} Products</h3>
          <p className="text-[11px] opacity-80 mt-1">Across {categories.length} Vedic food categories</p>
        </div>

        <div 
          onClick={() => setFilterType('low')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            filterType === 'low' ? 'bg-rose-900 text-white border-rose-400' : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase font-bold tracking-wider opacity-80">Low Stock Warnings</p>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold mt-1">{lowStockItems.length} Products</h3>
          <p className="text-[11px] opacity-80 mt-1">&lt; 30 units remaining threshold</p>
        </div>

        <div 
          onClick={() => setFilterType('healthy')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            filterType === 'healthy' ? 'bg-emerald-900 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase font-bold tracking-wider opacity-80">Healthy Stock</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold mt-1">{healthyStockItems.length} Products</h3>
          <p className="text-[11px] opacity-80 mt-1">Optimal warehouse buffer</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-4 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU or Product title..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Variant Size</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Health Status</th>
                <th className="p-3 text-right">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(product => {
                const variant = product.variants[0] || { stock: 0, size: 'N/A', sku: 'N/A' };
                const isLow = variant.stock < 30;

                return (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={product.heroImage} alt={product.name} className="w-9 h-9 rounded-xl object-cover border" />
                        <div>
                          <p className="font-bold text-stone-900">{product.name}</p>
                          <p className="text-[10px] text-stone-400">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-mono font-semibold text-stone-600">
                      {variant.sku}
                    </td>

                    <td className="p-3 font-medium text-stone-700">
                      {variant.size}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          defaultValue={variant.stock}
                          key={variant.stock}
                          onBlur={(e) => handleSetStock(product, Number(e.target.value))}
                          className="w-16 p-1 text-center font-bold text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-[#0F3823]"
                        />
                        <span className="text-[10px] text-stone-500">units</span>
                      </div>
                    </td>

                    <td className="p-3">
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickRestock(product, 25)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#0F3823] hover:text-white text-stone-700 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          +25
                        </button>
                        <button
                          onClick={() => handleQuickRestock(product, 50)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#0F3823] hover:text-white text-[#0F3823] font-bold text-[11px] transition-colors cursor-pointer border border-[#0F3823]/20"
                        >
                          +50 Units
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
