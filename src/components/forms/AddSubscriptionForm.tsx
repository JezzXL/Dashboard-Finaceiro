import React, { useState } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { X, Calendar, DollarSign, Tag, Users, Repeat, CheckCircle2 } from 'lucide-react';
import type { Member, Subscription } from '../../types/finance';

export function AddSubscriptionForm({ onClose }: { onClose: () => void }) {
  const { addSubscription } = useFinance();
  const [showSuccess, setShowSuccess] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [member, setMember] = useState<Member>('Pai');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayOfMonth, setDayOfMonth] = useState(new Date().getDate().toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSubscription: Subscription = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      category,
      member,
      startDate,
      isActive: true,
      dayOfMonth: parseInt(dayOfMonth),
    };

    addSubscription(newSubscription);
    
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
        <h3 className="text-xl font-bold">Assinatura Criada!</h3>
        <p className="text-slate-500">Os gastos mensais serão gerados automaticamente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Nova Assinatura</h2>
          <p className="text-sm text-slate-500">Gasto recorrente mensal</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Tag size={14}/> Descrição</label>
            <input 
              required
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ex: Netflix, Spotify..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={14}/> Valor Mensal (R$)</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Users size={14}/> Responsável</label>
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
            <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={14}/> Data de Início</label>
            <input 
              type="date"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Categoria</label>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none"
            placeholder="Ex: Streaming, Software..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Repeat size={14} />
            Dia da Cobrança Mensal
          </label>
          <input 
            type="number"
            min="1"
            max="31"
            className="w-full p-3 rounded-xl border border-slate-200 outline-none"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
          />
          <p className="text-xs text-slate-500">Dia do mês em que o valor é cobrado (1-31)</p>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-purple-500 text-white rounded-2xl font-bold shadow-lg hover:bg-purple-600 transition-all active:scale-95"
      >
        Criar Assinatura Recorrente
      </button>
    </form>
  );
}