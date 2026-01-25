import React, { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { X, Calendar, DollarSign, Tag, Users, Hash, CheckCircle2 } from 'lucide-react';
import type { Member, Expense } from '../../types/finance';

export function AddExpenseForm({ onClose }: { onClose: () => void }) {
  const { addExpense } = useFinance();
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados do Formulário
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [member, setMember] = useState<Member>('Pai');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      category,
      member,
      date,
      isInstallment,
      totalInstallments: isInstallment ? parseInt(totalInstallments) : undefined,
    };

    addExpense(newExpense);
    
    // Feedback de Sucesso
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-xl font-bold">Gasto Adicionado!</h3>
        <p className="text-slate-500">As parcelas foram projetadas com sucesso.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Novo Lançamento</h2>
        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Descrição e Valor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Tag size={14}/> Descrição</label>
            <input 
              required
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pai outline-none transition-all"
              placeholder="Ex: Supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={14}/> Valor (R$)</label>
            <input 
              required
              type="number"
              step="0.01"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pai outline-none transition-all"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Membro e Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Users size={14}/> Quem gastou?</label>
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
            <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={14}/> Data</label>
            <input 
              type="date"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Categoria Simples */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Categoria</label>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none"
            placeholder="Ex: Alimentação, Lazer..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Lógica de Parcelamento */}
        <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm cursor-pointer flex items-center gap-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-pai"
                checked={isInstallment}
                onChange={(e) => setIsInstallment(e.target.checked)}
              />
              Gasto Parcelado
            </label>
            {isInstallment && (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                <Hash size={16} className="text-slate-400" />
                <input 
                  type="number"
                  min="2"
                  max="48"
                  className="w-20 p-2 rounded-lg border border-slate-200 text-center"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                />
                <span className="text-xs font-bold text-slate-500 uppercase">vezes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-pai text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95"
      >
        Salvar Lançamento
      </button>
    </form>
  );
}