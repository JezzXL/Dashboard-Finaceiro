import { User, Heart, Baby, Star, Coffee } from 'lucide-react';
import type { FamilyMemberConfig } from '../types/finance';

export const FAMILY_MEMBERS: FamilyMemberConfig[] = [
  { name: 'Pai', color: '#3b82f6', icon: User },
  { name: 'Mãe', color: '#ec4899', icon: Heart },
  { name: 'Filho', color: '#10b981', icon: Baby },
  { name: 'Filha', color: '#f59e0b', icon: Star },
  { name: 'Outro', color: '#64748b', icon: Coffee },
];