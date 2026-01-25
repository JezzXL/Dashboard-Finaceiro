import { createContext } from 'react';
import type { Expense, Subscription } from '../types/finance';

export interface FinanceContextData {
  expenses: Expense[];
  subscriptions: Subscription[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string, deleteAllFromGroup?: boolean) => void;
  addSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscription: (id: string) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const FinanceContext = createContext<FinanceContextData | undefined>(undefined);