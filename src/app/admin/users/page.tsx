'use client';
import { useEffect, useState } from 'react';

function Badge({ role }: { role: string }) {
  const cls: Record<string, string> = {
    ADMIN: 'badge-blue', DOCTOR: 'badge-green', PATIENT: 'badge-yellow',
  };
  return <span className={`badge ${cls[role] || 'badge-gray'}`}>{role}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    ACTIVE: 'badge-green', INACTIVE: 'badge-red',
  };
  return <span className={`badge ${cls[status] || 'badge-gray'}`}>{status}</span>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const url = filter ? `/api/users?role=${filter}` : '/api/users';
    const res = await fetch(url);
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, [filter]);

  return (
    <>
      <div className="dash-topbar">
        <h1 className="dash-title">Users</h1>
        <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admins</option>
          <option value="DOCTOR">Doctors</option>
          <option value="PATIENT">Patients</option>
        </select>
      </div>
      <div className="dash-body">
        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>Loading...</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.userId}>
                      <td>{u.userId}</td>
                      <td>{u.username}</td>
                      <td><Badge role={u.role} /></td>
                      <td>{u.admin?.name || u.doctor?.fullName || u.patient?.fullName || '-'}</td>
                      <td>{u.admin?.email || u.patient?.email || '-'}</td>
                      <td><StatusBadge status={u.status} /></td>
                      <td>{new Date(u.createdAt).toLocaleDateString('en-PH')}</td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--gray2)', padding: '2rem' }}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

