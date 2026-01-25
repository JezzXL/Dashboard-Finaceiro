import { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Expense, Subscription } from '../types/finance';
import { generateInstallments } from '../utils/expense-helpers';
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

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Salvar expenses no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('@FamilyFinance:expenses', JSON.stringify(expenses));
    } catch (err) {
      console.error("Erro ao salvar no LocalStorage:", err);
    }
  }, [expenses]);

  // Salvar subscriptions no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('@FamilyFinance:subscriptions', JSON.stringify(subscriptions));
    } catch (err) {
      console.error("Erro ao salvar assinaturas:", err);
    }
  }, [subscriptions]);

  // Gerar despesas de assinaturas automaticamente
  useEffect(() => {
    const generateSubscriptionExpenses = () => {
      const today = new Date();
      const activeSubscriptions = subscriptions.filter(sub => sub.isActive);

      activeSubscriptions.forEach(subscription => {
        const subStartDate = new Date(subscription.startDate);
        const monthsToGenerate = [];

        // Gerar para os últimos 12 meses e próximos 3 meses
        for (let i = -12; i <= 3; i++) {
          const targetDate = new Date(today.getFullYear(), today.getMonth() + i, subscription.dayOfMonth);
          
          if (targetDate >= subStartDate) {
            monthsToGenerate.push(targetDate);
          }
        }

        monthsToGenerate.forEach(date => {
          const dateStr = date.toISOString().split('T')[0];
          
          // Verifica se já existe uma despesa dessa assinatura nesse mês
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
  }, [subscriptions]); // Não incluir expenses aqui para evitar loop infinito

  const addExpense = (expense: Expense) => {
    try {
      const expensesToAdd = generateInstallments(expense);
      setExpenses((prev) => [...prev, ...expensesToAdd]);
    } catch (err) {
      console.error("Erro ao adicionar despesa:", err);
    }
  };

  const deleteExpense = (id: string, deleteAllFromGroup = false) => {
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
  };

  const addSubscription = (subscription: Subscription) => {
    try {
      setSubscriptions(prev => [...prev, subscription]);
    } catch (err) {
      console.error("Erro ao adicionar assinatura:", err);
    }
  };

  const deleteSubscription = (id: string) => {
    try {
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      // Remove todas as despesas relacionadas
      setExpenses(prev => prev.filter(exp => exp.subscriptionId !== id));
    } catch (err) {
      console.error("Erro ao deletar assinatura:", err);
    }
  };

  const toggleSubscription = (id: string) => {
    try {
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
        )
      );
    } catch (err) {
      console.error("Erro ao alternar assinatura:", err);
    }
  };

  const contextValue: FinanceContextData = useMemo(
    () => ({
      expenses,
      subscriptions,
      addExpense,
      deleteExpense,
      addSubscription,
      deleteSubscription,
      toggleSubscription,
      selectedMonth,
      setSelectedMonth,
    }),
    [expenses, subscriptions, selectedMonth]
  );

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};