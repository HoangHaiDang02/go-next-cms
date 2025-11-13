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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">CMS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/blog/hello-world">Sample Post</Link></li>
          </ul>
          <ul className="navbar-nav">
            {loggedIn ? (
              <>
                <li className="nav-item"><Link className="nav-link" href="/admin">Admin</Link></li>
                <li className="nav-item"><button className="btn btn-outline-light btn-sm ms-2" onClick={logout}>Logout</button></li>
              </>
            ) : (
              <li className="nav-item"><Link className="btn btn-outline-light btn-sm" href="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
