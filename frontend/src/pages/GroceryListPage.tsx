import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GroceryItem } from '../types';
import { ShoppingCart, Plus, Check, Trash2, CheckCircle2 } from 'lucide-react';

export const GroceryListPage: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce & Fresh Veggies');
  const [newItemQty, setNewItemQty] = useState('1 unit');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'Produce & Fresh Veggies',
    'Dairy & Proteins',
    'Grains & Pulses',
    'Spices & Oils',
    'Pantry',
  ];

  const fetchItems = async () => {
    try {
      const data = await api.listGrocery();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggle = async (item: GroceryItem) => {
    try {
      await api.updateGrocery(item.id, { is_purchased: !item.is_purchased });
      fetchItems();
    } catch (err: any) {
      alert(`Could not update: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteGrocery(id);
      fetchItems();
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      await api.addGrocery({
        item_name: newItemName.trim(),
        category: newItemCategory,
        quantity: newItemQty || '1 unit',
      });
      setNewItemName('');
      fetchItems();
    } catch (err: any) {
      alert(`Could not add item: ${err.message}`);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Grocery Shopping List</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Ingredients automatically synced from your meal plans, organized by market aisles.
        </p>
      </div>

      {/* Add Custom Item Card - Royal Amber Onyx */}
      <form onSubmit={handleAdd} className="bg-gradient-to-r from-[#211504]/90 via-[#150d02]/95 to-[#0b0601] rounded-3xl p-5 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row gap-3 backdrop-blur-xs">
        <input
          type="text"
          required
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add item (e.g. Baby Spinach, Moong Dal, Lemon)..."
          className="flex-1 p-3 rounded-xl bg-black/60 border border-amber-500/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="p-3 rounded-xl bg-black/60 border border-amber-500/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-zinc-900 text-white">
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black rounded-xl text-sm font-black shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add Item
        </button>
      </form>

      {/* Items by Category */}
      {isLoading ? (
        <div className="py-12 text-center text-sm font-medium text-zinc-400">Loading grocery list...</div>
      ) : items.length === 0 ? (
        <div className="bg-gradient-to-br from-[#1c1206]/90 via-[#110a03]/95 to-[#090501] rounded-3xl p-12 text-center border border-amber-500/40 shadow-xl max-w-md mx-auto">
          <ShoppingCart className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-lg font-black text-white mb-1">Your list is currently empty</h3>
          <p className="text-sm text-zinc-300 font-medium">
            Generate an AI meal plan and click 'Generate Grocery List' to populate your shopping items!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const catItems = items.filter((i) => i.category === category);
            if (catItems.length === 0) return null;

            // Distinct themed color gradient for each grocery category
            const catLower = category.toLowerCase();
            const catTheme =
              catLower.includes('produce') || catLower.includes('vegetable') || catLower.includes('fruit')
                ? { bg: 'from-[#052618]/90 via-[#03180f]/95 to-[#010c07]', border: 'border-emerald-500/40', badge: 'text-emerald-300', divide: 'border-emerald-500/20' }
                : catLower.includes('dairy') || catLower.includes('egg')
                ? { bg: 'from-[#281905]/90 via-[#1a1002]/95 to-[#0c0701]', border: 'border-amber-500/40', badge: 'text-amber-300', divide: 'border-amber-500/20' }
                : catLower.includes('grain') || catLower.includes('pulse') || catLower.includes('dal')
                ? { bg: 'from-[#2a1306]/90 via-[#1a0a03]/95 to-[#0c0501]', border: 'border-orange-500/40', badge: 'text-orange-300', divide: 'border-orange-500/20' }
                : catLower.includes('spice') || catLower.includes('condiment') || catLower.includes('oil')
                ? { bg: 'from-[#290714]/90 via-[#19030c]/95 to-[#0c0106]', border: 'border-rose-500/40', badge: 'text-rose-300', divide: 'border-rose-500/20' }
                : catLower.includes('meat') || catLower.includes('fish') || catLower.includes('poultry')
                ? { bg: 'from-[#2a0808]/90 via-[#180404]/95 to-[#0b0101]', border: 'border-red-500/40', badge: 'text-red-300', divide: 'border-red-500/20' }
                : catLower.includes('beverage') || catLower.includes('drink')
                ? { bg: 'from-[#041d2d]/90 via-[#02121d]/95 to-[#01090f]', border: 'border-cyan-500/40', badge: 'text-cyan-300', divide: 'border-cyan-500/20' }
                : { bg: 'from-[#1c082e]/90 via-[#11041d]/95 to-[#08020e]', border: 'border-purple-500/40', badge: 'text-purple-300', divide: 'border-purple-500/20' };

            return (
              <div key={category} className={`bg-gradient-to-br ${catTheme.bg} rounded-3xl p-6 border ${catTheme.border} shadow-2xl space-y-3 backdrop-blur-xs`}>
                <div className={`flex items-center justify-between border-b ${catTheme.divide} pb-2`}>
                  <h3 className="text-base font-black text-white">{category}</h3>
                  <span className={`text-xs font-black ${catTheme.badge}`}>
                    {catItems.filter((i) => i.is_purchased).length}/{catItems.length} purchased
                  </span>
                </div>

                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        item.is_purchased
                          ? 'bg-black/40 border-zinc-900 opacity-50'
                          : 'bg-black/60 border border-zinc-800/80 hover:border-amber-500/40'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.is_purchased}
                          onChange={() => handleToggle(item)}
                          className="w-4 h-4 text-amber-500 bg-black rounded border-zinc-700 focus:ring-amber-400"
                        />
                        <span
                          className={`text-sm font-bold ${
                            item.is_purchased ? 'line-through text-zinc-500' : 'text-zinc-100'
                          }`}
                        >
                          {item.item_name}
                        </span>
                        <span className="text-xs text-zinc-300 font-medium">({item.quantity})</span>
                      </label>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
