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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">TripSplit</h1>
        <p className="text-sm text-gray-500 mb-4">
          Split trip expenses easily with friends
        </p>

        {/* Add Trip */}
        <div className="flex gap-2 mb-5">
          <input
            className="border border-gray-300 p-2 rounded w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. Murree Trip"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
          <button
            onClick={addTrip}
            disabled={!tripName.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 rounded transition"
          >
            Add
          </button>
        </div>

        {/* Section Title */}
        <h2 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Trips
        </h2>

        {/* Trip List */}
        <div className="space-y-2">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
            >
              <span className="text-gray-800 font-medium">{trip.name}</span>

              {/* ✅ Navigation FIX */}
              <Link
                href={`/trip/${trip.id}`}
                className="text-sm text-blue-500 hover:underline"
              >
                Open →
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <p className="text-gray-400 text-sm mt-2">
            No trips yet. Start by adding one above.
          </p>
        )}
      </div>
    </div>
  );
}
