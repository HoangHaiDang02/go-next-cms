"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/cms-api';
import { saveToken, isLoggedIn } from '../../lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace('/admin');
  }, [router]);

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
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm mt-5">
            <div className="card-body p-4">
              <h1 className="h4 text-center mb-3">Đăng nhập quản trị</h1>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
