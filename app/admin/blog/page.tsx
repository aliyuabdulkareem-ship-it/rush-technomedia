"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import {
  LayoutDashboard, FileText, Image as ImageIcon, LogOut, Plus, Trash2, Save,
  Upload, Search, Eye, Calendar, Tag, Globe, Bold, Italic, Underline,
  Strikethrough, Link2, ListOrdered, List, Quote as QuoteIcon, RotateCcw, X,
  Users, MessageSquare, Settings
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;
import "react-quill/dist/quill.snow.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = ["Tech", "SEO", "AI", "DIY", "Business", "Digital Strategy", "Case Study", "Media"];
const TODAY = new Date().toISOString().split("T")[0];

const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const compressImage = (file: File, maxWidth = 1920, quality = 0.85): Promise<File> =>
  new Promise((resolve) => {
    if (file.size < 300 * 1024) { resolve(file); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const finish = (blob: Blob | null, mime: string, ext: string) => {
        if (!blob) { resolve(file); return; }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type: mime }));
      };
      canvas.toBlob((b) => {
        if (b && b.type === "image/webp") finish(b, "image/webp", "webp");
        else canvas.toBlob((b2) => finish(b2, "image/jpeg", "jpg"), "image/jpeg", quality);
      }, "image/webp", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

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
  const [modalMode, setModalMode] = useState<'editor' | 'featured'>('editor'); // Tracks which button opened the modal
  const quillRef = useRef<any>(null);
  const openMediaRef = useRef<() => void>(() => {});
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [bubble, setBubble] = useState<{ show: boolean; top: number; left: number }>({ show: false, top: 0, left: 0 });
  const [mediaDetail, setMediaDetail] = useState<{ open: boolean; url: string; title: string; alt: string; caption: string; description: string }>({ open: false, url: "", title: "", alt: "", caption: "", description: "" });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [date, setDate] = useState(TODAY);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keyphrase, setKeyphrase] = useState("");
  const [keyphraseSynonyms, setKeyphraseSynonyms] = useState("");
  const [altText, setAltText] = useState("");

  useEffect(() => { openMediaRef.current = () => { setModalMode('editor'); setIsMediaModalOpen(true); }; }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { fetchPosts(); fetchMedia(); }
    });
  }, []);

  // Floating Toolbar Logic
  useEffect(() => {
    if (!user || view !== "editor") { setBubble((b) => ({ ...b, show: false })); return; }
    let tries = 0; let cleanup: (() => void) | undefined;
    const attach = () => {
      const quill = quillRef.current?.getEditor?.();
      if (!quill) { if (tries++ < 60) setTimeout(attach, 100); return; }
      const handler = (range: any) => {
        if (range && range.length > 0 && wrapperRef.current) {
          try {
            const bounds = quill.getBounds(range.index, range.length);
            const containerRect = quill.container.getBoundingClientRect();
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const absTop = containerRect.top - wrapperRect.top + bounds.top;
            const absLeft = containerRect.left - wrapperRect.left + bounds.left + bounds.width / 2;
            const clampedLeft = Math.min(Math.max(absLeft, 90), wrapperRect.width - 90);
            setBubble({ show: true, top: Math.max(absTop - 48, 0), left: clampedLeft });
          } catch { setBubble((b) => ({ ...b, show: false })); }
        } else {
          setBubble({ show: false, top: 0, left: 0 });
        }
      };
      quill.on("selection-change", handler);
      cleanup = () => quill.off("selection-change", handler);
    };
    attach();
    return () => { if (cleanup) cleanup(); };
  }, [user, view]);

  const applyFormat = (name: string, value: any) => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
    if (name === "link") {
      const url = prompt("Enter URL (leave blank to remove link):");
      quill.format("link", url ? url : false, "user");
    } else {
      quill.format(name, value, "user");
    }
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const fetchMedia = async () => {
    const { data } = await supabase.storage.from("blog-images").list();
    if (data) setMediaFiles(data.map((f: any) => supabase.storage.from("blog-images").getPublicUrl(f.name).data.publicUrl));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message); setLoading(false);
  };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  const uploadImageToStorage = async (file: File) => {
    const compressed = await compressImage(file, 1920, 0.85);
    const ext = compressed.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(fileName, compressed, { contentType: compressed.type });
    if (error) throw error;
    const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
    fetchMedia();
    return data.publicUrl;
  };

  // Handles clicking an image in the modal (either inserts to editor or sets as featured)
  const handleImageSelect = (url: string) => {
    if (modalMode === 'featured') {
      setFeaturedImageUrl(url);
      setFeaturedImage(null); 
    } else {
      const quill = quillRef.current?.getEditor?.();
      const range = quill?.getSelection();
      quill?.insertEmbed(range?.index || 0, "image", url);
    }
    setIsMediaModalOpen(false);
  };

  const handleModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setLoading(true);
    try { const url = await uploadImageToStorage(file); handleImageSelect(url); }
    catch (err: any) { alert("Upload failed: " + (err?.message || "unknown error")); }
    setLoading(false);
  };

  const openMediaDetail = async (url: string) => {
    const { data } = await supabase.from("media_metadata").select("*").eq("url", url).maybeSingle();
    setMediaDetail({ open: true, url, title: data?.title || "", alt: data?.alt_text || "", caption: data?.caption || "", description: data?.description || "" });
  };
  const saveMediaDetail = async () => {
    setLoading(true);
    const { error } = await supabase.from("media_metadata").upsert(
      { url: mediaDetail.url, title: mediaDetail.title, alt_text: mediaDetail.alt, caption: mediaDetail.caption, description: mediaDetail.description },
      { onConflict: "url" }
    );
    setLoading(false);
    if (error) alert("Save failed: " + error.message);
    else { alert("Image details saved!"); setMediaDetail((m) => ({ ...m, open: false })); }
  };

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ "header": [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ "list": "ordered" }, { "list": "bullet" }],
        ["link", "image"], ["clean"]
      ],
      handlers: { image: () => openMediaRef.current() }
    }
  }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !category || !readTime || !date) { alert("Please fill in all required fields marked with *"); return; }
    setLoading(true);
    let finalImgUrl = featuredImageUrl;
    if (featuredImage) {
      try { finalImgUrl = await uploadImageToStorage(featuredImage); }
      catch (err: any) { alert("Failed to upload featured image: " + (err?.message || "unknown error")); setLoading(false); return; }
    }
    const finalSlug = slug || generateSlug(title);
    const postData = { title, slug: finalSlug, excerpt, content, category, tags, read_time: readTime, date, featured_image: finalImgUrl, meta_description: metaDescription, keyphrase, keyphrase_synonyms: keyphraseSynonyms, alt_text: altText };
    let error;
    if (editId) { const res = await supabase.from("blog_posts").update(postData).eq("id", editId); error = res.error; }
    else { const res = await supabase.from("blog_posts").insert([postData]); error = res.error; }
    if (error) alert("Error saving post: " + error.message);
    else { alert(editId ? "Post updated successfully!" : "Post published successfully!"); resetForm(); setView("dashboard"); fetchPosts(); }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setCategory(CATEGORIES[0]); setTags("");
    setReadTime("5 min read"); setDate(TODAY); setFeaturedImage(null); setFeaturedImageUrl("");
    setMetaDescription(""); setKeyphrase(""); setKeyphraseSynonyms(""); setAltText(""); setEditId(null);
  };

  const handleEdit = (post: any) => {
    setEditId(post.id);
    setTitle(post.title); setSlug(post.slug || generateSlug(post.title)); setExcerpt(post.excerpt); setContent(post.content || "");
    setCategory(post.category || CATEGORIES[0]); setTags(post.tags || ""); setReadTime(post.read_time || "5 min read");
    setDate(post.date || TODAY); setFeaturedImageUrl(post.featured_image || "");
    setMetaDescription(post.meta_description || ""); setKeyphrase(post.keyphrase || "");
    setKeyphraseSynonyms(post.keyphrase_synonyms || ""); setAltText(post.alt_text || "");
    setView("editor");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id); fetchPosts();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Rush CMS Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg text-slate-900" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg text-slate-900" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">{loading ? "..." : "Login"}</button>
        </form>
      </div>
    );
  }

  const bubbleBtn = "p-1.5 hover:bg-slate-700 rounded text-white text-sm font-semibold flex items-center justify-center";
  const inputClass = "w-full p-2 border border-slate-200 rounded-md text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 bg-white";
  const navItemBase = "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const navItemActive = "bg-blue-600 text-white";
  const navItemInactive = "text-slate-300 hover:bg-slate-800 hover:text-white";
  const navItemDisabled = "text-slate-500 opacity-60 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Global CSS to hide WhatsApp button and force black text */}
      <style>{`
        a[href*="wa.me"], a[href*="whatsapp"], .whatsapp-float, [class*="whatsapp"] { display: none !important; }
        input, textarea, select { color: #0f172a !important; }
        .ql-editor { color: #000000 !important; min-height: 300px !important; font-size: 16px !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
        .ql-editor * { color: #000000 !important; }
        .ql-editor.ql-blank::before { color: #94a3b8 !important; font-style: normal !important; }
        .ql-toolbar.ql-snow { border: 1px solid #cbd5e1 !important; border-bottom: none !important; background: #f8fafc !important; position: sticky; top: 0; z-index: 30; }
        .ql-container.ql-snow { border: 1px solid #cbd5e1 !important; border-top: none !important; }
      `}</style>

      <aside className="w-64 bg-slate-900 text-slate-300 fixed left-0 top-0 bottom-0 flex flex-col p-4 z-20">
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-8 px-2"><LayoutDashboard className="w-6 h-6 text-blue-500" /> Rush CMS</div>
        <nav className="space-y-1 flex-1">
          <button onClick={() => setView("dashboard")} className={`${navItemBase} ${view === "dashboard" ? navItemActive : navItemInactive}`}><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
          <button onClick={() => setView("dashboard")} className={`${navItemBase} ${navItemInactive}`}><FileText className="w-4 h-4" /> All Posts</button>
          <button onClick={() => { resetForm(); setView("editor"); }} className={`${navItemBase} ${view === "editor" && !editId ? navItemActive : navItemInactive}`}><Plus className="w-4 h-4" /> Add New Post</button>
          <button onClick={() => setView("media")} className={`${navItemBase} ${view === "media" ? navItemActive : navItemInactive}`}><ImageIcon className="w-4 h-4" /> Media Library</button>
          
          {/* WordPress-style dummy menu items */}
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Site Management</div>
          <button className={`${navItemBase} ${navItemDisabled}`}><Users className="w-4 h-4" /> Users</button>
          <button className={`${navItemBase} ${navItemDisabled}`}><MessageSquare className="w-4 h-4" /> Comments</button>
          <button className={`${navItemBase} ${navItemDisabled}`}><Settings className="w-4 h-4" /> Settings</button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 mt-auto"><LogOut className="w-4 h-4" /> Logout</button>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{view === "dashboard" ? "Dashboard" : view === "editor" ? (editId ? "Edit Post" : "Add New Post") : "Media Library"}</h1>
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"><Eye className="w-4 h-4" /> View Live Site</a>
        </div>

        {view === "dashboard" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">All Posts ({posts.length})</h2>
              <button onClick={() => { resetForm(); setView("editor"); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New</button>
            </div>
            <div className="divide-y divide-slate-200">
              {posts.map((post) => (
                <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    {post.featured_image ? <img src={post.featured_image} className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-slate-400" /></div>}
                    <div>
                      <h3 className="font-bold text-slate-900">{post.title}</h3>
                      <p className="text-xs text-slate-500">{post.category} • {post.date} • <span className="text-blue-500">/{post.slug}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(post)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p className="p-8 text-center text-slate-500">No posts yet.</p>}
            </div>
          </div>
        )}

        {view === "media" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Media Library <span className="text-xs font-normal text-slate-400">(click an image to edit its details)</span></h2>
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload New<input type="file" accept="image/*" onChange={handleModalUpload} className="hidden" /></label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaFiles.map((url, i) => (
                <div key={i} onClick={() => openMediaDetail(url)} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:border-blue-500">
                  <img src={url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Edit Details</span>
                  </div>
                </div>
              ))}
              {mediaFiles.length === 0 && <p className="col-span-full text-center text-slate-500 py-12">No images uploaded yet.</p>}
            </div>
          </div>
        )}

        {view === "editor" && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Post Title <span className="text-red-500">*</span></label>
                <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); if (!editId) setSlug(generateSlug(e.target.value)); }} required placeholder="Add title" className="w-full text-2xl font-bold text-slate-900 placeholder:text-slate-400 outline-none mb-4 p-2 -ml-2 rounded focus:bg-slate-50" />
                <div ref={wrapperRef} className="border border-slate-200 rounded-lg bg-white relative">
                  <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={quillModules} />
                  {bubble.show && (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      style={{ top: bubble.top, left: bubble.left }}
                      className="absolute -translate-x-1/2 z-50 flex items-center gap-0.5 bg-slate-800 text-white rounded-lg shadow-xl px-1.5 py-1"
                    >
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("header", 2)}>H2</button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("header", 3)}>H3</button>
                      <span className="w-px h-5 bg-slate-600 mx-0.5" />
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("bold", true)}><Bold className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("italic", true)}><Italic className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("underline", true)}><Underline className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("strike", true)}><Strikethrough className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("blockquote", true)}><QuoteIcon className="w-4 h-4" /></button>
                      <span className="w-px h-5 bg-slate-600 mx-0.5" />
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("list", "ordered")}><ListOrdered className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("list", "bullet")}><List className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("link", "")}><Link2 className="w-4 h-4" /></button>
                      <button type="button" className={bubbleBtn} onClick={() => openMediaRef.current()}><ImageIcon className="w-4 h-4" /></button>
                      <span className="w-px h-5 bg-slate-600 mx-0.5" />
                      <button type="button" className={bubbleBtn} onClick={() => applyFormat("clean", true)}><RotateCcw className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Excerpt <span className="text-red-500">*</span></label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} className={`${inputClass} resize-none`} placeholder="Short summary for the blog card..." />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Publish</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date <span className="text-red-500">*</span></label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Category <span className="text-red-500">*</span></label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required className={`${inputClass} bg-white`}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tags <span className="text-slate-400 font-normal">(comma separated)</span></label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="seo, marketing, growth" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Read Time <span className="text-red-500">*</span></label>
                    <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} required placeholder="e.g., 5 min read" className={inputClass} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> {loading ? "Saving..." : (editId ? "Update Post" : "Publish Post")}</button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Featured Image</h3>
                {featuredImageUrl && <img src={featuredImageUrl} className="w-full h-40 object-cover rounded-lg mb-3 border border-slate-200" />}
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer bg-slate-50 border border-dashed border-slate-300 text-slate-600 py-3 rounded-lg text-sm font-medium hover:bg-slate-100 text-center">
                    <Upload className="w-4 h-4 inline mr-1" /> Upload
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setFeaturedImage(file); setFeaturedImageUrl(URL.createObjectURL(file)); } }} className="hidden" />
                  </label>
                  <button type="button" onClick={() => { setModalMode('featured'); setIsMediaModalOpen(true); }} className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-1">
                    <ImageIcon className="w-4 h-4" /> Library
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> SEO Settings</h3>
                <div className="space-y-3">
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="URL Slug (auto-generated)" className={`${inputClass} font-mono text-xs`} />
                  <input type="text" value={keyphrase} onChange={(e) => setKeyphrase(e.target.value)} placeholder="Focus Keyphrase" className={inputClass} />
                  <input type="text" value={keyphraseSynonyms} onChange={(e) => setKeyphraseSynonyms(e.target.value)} placeholder="Keyphrase Synonyms (comma separated)" className={inputClass} />
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Meta Description" className={`${inputClass} resize-none`} />
                  <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Featured Image Alt Text" className={inputClass} />
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Google & Social Preview</p>
                    {featuredImageUrl && <img src={featuredImageUrl} alt="Preview" className="w-full h-32 object-cover rounded mb-3 border border-slate-200" />}
                    <p className="text-blue-700 text-lg font-medium truncate">{title || "Your Post Title Will Appear Here"}</p>
                    <p className="text-green-700 text-xs truncate">rushtechnomedia.com/blog/{slug || "your-post-slug"}</p>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">{metaDescription || "Your meta description will appear here..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      {isMediaModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg">{modalMode === 'featured' ? 'Select Featured Image' : 'Select Image for Editor'}</h3>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload New<input type="file" accept="image/*" onChange={handleModalUpload} className="hidden" /></label>
                <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaFiles.map((url, i) => (
                  <div key={i} onClick={() => handleImageSelect(url)} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all">
                    <img src={url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {mediaFiles.length === 0 && <p className="text-center text-slate-500 py-12">No images yet.</p>}
            </div>
          </div>
        </div>
      )}

      {mediaDetail.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-bold text-lg">Image Details</h3>
              <button onClick={() => setMediaDetail((m) => ({ ...m, open: false }))} className="text-slate-500 hover:text-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <img src={mediaDetail.url} alt="preview" className="w-full h-48 object-cover rounded-lg border border-slate-200" />
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Name (Title)</label><input type="text" value={mediaDetail.title} onChange={(e) => setMediaDetail((m) => ({ ...m, title: e.target.value }))} className={inputClass} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Alt Text</label><input type="text" value={mediaDetail.alt} onChange={(e) => setMediaDetail((m) => ({ ...m, alt: e.target.value }))} className={inputClass} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Caption</label><input type="text" value={mediaDetail.caption} onChange={(e) => setMediaDetail((m) => ({ ...m, caption: e.target.value }))} className={inputClass} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Description</label><textarea value={mediaDetail.description} onChange={(e) => setMediaDetail((m) => ({ ...m, description: e.target.value }))} rows={3} className={`${inputClass} resize-none`} /></div>
              <button onClick={saveMediaDetail} disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">{loading ? "Saving..." : "Save Details"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
