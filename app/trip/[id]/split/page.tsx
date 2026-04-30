"use client";

import { useParams } from "next/navigation";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Trip } from "@/src/types/trips";

export default function SplitPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trips] = useLocalStorage<Trip[]>("trips", []);
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return <div className="p-6">Trip not found</div>;
  }

  const people = trip.people || [];
  const expenses = trip.expenses || [];

  // 🔹 total spent
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 🔹 share per person
  const share = people.length ? total / people.length : 0;

  // 🔹 calculate balances
  const balances = people.map((person) => {
    const paid = expenses
      .filter((e) => e.paidBy === person.id)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      ...person,
      paid,
      balance: paid - share,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">Split Summary</h1>
        <p className="text-sm text-gray-500 mb-4">{trip.name}</p>

        {/* Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Total: <span className="font-semibold">Rs {total}</span>
          </p>
          <p className="text-gray-600">
            Per person:{" "}
            <span className="font-semibold">Rs {share.toFixed(2)}</span>
          </p>
        </div>

        {/* Balances */}
        <div className="space-y-2">
          {balances.map((p) => (
            <div
              key={p.id}
              className="p-3 border border-gray-200 rounded-lg flex justify-between items-center"
            >
              <span className="text-gray-800 font-medium">{p.name}</span>

              <span
                className={`font-semibold ${
                  p.balance > 0
                    ? "text-green-600"
                    : p.balance < 0
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {p.balance > 0 && "+"}
                Rs {p.balance.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {people.length === 0 && (
          <p className="text-gray-500 mt-4 text-sm">
            Add people to calculate split
          </p>
        )}
      </div>
    </div>
  );
}
