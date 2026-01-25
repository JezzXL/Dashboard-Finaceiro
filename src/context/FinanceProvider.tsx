import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Expense } from '../types/finance';
import { generateInstallments } from '../utils/expense-helpers';
import { FinanceContext } from './FinanceContext';

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  // Altere a inicialização do estado de expenses:
const [expenses, setExpenses] = useState<Expense[]>(() => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storageData = localStorage.getItem('@FamilyFinance:expenses');
    if (!storageData) return [];
    
    const parsed = JSON.parse(storageData);
    
    // Validação básica: remove itens que não têm data válida
    return Array.isArray(parsed) 
      ? parsed.filter(e => !isNaN(new Date(e.date).getTime())) 
      : [];
  } catch (err) {
    console.error("Erro ao carregar LocalStorage, resetando dados...", err);
    return [];
  }
});

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('@FamilyFinance:expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    const expensesToAdd = generateInstallments(expense);
    setExpenses((prev) => [...prev, ...expensesToAdd]);
  };

  const deleteExpense = (id: string, deleteAllFromGroup = false) => {
    setExpenses((prev) => {
      if (deleteAllFromGroup) {
        const expenseToDelete = prev.find(e => e.id === id);
        if (expenseToDelete?.groupId) {
          return prev.filter(e => e.groupId !== expenseToDelete.groupId);
        }
      }
      return prev.filter(e => e.id !== id);
    });
  };

  return (
    <FinanceContext.Provider value={{ expenses, addExpense, deleteExpense, selectedMonth, setSelectedMonth }}>
      {children}
    </FinanceContext.Provider>
  );
};