import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api, formatDate, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';
import BlogSidebar from '../components/BlogSidebar.jsx';

export default function PostPage() {
  const { slug } = useParams();
  const { data: post, error, loading, reload } = useApi(() => api.post(slug), [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} | ThesisPulse`;
    return () => { document.title = "ThesisPulse | Where residents' research finds its pulse"; };
  }, [post]);

  if (error && error.status === 404) {
    return (
      <section className="section">
        <div className="container state">
          <h1>That guide could not be found</h1>
          <p>It may have been moved or unpublished.</p>
          <Link to="/blog" className="btn btn--ink">Back to the blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        title={post ? post.title : 'Loading...'}
        trail={[
          { label: 'Blog', to: '/blog' },
          ...(post ? [{ label: post.categoryName, to: `/blog?category=${post.categorySlug}` }] : []),
        ]}
      />
      <section className="section">
        <div className="container blog-layout">
          <article className="article">
            {loading && <Loading />}
            {error && <ErrorBox error={error} onRetry={reload} />}
            {post && (
              <>
                <ul className="meta meta--article">
                  <li>{formatDate(post.publishedOn)}</li>
                  <li>by {post.author}</li>
                  <li>{post.readMinutes} min read</li>
                </ul>
                <p className="article__lead">{post.excerpt}</p>
                <div className="prose">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                <div className="callout">
                  <p>Stuck on this step in your own thesis?</p>
                  <Link to="/contact" className="btn btn--coral">Talk to a mentor</Link>
                </div>
              </>
            )}
          </article>
          <BlogSidebar activeCategory={post?.categorySlug} />
        </div>
      </section>
    </>
  );
}
