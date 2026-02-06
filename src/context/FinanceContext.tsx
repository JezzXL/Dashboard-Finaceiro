import { createContext } from 'react';
import type { Expense, Subscription, Category } from '../types/finance';

export interface FinanceContextData {
  expenses: Expense[];
  subscriptions: Subscription[];
  categories: Category[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updatedExpense: Expense) => void;
  deleteExpense: (id: string, deleteAllFromGroup?: boolean) => void;
  addSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscription: (id: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const FinanceContext = createContext<FinanceContextData | undefined>(undefined);