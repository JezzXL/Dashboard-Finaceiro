import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { isSameMonth, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import type { Expense } from '../../types/finance';

export function TransactionList() {
  const { expenses, selectedMonth, deleteExpense } = useFinance();

  // Filtrar e ordenar por data (mais recentes primeiro)
  const monthlyExpenses = expenses
    .filter(e => isSameMonth(parseISO(e.date), selectedMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (expense: Expense) => {
    if (expense.isInstallment) {
      const confirmAll = window.confirm(
        `Este é um gasto parcelado (${expense.currentInstallment}/${expense.totalInstallments}).\n\nOK para excluir TODAS as parcelas deste grupo.\nCancelar para excluir APENAS esta parcela.`
      );
      deleteExpense(expense.id, confirmAll);
    } else {
      if (window.confirm('Deseja excluir este gasto?')) {
        deleteExpense(expense.id);
      }
    }
  };

  if (monthlyExpenses.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-brand-border">
        <p className="text-slate-400 italic">Nenhuma transação encontrada para este mês.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50">
        <h3 className="font-bold text-lg text-slate-800 text-left">Detalhamento de Gastos</h3>
      </div>
      
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
            {monthlyExpenses.map((expense) => {
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
                        <span className="text-[10px] font-bold text-pai uppercase flex items-center gap-1 mt-0.5">
                          <CreditCard size={10} /> Parcela {expense.currentInstallment}/{expense.totalInstallments}
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
                      {format(parseISO(expense.date), "dd 'de' MMM", { locale: ptBR })}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-sm font-bold text-slate-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(expense)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}