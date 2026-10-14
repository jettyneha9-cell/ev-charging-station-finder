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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/stations')
      .then((res) => res.json())
      .then((data: Station[]) => {
        setStations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stations:', err);
        setLoading(false);
      });
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation || !driverName) {
      setBookingMessage('Kripya station choose karein aur driver name dalein.');
      return;
    }
    const station = stations.find(s => s.id.toString() === selectedStation);
    setBookingMessage(`Slot successfully booked for ${driverName} at ${station ? station.name : 'Station'}!`);
    setDriverName('');
    setSelectedStation('');
  };

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#ffffff', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Navigation Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid #1f293d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              ⚡
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>VoltCharge EV</h1>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>Smart Charging Network</p>
            </div>
          </div>
          <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>
            ● Live Network Active
          </span>
        </header>

        {/* Hero Banner */}
        <div style={{ background: 'linear-gradient(180deg, #131b2e 0%, #0d1424 100%)', border: '1px solid #1e293b', borderRadius: '16px', padding: '2.5rem', marginBottom: '3rem', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Find & Book EV Chargers Near You
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Real-time charging slot availability across Hyderabad region with instant reservation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

          {/* Available Stations List */}
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔌</span> Available Charging Stations
            </h3>

            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading station data...</p>
            ) : stations.length === 0 ? (
              <div style={{ background: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937', color: '#9ca3af' }}>
                No station data found. Please verify `/api/stations`.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {stations.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      backgroundColor: '#131c2e',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: '#f8fafc' }}>{st.name}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem' }}>📍 {st.location}</p>
                    </div>

                    <div style={{ paddingTop: '0.85rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ backgroundColor: '#1e293b', color: '#cbd5e1', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {st.type}
                      </span>
                      <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: '700' }}>
                        ● {st.slots} slots available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slot Booking Form */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📅</span> Book a Charging Slot
            </h3>

            <div style={{ backgroundColor: '#131c2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: '500' }}>
                    Select Station
                  </label>
                  <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0b0f19',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">-- Select a station --</option>
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.slots} slots open)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: '500' }}>
                    Driver / Vehicle Owner Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0b0f19',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '600',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    marginTop: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Confirm Reservation
                </button>
              </form>

              {bookingMessage && (
                <div style={{ marginTop: '1.25rem', padding: '0.85rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>
                  {bookingMessage}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}