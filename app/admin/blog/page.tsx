"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  LayoutDashboard, FileText, Image as ImageIcon, LogOut, Plus, Trash2, 
  Save, Upload, Search, Eye, Calendar, Tag, Globe 
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;
import "react-quill/dist/quill.snow.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = ["Tech", "SEO", "AI", "DIY", "Business", "Digital Strategy", "Case Study", "Media"];
const TODAY = new Date().toISOString().split("T")[0];

export default function AdminBlog() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<"dashboard" | "editor" | "media">("dashboard");
  const [posts, setPosts] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const quillRef = useRef<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [readTime, setReadTime] = useState("5 min read");
  const [date, setDate] = useState(TODAY);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  
  // SEO State
  const [metaDescription, setMetaDescription] = useState("");
  const [keyphrase, setKeyphrase] = useState("");
  const [altText, setAltText] = useState("");

  const router = useRouter();

  // --- AUTH & DATA FETCHING ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { fetchPosts(); fetchMedia(); }
    });
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const fetchMedia = async () => {
    const { data } = await supabase.storage.from("blog-images").list();
    if (data) {
      const urls = data.map((file: any) => supabase.storage.from("blog-images").getPublicUrl(file.name).data.publicUrl);
      setMediaFiles(urls);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // --- IMAGE HANDLING ---
  const uploadImageToStorage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    fetchMedia(); // Refresh media library
    return publicUrl;
  };

  const insertImageToEditor = (url: string) => {
    const quill = quillRef.current?.getEditor();
    const range = quill?.getSelection();
    quill?.insertEmbed(range?.index || 0, 'image', url);
    setIsMediaModalOpen(false);
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { 
        image: () => setIsMediaModalOpen(true) 
      }
    }
  };

  // --- FORM ACTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let finalImgUrl = featuredImageUrl;
    if (featuredImage) finalImgUrl = await uploadImageToStorage(featuredImage);

    const postData = {
      title, excerpt, content, category, read_time: readTime, date,
      featured_image: finalImgUrl,
      meta_description: metaDescription, keyphrase, alt_text: altText
    };

    let error;
    if (editId) {
      const res = await supabase.from("blog_posts").update(postData).eq("id", editId);
      error = res.error;
    } else {
      const res = await supabase.from("blog_posts").insert([postData]);
      error = res.error;
    }

    if (error) alert("Error: " + error.message);
    else {
      alert(editId ? "Updated!" : "Published!");
      resetForm();
      setView("dashboard");
      fetchPosts();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setExcerpt(""); setContent(""); setCategory(CATEGORIES[0]); 
    setReadTime("5 min read"); setDate(TODAY); setFeaturedImage(null); 
    setFeaturedImageUrl(""); setMetaDescription(""); setKeyphrase(""); 
    setAltText(""); setEditId(null);
  };

  const handleEdit = (post: any) => {
    setEditId(post.id);
    setTitle(post.title); setExcerpt(post.excerpt); setContent(post.content || ""); 
    setCategory(post.category || CATEGORIES[0]); setReadTime(post.read_time || "5 min read"); 
    setDate(post.date || TODAY); setFeaturedImageUrl(post.featured_image || "");
    setMetaDescription(post.meta_description || ""); setKeyphrase(post.keyphrase || ""); 
    setAltText(post.alt_text || "");
    setView("editor");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Rush CMS Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{loading ? "..." : "Login"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* FORCE EDITOR STYLES */}
      <style>{`
        .ql-editor { color: #1e293b !important; min-height: 300px !important; font-size: 16px !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
        .ql-editor.ql-blank::before { color: #94a3b8 !important; font-style: normal !important; }
        .ql-toolbar.ql-snow { border: 1px solid #cbd5e1 !important; border-bottom: none !important; border-radius: 8px 8px 0 0 !important; background: #f8fafc !important; }
        .ql-container.ql-snow { border: 1px solid #cbd5e1 !important; border-radius: 0 0 8px 8px !important; font-family: inherit !important; }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 fixed left-0 top-0 bottom-0 flex flex-col p-4 z-20">
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-8 px-2">
          <LayoutDashboard className="w-6 h-6 text-blue-500" /> Rush CMS
        </div>
        <nav className="space-y-1 flex-1">
          <button onClick={() => setView("dashboard")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => { resetForm(); setView("editor"); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'editor' && !editId ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
            <Plus className="w-4 h-4" /> Add New Post
          </button>
          <button onClick={() => setView("dashboard")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800`}>
            <FileText className="w-4 h-4" /> All Posts
          </button>
          <button onClick={() => setView("media")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'media' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
            <ImageIcon className="w-4 h-4" /> Media Library
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 mt-auto">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-64 flex-1 p-8">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {view === 'dashboard' ? 'Dashboard' : view === 'editor' ? (editId ? 'Edit Post' : 'Add New Post') : 'Media Library'}
          </h1>
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
            <Eye className="w-4 h-4" /> View Live Site
          </a>
        </div>

        {/* DASHBOARD / POSTS LIST VIEW */}
        {view === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recent Posts ({posts.length})</h2>
              <button onClick={() => { resetForm(); setView("editor"); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              {posts.map((post) => (
                <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    {post.featured_image ? <img src={post.featured_image} className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-slate-400" /></div>}
                    <div>
                      <h3 className="font-bold text-slate-900">{post.title}</h3>
                      <p className="text-xs text-slate-500">{post.category} • {post.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(post)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEDIA LIBRARY VIEW */}
        {view === 'media' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaFiles.map((url, i) => (
                <div key={i} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img src={url} className="w-full h-full object-cover" />
                  <button onClick={() => insertImageToEditor(url)} className="absolute inset-0 bg-blue-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">
                    Insert into Post
                  </button>
                </div>
              ))}
              {mediaFiles.length === 0 && <p className="col-span-full text-center text-slate-500 py-12">No images uploaded yet. Use the "Add New Post" image button to upload.</p>}
            </div>
          </div>
        )}

        {/* EDITOR VIEW */}
        {view === 'editor' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  placeholder="Add title" 
                  className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 outline-none mb-4" 
                />
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={quillModules} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Search className="w-4 h-4" /> Excerpt</h3>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm" placeholder="Short summary for the blog card..." />
              </div>
            </div>

            {/* RIGHT COLUMN: Meta Boxes (WordPress Style) */}
            <div className="space-y-6">
              {/* Publish Box */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Publish</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Read Time</label>
                    <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} required className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {editId ? "Update" : "Publish"}
                  </button>
                </div>
              </div>

              {/* Featured Image Box */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Featured Image</h3>
                {featuredImageUrl && <img src={featuredImageUrl} className="w-full h-40 object-cover rounded-lg mb-3 border border-slate-200" />}
                <label className="block w-full cursor-pointer bg-slate-50 border border-dashed border-slate-300 text-slate-600 py-3 rounded-lg text-sm font-medium hover:bg-slate-100 text-center">
                  <Upload className="w-4 h-4 inline mr-1" /> {featuredImage ? "Change Image" : "Set Featured Image"}
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setFeaturedImage(file); setFeaturedImageUrl(URL.createObjectURL(file)); }
                  }} className="hidden" />
                </label>
              </div>

              {/* SEO Box */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> SEO Settings</h3>
                <div className="space-y-3">
                  <input type="text" value={keyphrase} onChange={(e) => setKeyphrase(e.target.value)} placeholder="Focus Keyphrase" className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none" />
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Meta Description" className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none" />
                  <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Image Alt Text" className="w-full p-2 border border-slate-200 rounded-md text-sm outline-none" />
                  
                  {/* Live Google Preview */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Google Preview</p>
                    <p className="text-blue-700 text-lg font-medium truncate hover:underline cursor-pointer">{title || "Your Post Title"}</p>
                    <p className="text-green-700 text-xs truncate">rushtechnomedia.com/blog/...</p>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">{metaDescription || "Your meta description will appear here in search results..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* MEDIA MODAL (For inserting images into editor) */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg">Select Image from Library</h3>
              <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaFiles.map((url, i) => (
                  <div key={i} onClick={() => insertImageToEditor(url)} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all">
                    <img src={url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {mediaFiles.length === 0 && <p className="text-center text-slate-500 py-12">No images yet. Upload via the Featured Image box.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
