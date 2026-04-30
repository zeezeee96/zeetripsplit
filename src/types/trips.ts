export type Trip = {
  id: string;
  name: string;
  people: Person[];
  expenses: Expense[];
};

export type Person = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  amount: number;
  paidBy: string;
  description?: string;
};
