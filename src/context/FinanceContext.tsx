import { createContext } from 'react';
import type { Expense } from '../types/finance';

export interface FinanceContextData {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string, deleteAllFromGroup?: boolean) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

// Criamos o contexto, mas não o componente Provider
export const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);