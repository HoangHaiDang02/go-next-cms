const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

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
  const res = await fetch(`${API_BASE}/api/posts`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/api/posts/${encodeURIComponent(slug)}`, { next: { revalidate: 30 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

// Auth / Admin
export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
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
  const res = await fetch(`${API_BASE}/api/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
