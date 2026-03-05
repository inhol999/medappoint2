'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PatientProfile() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userId) fetch(`/api/users/${userId}`).then(r => r.json()).then(d => {
      setUser(d);
      const p = d.patient;
      setForm({ fullName: p?.fullName, email: p?.email, phone: p?.phone, address: p?.address, dateOfBirth: p?.dateOfBirth?.split('T')[0] });
    });
  }, [userId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <div className="dash-topbar"><h1 className="dash-title">My Profile</h1></div>
      <div className="dash-body">
        <div className="card" style={{ maxWidth: '480px' }}>
          {success && <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>Profile updated!</div>}
          <form onSubmit={handleSave}>
            <div className="form-group"><label className="form-label">Username</label><input className="form-input" value={user?.username || ''} disabled /></div>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.fullName || ''} onChange={set('fullName')} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email || ''} onChange={set('email')} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone || ''} onChange={set('phone')} /></div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address || ''} onChange={set('address')} /></div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={form.dateOfBirth || ''} onChange={set('dateOfBirth')} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>
    </>
  );
}
