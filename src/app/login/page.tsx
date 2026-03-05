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

    const res = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid username or password');
      setLoading(false);
    } else {
      router.push('/');
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
        {/* Left side — image */}
        {/*
         <div className="login-image-panel">
          <Image
            src="/clinic.jpg"
            alt="Clinic"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div> 
        */}

        {/* Right side — login form */}
        <div className="auth-page login-form-panel">
          <div className="auth-card">
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
