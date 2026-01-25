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
}

export interface FamilyMemberConfig {
  name: Member;
  color: string;
  icon: LucideIcon; // Agora o tipo é o componente do ícone
}