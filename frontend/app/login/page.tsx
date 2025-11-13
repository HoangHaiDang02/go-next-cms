"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/cms-api';
import { saveToken } from '../../lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await login(email, password);
      saveToken(token);
      router.push('/admin');
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Đăng nhập quản trị</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </label>
        <label>
          Mật khẩu
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  );
}

