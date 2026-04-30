"use client";
import { useParams } from "next/navigation";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Trip, Person, Expense } from "@/src/types/trips";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getRandomColor } from "@/src/utils/constants";

export default function TripDetail() {
  const params = useParams();
  const tripId = params.id as string;
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    paidBy: "",
    splitAmong: [] as string[],
  });
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [personName, setPersonName] = useState("");
  const [trips, setTrips] = useLocalStorage<Trip[]>("trips", []);

  const trip = trips.find((t) => t.id === tripId);

  // 🔹 keep SAME variable names
  const tripName = trip?.name || "";
  const people: Person[] = trip?.people || [];
  const expenses: Expense[] = trip?.expenses || [];

  // 🔹 update helper
  const updateTrip = (updated: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
  };

  // 🔹 calculate balances
  const calculateBalances = () => {
    const balances: Record<string, number> = {};

    people.forEach((p) => (balances[p.id] = 0));

    expenses.forEach((exp) => {
      const perPerson = exp.amount / exp.splitAmong.length;

      balances[exp.paidBy] += exp.amount;

      exp.splitAmong.forEach((person) => {
        balances[person] -= perPerson;
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 🔹 add expense
  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    updateTrip({
      ...trip!,
      expenses: [
        ...expenses,
        {
          id: uuidv4(),
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          paidBy: people[0]?.id || "",
          splitAmong: people.map((p) => p.id),
          date: new Date().toISOString().split("T")[0],
        },
      ],
    });

    setNewExpense({
      description: "",
      amount: "",
      paidBy: "",
      splitAmong: [],
    });
  };

  // 🔹 delete expense
  const deleteExpense = (id: string) => {
    updateTrip({
      ...trip!,
      expenses: expenses.filter((e) => e.id !== id),
    });
  };
  const addPerson = () => {
    if (!personName.trim()) return;

    updateTrip({
      ...trip!,
      people: [
        ...people,
        {
          id: uuidv4(),
          name: personName,
          color: getRandomColor(),
        },
      ],
    });

    setPersonName("");
    setShowPersonModal(false);
  };

  // 🔹 helper
  const getPerson = (id: string) => people.find((p) => p.id === id);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-hover-bg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{tripName}</h1>
              <p className="text-sm text-text-secondary mt-1">
                Total: ${totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    Total Expenses
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    ${totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    Expenses
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {expenses.length}
                  </p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    People
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {people.length}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* People & Balances */}
          <div className="bg-card rounded-xl border border-card-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                People & Balances
              </h2>

              <button
                onClick={() => setShowPersonModal(true)}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-primary" />
              </button>
            </div>
            <div className="space-y-3">
              {people.map((person) => {
                const balance = balances[person.id];
                const isOwed = balance > 0;

                return (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-hover-bg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: person.color }}
                      />
                      <span className="font-medium text-foreground">
                        {person.name}
                      </span>
                    </div>
                    <span
                      className={`font-semibold ${
                        isOwed ? "text-accent" : "text-primary"
                      }`}
                    >
                      {isOwed ? "+" : ""} ${Math.abs(balance).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="bg-card rounded-xl border border-card-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Add Expense
            </h2>

            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g., Dinner, Hotel..."
                  className="w-full px-4 py-2 rounded-lg border border-input-border bg-input-bg text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-2 rounded-lg border border-input-border bg-input-bg text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Paid By (same style preserved) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Paid By
                </label>
                <select
                  value={newExpense.paidBy}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      paidBy: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" className="text-muted-foreground">
                    Select who paid
                  </option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Split Among */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Split Among
                </label>

                <div className="flex flex-wrap gap-2">
                  {people.map((p) => {
                    const isSelected = newExpense.splitAmong.includes(p.id);

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setNewExpense({
                            ...newExpense,
                            splitAmong: isSelected
                              ? newExpense.splitAmong.filter(
                                  (id) => id !== p.id,
                                )
                              : [...newExpense.splitAmong, p.id],
                          })
                        }
                        className={`px-3 py-1 rounded-full border text-sm transition ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-input-bg border-input-border text-foreground hover:bg-muted"
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-center ">
                {/* Button (unchanged style) */}
                <button
                  onClick={addExpense}
                  disabled={
                    !newExpense.description ||
                    !newExpense.amount ||
                    !newExpense.paidBy ||
                    newExpense.splitAmong.length === 0
                  }
                  className="w-full max-w-md bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-card rounded-xl border border-card-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Expenses
            </h2>
            <div className="space-y-2">
              {expenses.length === 0 ? (
                <p className="text-text-secondary text-center py-8">
                  No expenses yet. Add one to get started!
                </p>
              ) : (
                expenses.map((expense) => {
                  const paidByPerson = getPerson(expense.paidBy);

                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-card-border hover:bg-hover-bg transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: paidByPerson?.color }}
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {expense.description}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {paidByPerson?.name} paid • {expense.date}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-foreground">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-hover-bg text-primary transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <Link
                href={`/trip/${trip?.id}/split`}
                className="w-full max-w-md flex items-center justify-center gap-2 bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                View Split
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showPersonModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg border">
            <h3 className="text-lg font-semibold mb-3">Add Person</h3>

            <input
              className="w-full border border-gray-300 p-2 rounded mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPersonModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={addPerson}
                className="bg-primary text-white px-4 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
