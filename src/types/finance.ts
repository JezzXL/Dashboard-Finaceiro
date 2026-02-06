import type { LucideIcon } from 'lucide-react';

export type Member = 'Pai' | 'Mãe' | 'Filho' | 'Filha' | 'Outro';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  member: Member;
  date: string;
  isInstallment: boolean;
  totalInstallments?: number;
  currentInstallment?: number;
  groupId?: string;
  isSubscription?: boolean;
  subscriptionId?: string;
}

export interface Subscription {
  id: string;
  description: string;
  amount: number;
  category: string;
  member: Member;
  startDate: string;
  isActive: boolean;
  dayOfMonth: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
}

export interface FamilyMemberConfig {
  name: Member;
  color: string;
  icon: LucideIcon;
}