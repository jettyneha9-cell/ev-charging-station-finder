'use client';

import { useState, useEffect } from 'react';

interface Station {
  id: number;
  name: string;
  location: string;
  slots: number;
  type: string;
}

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [driverName, setDriverName] = useState<string>('');
  const [bookingMessage, setBookingMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/stations')
      .then((res) => res.json())
      .then((data: Station[]) => setStations(data))
      .catch((err) => console.error('error fetching stations:', err));
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation || !driverName) {
      setBookingMessage('please select a station and enter driver name.');
      return;
    }
    setBookingMessage(`slot booked successfully for ${driverName} at station #${selectedStation}!`);
    setDriverName('');
    setSelectedStation('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-10">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-medium tracking-wide">
            live network active
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-2">
            EV Charging Station Finder
          </h1>
          <p className="text-slate-400 text-sm">
            real-time availability and slot booking across hyderabad region
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">
            available stations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stations.map((st) => (
              <div
                key={st.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{st.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{st.location}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
                    {st.type}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {st.slots} slots open
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-lg mx-auto">
          <h2 className="text-lg font-bold mb-4 text-slate-100">
            book a charging slot
          </h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                select station
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">-- choose a station --</option>
                {stations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.slots} slots)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                driver name
              </label>
              <input
                type="text"
                placeholder="e.g. rahul sharma"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-md text-sm transition-colors duration-200 mt-2"
            >
              confirm slot booking
            </button>
          </form>

          {bookingMessage && (
            <p className="mt-4 text-center text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-md">
              {bookingMessage}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}