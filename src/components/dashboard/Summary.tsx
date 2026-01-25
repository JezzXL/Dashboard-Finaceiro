import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { isSameMonth, parseISO } from 'date-fns';

export function Summary() {
  const { expenses, selectedMonth } = useFinance();

  const monthlyExpenses = expenses.filter(expense => 
    isSameMonth(parseISO(expense.date), selectedMonth)
  );

  const totalFamily = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {/* Card Gasto Total */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm xl:col-span-2">
        <p className="text-sm text-slate-500 font-medium">Gasto Total da Família</p>
        <h3 className="text-3xl font-bold text-slate-900">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFamily)}
        </h3>
      </div>

      {/* Cards Individuais */}
      {FAMILY_MEMBERS.map(member => {
        const memberTotal = monthlyExpenses
          .filter(e => e.member === member.name)
          .reduce((acc, curr) => acc + curr.amount, 0);

        const Icon = member.icon; // Agora funciona perfeitamente!

        return (
          <div key={member.name} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${member.color}20`, color: member.color }}>
                <Icon size={18} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{member.name}</span>
            </div>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(memberTotal)}
            </p>
          </div>
        );
      })}
    </section>
  );
}