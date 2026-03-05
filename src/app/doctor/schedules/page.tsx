'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorSchedules() {
  const { data: session } = useSession();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ dayOfWeek: '', startTime: '', endTime: '', availabilitySlots: '10' });

  const profileId = (session?.user as any)?.profileId;

  useEffect(() => {
    if (profileId) fetchSchedules();
  }, [profileId]);

  async function fetchSchedules() {
    const res = await fetch(`/api/schedules?doctorId=${profileId}`);
    setSchedules(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, doctorId: profileId, availabilitySlots: parseInt(form.availabilitySlots) }),
    });
    setLoading(false);
    setShowModal(false);
    setForm({ dayOfWeek: '', startTime: '', endTime: '', availabilitySlots: '10' });
    fetchSchedules();
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">My Schedules</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Schedule</button>
      </div>
      <div className="dash-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Home</th><th>Day</th><th>Start Time</th><th>End Time</th><th>Available Slots</th><th>Status</th></tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.scheduleId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td style={{ fontWeight: 500 }}>{s.dayOfWeek}</td>
                    <td>{s.startTime}</td>
                    <td>{s.endTime}</td>
                    <td>{s.availabilitySlots}</td>
                    <td><span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
                {!schedules.length && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No schedules set. Add your availability.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add Schedule</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Day of Week *</label>
                <select className="form-select" value={form.dayOfWeek} onChange={set('dayOfWeek')} required>
                  <option value="">Select day</option>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Start Time *</label><input className="form-input" type="time" value={form.startTime} onChange={set('startTime')} required /></div>
                <div className="form-group"><label className="form-label">End Time *</label><input className="form-input" type="time" value={form.endTime} onChange={set('endTime')} required /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Available Slots</label>
                <input className="form-input" type="number" value={form.availabilitySlots} onChange={set('availabilitySlots')} min={1} max={50} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Add Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
