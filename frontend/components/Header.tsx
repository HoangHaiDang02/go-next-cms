"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isLoggedIn, clearToken } from '../lib/utils';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { setLoggedIn(isLoggedIn()); }, []);

  function logout() {
    clearToken();
    setLoggedIn(false);
    router.push('/');
  }

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #eaeaea' }}>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/">Home</Link>
        <Link href="/blog/hello-world">Sample Post</Link>
        <span style={{ flex: 1 }} />
        {loggedIn ? (
          <>
            <Link href="/admin">Admin</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
