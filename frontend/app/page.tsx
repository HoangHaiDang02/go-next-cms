import { getPosts } from '../lib/cms-api';
import { BlogPostCard } from '../components/BlogPostCard';

export default async function HomePage() {
  const posts = await getPosts();
  return (
    <div>
      <h1>Latest Posts</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {posts.map((p) => (
          <BlogPostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
