'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PatientFind() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ appointmentDate: '', appointmentTime: '', notes: '', type: 'GENERAL' });

  useEffect(() => { fetchData(); }, [search]);

  async function fetchData() {
    const [cRes, dRes] = await Promise.all([
      fetch(`/api/clinics?search=${search}`),
      fetch(`/api/doctors?search=${search}`),
    ]);
    setClinics(await cRes.json());
    setDoctors(await dRes.json());
  }

  async function selectDoctor(doc: any) {
    setSelectedDoctor(doc);
    const res = await fetch(`/api/schedules?doctorId=${doc.doctorId}`);
    setSchedules(await res.json());
    setShowBooking(true);
    setForm({ appointmentDate: '', appointmentTime: '', notes: '', type: 'GENERAL' });
    setError('');
    setSuccess(false);
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: selectedDoctor.doctorId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

  // Get available times from schedule
  function getTimeSuggestions() {
    const date = new Date(form.appointmentDate);
    if (!date || isNaN(date.getTime())) return [];
    const dayName = date.toLocaleDateString('en', { weekday: 'long' });
    const schedule = schedules.find(s => s.dayOfWeek === dayName);
    if (!schedule) return [];

    const times: string[] = [];
    const [startH] = schedule.startTime.split(':').map(Number);
    const [endH] = schedule.endTime.split(':').map(Number);
    for (let h = startH; h < endH; h++) {
      times.push(`${String(h).padStart(2, '0')}:00`);
      if (h < endH - 1) times.push(`${String(h).padStart(2, '0')}:30`);
    }
    return times;
  }

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">Find a Clinic</h1>
      </div>
      <div className="dash-body">
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <input className="form-input" placeholder="Search by clinic, doctor, or specialty..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <h3 style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Available Doctors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {doctors.map(d => (
            <div key={d.doctorId} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--blue)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
              onClick={() => selectDoctor(d)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{d.fullName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--blue)', marginBottom: '0.5rem' }}>{d.specialization}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray2)' }}>{d.clinic?.clinicName || 'No clinic assigned'}</div>
                  {d.clinic && <div style={{ fontSize: '0.75rem', color: 'var(--gray2)' }}>{d.clinic.location}</div>}
                </div>
                <span className={`badge ${d.availabilityStatus === 'AVAILABLE' ? 'badge-green' : 'badge-red'}`}>{d.availabilityStatus}</span>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--gray2)' }}>
                {d.schedules?.map((s: any) => s.dayOfWeek.slice(0, 3)).join(', ')} · {d.schedules?.[0]?.startTime}–{d.schedules?.[0]?.endTime}
              </div>
              <button className="btn btn-blue btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }} onClick={e => { e.stopPropagation(); selectDoctor(d); }}>Book Appointment</button>
            </div>
          ))}
          {!doctors.length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--gray2)', padding: '2rem', fontSize: '0.875rem' }}>
              No doctors found. Try a different search.
            </div>
          )}
        </div>
      </div>

      {showBooking && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="modal" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Book Appointment</h2>
            <div style={{ background: '#f9fafb', borderRadius: '6px', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <strong>{selectedDoctor.fullName}</strong> — {selectedDoctor.specialization}<br />
              <span style={{ color: 'var(--gray2)', fontSize: '0.8rem' }}>{selectedDoctor.clinic?.clinicName}</span>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Appointment booked successfully!</div>
                <div style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1rem' }}>Your appointment has been scheduled. You can now proceed to payment at your convenience.</div>
                <Link href="/patient/appointments" className="btn btn-blue">View My Appointments</Link>
              </div>
            ) : (
              <form onSubmit={handleBook}>
                {error && <div className="auth-error">{error}</div>}
                <div className="form-group">
                  <label className="form-label">Available Days: {schedules.map(s => s.dayOfWeek.slice(0, 3)).join(', ') || 'None set'}</label>
                  <input className="form-input" type="date" value={form.appointmentDate} onChange={set('appointmentDate')} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  {getTimeSuggestions().length > 0 ? (
                    <select className="form-select" value={form.appointmentTime} onChange={set('appointmentTime')} required>
                      <option value="">Select time</option>
                      {getTimeSuggestions().map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input className="form-input" type="time" value={form.appointmentTime} onChange={set('appointmentTime')} required />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Appointment Type</label>
                  <select className="form-select" value={form.type} onChange={set('type')}>
                    <option value="GENERAL">General</option>
                    <option value="SPECIALIST">Specialist</option>
                    <option value="FOLLOW_UP">Follow-up</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes / Symptoms</label>
                  <textarea className="form-textarea" value={form.notes} onChange={set('notes')} placeholder="Describe your symptoms or reason for visit..." style={{ minHeight: '80px' }} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowBooking(false)}>Cancel</button>
                  <button type="submit" className="btn btn-blue" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
