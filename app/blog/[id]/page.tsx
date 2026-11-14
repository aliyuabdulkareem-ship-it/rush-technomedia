import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/#blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">{post.category}</span>
            <span className="flex items-center gap-1 text-slate-500 text-xs"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1 text-slate-500 text-xs"><Clock className="w-3 h-3" /> {post.read_time}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{post.title}</h1>
          {post.meta_description && <p className="text-lg text-slate-600 leading-relaxed">{post.meta_description}</p>}
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-10 bg-slate-100 shadow-lg">
            <Image
              src={post.featured_image}
              alt={post.alt_text || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Rich Text Content */}
        {/* We use dangerouslySetInnerHTML because React Quill saves HTML. 
            The classes below style the HTML elements beautifully without needing extra plugins. */}
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
