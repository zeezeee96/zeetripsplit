"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Expense, Person, Trip } from "@/src/types/trips";

export default function TripDetail() {
  const params = useParams();
  const tripId = params.id as string; // ✅ FIX

  const [trips, setTrips] = useLocalStorage<Trip[]>("trips", []);
  const [personName, setPersonName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<string | null>(null); // ✅ FIX
  const [description, setDescription] = useState("");

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return <div className="p-6">Trip not found</div>;
  }

  // 🔹 Update helper
  const updateTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
  };

  // 🔹 Add Person
  const addPerson = () => {
    if (!personName.trim()) return;

    const newPerson: Person = {
      id: uuidv4(),
      name: personName,
    };

    updateTrip({
      ...trip,
      people: [...(trip.people || []), newPerson],
    });

    setPersonName("");
    setShowModal(false);
  };

  // 🔹 Add Expense
  const addExpense = () => {
    if (!amount || !paidBy) return;

    const newExpense: Expense = {
      id: uuidv4(),
      amount: Number(amount),
      paidBy, // ✅ string now
      description,
    };

    updateTrip({
      ...trip,
      expenses: [...(trip.expenses || []), newExpense],
    });

    setAmount("");
    setPaidBy(null);
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">{trip.name}</h1>

        {/* PEOPLE */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              People
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              + Add
            </button>
          </div>

          {trip.people?.length === 0 ? (
            <p className="text-gray-500 text-sm">No people added</p>
          ) : (
            <div className="space-y-2">
              {trip.people.map((p) => (
                <div key={p.id} className="p-2 border rounded text-gray-800">
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD EXPENSE */}
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Add Expense
          </h2>

          <div className="space-y-2 mb-4">
            <input
              type="number"
              placeholder="Amount"
              className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className={`w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                !paidBy ? "text-gray-400" : "text-gray-800"
              }`}
              value={paidBy ?? ""}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              <option value="" disabled hidden>
                Select who paid
              </option>

              {trip.people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Description (optional)"
              className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={addExpense}
              disabled={!amount || !paidBy}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded"
            >
              Add Expense
            </button>
          </div>

          {/* EXPENSE LIST */}
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Expenses
          </h2>

          {trip.expenses?.length === 0 ? (
            <p className="text-gray-500 text-sm">No expenses yet</p>
          ) : (
            <div className="space-y-2">
              {trip.expenses.map((e) => {
                const person = trip.people.find((p) => p.id === e.paidBy);

                return (
                  <div
                    key={e.id}
                    className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">
                        {e.description || "Expense"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Paid by {person?.name || "Unknown"}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800">
                      Rs {e.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg border">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Add Person
            </h3>

            <input
              className="w-full border border-gray-300 p-2 rounded mb-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={addPerson}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
