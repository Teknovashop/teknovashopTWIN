import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-static";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();
  const html = await markdownToHtml(post.content);
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 prose prose-slate dark:prose-invert">
      <h1>{post.meta.title}</h1>
      <div className="text-sm opacity-70">{new Date(post.meta.date).toLocaleString()}</div>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}