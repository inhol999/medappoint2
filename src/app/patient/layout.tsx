'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/login'); return; }
    if ((session.user as any).role !== 'PATIENT') router.push('/login');
  }, [session, status, router]);

  if (status === 'loading') return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--gray)' }}>Loading...</div>;
  if (!session) return null;

  return (
    <div className="dash-layout">
      <Sidebar role="PATIENT" />
      <div className="dash-content">{children}</div>
    </div>
  );
}
