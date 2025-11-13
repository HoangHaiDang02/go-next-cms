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
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-2">
          <Link className="stretched-link text-decoration-none" href={`/blog/${post.slug}`}>{post.title}</Link>
        </h5>
        <p className="card-text text-muted mb-2">{post.excerpt}</p>
        {post.publishedAt && (
          <small className="text-secondary">{new Date(post.publishedAt).toLocaleDateString()}</small>
        )}
      </div>
    </div>
  );
}
