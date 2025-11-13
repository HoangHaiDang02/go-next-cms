"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, User } from '../../lib/cms-api';
import { getToken, clearToken } from '../../lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    getUsers(token)
      .then(setUsers)
      .catch(() => setError('Không tải được danh sách người dùng'))
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    clearToken();
    router.push('/login');
  }

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Quản trị người dùng</h1>
      <button onClick={logout} style={{ marginBottom: '1rem' }}>Đăng xuất</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '0.5rem' }}>Email</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '0.5rem' }}>Tên</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '0.5rem' }}>Kích hoạt</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: '0.5rem' }}>Tạo lúc</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ borderBottom: '1px solid #f3f3f3', padding: '0.5rem' }}>{u.email}</td>
              <td style={{ borderBottom: '1px solid #f3f3f3', padding: '0.5rem' }}>{u.name}</td>
              <td style={{ borderBottom: '1px solid #f3f3f3', padding: '0.5rem' }}>{u.isActive ? '✓' : '✗'}</td>
              <td style={{ borderBottom: '1px solid #f3f3f3', padding: '0.5rem' }}>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

