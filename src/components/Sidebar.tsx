'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

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
  { href: '/landing', icon: '🏠', label: 'Home' },
];

const doctorNav: NavItem[] = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/doctor/appointments', icon: '📅', label: 'Appointments' },
  { href: '/doctor/schedules', icon: '🗓', label: 'My Schedules' },
  { href: '/doctor/patients', icon: '👤', label: 'My Patients' },
  { href: '/doctor/messages', icon: '💬', label: 'Messages' },
  { href: '/doctor/profile', icon: '⚙️', label: 'Profile' },
  // extra home link below profile
  { href: '/landing', icon: '🏠', label: 'Home' },
];

const patientNav: NavItem[] = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/patient/find', icon: '🔍', label: 'Find a Clinic' },
  { href: '/patient/appointments', icon: '📅', label: 'Appointments' },
  { href: '/patient/payments', icon: '💳', label: 'Payments' },
  { href: '/patient/messages', icon: '💬', label: 'Messages' },
  { href: '/patient/profile', icon: '⚙️', label: 'Profile' },
  // extra home link below profile
  { href: '/landing', icon: '🏠', label: 'Home' },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const nav = role === 'ADMIN' ? adminNav : role === 'DOCTOR' ? doctorNav : patientNav;
  const label = role === 'ADMIN' ? 'Admin Panel' : role === 'DOCTOR' ? 'Doctor Portal' : 'Patient Portal';

  return (
    <aside className="sidebar">
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
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
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
    </aside>
  );
}
