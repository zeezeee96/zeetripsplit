"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, TrendingUp } from "lucide-react";

import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Trip } from "@/src/types/trips";

export default function SplitPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trips] = useLocalStorage<Trip[]>("trips", []);
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) return <div className="p-6">Trip not found</div>;

  const balances: Record<string, number> = {};

  trip.people.forEach((p) => (balances[p.id] = 0));

  trip.expenses.forEach((exp) => {
    const perPerson = exp.amount / exp.splitAmong.length;

    exp.splitAmong.forEach((id) => {
      balances[id] -= perPerson;
    });

    balances[exp.paidBy] += exp.amount;
  });

  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/trip/${trip.id}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-hover-bg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Split Summary
              </h1>

              <p className="text-sm text-text-secondary mt-1">
                {trip.name} • Total: Rs {total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* SUMMARY CARD */}
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-semibold">Rs {total.toFixed(2)}</p>
          </div>

          <div className="bg-primary/10 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* BALANCES CARD */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Per Person Balance
          </h2>

          <div className="space-y-3">
            {trip.people.map((p) => {
              const balance = balances[p.id];

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        backgroundColor: p.color || "#cbd5f5",
                      }}
                    />

                    <span className="font-medium text-foreground">
                      {p.name}
                    </span>
                  </div>

                  <span
                    className={`font-semibold ${
                      balance > 0
                        ? "text-green-600"
                        : balance < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {balance > 0 && "+"}
                    Rs {balance.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {trip.people.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              No people added yet
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
