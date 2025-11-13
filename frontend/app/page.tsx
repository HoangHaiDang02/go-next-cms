"use client";

import { useEffect, useState } from 'react';
import { getPosts, type Post } from '../lib/cms-api';
import { BlogPostCard } from '../components/BlogPostCard';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">Latest Posts</h1>
      </div>
      {loading && <div className="alert alert-secondary">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {posts.map((p) => (
          <div key={p.slug} className="col-12 col-md-6 col-lg-4">
            <BlogPostCard post={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
// Client component: no server-side rendering hints needed
