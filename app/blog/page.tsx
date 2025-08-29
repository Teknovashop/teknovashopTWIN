import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamic = "force-static";

export default async function BlogPage() {
  const posts = getAllPostsMeta();
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog (actualización diaria)</h1>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.slug} className="border rounded-xl p-4">
            <Link href={`/blog/${p.slug}`} className="text-xl font-semibold hover:underline">
              {p.title}
            </Link>
            <div className="text-sm opacity-70">{new Date(p.date).toLocaleDateString()}</div>
            {p.excerpt && <p className="mt-2 opacity-80">{p.excerpt}</p>}
            {typeof p.soi === "number" && <div className="mt-1 text-xs">Índice SOI: {(p.soi * 100).toFixed(1)}%</div>}
          </li>
        ))}
      </ul>
    </main>
  );
}