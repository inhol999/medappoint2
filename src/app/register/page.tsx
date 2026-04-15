'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState<'patient' | 'clinic'>('patient');
  const [googlePrefill, setGooglePrefill] = useState<{ email: string; name: string; googleId: string } | null>(null);
  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '',
    fullName: '', email: '', phone: '', address: '', dateOfBirth: '',
    clinicName: '', contactNumber: '', location: '', description: '',
    verificationCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Pre-fill from Google OAuth redirect
  useEffect(() => {
    const googleEmail = searchParams.get('googleEmail');
    const googleName = searchParams.get('googleName');
    const googleId = searchParams.get('googleId');
    if (googleEmail && googleId) {
      setGooglePrefill({ email: googleEmail, name: googleName || '', googleId });
      setForm(f => ({
        ...f,
        email: googleEmail,
        fullName: googleName || '',
      }));
      setCodeVerified(true); // Skip verification for Google OAuth
    }
  }, [searchParams]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendVerificationCode = async () => {
    if (!form.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCodeSent(true);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const trimmedCode = form.verificationCode.trim();
    
    if (!trimmedCode) {
      setError('Please enter the verification code');
      return;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setError('Verification code must be exactly 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: form.email, code: trimmedCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCodeVerified(true);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If not Google and code not verified, send code first
    if (!googlePrefill && !codeVerified && !codeSent) {
      await handleSendVerificationCode();
      return;
    }

    // If code sent but not verified, verify it
    if (!googlePrefill && !codeVerified && codeSent) {
      await handleVerifyCode();
      return;
    }

    // All validations passed, proceed with registration
    if (!googlePrefill && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = accountType === 'patient'
        ? {
          accountType,
          username: form.username,
          password: googlePrefill ? crypto.randomUUID() : form.password,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          dateOfBirth: form.dateOfBirth,
          verificationCode: form.verificationCode,
          googleId: googlePrefill?.googleId,
        }
        : {
          accountType,
          username: form.username,
          password: googlePrefill ? crypto.randomUUID() : form.password,
          clinicName: form.clinicName,
          contactNumber: form.contactNumber,
          location: form.location,
          email: form.email,
          description: form.description,
          verificationCode: form.verificationCode,
          googleId: googlePrefill?.googleId,
        };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      if (googlePrefill) {
        await signIn('google', { callbackUrl: '/' });
      } else if (accountType === 'patient') {
        router.push('/login?registered=1');
      } else {
        alert('Clinic registration submitted! An admin will review your application.');
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: any) => {
    let value = e.target.value;
    // Auto-trim verification code input
    if (k === 'verificationCode') {
      value = value.trim().replace(/\s+/g, '');
    }
    setForm(f => ({ ...f, [k]: value }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-logo">Med<span>Appoint</span></div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join MedAppoint — it&apos;s free</p>

        {error && <div className="auth-error">{error}</div>}

        {/* Google Sign-up button (before form) */}
        {!googlePrefill && (
          <>
            <button
              type="button"
              onClick={handleGoogleRegister}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.65rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#374151',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.9 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.5 5.8l6.2 5.2C40.9 35.3 44 30 24c0-1.3-.1-2.7-.4-4z" />
              </svg>
              Continue with Google
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <hr style={{ flex: 1, borderColor: '#e5e7eb' }} />
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>or register with email</span>
              <hr style={{ flex: 1, borderColor: '#e5e7eb' }} />
            </div>
          </>
        )}

        {/* Google prefill banner */}
        {googlePrefill && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#166534' }}>
            ✅ Google account verified ({googlePrefill.email}). Complete your profile below.
          </div>
        )}

        {/* Account Type */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Account Type *</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="accountType" value="patient" checked={accountType === 'patient'} onChange={() => setAccountType('patient')} />
              Patient
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="accountType" value="clinic" checked={accountType === 'clinic'} onChange={() => setAccountType('clinic')} />
              Clinic
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {accountType === 'patient' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Username *</label>
                  <input className="form-input" value={form.username} onChange={set('username')} required minLength={3} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.fullName} onChange={set('fullName')} required readOnly={!!googlePrefill} style={googlePrefill ? { background: '#f9fafb', cursor: 'not-allowed' } : {}} />
                </div>
              </div>
              {!googlePrefill && (
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
            </>
          )}

          <div style={{ marginTop: accountType === 'patient' ? '0.75rem' : '0' }}>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className="form-input"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                readOnly={!!googlePrefill}
                style={googlePrefill ? { background: '#f9fafb', cursor: 'not-allowed' } : {}}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{accountType === 'patient' ? 'Phone *' : 'Clinic Name *'}</label>
              <input
                className="form-input"
                value={accountType === 'patient' ? form.phone : form.clinicName}
                onChange={set(accountType === 'patient' ? 'phone' : 'clinicName')}
                placeholder={accountType === 'patient' ? '09XXXXXXXXX' : 'Clinic name'}
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
                {!googlePrefill && (
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
                  <textarea className="form-input" value={form.description} onChange={set('description')} rows={3} placeholder="Brief description of your clinic" />
                </div>
              </>
            )}
          </div>

          {/* Verification Code Section - Appears after code is sent */}
          {!googlePrefill && codeSent && (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem', fontWeight: 500 }}>
                📧 Verification code sent to {form.email} <span><br />Check your Spam</span>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  type="text"
                  value={form.verificationCode}
                  onChange={set('verificationCode')}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  style={{ flex: 1, textAlign: 'center', fontSize: '1rem', letterSpacing: '0.25rem' }}
                  disabled={codeVerified}
                />
                {!codeVerified && (
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                    disabled={loading || form.verificationCode.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                )}
                {codeVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#059669', fontWeight: 'bold' }}>
                    ✅ Verified
                  </div>
                )}
              </div>
              {countdown > 0 && !codeVerified && (
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  style={{
                    marginTop: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'not-allowed',
                    textDecoration: 'underline',
                    fontSize: '0.875rem'
                  }}
                  disabled
                >
                  Resend code in {countdown}s
                </button>
              )}
              {countdown === 0 && !codeVerified && (
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  style={{
                    marginTop: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.875rem'
                  }}
                >
                  Resend code
                </button>
              )}
            </div>
          )}

          {/* Submit Button - Changes based on state */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            disabled={loading || (codeSent && !codeVerified) || (!googlePrefill && !codeVerified && !codeSent && (!form.email || (accountType === 'patient' && (!form.username || !form.password || !form.confirmPassword)) || (accountType === 'clinic' && (!form.username || !form.password || !form.confirmPassword))))}
          >
            {loading ? 'Processing...' : codeSent && !codeVerified ? 'Enter code above' : googlePrefill ? 'Complete Registration' : `Register ${accountType === 'patient' ? 'Patient' : 'Clinic'}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}