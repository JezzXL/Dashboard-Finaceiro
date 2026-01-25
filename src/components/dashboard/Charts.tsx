import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { isSameMonth, parseISO } from 'date-fns';

export function Charts() {
  const { expenses, selectedMonth } = useFinance();

  const monthlyExpenses = expenses.filter(expense => {
  const expenseDate = parseISO(expense.date);
  if (isNaN(expenseDate.getTime())) return false; // Ignora datas inválidas
  return isSameMonth(expenseDate, selectedMonth);
});

  const barData = FAMILY_MEMBERS.map((member) => ({
    name: member.name,
    total: monthlyExpenses
      .filter((e) => e.member === member.name)
      .reduce((acc, curr) => acc + curr.amount, 0),
    fillColor: member.color 
  }));

  const categoryMap = monthlyExpenses.reduce((acc, curr) => {
    const cat = curr.category || 'Geral';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  const CATEGORY_COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  // SOLUÇÃO DEFINITIVA DE TIPAGEM:
  // Usamos tipos primitivos que o TS aceita para o Recharts sem imports complexos
  const formatValue = (value: number | string | readonly (number | string)[] | undefined) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }
    return value?.toString() || '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      {/* Gráfico de Barras */}
      <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[400px]">
        <h4 className="font-bold mb-6 text-slate-800 flex items-center gap-2 text-left">
          <div className="w-1.5 h-4 bg-pai rounded-full" />
          Gastos por Membro
        </h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `R$ ${val}`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                // Tipagem inline para satisfazer o contrato do Recharts
                formatter={(value: number | string | readonly (number | string)[] | undefined) => [formatValue(value), 'Total Gasto']}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={45}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={entry.fillColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Rosca */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
        <h4 className="font-bold mb-6 text-slate-800 flex items-center gap-2 text-left">
          <div className="w-1.5 h-4 bg-mae rounded-full" />
          Distribuição
        </h4>
        <div className="h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                {pieData.map((_, index) => (
                  <Cell key={`cell-pie-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number | string | readonly (number | string)[] | undefined) => [formatValue(value), 'Valor']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}