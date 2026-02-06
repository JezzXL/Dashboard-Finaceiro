import { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Plus, Check } from 'lucide-react';
import type { Category } from '../../types/finance';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

const EMOJI_OPTIONS = ['🍔', '🚗', '🏥', '📚', '🎮', '🏠', '👕', '📺', '💡', '📦', '✈️', '🎬', '🎵', '💰', '🛒', '⚽', '🎨', '☕', '🍕', '🎁'];
const COLOR_OPTIONS = ['#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#a855f7', '#eab308', '#64748b'];

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { categories, addCategory } = useFinance();
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📦');
  const [selectedColor, setSelectedColor] = useState('#64748b');

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Digite um nome para a categoria');
      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      icon: selectedEmoji,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };

    addCategory(newCategory);
    onChange(newCategory.name);
    setIsCreating(false);
    setNewCategoryName('');
    setSelectedEmoji('📦');
    setSelectedColor('#64748b');
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewCategoryName('');
    setSelectedEmoji('📦');
    setSelectedColor('#64748b');
  };

  if (isCreating) {
    return (
      <div className="space-y-4 p-4 bg-slate-50 rounded-xl border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-800">Nova Categoria</h4>
          <button
            type="button"
            onClick={handleCancelCreate}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Cancelar
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Nome da Categoria</label>
            <input
              type="text"
              className="w-full p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: Academia, Pets..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Ícone</label>
            <div className="grid grid-cols-10 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedEmoji === emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Cor</label>
            <div className="grid grid-cols-10 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedColor === color
                      ? 'border-slate-800'
                      : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check size={16} className="text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateCategory}
            className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-all"
          >
            Criar Categoria
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Categoria</label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.name)}
            className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
              value === category.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{category.icon}</span>
              <span className="text-xs font-bold text-slate-700 truncate">{category.name}</span>
            </div>
          </button>
        ))}
        
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="p-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600">
            <Plus size={20} />
            <span className="text-xs font-bold">Nova</span>
          </div>
        </button>
      </div>
    </div>
  );
}