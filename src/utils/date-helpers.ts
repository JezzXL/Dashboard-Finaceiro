export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const subMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
};

export const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};

export const formatMonth = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return `${months[date.getMonth()]} de ${date.getFullYear()}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  
  return `${day} de ${months[date.getMonth()]}`;
};