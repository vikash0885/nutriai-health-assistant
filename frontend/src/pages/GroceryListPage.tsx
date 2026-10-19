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

      {/* Add Custom Item Card */}
      <form onSubmit={handleAdd} className="bg-[#0d0d12] rounded-3xl p-5 border border-zinc-800/90 shadow-xl flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          required
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add item (e.g. Baby Spinach, Moong Dal, Lemon)..."
          className="flex-1 p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white placeholder:text-zinc-600"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-zinc-900 text-white">
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 gold-box-glow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Items by Category */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-zinc-500">Loading grocery list...</div>
      ) : items.length === 0 ? (
        <div className="bg-[#0d0d12] rounded-3xl p-12 text-center border border-zinc-800/90 shadow-xl max-w-md mx-auto">
          <ShoppingCart className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-bold text-white mb-1">Your list is currently empty</h3>
          <p className="text-xs text-zinc-400">
            Generate an AI meal plan and click 'Generate Grocery List' to populate your shopping items!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const catItems = items.filter((i) => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="bg-[#0d0d12] rounded-3xl p-6 border border-zinc-800/90 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-sm font-bold text-white">{category}</h3>
                  <span className="text-xs font-semibold text-zinc-400">
                    {catItems.filter((i) => i.is_purchased).length}/{catItems.length} purchased
                  </span>
                </div>

                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        item.is_purchased
                          ? 'bg-black/30 border-zinc-900 opacity-50'
                          : 'bg-black/60 border border-zinc-800 hover:border-amber-500/40'
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
