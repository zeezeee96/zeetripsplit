"use client";

import { useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { Trip } from "@/src/types/trips";

export default function Home() {
  const [tripName, setTripName] = useState("");
  const [trips, setTrips] = useLocalStorage<Trip[]>("trips", []);

  const addTrip = () => {
    if (!tripName.trim()) return;
    const newTrip: Trip = {
      id: uuidv4(),
      name: tripName,
      people: [],
      expenses: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
    setTripName("");
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTrip();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/20 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            TripSplit
          </h1>
          <p className="text-lg text-muted-foreground">
            Split trip expenses effortlessly with friends. Keep friendships
            intact, not wallets complicated.
          </p>
        </div>

        {/* Add Trip Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg shadow-primary/5 p-6 mb-8">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Create New Trip
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter trip name (e.g., Murree Trip, Weekend Getaway)"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
            />
            <button
              onClick={addTrip}
              disabled={!tripName.trim()}
              className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>

        {/* Trips List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your Trips
            </h2>
            {trips.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                {trips.length}
              </span>
            )}
          </div>

          {trips.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No trips yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first trip to start splitting expenses
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="group bg-card border border-border hover:border-primary/30 rounded-xl p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:shadow-primary/10"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {trip.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {trip.people?.length || 0} people •{" "}
                      {trip.expenses?.length || 0} expenses
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/trip/${trip.id}`}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors duration-200"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
