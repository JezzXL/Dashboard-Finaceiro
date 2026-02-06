import { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { isSameMonth, parseISO, formatDate, formatMonth } from '../../utils/date-helpers';
import { formatCurrency } from '../../utils/currency-helpers';
import { 
  Trash2, 
  CreditCard, 
  Calendar as CalendarIcon, 
  ReceiptText, 
  Edit2,
  Filter,
  Users,
  Tag,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import type { Expense, Member } from '../../types/finance';
import { EditExpenseForm } from '../forms/EditExpenseForm';

type ViewMode = 'all' | 'detailed';
type FilterType = 'all' | Member | 'category';

export function TransactionList() {
  const { expenses, selectedMonth, deleteExpense, categories } = useFinance();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const monthlyExpenses = expenses
    .filter(e => {
      const expenseDate = parseISO(e.date);
      return !isNaN(expenseDate.getTime()) && isSameMonth(expenseDate, selectedMonth);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Aplicar filtros
  const filteredExpenses = monthlyExpenses.filter(expense => {
    if (filterType === 'all') return true;
    if (filterType === 'category') return expense.category === selectedCategory;
    return expense.member === filterType;
  });

  // Calcular totais por membro
  const memberTotals = FAMILY_MEMBERS.map(member => {
    const total = filteredExpenses
      .filter(e => e.member === member.name)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { member: member.name, total, color: member.color, icon: member.icon };
  }).filter(m => m.total > 0);

  // Calcular totais por categoria
  const categoryTotals = Object.entries(
    filteredExpenses.reduce((acc, curr) => {
      const cat = curr.category || 'Sem categoria';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, total]) => {
      const category = categories.find(c => c.name === name);
      return {
        name,
        total,
        icon: category?.icon || '📦',
        color: category?.color || '#64748b'
      };
    })
    .sort((a, b) => b.total - a.total);

  const totalFiltered = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleDelete = (expense: Expense) => {
    if (expense.isInstallment) {
      const confirmAll = window.confirm(
        `Este é um gasto parcelado (${expense.currentInstallment}/${expense.totalInstallments}).\n\nOK para excluir TODAS as parcelas.\nCancelar para excluir APENAS esta parcela.`
      );
      deleteExpense(expense.id, confirmAll);
    } else {
      if (window.confirm('Deseja excluir este gasto?')) {
        deleteExpense(expense.id);
      }
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  if (monthlyExpenses.length === 0) {
    return (
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-lg text-slate-800 text-left">Últimos Lançamentos</h3>
        </div>
        <div className="p-12 text-center">
          <div className="max-w-xs mx-auto space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <ReceiptText size={32} />
            </div>
            <p className="text-slate-500 font-medium">
              As transações do mês de {formatMonth(selectedMonth).split(' de ')[0]} aparecerão aqui.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header com Título e Controles de Visualização */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Detalhamento de Gastos</h3>
              <p className="text-sm text-slate-500">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'transação' : 'transações'} · {formatCurrency(totalFiltered)}
              </p>
            </div>

            {/* Botões de Visualização */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  viewMode === 'all'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <TrendingUp size={16} />
                Geral
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BarChart3 size={16} />
                Detalhado
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filtrar por:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilterType('all');
                setSelectedCategory('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Todos
            </button>

            {FAMILY_MEMBERS.map(member => (
              <button
                key={member.name}
                onClick={() => {
                  setFilterType(member.name as Member);
                  setSelectedCategory('');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  filterType === member.name
                    ? 'text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: filterType === member.name ? member.color : undefined
                }}
              >
                <Users size={14} />
                {member.name}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setFilterType('category')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  filterType === 'category'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Tag size={14} />
                Categoria
              </button>

              {filterType === 'category' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-10">
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedCategory === category.name
                            ? 'bg-purple-100 text-purple-700'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visualização Geral (Resumo) */}
        {viewMode === 'all' && (
          <div className="p-6 space-y-4">
            <h4 className="font-bold text-slate-700 mb-4">Resumo por Membro</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {memberTotals.map(({ member, total, color, icon: Icon }) => (
                <div
                  key={member}
                  className="p-4 rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="font-bold text-slate-700">{member}</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{formatCurrency(total)}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {((total / totalFiltered) * 100).toFixed(1)}% do total
                  </p>
                </div>
              ))}
            </div>

            <h4 className="font-bold text-slate-700 mb-4 mt-8">Resumo por Categoria</h4>
            <div className="space-y-2">
              {categoryTotals.map(({ name, total, icon, color }) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-bold text-slate-700">{name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatCurrency(total)}</p>
                      <p className="text-xs text-slate-500">
                        {((total / totalFiltered) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div
                      className="w-2 h-12 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visualização Detalhada (Tabela) */}
        {viewMode === 'detailed' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Membro</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredExpenses.map((expense) => {
                  const memberConfig = FAMILY_MEMBERS.find(m => m.name === expense.member);
                  const MemberIcon = memberConfig?.icon || CreditCard;

                  return (
                    <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: memberConfig?.color }}
                          >
                            <MemberIcon size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{expense.member}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800">{expense.description}</span>
                          {expense.isInstallment && (
                            <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1 mt-0.5">
                              <CreditCard size={10} /> Parcela {expense.currentInstallment}/{expense.totalInstallments}
                            </span>
                          )}
                          {expense.isSubscription && (
                            <span className="text-[10px] font-bold text-purple-600 uppercase flex items-center gap-1 mt-0.5">
                              🔁 Assinatura
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-sm text-slate-500 font-medium">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold">
                          {expense.category || 'Geral'}
                        </span>
                      </td>

                      <td className="p-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium">
                          <CalendarIcon size={14} className="text-slate-300" />
                          {formatDate(expense.date)}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(expense)}
                            className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar gasto"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(expense)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir gasto"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal de Edição */}
      {editingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <EditExpenseForm 
              expense={editingExpense} 
              onClose={() => setEditingExpense(null)} 
            />
          </div>
        </div>
      )}
    </>
  );
}