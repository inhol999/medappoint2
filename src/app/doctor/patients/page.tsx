'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DoctorPatients() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/appointments?status=COMPLETED').then(r => r.json()).then(d => setAppointments(Array.isArray(d) ? d : []));
  }, []);

  // Get unique patients
  const patients = Array.from(
    new Map(appointments.map(a => [a.patient?.patientId, a.patient])).values()
  ).filter(Boolean);

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">My Patients</h1>
      </div>
      <div className="dash-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Home</th><th>Patient Name</th><th>Email</th><th>Phone</th><th>Visits</th></tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.patientId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td style={{ fontWeight: 500 }}>{p.fullName}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{appointments.filter(a => a.patient?.patientId === p.patientId).length}</td>
                  </tr>
                ))}
                {!patients.length && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No patients with completed appointments</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
