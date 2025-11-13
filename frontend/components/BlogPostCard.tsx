import Link from 'next/link';

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string;
  publishedAt?: string;
};

export function BlogPostCard({ post }: { post: PostSummary }) {
  return (
    <article style={{ border: '1px solid #eaeaea', padding: '1rem', borderRadius: 8 }}>
      <h3 style={{ margin: 0 }}>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p style={{ margin: '0.5rem 0', color: '#555' }}>{post.excerpt}</p>
      {post.publishedAt && (
        <small style={{ color: '#888' }}>{new Date(post.publishedAt).toLocaleDateString()}</small>
      )}
    </article>
  );
}

