"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPostBySlug, type Post } from '../../../lib/cms-api';
import Image from 'next/image';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then(setPost)
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <article className="container">
      <h1 className="display-6 mb-3">{post.title}</h1>
      {post.coverImageUrl ? (
        <div className="mb-3">
          <Image className="img-fluid rounded" src={post.coverImageUrl} alt={post.title} width={800} height={400} />
        </div>
      ) : null}
      <p className="text-muted">{post.excerpt}</p>
      <div className="mt-3">
        <pre className="fs-6" style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{post.content}</pre>
      </div>
    </article>
  );
}
