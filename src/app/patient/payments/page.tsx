'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PatientPayments() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/payments').then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : []));
  }, []);

  const total = payments.reduce((s, p) => s + Number(p.amount), 0);

  return (
    <>
      <div className="dash-topbar"><h1 className="dash-title">Payment History</h1></div>
      <div className="dash-body">
        <div className="stat-card" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
          <div className="stat-label">Total Paid</div>
          <div className="stat-value">₱{total.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Home</th><th>Receipt</th><th>Doctor</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.paymentId}>
                    <td><Link href="/?home=1" className="link">🏠</Link></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{p.receipt}</td>
                    <td>{p.appointment?.doctor?.fullName}</td>
                    <td style={{ fontWeight: 600 }}>₱{Number(p.amount).toLocaleString()}</td>
                    <td>{p.paymentMethod}</td>
                    <td><span className={`badge ${p.paymentStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>{p.paymentStatus}</span></td>
                    <td style={{ color: 'var(--gray2)', fontSize: '0.8rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!payments.length && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>No payment history</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
