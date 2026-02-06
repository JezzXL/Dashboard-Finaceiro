import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Expense, Subscription, Category } from '../types/finance';
import { generateInstallments } from '../utils/expense-helpers';
import { DEFAULT_CATEGORIES } from '../utils/default-categories';
import { FinanceContext } from './FinanceContext';
import type { FinanceContextData } from './FinanceContext';

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storageData = localStorage.getItem('@FamilyFinance:expenses');
      if (!storageData) return [];
      
      const parsed = JSON.parse(storageData);
      
      return Array.isArray(parsed) 
        ? parsed.filter(e => e && e.date && !isNaN(new Date(e.date).getTime())) 
        : [];
    } catch (err) {
      console.error("Erro ao carregar LocalStorage:", err);
      return [];
    }
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storageData = localStorage.getItem('@FamilyFinance:subscriptions');
      if (!storageData) return [];
      
      const parsed = JSON.parse(storageData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Erro ao carregar assinaturas:", err);
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
    
    try {
      const storageData = localStorage.getItem('@FamilyFinance:categories');
      if (!storageData) return DEFAULT_CATEGORIES;
      
      const parsed = JSON.parse(storageData);
      return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      return DEFAULT_CATEGORIES;
    }
  });

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Persist expenses
  useEffect(() => {
    try {
      localStorage.setItem('@FamilyFinance:expenses', JSON.stringify(expenses));
    } catch (err) {
      console.error("Erro ao salvar no LocalStorage:", err);
    }
  }, [expenses]);

  // Persist subscriptions
  useEffect(() => {
    try {
      localStorage.setItem('@FamilyFinance:subscriptions', JSON.stringify(subscriptions));
    } catch (err) {
      console.error("Erro ao salvar assinaturas:", err);
    }
  }, [subscriptions]);

  // Persist categories
  useEffect(() => {
    try {
      localStorage.setItem('@FamilyFinance:categories', JSON.stringify(categories));
    } catch (err) {
      console.error("Erro ao salvar categorias:", err);
    }
  }, [categories]);

  // Generate subscription expenses
  useEffect(() => {
    const generateSubscriptionExpenses = () => {
      const today = new Date();
      const activeSubscriptions = subscriptions.filter(sub => sub.isActive);

      activeSubscriptions.forEach(subscription => {
        const subStartDate = new Date(subscription.startDate);
        const monthsToGenerate = [];

        for (let i = -12; i <= 3; i++) {
          const targetDate = new Date(today.getFullYear(), today.getMonth() + i, subscription.dayOfMonth);
          
          if (targetDate >= subStartDate) {
            monthsToGenerate.push(targetDate);
          }
        }

        monthsToGenerate.forEach(date => {
          const dateStr = date.toISOString().split('T')[0];
          
          const alreadyExists = expenses.some(
            exp => exp.subscriptionId === subscription.id && exp.date === dateStr
          );

          if (!alreadyExists) {
            const newExpense: Expense = {
              id: crypto.randomUUID(),
              description: `${subscription.description} (Assinatura)`,
              amount: subscription.amount,
              category: subscription.category,
              member: subscription.member,
              date: dateStr,
              isInstallment: false,
              isSubscription: true,
              subscriptionId: subscription.id,
            };

            setExpenses(prev => [...prev, newExpense]);
          }
        });
      });
    };

    if (subscriptions.length > 0) {
      generateSubscriptionExpenses();
    }
  }, [subscriptions]);

  // Memoized functions with useCallback
  const addExpense = useCallback((expense: Expense) => {
    try {
      const expensesToAdd = generateInstallments(expense);
      setExpenses((prev) => [...prev, ...expensesToAdd]);
    } catch (err) {
      console.error("Erro ao adicionar despesa:", err);
    }
  }, []);

  const updateExpense = useCallback((id: string, updatedExpense: Expense) => {
    try {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...updatedExpense, id } : expense
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar despesa:", err);
    }
  }, []);

  const deleteExpense = useCallback((id: string, deleteAllFromGroup = false) => {
    try {
      setExpenses((prev) => {
        if (deleteAllFromGroup) {
          const expenseToDelete = prev.find(e => e.id === id);
          if (expenseToDelete?.groupId) {
            return prev.filter(e => e.groupId !== expenseToDelete.groupId);
          }
        }
        return prev.filter(e => e.id !== id);
      });
    } catch (err) {
      console.error("Erro ao deletar despesa:", err);
    }
  }, []);

  const addSubscription = useCallback((subscription: Subscription) => {
    try {
      setSubscriptions(prev => [...prev, subscription]);
    } catch (err) {
      console.error("Erro ao adicionar assinatura:", err);
    }
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    try {
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      setExpenses(prev => prev.filter(exp => exp.subscriptionId !== id));
    } catch (err) {
      console.error("Erro ao deletar assinatura:", err);
    }
  }, []);

  const toggleSubscription = useCallback((id: string) => {
    try {
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
        )
      );
    } catch (err) {
      console.error("Erro ao alternar assinatura:", err);
    }
  }, []);

  const addCategory = useCallback((category: Category) => {
    try {
      setCategories(prev => [...prev, category]);
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
    }
  }, []);

  const deleteCategory = useCallback((id: string) => {
    try {
      setCategories(prev => {
        const categoryToDelete = prev.find(cat => cat.id === id);
        if (!categoryToDelete) return prev;

        // Check if category is in use - need to access current expenses
        return prev.filter(cat => cat.id !== id);
      });
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
    }
  }, []);

  // Memoized context value with all dependencies
  const contextValue: FinanceContextData = useMemo(
    () => ({
      expenses,
      subscriptions,
      categories,
      addExpense,
      updateExpense,
      deleteExpense,
      addSubscription,
      deleteSubscription,
      toggleSubscription,
      addCategory,
      deleteCategory,
      selectedMonth,
      setSelectedMonth,
    }),
    [
      expenses,
      subscriptions,
      categories,
      selectedMonth,
      addExpense,
      updateExpense,
      deleteExpense,
      addSubscription,
      deleteSubscription,
      toggleSubscription,
      addCategory,
      deleteCategory,
    ]
  );

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};