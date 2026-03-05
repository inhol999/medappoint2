'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'patient' | 'clinic'>('patient');
  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '',
    fullName: '', email: '', phone: '', address: '', dateOfBirth: '',
    clinicName: '', contactNumber: '', location: '', description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = accountType === 'patient' 
        ? {
            accountType,
            username: form.username,
            password: form.password,
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            dateOfBirth: form.dateOfBirth,
          }
        : {
            accountType,
            username: form.username,
            password: form.password,
            clinicName: form.clinicName,
            contactNumber: form.contactNumber,
            location: form.location,
            email: form.email,
            description: form.description,
          };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      if (accountType === 'patient') {
        router.push('/login?registered=1');
      } else {
        // For clinics, show success message and redirect to home
        alert('Clinic registration submitted successfully! An admin will review your application.');
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-logo">Med<span>Appoint</span></div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join MedAppoint — it&apos;s free</p>

        {error && <div className="auth-error">{error}</div>}

        {/* Account Type Selection */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Account Type *</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="accountType"
                value="patient"
                checked={accountType === 'patient'}
                onChange={(e) => setAccountType(e.target.value as 'patient')}
              />
              Patient
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="accountType"
                value="clinic"
                checked={accountType === 'clinic'}
                onChange={(e) => setAccountType(e.target.value as 'clinic')}
              />
              Clinic
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {accountType === 'patient' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Username *</label>
                <input className="form-input" value={form.username} onChange={set('username')} required minLength={3} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.fullName} onChange={set('fullName')} required />
              </div>
            </div>
          )}
          {accountType === 'patient' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" value={form.password} onChange={set('password')} required minLength={6} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm Password *</label>
                <input className="form-input" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            </div>
          )}
          <div style={{ marginTop: accountType === 'patient' ? '0.75rem' : '0' }}>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">{accountType === 'patient' ? 'Phone *' : 'Clinic Name *'}</label>
              <input 
                className="form-input" 
                value={accountType === 'patient' ? form.phone : form.clinicName} 
                onChange={set(accountType === 'patient' ? 'phone' : 'clinicName')} 
                placeholder={accountType === 'patient' ? "09XXXXXXXXX" : "Clinic name"} 
                required 
              />
            </div>
            {accountType === 'patient' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" value={form.address} onChange={set('address')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Username *</label>
                    <input className="form-input" value={form.username} onChange={set('username')} required minLength={3} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Clinic Name *</label>
                    <input className="form-input" value={form.clinicName} onChange={set('clinicName')} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Password *</label>
                    <input className="form-input" type="password" value={form.password} onChange={set('password')} required minLength={6} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Confirm Password *</label>
                    <input className="form-input" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number *</label>
                  <input className="form-input" value={form.contactNumber} onChange={set('contactNumber')} placeholder="Contact number" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-input" value={form.location} onChange={set('location')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input" 
                    value={form.description} 
                    onChange={set('description')} 
                    rows={3}
                    placeholder="Brief description of your clinic"
                  />
                </div>
              </>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : `Register ${accountType === 'patient' ? 'Patient' : 'Clinic'}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
