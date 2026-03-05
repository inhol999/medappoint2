'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminClinics() {
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [consultationFee, setConsultationFee] = useState('500');
  const [savingFee, setSavingFee] = useState(false);

  useEffect(() => { fetchClinic(); }, []);

  async function fetchClinic() {
    try {
      setLoading(true);
      const res = await fetch('/api/clinics');
      const data = await res.json();
      // data should be an array with one clinic for admins
      const clinicData = Array.isArray(data) && data.length > 0 ? data[0] : null;
      setClinic(clinicData);
      if (clinicData) {
        setConsultationFee((clinicData.consultationFee || 500).toString());
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveFee() {
    if (!clinic || !consultationFee) return;
    setSavingFee(true);
    setError('');
    try {
      const fee = parseFloat(consultationFee);
      if (isNaN(fee) || fee < 0) {
        throw new Error('Please enter a valid fee amount');
      }
      const res = await fetch(`/api/clinics/${clinic.clinicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationFee: fee }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setClinic({ ...clinic, consultationFee: fee });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error saving fee:', err);
    } finally {
      setSavingFee(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (loading && error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  }

  if (!clinic) {
    return (
      <>
        <div className="dash-topbar">
          <h1 className="dash-title">My Clinic</h1>
        </div>
        <div className="dash-body">
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No clinic assigned to your account yet.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">My Clinic</h1>
      </div>
      <div className="dash-body">
        <div className="card">
          <div style={{ padding: '1.5rem' }}>
            {error && <div style={{ padding: '1rem', backgroundColor: '#fee', color: '#c00', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 600 }}>{clinic.clinicName}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--gray2)', fontSize: '0.85rem', fontWeight: 500 }}>Location</label>
                <p style={{ marginTop: '0.25rem', fontSize: '1rem' }}>{clinic.location}</p>
              </div>
              <div>
                <label style={{ color: 'var(--gray2)', fontSize: '0.85rem', fontWeight: 500 }}>Contact Number</label>
                <p style={{ marginTop: '0.25rem', fontSize: '1rem' }}>{clinic.contactNumber}</p>
              </div>
              <div>
                <label style={{ color: 'var(--gray2)', fontSize: '0.85rem', fontWeight: 500 }}>Email</label>
                <p style={{ marginTop: '0.25rem', fontSize: '1rem' }}>{clinic.email || '—'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--gray2)', fontSize: '0.85rem', fontWeight: 500 }}>Doctors</label>
                <p style={{ marginTop: '0.25rem', fontSize: '1rem' }}>{clinic.doctors?.length || 0}</p>
              </div>
            </div>
            {clinic.description && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'var(--gray2)', fontSize: '0.85rem', fontWeight: 500 }}>Description</label>
                <p style={{ marginTop: '0.25rem', fontSize: '0.95rem', lineHeight: '1.5' }}>{clinic.description}</p>
              </div>
            )}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f4f8', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <label style={{ color: 'var(--gray2)', fontSize: '0.85rem', fontWeight: 500 }}>Consultation Fee</label>
                  {!isEditing ? (
                    <p style={{ marginTop: '0.25rem', fontSize: '1.2rem', fontWeight: 600 }}>₱{Number(clinic.consultationFee || 500).toLocaleString()}</p>
                  ) : (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <input 
                        className="form-input" 
                        type="number" 
                        value={consultationFee} 
                        onChange={e => setConsultationFee(e.target.value)}
                        min="0"
                        step="0.01"
                        style={{ width: '150px' }}
                      />
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={handleSaveFee}
                        disabled={savingFee}
                      >
                        {savingFee ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className={`badge ${clinic.isActive ? 'badge-green' : 'badge-red'}`}>{clinic.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
