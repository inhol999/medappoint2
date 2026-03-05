'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDoctors() {
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const clinicId = (session?.user as any)?.clinicId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', specialization: '',
    licenceNumber: '', phone: '', clinicId: clinicId?.toString() || '',
  });

  useEffect(() => {
    if (clinicId) {
      setForm(f => ({ ...f, clinicId: clinicId.toString() }));
      fetchDoctors();
    }
  }, [clinicId]);

  async function fetchDoctors() {
    const res = await fetch(`/api/doctors?clinicId=${clinicId}`);
    setDoctors(await res.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { clinicId, ...bodyData } = form;
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowModal(false);
      setForm({ username: '', password: '', fullName: '', specialization: '', licenceNumber: '', phone: '', clinicId: clinicId || '' });
      fetchDoctors();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(userId: number, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchDoctors();
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">Doctors</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Doctor</button>
      </div>
      <div className="dash-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Home</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Licence No.</th>
                  <th>Clinic</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d: any) => (
                  <tr key={d.doctorId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td style={{ fontWeight: 500 }}>{d.fullName}</td>
                    <td>{d.specialization}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{d.licenceNumber}</td>
                    <td>{d.clinic?.clinicName || '—'}</td>
                    <td>{d.phone}</td>
                    <td>
                      <span className={`badge ${d.user?.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
                        {d.user?.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${d.user?.status === 'ACTIVE' ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => toggleStatus(d.userId, d.user?.status)}
                      >
                        {d.user?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!doctors.length && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No doctors yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add New Doctor</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Username *</label><input className="form-input" value={form.username} onChange={set('username')} required /></div>
                <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" value={form.password} onChange={set('password')} required minLength={6} /></div>
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.fullName} onChange={set('fullName')} required /></div>
                <div className="form-group"><label className="form-label">Specialization *</label><input className="form-input" value={form.specialization} onChange={set('specialization')} required /></div>
                <div className="form-group"><label className="form-label">Licence Number *</label><input className="form-input" value={form.licenceNumber} onChange={set('licenceNumber')} required /></div>
                <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" value={form.phone} onChange={set('phone')} required /></div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray2)' }}>Doctor will be automatically assigned to your clinic.</p>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
