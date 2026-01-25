import { User, Heart, Baby, Star, Coffee } from 'lucide-react';
import type { FamilyMemberConfig } from '../types/finance';

export const FAMILY_MEMBERS: FamilyMemberConfig[] = [
  { name: 'Pai', color: 'var(--color-pai)', icon: User },
  { name: 'Mãe', color: 'var(--color-mae)', icon: Heart },
  { name: 'Filho', color: 'var(--color-filho)', icon: Baby },
  { name: 'Filha', color: 'var(--color-filha)', icon: Star },
  { name: 'Outro', color: 'var(--color-brand-border)', icon: Coffee },
];