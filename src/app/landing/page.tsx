'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { n: "01", title: "Browse", desc: "Search clinics by location, specialty, or doctor name." },
  { n: "02", title: "Choose", desc: "Compare ratings, availability, and services side by side." },
  { n: "03", title: "Book", desc: "Pick a time slot and get instant confirmation." },
  { n: "04", title: "Manage", desc: "Access records, results, and prescriptions anytime." },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'patient' | 'clinic' | 'doctor'>('patient');
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/clinics')
      .then(r => r.json())
      .then(setClinics);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') return null;

  const filtered = clinics.filter(c =>
    !search ||
    c.clinicName.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`/* global styles copied from home page */
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
        /* … rest of styles omitted for brevity, identical to root page … */
      `}</style>

      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="logo">Meda<span>Point</span></Link>
        <ul className="nav-center">
          <li><a href="#clinics">Find Clinics</a></li>
          <li><a href="#how">How It Works</a></li>
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

      {/* ... remaining landing markup same as home page ... */}
    </>
  );
}
