'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/Sidebar';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (!session) return;
    const role = (session.user as any).role;
    if (role === 'ADMIN') {
      fetch('/api/admin/stats')
        .then(r => r.json())
        .then(setDashboardData);
    } else if (role === 'DOCTOR') {
      fetch('/api/doctors')
        .then(r => r.json())
        .then(doctors => {
          const doctor = doctors.find((d: any) => d.doctorId === (session.user as any).profileId);
          if (doctor) {
            fetch(`/api/appointments?doctorId=${doctor.doctorId}`)
              .then(r => r.json())
              .then(appointments => {
                setDashboardData({
                  todayAppointments: appointments.filter((a: any) => new Date(a.date).toDateString() === new Date().toDateString()).length,
                  totalAppointments: appointments.length,
                  patients: Array.from(new Set(appointments.map((a: any) => a.patientId))).length,
                });
              });
          }
        });
    } else if (role === 'PATIENT') {
      fetch('/api/appointments')
        .then(r => r.json())
        .then(appointments => {
          const userAppointments = appointments.filter((a: any) => a.patientId === (session.user as any).profileId);
          setDashboardData({
            upcomingAppointments: userAppointments.filter((a: any) => new Date(a.date) >= new Date()).length,
            totalAppointments: userAppointments.length,
          });
        });
    }
  }, [session]);

  useEffect(() => {
    fetch('/api/clinics')
      .then(r => r.json())
      .then(setClinics);
  }, []);

  if (status === 'loading') return null;
  if (!session) {
    // redirect could be added, but page is protected via middleware maybe
    return <p>Loading...</p>;
  }

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
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Monitor your clinic's performance and manage operations</p>
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
                <div className="stat-label">Today's Appointments</div>
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
                <div className="stat-label">Today's Appointments</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
