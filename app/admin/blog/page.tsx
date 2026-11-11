"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Trash2, Plus, LogOut, Upload, Image as ImageIcon, Save } from "lucide-react";

// Dynamically import React Quill to prevent SSR errors and bypass TS ref issue
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;
import "react-quill/dist/quill.snow.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminBlog() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const quillRef = useRef<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [date, setDate] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  
  // SEO State
  const [metaDescription, setMetaDescription] = useState("");
  const [keyphrase, setKeyphrase] = useState("");
  const [keyphraseSynonyms, setKeyphraseSynonyms] = useState("");
  const [altText, setAltText] = useState("");

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

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    return publicUrl;
  };

  // Custom Image Handler for Quill Editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setLoading(true);
        try {
          const url = await uploadImage(file);
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          quill?.insertEmbed(range?.index || 0, 'image', url);
        } catch (error) {
          alert('Failed to upload image to Supabase Storage.');
        }
        setLoading(false);
      }
    };
  };

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalFeaturedImageUrl = featuredImageUrl;
    if (featuredImage) {
      try {
        finalFeaturedImageUrl = await uploadImage(featuredImage);
      } catch (error) {
        alert("Failed to upload featured image.");
        setLoading(false);
        return;
      }
    }

    const postData = {
      title, excerpt, content, category, read_time: readTime, date,
      featured_image: finalFeaturedImageUrl,
      meta_description: metaDescription, keyphrase, keyphrase_synonyms: keyphraseSynonyms, alt_text: altText
    };

    let error;
    if (editId) {
      const res = await supabase.from("blog_posts").update(postData).eq("id", editId);
      error = res.error;
    } else {
      const res = await supabase.from("blog_posts").insert([postData]);
      error = res.error;
    }

    if (error) {
      alert("Error saving post: " + error.message);
    } else {
      alert(editId ? "Post updated successfully!" : "Post published successfully!");
      resetForm();
      fetchPosts();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setExcerpt(""); setContent(""); setCategory(""); setReadTime(""); setDate("");
    setFeaturedImage(null); setFeaturedImageUrl(""); setMetaDescription(""); setKeyphrase(""); 
    setKeyphraseSynonyms(""); setAltText(""); setEditId(null);
  };

  const handleEdit = (post: any) => {
    setEditId(post.id);
    setTitle(post.title); setExcerpt(post.excerpt); setContent(post.content || ""); 
    setCategory(post.category); setReadTime(post.read_time); setDate(post.date);
    setFeaturedImageUrl(post.featured_image || "");
    setMetaDescription(post.meta_description || ""); setKeyphrase(post.keyphrase || ""); 
    setKeyphraseSynonyms(post.keyphrase_synonyms || ""); setAltText(post.alt_text || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <h2 className="text-2xl font-bold text-slate-900 text-center">CMS Admin Login</h2>
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-blue-600" /> Rush CMS</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">{editId ? "Edit Post" : "Create New Post"}</h2>
            {editId && <button type="button" onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-800">Cancel Edit</button>}
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Post Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Enter an engaging title..." />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Content *</label>
                <div className="bg-white rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={quillModules} className="h-64 mb-12" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Short Excerpt *</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" placeholder="A short summary for the blog card..." />
              </div>
            </div>

            {/* Sidebar Column (Settings, SEO, Images) */}
            <div className="space-y-6">
              {/* Publish Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Publishing Details</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Read Time *</label>
                    <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} required placeholder="5 min" className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
                    <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required placeholder="Oct 28, 2026" className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              {/* Featured Image Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Featured Image</h3>
                {featuredImageUrl && <img src={featuredImageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-200" />}
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer bg-white border border-slate-300 text-slate-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" /> {featuredImage ? featuredImage.name : "Choose File"}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setFeaturedImage(file); setFeaturedImageUrl(URL.createObjectURL(file)); }
                    }} className="hidden" />
                  </label>
                </div>
              </div>

              {/* SEO Box */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> SEO Settings
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Focus Keyphrase</label>
                  <input type="text" value={keyphrase} onChange={(e) => setKeyphrase(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" placeholder="e.g., SEO Strategy" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Keyphrase Synonyms</label>
                  <input type="text" value={keyphraseSynonyms} onChange={(e) => setKeyphraseSynonyms(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" placeholder="Comma separated" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description</label>
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" placeholder="Brief description for search engines..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Featured Image Alt Text</label>
                  <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500" placeholder="Describe the image for accessibility" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? "Saving..." : <><Save className="w-4 h-4" /> {editId ? "Update Post" : "Publish Post"}</>}
              </button>
            </div>
          </div>
        </form>

        {/* Existing Posts List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900">All Posts ({posts.length})</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {posts.map((post) => (
              <div key={post.id} className="p-6 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  {post.featured_image && <img src={post.featured_image} alt={post.alt_text || post.title} className="w-20 h-20 object-cover rounded-lg border border-slate-200 flex-shrink-0" />}
                  <div>
                    <h3 className="font-bold text-slate-900">{post.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{post.category} • {post.read_time} • {post.date}</p>
                    {post.keyphrase && <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">SEO: {post.keyphrase}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors text-sm font-semibold">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="p-8 text-center text-slate-500">No posts yet. Create your first one above!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
