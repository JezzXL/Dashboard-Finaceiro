import type { Category } from '../types/finance';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', icon: '🍔', color: '#10b981', createdAt: new Date().toISOString() },
  { id: '2', name: 'Transporte', icon: '🚗', color: '#3b82f6', createdAt: new Date().toISOString() },
  { id: '3', name: 'Saúde', icon: '🏥', color: '#ef4444', createdAt: new Date().toISOString() },
  { id: '4', name: 'Educação', icon: '📚', color: '#8b5cf6', createdAt: new Date().toISOString() },
  { id: '5', name: 'Lazer', icon: '🎮', color: '#ec4899', createdAt: new Date().toISOString() },
  { id: '6', name: 'Moradia', icon: '🏠', color: '#f59e0b', createdAt: new Date().toISOString() },
  { id: '7', name: 'Vestuário', icon: '👕', color: '#06b6d4', createdAt: new Date().toISOString() },
  { id: '8', name: 'Streaming', icon: '📺', color: '#a855f7', createdAt: new Date().toISOString() },
  { id: '9', name: 'Contas', icon: '💡', color: '#eab308', createdAt: new Date().toISOString() },
  { id: '10', name: 'Outros', icon: '📦', color: '#64748b', createdAt: new Date().toISOString() },
];