import { useState } from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  Wallet,
  Repeat
} from 'lucide-react';
import { useFinance } from './hooks/useFinance';
import { Summary } from './components/dashboard/Summary';
import { Charts } from './components/dashboard/Charts';
import { AddExpenseForm } from './components/forms/AddExpenseForm';
import { AddSubscriptionForm } from './components/forms/AddSubscriptionForm';
import { TransactionList } from './components/dashboard/TransactionList';
import { SubscriptionList } from './components/dashboard/SubscriptionList';
import { addMonths, subMonths, formatMonth } from './utils/date-helpers';

export default function App() {
  const { selectedMonth, setSelectedMonth } = useFinance();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handlePrevMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const handleNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      
      {/* SIDEBAR - Desktop */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Wallet size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FamilyCash</h1>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-slate-100 rounded-xl text-sm font-bold text-blue-600">
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
              <ReceiptText size={20} /> Transações
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
              <Repeat size={20} /> Assinaturas
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
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

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex-wrap">
            <div className="flex items-center gap-2 px-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                aria-label="Mês anterior"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="min-w-[140px] text-center">
                <p className="text-slate-500 capitalize font-medium">
                  {formatMonth(selectedMonth)}
                </p>
              </div>

              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                aria-label="Próximo mês"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="w-[1px] h-8 bg-slate-100 mx-1" />

            <button 
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Repeat size={18} />
              <span className="hidden sm:inline text-sm">Assinatura</span>
            </button>

            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
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

        {/* LISTA DE ASSINATURAS */}
        <div className="mb-8">
          <SubscriptionList />
        </div>

        {/* LISTA DE TRANSAÇÕES */}
        <TransactionList />

      </main>

      {/* MODAL DE ADICIONAR GASTO */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <AddExpenseForm onClose={() => setIsExpenseModalOpen(false)} />
          </div>
        </div>
      )}

      {/* MODAL DE ADICIONAR ASSINATURA */}
      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <AddSubscriptionForm onClose={() => setIsSubscriptionModalOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}