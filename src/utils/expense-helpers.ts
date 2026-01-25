import type { Expense } from '../types/finance';
import { addMonths } from 'date-fns';

export const generateInstallments = (baseExpense: Expense): Expense[] => {
  // Se não for parcelado ou não tiver número de parcelas, retorna apenas o gasto original
  if (!baseExpense.isInstallment || !baseExpense.totalInstallments) {
    return [{ ...baseExpense, id: baseExpense.id || crypto.randomUUID() }];
  }

  const installments: Expense[] = [];
  const groupId = baseExpense.groupId || crypto.randomUUID();

  for (let i = 0; i < baseExpense.totalInstallments; i++) {
    const installmentDate = addMonths(new Date(baseExpense.date), i);
    
    installments.push({
      ...baseExpense,
      id: crypto.randomUUID(),
      groupId,
      date: installmentDate.toISOString(),
      currentInstallment: i + 1,
      // O isInstallment permanece true para todas
    });
  }

  return installments;
};