'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';

const STEPS = [
  { n: "01", title: "Browse", desc: "Search clinics by location, specialty, or doctor name." },
  { n: "02", title: "Choose", desc: "Compare ratings, availability, and services side by side." },
  { n: "03", title: "Book", desc: "Pick a time slot and get instant confirmation." },
  { n: "04", title: "Manage", desc: "Access records, results, and prescriptions anytime." },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'patient' | 'clinic' | 'doctor'>('patient');
  const [clinics, setClinics] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // if user is signed in, send them to /dashboard unless explicitly requesting the public home page
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  useEffect(() => {
    if (session && !searchParams.get('home')) {
      router.replace('/dashboard');
    }
  }, [session, router, searchParams]);

  useEffect(() => {
    fetch('/api/clinics')
      .then(r => r.json())
      .then(setClinics);
  }, []);

  // landing page doesn't need dashboardData logic

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const filtered = clinics.filter(c =>
    !search ||
    c.clinicName.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading') return null;

  if (session) {
    const role = (session.user as any).role;
    return (
      <div className="dash-layout">
        <Sidebar role={role} />
        <div className="dash-content">
          <div className="dash-header">
            <h1 className="dash-welcome">Welcome back, {(session.user as any).name || 'User'}!</h1>
            <p className="dash-subtitle">
              {role === 'ADMIN' && 'Manage your clinic, doctors, and appointments'}
              {role === 'DOCTOR' && 'View your appointments and manage your schedule'}
              {role === 'PATIENT' && 'Find clinics, book appointments, and manage your health'}
            </p>
          </div>

          {role === 'ADMIN' && dashboardData && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Clinic Overview</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Monitor your clinic&apos;s performance and manage operations</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.totalPatients}</div>
                  <div className="stat-label">Total Patients</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.totalDoctors}</div>
                  <div className="stat-label">Doctors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.totalAppointments}</div>
                  <div className="stat-label">Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.pendingAppointments}</div>
                  <div className="stat-label">Pending Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.todayAppointments}</div>
                  <div className="stat-label">Today&apos;s Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">₱{dashboardData.totalRevenue}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
            </>
          )}

          {role === 'DOCTOR' && dashboardData && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Your Practice</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Track your appointments and patient care</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.todayAppointments}</div>
                  <div className="stat-label">Today&apos;s Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.totalAppointments}</div>
                  <div className="stat-label">Total Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.patients}</div>
                  <div className="stat-label">Patients</div>
                </div>
              </div>
            </>
          )}

          {role === 'PATIENT' && dashboardData && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Your Health</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage your appointments and healthcare journey</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.upcomingAppointments}</div>
                  <div className="stat-label">Upcoming Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{dashboardData.totalAppointments}</div>
                  <div className="stat-label">Total Appointments</div>
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Quick Actions</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Access the most common tasks and features</p>
            </div>
            <div className="quick-links">
              {role === 'ADMIN' && (
                <>
                  <Link href="/admin/users" className="quick-link">
                    <div className="icon">👥</div>
                    <h3>Manage Users</h3>
                    <p>View and manage clinic users</p>
                  </Link>
                  <Link href="/admin/doctors" className="quick-link">
                    <div className="icon">🩺</div>
                    <h3>Manage Doctors</h3>
                    <p>Add and manage doctors</p>
                  </Link>
                  <Link href="/admin/appointments" className="quick-link">
                    <div className="icon">📅</div>
                    <h3>Appointments</h3>
                    <p>View all appointments</p>
                  </Link>
                </>
              )}
              {role === 'DOCTOR' && (
                <>
                  <Link href="/doctor/appointments" className="quick-link">
                    <div className="icon">📅</div>
                    <h3>My Appointments</h3>
                    <p>View and manage appointments</p>
                  </Link>
                  <Link href="/doctor/schedules" className="quick-link">
                    <div className="icon">🗓</div>
                    <h3>My Schedules</h3>
                    <p>Manage availability</p>
                  </Link>
                  <Link href="/doctor/patients" className="quick-link">
                    <div className="icon">👤</div>
                    <h3>My Patients</h3>
                    <p>View patient records</p>
                  </Link>
                </>
              )}
              {role === 'PATIENT' && (
                <>
                  <Link href="/patient/find" className="quick-link">
                    <div className="icon">🔍</div>
                    <h3>Find a Clinic</h3>
                    <p>Search and book appointments</p>
                  </Link>
                  <Link href="/patient/appointments" className="quick-link">
                    <div className="icon">📅</div>
                    <h3>My Appointments</h3>
                    <p>View upcoming appointments</p>
                  </Link>
                  <Link href="/patient/payments" className="quick-link">
                    <div className="icon">💳</div>
                    <h3>Payments</h3>
                    <p>View payment history</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );

  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --black: #111111; --gray: #6b7280; --gray2: #9ca3af; --line: #e5e7eb; --bg: #ffffff; --blue: #2563eb; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--black); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 60px; background: white; border-bottom: 1px solid transparent; display: flex; align-items: center; padding: 0 5%; justify-content: space-between; transition: border-color 0.3s; }
        nav.scrolled { border-bottom-color: var(--line); }
        .logo { font-size: 1.05rem; font-weight: 600; color: var(--black); text-decoration: none; letter-spacing: -0.02em; }
        .logo span { color: var(--blue); }
        .nav-center { display: flex; gap: 2.5rem; list-style: none; position: absolute; left: 50%; transform: translateX(-50%); }
        .nav-center a { font-size: 0.875rem; font-weight: 400; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .nav-center a:hover { color: var(--black); }
        .nav-right { display: flex; gap: 0.75rem; align-items: center; }
        .nav-signin { font-size: 0.875rem; font-weight: 400; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .nav-signin:hover { color: var(--black); }
        .nav-join { font-size: 0.875rem; font-weight: 500; padding: 0.45rem 1.1rem; background: var(--black); color: white; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; transition: opacity 0.2s; }
        .nav-join:hover { opacity: 0.75; }
        .ham { display: none; flex-direction: column; gap: 4px; cursor: pointer; background: none; border: none; }
        .ham span { width: 20px; height: 1.5px; background: var(--black); display: block; }
        .mob-menu { position: fixed; top: 60px; left: 0; right: 0; z-index: 99; background: white; border-bottom: 1px solid var(--line); padding: 1.5rem 5%; display: flex; flex-direction: column; gap: 1rem; transform: translateY(-110%); transition: transform 0.28s ease; }
        .mob-menu.open { transform: translateY(0); }
        .mob-menu a { font-size: 0.95rem; color: var(--black); text-decoration: none; }

        .hero { padding: 140px 5% 80px; max-width: 860px; margin: 0 auto; text-align: center; }
        .hero-eyebrow { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 1.5rem; opacity: 0; animation: up 0.5s 0.1s ease forwards; }
        .hero h1 { font-size: clamp(2.6rem, 6vw, 4.5rem); font-weight: 300; line-height: 1.1; letter-spacing: -0.04em; color: var(--black); margin-bottom: 1.25rem; opacity: 0; animation: up 0.55s 0.18s ease forwards; }
        .hero h1 strong { font-weight: 600; }
        .hero h1 em { font-style: italic; font-weight: 300; color: var(--blue); }
        .hero p { font-size: 1rem; color: var(--gray); line-height: 1.7; max-width: 460px; margin: 0 auto 3rem; font-weight: 400; opacity: 0; animation: up 0.55s 0.26s ease forwards; }
        @keyframes up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .search-box { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; max-width: 480px; margin: 0 auto 1rem; transition: border-color 0.2s, box-shadow 0.2s; opacity: 0; animation: up 0.55s 0.32s ease forwards; background: white; }
        .search-box:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .search-box input { flex: 1; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--black); padding: 0.85rem 1rem; background: transparent; }
        .search-box input::placeholder { color: var(--gray2); }
        .search-box button { font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.65rem 1.2rem; margin: 0.25rem; background: var(--black); color: white; border: none; border-radius: 5px; cursor: pointer; transition: opacity 0.2s; }
        .search-box button:hover { opacity: 0.75; }
        .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; opacity: 0; animation: up 0.5s 0.38s ease forwards; margin-bottom: 5rem; }
        .tag { font-size: 0.78rem; font-weight: 400; color: var(--gray); border: 1px solid var(--line); border-radius: 100px; padding: 0.25rem 0.8rem; cursor: pointer; transition: all 0.18s; background: white; }
        .tag:hover { border-color: var(--blue); color: var(--blue); }

        .clinic-section { padding: 0 5% 6rem; }
        .section-label { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray2); margin-bottom: 1.25rem; text-align: center; }
        .clinic-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; max-width: 860px; margin: 0 auto; }
        .clinic-item { padding: 1.5rem; background: white; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); transition: background 0.15s; cursor: pointer; }
        .clinic-item:nth-child(3n) { border-right: none; }
        .clinic-item:nth-last-child(-n+3) { border-bottom: none; }
        .clinic-item:hover { background: #fafafa; }
        .ci-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem; }
        .ci-name { font-size: 0.9rem; font-weight: 500; line-height: 1.35; }
        .ci-rating { font-size: 0.75rem; color: var(--gray2); white-space: nowrap; margin-left: 0.5rem; }
        .ci-rating b { color: var(--black); font-weight: 600; }
        .ci-loc { font-size: 0.78rem; color: var(--gray2); margin-bottom: 0.65rem; }
        .ci-spec { font-size: 0.75rem; font-weight: 500; color: var(--blue); }
        .no-results { grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray); font-size: 0.875rem; }
        .view-all { display: block; text-align: center; margin-top: 1.25rem; font-size: 0.875rem; color: var(--blue); text-decoration: none; font-weight: 500; }
        .view-all:hover { text-decoration: underline; }
        .features-section { padding: 5rem 5%; border-top: 1px solid var(--line); }
        .features-inner { max-width: 1200px; margin: 0 auto; text-align: center; }
        .features-section h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; margin-bottom: 3rem; line-height: 1.2; }
        .features-section h2 strong { font-weight: 600; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .feature-card { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 2rem; text-align: center; transition: all 0.2s; }
        .feature-card:hover { border-color: var(--blue); box-shadow: 0 4px 20px rgba(37,99,235,0.1); transform: translateY(-2px); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--black); }
        .feature-card p { font-size: 0.9rem; color: var(--gray); line-height: 1.6; }
        .how-header { margin-bottom: 3rem; }
        .how-header h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; line-height: 1.2; }
        .how-header h2 strong { font-weight: 600; }
        .steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; }
        .step-n { font-size: 0.72rem; font-weight: 500; color: var(--gray2); letter-spacing: 0.08em; margin-bottom: 1.25rem; }
        .step-title { font-size: 0.95rem; font-weight: 500; margin-bottom: 0.4rem; }
        .step-desc { font-size: 0.82rem; color: var(--gray); line-height: 1.6; font-weight: 400; }

        .who { padding: 5rem 5%; border-top: 1px solid var(--line); }
        .who-inner { max-width: 860px; margin: 0 auto; }
        .who-header h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; line-height: 1.2; }
        .who-header h2 strong { font-weight: 600; }
        .who-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line); margin-bottom: 3rem; }
        .who-tab { font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 400; padding: 0.7rem 1.4rem; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: var(--gray); transition: all 0.2s; margin-bottom: -1px; }
        .who-tab.active { color: var(--black); border-bottom-color: var(--black); font-weight: 500; }
        .who-body { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .who-points { display: flex; flex-direction: column; gap: 1.5rem; }
        .wp { display: flex; gap: 1rem; }
        .wp-num { font-size: 0.72rem; color: var(--gray2); font-weight: 500; padding-top: 0.15rem; flex-shrink: 0; width: 20px; }
        .wp-title { font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .wp-desc { font-size: 0.82rem; color: var(--gray); line-height: 1.6; }
        .who-cta-wrap { display: flex; flex-direction: column; gap: 0.85rem; padding-top: 0.25rem; }
        .who-cta-wrap h3 { font-size: 1.3rem; font-weight: 300; letter-spacing: -0.02em; line-height: 1.35; }
        .who-cta-wrap h3 strong { font-weight: 600; }
        .who-cta-wrap p { font-size: 0.875rem; color: var(--gray); line-height: 1.7; }
        .btn-dark { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.6rem 1.4rem; background: var(--black); color: white; border-radius: 6px; text-decoration: none; transition: opacity 0.2s; width: fit-content; margin-top: 0.5rem; }
        .btn-dark:hover { opacity: 0.75; }

        .cta-section { padding: 6rem 5%; border-top: 1px solid var(--line); text-align: center; }
        .cta-section h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 300; letter-spacing: -0.04em; margin-bottom: 1rem; line-height: 1.1; }
        .cta-section h2 strong { font-weight: 600; }
        .cta-section h2 em { font-style: italic; color: var(--blue); }
        .cta-section p { font-size: 0.95rem; color: var(--gray); max-width: 380px; margin: 0 auto 2.25rem; line-height: 1.7; }
        .cta-btns { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
        .btn-blue { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.65rem 1.5rem; background: var(--blue); color: white; border-radius: 6px; text-decoration: none; transition: opacity 0.2s; }
        .btn-blue:hover { opacity: 0.85; }
        .btn-line { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 400; padding: 0.65rem 1.5rem; background: white; color: var(--black); border: 1px solid var(--line); border-radius: 6px; text-decoration: none; transition: border-color 0.2s; }
        .btn-line:hover { border-color: #9ca3af; }

        .role-row { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; max-width: 640px; margin: 3.5rem auto 0; }
        .role-item { padding: 1.5rem; background: white; border-right: 1px solid var(--line); text-align: left; }
        .role-item:last-child { border-right: none; }
        .role-emoji { font-size: 1.1rem; margin-bottom: 0.65rem; display: block; }
        .role-item h4 { font-size: 0.875rem; font-weight: 500; margin-bottom: 0.3rem; }
        .role-item p { font-size: 0.78rem; color: var(--gray); line-height: 1.55; margin-bottom: 0.65rem; }
        .role-link { font-size: 0.78rem; color: var(--blue); text-decoration: none; font-weight: 500; }
        .stats-section { padding: 4rem 5%; background: var(--blue-light); }
        .stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
        .stat-item .stat-number { font-size: 2.5rem; font-weight: 700; color: var(--blue); margin-bottom: 0.5rem; }
        .stat-item .stat-label { font-size: 1rem; color: var(--gray); font-weight: 500; }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; text-align: center; }
        .testimonials-section h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; margin-bottom: 3rem; line-height: 1.2; }
        .testimonials-section h2 strong { font-weight: 600; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .testimonial-card { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 2rem; text-align: left; }
        .testimonial-stars { color: #fbbf24; margin-bottom: 1rem; }
        .testimonial-card p { font-size: 0.95rem; color: var(--gray); line-height: 1.6; margin-bottom: 1.5rem; font-style: italic; }
        .testimonial-author { display: flex; justify-content: space-between; align-items: center; }
        .author-name { font-weight: 600; color: var(--black); }
        .author-role { font-size: 0.85rem; color: var(--gray); }
        .footer-brand { font-size: 0.9rem; font-weight: 600; color: var(--black); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { font-size: 0.78rem; color: var(--gray2); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--black); }
        .footer-copy { font-size: 0.75rem; color: var(--gray2); }

        @media(max-width:768px) {
          .nav-center, .nav-right { display: none; }
          .ham { display: flex; }
          .clinic-grid { grid-template-columns: 1fr 1fr; }
          .steps { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .who-body { grid-template-columns: 1fr; gap: 2rem; }
          .role-row { grid-template-columns: 1fr; }
          .role-item { border-right: none; border-bottom: 1px solid var(--line); }
          .role-item:last-child { border-bottom: none; }
          footer { flex-direction: column; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
        @media(max-width:480px) {
          .clinic-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; }
        }

        /* Dashboard Styles */
        .dash-layout { display: flex; min-height: 100vh; background: #f8fafc; }
        .sidebar { width: 280px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 1.5rem 0; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.1); }
        .sidebar-logo { font-size: 1.25rem; font-weight: 600; padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-logo span { color: #3b82f6; }
        .sidebar-nav { flex: 1; padding: 1rem 0; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; transition: all 0.2s; border-radius: 6px; margin: 0 0.5rem; }
        .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: rgba(59,130,246,0.2); color: white; }
        .nav-icon { font-size: 1.1rem; }
        .sidebar-footer { padding: 1rem 0.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .dash-content { flex: 1; padding: 2rem; background: #f8fafc; }
        .dash-header { margin-bottom: 2rem; }
        .dash-welcome { font-size: 1.8rem; font-weight: 300; color: #1e293b; margin-bottom: 0.5rem; }
        .dash-subtitle { font-size: 0.95rem; color: #64748b; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .quick-link { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; text-align: center; transition: all 0.2s; text-decoration: none; color: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .quick-link:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .quick-link .icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .quick-link h3 { font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: 600; color: #1e293b; }
        .quick-link p { color: #64748b; font-size: 0.95rem; line-height: 1.5; }
      `}</style>

      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="logo">Med<span>Appoint</span></Link>
        <ul className="nav-center">
          <li><a href="#clinics">Find Clinics</a></li>
          <li><a href="#who">For You</a></li>
        </ul>
        <div className="nav-right">
          <Link href="/login" className="nav-signin">Sign in</Link>
          <Link href="/register" className="nav-join">Join free</Link>
        </div>
        <button className="ham" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mob-menu${menuOpen ? ' open' : ''}`}>
        <a href="#clinics" onClick={() => setMenuOpen(false)}>Find Clinics</a>
        <a href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a href="#who" onClick={() => setMenuOpen(false)}>For You</a>
        <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
        <Link href="/register" className="nav-join" style={{ textAlign: 'center' }} onClick={() => setMenuOpen(false)}>Join free</Link>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Healthcare, simplified</div>
        <h1>Find your clinic.<br /><em>Book your doctor.</em></h1>
        <p>Search hundreds of verified clinics across the Philippines. Choose, book, and manage your health — all in one place.</p>
        <div className="search-box">
          <input type="text" placeholder="Clinic, specialty, or location..." value={search} onChange={e => setSearch(e.target.value)} />
          <button>Search</button>
        </div>
        <div className="tags">
          {['Cardiology', 'Pediatrics', 'OB-GYN', 'Makati', 'Quezon City', 'Orthopedics'].map(t => (
            <span className="tag" key={t} onClick={() => setSearch(t)}>{t}</span>
          ))}
        </div>
      </section>

      {/* CLINICS */}
      <section className="clinic-section" id="clinics">
        <div className="section-label">Featured clinics</div>
        <div className="clinic-grid">
          {filtered.length > 0 ? filtered.map((c, i) => (
            <Link href={session ? "/patient/find" : "/login"} key={i} className="clinic-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ci-top">
                <div className="ci-name">{c.clinicName}</div>
              </div>
              <div className="ci-loc">{c.location}</div>
              <div className="ci-spec">{c.description || 'Medical Clinic'}</div>
            </Link>
          )) : (
            <div className="no-results">
              No results for &quot;{search}&quot;.{''}
              <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setSearch('')}>Clear</span>
            </div>
          )}
        </div>
        <Link href="/register" className="view-all">View all clinics & book →</Link>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-label">Why choose MedaPoint</div>
          <h2>Everything you need for <strong>better healthcare.</strong></h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find clinics by specialty, location, or doctor name with advanced filters.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Instant Booking</h3>
              <p>Book appointments 24/7 with real-time availability and instant confirmation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Direct Communication</h3>
              <p>Message your doctor directly through our secure platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Health Records</h3>
              <p>Access your medical history, prescriptions, and test results anytime.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Rated & Reviewed</h3>
              <p>Read reviews from real patients to choose the best healthcare providers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Pay for appointments safely with multiple payment options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="who" id="who">
        <div className="who-inner">
          <div className="who-header" style={{ marginBottom: '2.5rem' }}>
            <div className="section-label" style={{ textAlign: 'left' }}>Built for everyone</div>
            <h2>One platform,<br /><strong>three roles.</strong></h2>
          </div>
          <div className="who-tabs">
            {(['patient', 'clinic', 'doctor'] as const).map(t => (
              <button key={t} className={`who-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t === 'patient' ? 'Patients' : t === 'clinic' ? 'Clinics' : 'Doctors'}
              </button>
            ))}
          </div>

          {tab === 'patient' && (
            <div className="who-body">
              <div className="who-points">
                {[
                  { title: 'Search & compare clinics', desc: 'Filter by specialty, location, ratings, and doctor availability in real time.' },
                  { title: 'Book appointments 24/7', desc: 'Pick your time slot and get instant confirmation — no phone calls needed.' },
                  { title: 'Access your health records', desc: 'View medical history, prescriptions, and lab results from any device.' },
                  { title: 'Switch clinics anytime', desc: 'You are not locked in. Change your clinic whenever you need to.' },
                ].map((p, i) => (
                  <div className="wp" key={i}>
                    <div className="wp-num">0{i + 1}</div>
                    <div><div className="wp-title">{p.title}</div><div className="wp-desc">{p.desc}</div></div>
                  </div>
                ))}
              </div>
              <div className="who-cta-wrap">
                <h3>Take control of your <strong>healthcare journey.</strong></h3>
                <p>No more calling clinic after clinic. Find the right doctor, at the right clinic, at a time that works — all from your phone.</p>
                <Link href="/register" className="btn-dark">Create patient account</Link>
              </div>
            </div>
          )}

          {tab === 'clinic' && (
            <div className="who-body">
              <div className="who-points">
                {[
                  { title: 'Register your clinic', desc: 'List your clinic on MedaPoint and reach thousands of patients in your city.' },
                  { title: 'Manage your team', desc: 'Add doctors, assign schedules, and control access with role-based permissions.' },
                  { title: 'Reduce no-shows', desc: 'Automated reminders keep your calendar full and reliable.' },
                  { title: 'Analytics dashboard', desc: 'Track patient flow, revenue, and performance metrics in real time.' },
                ].map((p, i) => (
                  <div className="wp" key={i}>
                    <div className="wp-num">0{i + 1}</div>
                    <div><div className="wp-title">{p.title}</div><div className="wp-desc">{p.desc}</div></div>
                  </div>
                ))}
              </div>
              <div className="who-cta-wrap">
                <h3>Grow your clinic with <strong>smart digital tools.</strong></h3>
                <p>Digitize operations, reduce admin work, and deliver a better experience for every patient that walks through your door.</p>
                <Link href="/login" className="btn-dark">Sign in as Admin</Link>
              </div>
            </div>
          )}

          {tab === 'doctor' && (
            <div className="who-body">
              <div className="who-points">
                {[
                  { title: 'Manage your schedule', desc: 'Set your availability and let patients book open slots automatically.' },
                  { title: 'Digital consultations', desc: 'Access full patient history, write prescriptions, and add notes digitally.' },
                  { title: 'Smart queue management', desc: 'Real-time patient queue with priority controls and alerts.' },
                  { title: 'Performance insights', desc: 'See consultation stats, patient feedback, and trends over time.' },
                ].map((p, i) => (
                  <div className="wp" key={i}>
                    <div className="wp-num">0{i + 1}</div>
                    <div><div className="wp-title">{p.title}</div><div className="wp-desc">{p.desc}</div></div>
                  </div>
                ))}
              </div>
              <div className="who-cta-wrap">
                <h3>Focus on patients, <strong>not paperwork.</strong></h3>
                <p>A clean, fast dashboard that puts everything you need in one place — less admin, more care.</p>
                <Link href="/login" className="btn-dark">Go to doctor portal</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Your health.<br /><em>Your choice.</em></h2>
        <p>Whether you are a patient, a clinic, or a doctor — MedaPoint was built for you.</p>
        <div className="cta-btns">
          <Link href="/register" className="btn-blue">Create free account</Link>
          <Link href="/login" className="btn-line">Sign in</Link>
        </div>
        <div className="role-row">
          {[
            { emoji: '👤', title: 'For Patients', desc: 'Free to use. Find and book clinics near you.', link: '/register' },
            { emoji: '🏥', title: 'For Clinics', desc: 'List your clinic and reach more patients.', link: '/login' },
            { emoji: '🩺', title: 'For Doctors', desc: 'Manage appointments and patient records.', link: '/login' },
          ].map(r => (
            <div className="role-item" key={r.title}>
              <span className="role-emoji">{r.emoji}</span>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
              <Link href={r.link} className="role-link">Get started →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">MedaPoint</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">For Clinics</a>
          <a href="#">Contact</a>
          <a href="#">Help</a>
        </div>
        <div className="footer-copy">© 2026 MedaPoint</div>
      </footer>
    </>
  );
}