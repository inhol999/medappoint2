'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function Badge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    PENDING: 'badge-yellow', APPROVED: 'badge-green', CANCELLED: 'badge-red',
    COMPLETED: 'badge-blue', RESCHEDULED: 'badge-gray',
  };
  return <span className={`badge ${cls[status] || 'badge-gray'}`}>{status}</span>;
}

export default function AdminAppointments() {
  const [appts, setAppts] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchAppts(); }, []);

  async function fetchAppts() {
    const url = filter ? `/api/appointments?status=${filter}` : '/api/appointments';
    const res = await fetch(url);
    setAppts(await res.json());
  }

  useEffect(() => { fetchAppts(); }, [filter]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchAppts();
  }

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">Appointments</h1>
        <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div className="dash-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Home</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appts.map((a: any) => (
                  <tr key={a.appointmentId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td>{a.patient?.fullName}</td>
                    <td>{a.doctor?.fullName}<br /><small style={{ color: 'var(--gray2)' }}>{a.doctor?.specialization}</small></td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString('en-PH')}</td>
                    <td>{a.appointmentTime}</td>
                    <td><span className="badge badge-gray">{a.type}</span></td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {a.status === 'PENDING' && (
                          <>
                            <button className="btn btn-sm btn-outline" style={{ color: 'var(--green)' }} onClick={() => updateStatus(a.appointmentId, 'APPROVED')}>Approve</button>
                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(a.appointmentId, 'CANCELLED')}>Cancel</button>
                          </>
                        )}
                        {a.status === 'APPROVED' && (
                          <button className="btn btn-sm btn-outline" style={{ color: 'var(--blue)' }} onClick={() => updateStatus(a.appointmentId, 'COMPLETED')}>Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!appts.length && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
