import { getPostBySlug } from '../../../lib/cms-api';
import Image from 'next/image';

type Props = { params: { slug: string } };

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return <div>Post not found.</div>;
  return (
    <article>
      <h1>{post.title}</h1>
      {post.coverImageUrl ? (
        <Image src={post.coverImageUrl} alt={post.title} width={800} height={400} />
      ) : null}
      <p style={{ color: '#666' }}>{post.excerpt}</p>
      <div>
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{post.content}</pre>
      </div>
    </article>
  );
}

