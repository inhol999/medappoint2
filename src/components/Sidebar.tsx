'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface SidebarProps {
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

const adminNav: NavItem[] = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/clinics', icon: '🏥', label: 'Clinics' },
  { href: '/admin/users', icon: '👥', label: 'Users' },
  { href: '/admin/doctors', icon: '🩺', label: 'Doctors' },
  { href: '/admin/appointments', icon: '📅', label: 'Appointments' },
];

const doctorNav: NavItem[] = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/doctor/appointments', icon: '📅', label: 'Appointments' },
  { href: '/doctor/schedules', icon: '🗓', label: 'My Schedules' },
  { href: '/doctor/patients', icon: '👤', label: 'My Patients' },
  { href: '/doctor/messages', icon: '💬', label: 'Messages' },
  { href: '/doctor/profile', icon: '⚙️', label: 'Profile' },
];

const patientNav: NavItem[] = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/patient/find', icon: '🔍', label: 'Find a Clinic' },
  { href: '/patient/appointments', icon: '📅', label: 'Appointments' },
  { href: '/patient/payments', icon: '💳', label: 'Payments' },
  { href: '/patient/messages', icon: '💬', label: 'Messages' },
  { href: '/patient/profile', icon: '⚙️', label: 'Profile' },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = role === 'ADMIN' ? adminNav : role === 'DOCTOR' ? doctorNav : patientNav;
  const label = role === 'ADMIN' ? 'Admin Panel' : role === 'DOCTOR' ? 'Doctor Portal' : 'Patient Portal';

  const SidebarContent = () => (
    <>
      <div className="sidebar-logo">Med<span>Appoint</span></div>
      <div style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {label}
      </div>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
          {(session?.user as any)?.name || 'User'}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="nav-item"
          style={{ color: 'rgba(255,255,255,0.5)', width: '100%', borderRadius: '6px' }}
        >
          <span className="nav-icon">↩</span> Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .sidebar {
          width: 260px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          min-height: 100vh;
        }
        .mobile-topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          background: #1e293b;
          align-items: center;
          padding: 0 1rem;
          z-index: 200;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .mobile-topbar .topbar-logo {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          flex: 1;
          text-align: center;
        }
        .mobile-topbar .topbar-logo span { color: #3b82f6; }
        .ham-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 4px;
        }
        .ham-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: white;
          border-radius: 2px;
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 300;
        }
        .mobile-sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 260px;
          height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          z-index: 400;
          transform: translateX(-100%);
          transition: transform 0.28s ease;
          box-shadow: 4px 0 20px rgba(0,0,0,0.3);
        }
        .mobile-sidebar.open {
          transform: translateX(0);
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-topbar { display: flex; }
          .dash-content { padding-top: 72px !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="ham-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>
        <div className="topbar-logo">Med<span>Appoint</span></div>
        <div style={{ width: 30 }} />
      </div>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`mobile-sidebar${mobileOpen ? ' open' : ''}`}>
        <SidebarContent />
      </div>
    </>
  );
}
