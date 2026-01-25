import type { Expense } from '../types/finance';
import { addMonths } from './date-helpers';

export const generateInstallments = (baseExpense: Expense): Expense[] => {
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
      date: installmentDate.toISOString().split('T')[0],
      currentInstallment: i + 1,
    });
  }

  return installments;
};