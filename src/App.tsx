import { useState } from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  Wallet
} from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useFinance } from './hooks/useFinance';
import { Summary } from './components/dashboard/Summary';
import { Charts } from './components/dashboard/Charts';
import { AddExpenseForm } from './components/forms/AddExpenseForm';
import { TransactionList } from './components/dashboard/TransactionList';

export default function App() {
  const { selectedMonth, setSelectedMonth } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Navegação de meses
  const handlePrevMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const handleNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <div className="min-h-screen bg-brand-bg flex text-slate-900 font-sans selection:bg-pai/20">
      
      {/* SIDEBAR - Desktop */}
      <aside className="w-64 border-r border-brand-border bg-brand-card flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-pai rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Wallet size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FamilyCash</h1>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-slate-100 rounded-xl text-sm font-bold text-pai">
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
              <ReceiptText size={20} /> Transações
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-brand-border">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Status do Plano</p>
            <p className="text-sm font-bold text-slate-700">Premium Family</p>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
        
        {/* HEADER COM FILTRO DE TEMPO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Dashboard</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-slate-500 font-medium">Controle de Gastos Familiares</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-brand-border shadow-sm">
            <div className="flex items-center gap-2 px-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="min-w-[140px] text-center">
                <p className="text-slate-500 capitalize">
  {selectedMonth instanceof Date && !isNaN(selectedMonth.getTime())
    ? format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })
    : "Data inválida"}
</p>
              </div>

              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="w-[1px] h-8 bg-slate-100 mx-1" />

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-pai text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">Novo Gasto</span>
            </button>
          </div>
        </header>

        {/* CARDS DE RESUMO (KPIs) */}
        <Summary />

        {/* SEÇÃO DE GRÁFICOS */}
        <Charts />

        <TransactionList />

        {/* LISTA DE TRANSAÇÕES (Placeholder para o próximo componente) */}
        <section className="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Últimos Lançamentos</h3>
            <button className="text-pai text-sm font-bold hover:underline">Ver tudo</button>
          </div>
          <div className="p-12 text-center">
            <div className="max-w-xs mx-auto space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <ReceiptText size={32} />
              </div>
              <p className="text-slate-500 font-medium">As transações do mês de {format(selectedMonth, 'MMMM', { locale: ptBR })} aparecerão aqui.</p>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <AddExpenseForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}