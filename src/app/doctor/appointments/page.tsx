'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function Badge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    PENDING: 'badge-yellow', APPROVED: 'badge-green', CANCELLED: 'badge-red',
    COMPLETED: 'badge-blue', RESCHEDULED: 'badge-gray', DONE: 'badge-blue',
  };
  return <span className={`badge ${cls[status] || 'badge-gray'}`}>{status}</span>;
}

export default function DoctorAppointments() {
  const [appts, setAppts] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAppts(); }, []);

  async function fetchAppts() {
    const url = filter ? `/api/appointments?status=${filter}` : '/api/appointments';
    const res = await fetch(url);
    const data = await res.json();
    setAppts(Array.isArray(data) ? data : []);
  }

  useEffect(() => { fetchAppts(); }, [filter]);

  async function updateStatus(id: number, status: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAppts();
      } else {
        alert('Failed to update appointment');
      }
    } catch (err) {
      alert('Error updating appointment');
    } finally {
      setLoading(false);
    }
  }

  async function deleteAppointment(id: number) {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAppts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete appointment');
      }
    } catch (err) {
      alert('Error deleting appointment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">My Appointments</h1>
        <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)} disabled={loading}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <div className="dash-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Home</th><th>Patient</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appts.map((a: any) => (
                  <tr key={a.appointmentId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td>{a.patient?.fullName}<br /><small style={{ color: 'var(--gray2)' }}>{a.patient?.email}</small></td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString('en-PH')}</td>
                    <td>{a.appointmentTime}</td>
                    <td><span className="badge badge-gray">{a.type}</span></td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {a.status === 'PENDING' && (
                          <>
                            <button className="btn btn-sm btn-outline" style={{ color: 'var(--green)' }} onClick={() => updateStatus(a.appointmentId, 'APPROVED')} disabled={loading}>Approve</button>
                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(a.appointmentId, 'CANCELLED')} disabled={loading}>Cancel</button>
                          </>
                        )}
                        {a.status === 'APPROVED' && (
                          <>
                            <button className="btn btn-sm btn-outline" style={{ color: 'var(--blue)' }} onClick={() => updateStatus(a.appointmentId, 'COMPLETED')} disabled={loading}>Complete</button>
                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(a.appointmentId, 'CANCELLED')} disabled={loading}>Cancel</button>
                          </>
                        )}
                        {a.status === 'COMPLETED' && (
                          <>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteAppointment(a.appointmentId)} disabled={loading} style={{ background: '#cc3333', color: 'white' }}>Delete</button>
                          </>
                        )}
                        {a.status === 'DONE' && (
                          <>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteAppointment(a.appointmentId)} disabled={loading} style={{ background: '#cc3333', color: 'white' }}>Delete</button>
                          </>
                        )}
                        {a.status === 'CANCELLED' && (
                          <span style={{ color: 'var(--gray2)', fontSize: '0.9rem' }}>No actions available</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!appts.length && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
