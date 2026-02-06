import React, { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { X, Calendar, DollarSign, Tag, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { CategorySelector } from './CategorySelector';
import type { Member, Expense } from '../../types/finance';

interface EditExpenseFormProps {
  expense: Expense;
  onClose: () => void;
}

export function EditExpenseForm({ expense, onClose }: EditExpenseFormProps) {
  const { updateExpense } = useFinance();
  const [showSuccess, setShowSuccess] = useState(false);

  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [member, setMember] = useState<Member>(expense.member);
  const [date, setDate] = useState(expense.date);

  const isSubscriptionExpense = expense.isSubscription;
  const isInstallmentExpense = expense.isInstallment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      alert('Selecione uma categoria');
      return;
    }

    const updatedExpense: Expense = {
      ...expense,
      description,
      amount: parseFloat(amount),
      category,
      member,
      date,
    };

    updateExpense(expense.id, updatedExpense);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-xl font-bold">Gasto Atualizado!</h3>
        <p className="text-slate-500">As alterações foram salvas com sucesso.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center sticky top-0 bg-white pb-4 border-b border-slate-100 z-10">
        <div>
          <h2 className="text-xl font-bold">Editar Lançamento</h2>
          {(isSubscriptionExpense || isInstallmentExpense) && (
            <p className="text-sm text-slate-500 mt-1">
              {isSubscriptionExpense && '🔁 Gasto de assinatura'}
              {isInstallmentExpense && !isSubscriptionExpense && 
                `💳 Parcela ${expense.currentInstallment}/${expense.totalInstallments}`}
            </p>
          )}
        </div>
        <button 
          type="button" 
          onClick={onClose} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Aviso para despesas de assinatura */}
      {isSubscriptionExpense && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Este gasto é de uma assinatura</p>
            <p className="text-amber-700">
              As alterações afetarão apenas este lançamento. 
              Para editar toda a assinatura, use o gerenciador de assinaturas.
            </p>
          </div>
        </div>
      )}

      {/* Aviso para parcelas */}
      {isInstallmentExpense && !isSubscriptionExpense && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Este gasto é parcelado</p>
            <p className="text-blue-700">
              As alterações afetarão apenas esta parcela específica.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Descrição e Valor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Tag size={14}/> Descrição
            </label>
            <input 
              required
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: Supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <DollarSign size={14}/> Valor (R$)
            </label>
            <input 
              required
              type="number"
              step="0.01"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Membro e Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Users size={14}/> Quem gastou?
            </label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 bg-white outline-none"
              value={member}
              onChange={(e) => setMember(e.target.value as Member)}
            >
              {FAMILY_MEMBERS.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Calendar size={14}/> Data
            </label>
            <input 
              type="date"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Categoria */}
        <CategorySelector value={category} onChange={setCategory} />
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t border-slate-100">
        <button 
          type="button"
          onClick={onClose}
          className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}