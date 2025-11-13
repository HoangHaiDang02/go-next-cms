const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const INTERNAL_BASE = process.env.API_BASE_INTERNAL || PUBLIC_BASE;

function apiBase() {
  // On server (SSR), prefer internal base (e.g. http://backend:8080)
  // On client (browser), use public base (e.g. http://localhost:8080)
  return typeof window === 'undefined' ? INTERNAL_BASE : PUBLIC_BASE;
}

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  publishedAt?: string;
};

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${apiBase()}/api/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${apiBase()}/api/posts/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

// Auth / Admin
export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${PUBLIC_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  return data.token as string;
}

export type User = {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getUsers(token: string): Promise<User[]> {
  const res = await fetch(`${PUBLIC_BASE}/api/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(token: string, input: { email: string; name: string; password: string; isActive?: boolean; }): Promise<number> {
  const res = await fetch(`${PUBLIC_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Failed to create user');
  const data = await res.json();
  return data.id as number;
}

export async function deleteUser(token: string, id: number): Promise<void> {
  const res = await fetch(`${PUBLIC_BASE}/api/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function assignRole(token: string, userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${PUBLIC_BASE}/api/users/${userId}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ roleId })
  });
  if (!res.ok) throw new Error('Failed to assign role');
}

export async function removeRole(token: string, userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${PUBLIC_BASE}/api/users/${userId}/roles`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ roleId })
  });
  if (!res.ok) throw new Error('Failed to remove role');
}
