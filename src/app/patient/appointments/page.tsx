'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function Badge({ status }: { status: string }) {
  const cls: Record<string, string> = { PENDING: 'badge-yellow', APPROVED: 'badge-green', CANCELLED: 'badge-red', COMPLETED: 'badge-blue', RESCHEDULED: 'badge-gray' };
  return <span className={`badge ${cls[status] || 'badge-gray'}`}>{status}</span>;
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchAppts(); }, []);

  async function fetchAppts() {
    const url = filter ? `/api/appointments?status=${filter}` : '/api/appointments';
    const res = await fetch(url);
    setAppointments(Array.isArray(await res.json()) ? await (await fetch(url)).json() : []);
  }

  useEffect(() => { fetchAppts(); }, [filter]);

  async function cancel(id: number) {
    if (!confirm('Cancel this appointment?')) return;
    await fetch(`/api/appointments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CANCELLED' }) });
    fetchAppts();
  }

  async function deleteAppointment(id: number) {
    if (!confirm('Delete this appointment? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAppts();
      } else {
        alert('Failed to delete appointment');
      }
    } catch (err) {
      alert('Error deleting appointment');
    }
  }

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">My Appointments</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Link href="/patient/find" className="btn btn-blue btn-sm">+ Book</Link>
        </div>
      </div>
      <div className="dash-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Home</th><th>Doctor</th><th>Clinic</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Payment</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.appointmentId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td style={{ fontWeight: 500 }}>{a.doctor?.fullName}<br /><small style={{ color: 'var(--gray2)' }}>{a.doctor?.specialization}</small></td>
                    <td style={{ color: 'var(--gray2)', fontSize: '0.82rem' }}>{a.doctor?.clinic?.clinicName}</td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString('en-PH')}</td>
                    <td>{a.appointmentTime}</td>
                    <td><span className="badge badge-gray">{a.type}</span></td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      {a.payment ? (
                        <span className="badge badge-green">Paid ₱{Number(a.payment.amount).toLocaleString()}</span>
                      ) : a.status === 'APPROVED' ? (
                        <PayButton appointmentId={a.appointmentId} onPaid={fetchAppts} clinicId={a.doctor?.clinicId} />
                      ) : '—'}
                    </td>
                    <td>
                      {['PENDING', 'APPROVED'].includes(a.status) && (
                        <button className="btn btn-sm btn-danger" onClick={() => cancel(a.appointmentId)}>Cancel</button>
                      )}
                      {a.status === 'CANCELLED' && (
                        <button className="btn btn-sm btn-danger" onClick={() => deleteAppointment(a.appointmentId)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {!appointments.length && <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No appointments. <Link href="/patient/find" style={{ color: 'var(--blue)' }}>Book now →</Link></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function PayButton({ appointmentId, onPaid, clinicId }: { appointmentId: number; onPaid: () => void; clinicId?: number }) {
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [method, setMethod] = useState('GCash');
  const [amount, setAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [agreeToAttend, setAgreeToAttend] = useState(false);

  useEffect(() => {
    // Fetch full appointment details including clinic info
    if (appointmentId) {
      fetch(`/api/appointments`)
        .then(r => r.json())
        .then(appts => {
          const appt = Array.isArray(appts) ? appts.find((a: any) => a.appointmentId === appointmentId) : null;
          if (appt) {
            setAppointmentDetails(appt);
            // Get consultation fee from clinic
            const fee = appt.doctor?.clinic?.consultationFee;
            if (fee) {
              setAmount(fee.toString());
            } else {
              setAmount('500'); // fallback
            }
          }
        })
        .catch(() => {
          setAmount('500');
        });
    }
  }, [appointmentId]);

  async function handlePayClick() {
    setError('');
    setShowPayment(true);
  }

  async function handleConfirmPayment() {
    if (!amount) {
      setError('Unable to load consultation fee. Please try again.');
      return;
    }
    setShowPayment(false);
    setShowConfirm(true);
  }

  async function pay() {
    if (!agreeToAttend) {
      setError('Please confirm that you will attend the appointment');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          appointmentId, 
          amount: parseFloat(amount!), 
          paymentMethod: method 
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Payment failed');
        setLoading(false);
        return;
      }
      setShowConfirm(false);
      setShowPayment(false);
      setAgreeToAttend(false);
      onPaid();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  }

  if (!appointmentDetails || amount === null) return null;

  return (
    <>
      <button className="btn btn-sm btn-outline" style={{ color: 'var(--blue)' }} onClick={handlePayClick}>Pay</button>
      
      {/* Payment Method Selection Modal */}
      {showPayment && (
        <div className="modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="modal" style={{ maxWidth: '360px' }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Make Payment</h2>
            {error && <div style={{ padding: '0.75rem', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            <div className="form-group">
              <label className="form-label">Amount (₱)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input className="form-input" type="number" value={amount} readOnly style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--gray2)' }}>By clinic</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
                <option>GCash</option><option>Maya</option><option>Cash</option><option>Credit Card</option><option>Debit Card</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowPayment(false)}>Cancel</button>
              <button className="btn btn-blue" onClick={handleConfirmPayment}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Confirmation Modal */}
      {showConfirm && appointmentDetails && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Appointment & Payment</h2>
            {error && <div style={{ padding: '0.75rem', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            <div style={{ backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ color: 'var(--gray2)', fontSize: '0.8rem', fontWeight: 500 }}>Doctor</label>
                <p style={{ marginTop: '0.25rem', fontWeight: 600 }}>{appointmentDetails.doctor?.fullName}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray2)' }}>{appointmentDetails.doctor?.specialization}</p>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ color: 'var(--gray2)', fontSize: '0.8rem', fontWeight: 500 }}>Clinic</label>
                <p style={{ marginTop: '0.25rem', fontWeight: 600 }}>{appointmentDetails.doctor?.clinic?.clinicName}</p>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ color: 'var(--gray2)', fontSize: '0.8rem', fontWeight: 500 }}>Date & Time</label>
                <p style={{ marginTop: '0.25rem', fontWeight: 600 }}>{new Date(appointmentDetails.appointmentDate).toLocaleDateString('en-PH')} at {appointmentDetails.appointmentTime}</p>
              </div>
              <div>
                <label style={{ color: 'var(--gray2)', fontSize: '0.8rem', fontWeight: 500 }}>Consultation Fee</label>
                <p style={{ marginTop: '0.25rem', fontWeight: 600, fontSize: '1.2rem', color: 'var(--blue)' }}>₱{Number(amount).toLocaleString()}</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={agreeToAttend} 
                  onChange={(e) => setAgreeToAttend(e.target.checked)}
                  style={{ marginTop: '2px', cursor: 'pointer' }}
                />
                <span>
                  I confirm that I will attend this consultation appointment on the scheduled date and time. I understand that non-attendance may result in charges.
                </span>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => { setShowConfirm(false); setShowPayment(true); }} disabled={loading}>Back</button>
              <button className="btn btn-blue" onClick={pay} disabled={loading || !agreeToAttend}>{loading ? 'Processing...' : 'Confirm & Pay'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
