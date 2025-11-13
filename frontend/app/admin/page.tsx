"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, User, createUser, deleteUser, assignRole, removeRole } from '../../lib/cms-api';
import { getToken, clearToken } from '../../lib/utils';

const ROLES = {
  admin: 1,
  editor: 2,
  viewer: 3,
} as const;

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function logout() { clearToken(); router.push('/login'); }

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (e) {
      setError('Không tải được danh sách người dùng');
    } finally { setLoading(false); }
  }

  async function onCreateUser(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!token) return;
    const form = ev.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const name = String(formData.get('name') || '');
    const password = String(formData.get('password') || '');
    const isActive = formData.get('isActive') === 'on';
    try {
      setBusy(true);
      await createUser(token, { email, name, password, isActive });
      (document.getElementById('createUserClose') as HTMLButtonElement | null)?.click();
      form.reset();
      await refresh();
    } catch (e) {
      alert('Tạo user thất bại');
    } finally { setBusy(false); }
  }

  async function onDeleteUser(id: number) {
    if (!token) return;
    if (!confirm('Xóa người dùng này?')) return;
    try { setBusy(true); await deleteUser(token, id); await refresh(); }
    catch { alert('Xóa user thất bại'); }
    finally { setBusy(false); }
  }

  async function onPromoteAdmin(id: number) {
    if (!token) return;
    try { setBusy(true); await assignRole(token, id, ROLES.admin); await refresh(); }
    catch { alert('Gán admin thất bại'); }
    finally { setBusy(false); }
  }

  async function onRevokeAdmin(id: number) {
    if (!token) return;
    try { setBusy(true); await removeRole(token, id, ROLES.admin); await refresh(); }
    catch { alert('Bỏ admin thất bại'); }
    finally { setBusy(false); }
  }

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Quản trị người dùng</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={refresh} disabled={loading || busy}>Làm mới</button>
          <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalCreate">Tạo user</button>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>Đăng xuất</button>
        </div>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-secondary" role="status" aria-label="Loading" />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Email</th>
              <th>Tên</th>
              <th>Kích hoạt</th>
              <th>Tạo lúc</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>
                  {u.isActive ? (
                    <span className="badge text-bg-success">Active</span>
                  ) : (
                    <span className="badge text-bg-secondary">Inactive</span>
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-primary" onClick={() => onPromoteAdmin(u.id)} disabled={busy}>{busy ? '...' : 'Make admin'}</button>
                    <button className="btn btn-outline-secondary" onClick={() => onRevokeAdmin(u.id)} disabled={busy}>{busy ? '...' : 'Revoke admin'}</button>
                    <button className="btn btn-outline-danger" onClick={() => onDeleteUser(u.id)} disabled={busy}>{busy ? '...' : 'Delete'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Create User */}
      <div className="modal fade" id="modalCreate" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo người dùng</h5>
              <button id="createUserClose" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <form onSubmit={onCreateUser}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input name="name" type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input name="password" type="password" className="form-control" required />
                </div>
                <div className="form-check">
                  <input name="isActive" id="isActive" className="form-check-input" type="checkbox" defaultChecked />
                  <label className="form-check-label" htmlFor="isActive">Kích hoạt</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>Tạo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
