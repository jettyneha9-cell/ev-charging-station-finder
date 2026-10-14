'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [driverName, setDriverName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/stations`);
      const data = await res.json();
      if (data.success) setStations(data.data);
    } catch (err) {
      console.error('Error fetching stations:', err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedStation || !driverName) {
      alert('Please select a station and enter your name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId: selectedStation, driverName }),
      });

      const data = await res.json();
      setMessage(data.message);
      setIsSuccess(data.success);
      if (data.success) {
        setDriverName('');
        fetchStations();
      }
    } catch (err) {
      setMessage('Failed to connect to backend server.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f8fafc', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '850px', margin: '0 auto' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            ⚡ Live Network Active
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            EV Charging Station Finder
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
            Real-time availability and slot booking across Hyderabad region
          </p>
        </header>

        {/* Stations Grid */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#cbd5e1', marginBottom: '16px' }}>Available Stations</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {stations.map((st) => (
              <div
                key={st.id}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#f8fafc' }}>{st.name}</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '14px' }}>📍 {st.location}</p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>🔌 {st.type}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    backgroundColor: st.slots > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: st.slots > 0 ? '#34d399' : '#f87171',
                    border: `1px solid ${st.slots > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}>
                    {st.slots > 0 ? `${st.slots} Slots Left` : 'Fully Booked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <section style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 20px 0', color: '#f8fafc' }}>
            Book a Charging Slot
          </h2>

          <form onSubmit={handleBooking}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>
                Select Station
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #475569',
                  color: '#f8fafc',
                  fontSize: '15px',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose a Station --</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.slots <= 0}>
                    {s.name} ({s.slots} slots available)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>
                Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #475569',
                  color: '#f8fafc',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Processing Booking...' : 'Confirm Slot Booking'}
            </button>
          </form>

          {message && (
            <div style={{
              marginTop: '20px',
              padding: '14px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isSuccess ? '#34d399' : '#f87171',
              border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              {message}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}