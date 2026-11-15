import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = "https://rushtechnomedia.com";

// DISABLE CACHING: Ensures updates show instantly
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };

  const imageUrl = post.featured_image || `${SITE_URL}/R.png`;
  const description = post.meta_description || post.excerpt || post.title;

  return {
    title: post.title,
    description: description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: description,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "Rush Technomedia",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.alt_text || post.title }],
      locale: "en_US",
      type: "article",
    },
    twitter: { card: "summary_large_image", title: post.title, description: description, images: [imageUrl] },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">{post.category}</span>
            <span className="flex items-center gap-1 text-slate-500 text-xs"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1 text-slate-500 text-xs"><Clock className="w-3 h-3" /> {post.read_time}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{post.title}</h1>
          {post.meta_description && <p className="text-lg text-slate-600 leading-relaxed">{post.meta_description}</p>}
        </div>

        {post.featured_image && (
          <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-10 bg-slate-100 shadow-lg">
            <Image src={post.featured_image} alt={post.alt_text || post.title} fill className="object-cover" priority />
          </div>
        )}

        <div
          className="text-slate-700 text-lg leading-relaxed space-y-6
                     [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-4
                     [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4
                     [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-3
                     [&_p]:mb-4
                     [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                     [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                     [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-blue-50 [&_blockquote]:py-2
                     [&_a]:text-blue-600 [&_a]:underline
                     [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
