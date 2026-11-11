"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Trash2, Plus, LogOut } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminBlog() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [date, setDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPosts();
    });
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.refresh();
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("blog_posts").insert([{ title, excerpt, category, read_time: readTime, date }]);
    if (error) alert("Error creating post: " + error.message);
    else {
      alert("Post created successfully!");
      setTitle(""); setExcerpt(""); setCategory(""); setReadTime(""); setDate("");
      fetchPosts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) alert("Error deleting post");
    else fetchPosts();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Admin Login</h2>
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Blog Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Create Post Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Plus className="w-5 h-5" /> Create New Post</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            <input type="text" placeholder="Category (e.g., SEO Strategy)" value={category} onChange={(e) => setCategory(e.target.value)} required className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <textarea placeholder="Excerpt (Short description)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Read Time (e.g., 5 min read)" value={readTime} onChange={(e) => setReadTime(e.target.value)} required className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            <input type="text" placeholder="Date (e.g., Oct 28, 2026)" value={date} onChange={(e) => setDate(e.target.value)} required className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>

        {/* Existing Posts List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Existing Posts ({posts.length})</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {posts.map((post) => (
              <div key={post.id} className="p-6 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-900">{post.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{post.category} • {post.read_time} • {post.date}</p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>
                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {posts.length === 0 && <p className="p-6 text-center text-slate-500">No posts yet. Create your first one above!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
