export interface Person {
  id: string;
  name: string;
  email?: string;
  color?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  date: string;
}

export interface Trip {
  id: string;
  name: string;
  people: Person[];
  expenses: Expense[];
  createdAt?: string;
}

export interface Split {
  from: string;
  to: string;
  amount: number;
}
