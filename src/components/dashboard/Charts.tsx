import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useFinance } from '../../hooks/useFinance';
import { FAMILY_MEMBERS } from '../../utils/constants';
import { isSameMonth, parseISO } from '../../utils/date-helpers';
import { formatCurrency } from '../../utils/currency-helpers';

interface BarDataItem {
  name: string;
  total: number;
  fillColor: string;
}

interface PieDataItem {
  name: string;
  value: number;
}

export function Charts() {
  const { expenses, selectedMonth } = useFinance();

  // Validação: garante que selectedMonth é uma data válida
  const validSelectedMonth = selectedMonth instanceof Date && !isNaN(selectedMonth.getTime()) 
    ? selectedMonth 
    : new Date();

  const monthlyExpenses = expenses.filter(expense => {
    try {
      const expenseDate = parseISO(expense.date);
      return !isNaN(expenseDate.getTime()) && isSameMonth(expenseDate, validSelectedMonth);
    } catch {
      return false;
    }
  });

  const barData: BarDataItem[] = FAMILY_MEMBERS.map((member) => ({
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

  const pieData: PieDataItem[] = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  const CATEGORY_COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[400px]">
        <h4 className="font-bold mb-6 text-slate-800 flex items-center gap-2 text-left">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
          Gastos por Membro
        </h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickFormatter={(val: number) => `R$ ${val}`} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                }}
                formatter={(value: number | string | undefined) => {
                  if (value === undefined) return ['R$ 0,00', 'Total Gasto'];
                  const numValue = typeof value === 'number' ? value : parseFloat(value);
                  return [formatCurrency(numValue), 'Total Gasto'];
                }}
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

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
        <h4 className="font-bold mb-6 text-slate-800 flex items-center gap-2 text-left">
          <div className="w-1.5 h-4 bg-pink-500 rounded-full" />
          Distribuição
        </h4>
        <div className="h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={pieData} 
                innerRadius={70} 
                outerRadius={95} 
                paddingAngle={8} 
                dataKey="value" 
                stroke="none"
              >
                {pieData.map((_, index) => (
                  <Cell 
                    key={`cell-pie-${index}`} 
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                }}
                formatter={(value: number | string | undefined) => {
                  if (value === undefined) return ['R$ 0,00', 'Valor'];
                  const numValue = typeof value === 'number' ? value : parseFloat(value);
                  return [formatCurrency(numValue), 'Valor'];
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                wrapperStyle={{ 
                  paddingTop: '20px', 
                  fontSize: '12px', 
                  fontWeight: 600 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}