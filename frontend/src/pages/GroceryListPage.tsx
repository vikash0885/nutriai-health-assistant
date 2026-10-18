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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Grocery Shopping List</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ingredients automatically synced from your meal plans, organized by market aisles.
        </p>
      </div>

      {/* Add Custom Item Card */}
      <form onSubmit={handleAdd} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          required
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add item (e.g. Baby Spinach, Moong Dal, Lemon)..."
          className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Items by Category */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading grocery list...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
          <ShoppingCart className="w-12 h-12 text-violet-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Your list is currently empty</h3>
          <p className="text-xs text-slate-500">
            Generate an AI meal plan and click 'Generate Grocery List' to populate your shopping items!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const catItems = items.filter((i) => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">{category}</h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {catItems.filter((i) => i.is_purchased).length}/{catItems.length} purchased
                  </span>
                </div>

                <div className="space-y-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        item.is_purchased
                          ? 'bg-slate-50/50 border-slate-100 opacity-60'
                          : 'bg-white border-slate-200/70 hover:border-violet-300'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.is_purchased}
                          onChange={() => handleToggle(item)}
                          className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
                        />
                        <span
                          className={`text-xs font-semibold ${
                            item.is_purchased ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {item.item_name}
                        </span>
                        <span className="text-[11px] text-slate-400">({item.quantity})</span>
                      </label>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
