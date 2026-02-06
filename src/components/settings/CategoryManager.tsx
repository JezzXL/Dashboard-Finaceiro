import { useFinance } from '../../hooks/useFinance';
import { Trash2 } from 'lucide-react';

export function CategoryManager() {
  const { categories, expenses, deleteCategory } = useFinance();

  const handleDelete = (categoryId: string, categoryName: string) => {
    const hasExpenses = expenses.some(exp => exp.category === categoryName);
    
    if (hasExpenses) {
      alert('Não é possível excluir uma categoria que possui gastos associados.');
      return;
    }

    if (window.confirm(`Deseja excluir a categoria "${categoryName}"?`)) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.id} className="flex items-center justify-between p-4 bg-white rounded-xl border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <span className="font-bold">{category.name}</span>
          </div>
          <button
            onClick={() => handleDelete(category.id, category.name)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}