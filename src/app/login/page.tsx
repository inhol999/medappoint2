'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        username: form.username,
        password: form.password,
        redirect: false,
      });

      console.log('✓ Sign-in response:', { ok: res?.ok, status: res?.status, error: res?.error });

      if (res?.error || !res?.ok) {
        setError('Invalid username or password');
        setLoading(false);
      } else if (res?.status === 200) {
        // Successfully authenticated, redirect
        console.log('✓ Login successful, redirecting...');
        router.push('/');
      } else {
        console.error('❌ Unexpected response status:', res?.status);
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-wrapper {
          display: flex;
          min-height: 100vh;
        }
        .login-image-panel {
          display: none;
          flex: 1;
          position: relative;
        }
        @media (min-width: 768px) {
          .login-image-panel {
            display: block;
          }
        }
        .login-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <div className="login-wrapper">
        {/* Right side — login form */}
        <div className="auth-page login-form-panel">
          <div className="auth-card">
            <Link href="/" style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'none', display: 'inline-block', marginBottom: '1.25rem' }}>← Back to home</Link>
            <div className="auth-logo">Med<span>Appoint</span></div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to your account to continue</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
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
                  marginBottom: '0.75rem',
                  color: '#374151',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.9 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.5 5.8l6.2 5.2C40.9 35.3 44 30 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                Continue with Google
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <hr style={{ flex: 1, borderColor: '#e5e7eb' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>or sign in with username</span>
                <hr style={{ flex: 1, borderColor: '#e5e7eb' }} />
              </div>
            </div>

            <div className="auth-footer">
              Don&apos;t have an account?{' '}
              <Link href="/register">Create patient account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
