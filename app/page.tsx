"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bolt, PlayCircle, TrendingUp, Star, Terminal, MonitorPlay, Brain, Globe, ShieldCheck, Clock, Handshake, ExternalLink, Menu, X, Search, Facebook, Twitter, Linkedin, Instagram, Plus, Minus, Quote } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Blog posts data - Easy to edit! Add more posts here.
// For a full admin backend later, integrate Sanity.io or Contentful CMS.
const blogPosts = [
  {
    title: "Why 90% of Nigerian Businesses Fail at SEO (And How to Fix It)",
    excerpt: "Most businesses build beautiful websites that nobody can find. Here's the data-driven framework we use to fix that.",
    category: "SEO Strategy",
    readTime: "5 min read",
    date: "Oct 28, 2026"
  },
  {
    title: "The Visibility Economy: How Being Found Online Became Your Biggest Asset",
    excerpt: "In 2026, digital visibility isn't marketing—it's survival. Learn why 'if you can't be found, you don't exist' is the new business law.",
    category: "Digital Strategy",
    readTime: "7 min read",
    date: "Oct 22, 2026"
  },
  {
    title: "From 0 to 10,000 Monthly Visitors: A Lagos Startup's SEO Journey",
    excerpt: "How a small fintech in Yaba tripled their organic traffic in 6 months using technical SEO and content clusters.",
    category: "Case Study",
    readTime: "6 min read",
    date: "Oct 15, 2026"
  },
  {
    title: "AI-Powered Content: How to Scale Your Brand Without Losing Your Voice",
    excerpt: "Generative AI can 10x your content output—but only if you know how to guide it. Our framework for authentic AI-assisted publishing.",
    category: "AI & Media",
    readTime: "8 min read",
    date: "Oct 10, 2026"
  }
];

// Testimonials data
const testimonials = [
  {
    name: "David Kim",
    role: "CTO @ HyperFlow Systems",
    initials: "DK",
    color: "bg-blue-500",
    quote: "Rush Technomedia operates like an elite special forces team for software. Their execution speed on our platform rebuild was unmatched.",
    rating: 5
  },
  {
    name: "Elena Rostova",
    role: "VP Marketing @ OmniCloud",
    initials: "ER",
    color: "bg-purple-500",
    quote: "The design aesthetics and technical robustness they delivered transformed our conversion rates overnight. +140% growth within 90 days.",
    rating: 5
  },
  {
    name: "Marcus Sterling",
    role: "Managing Director @ Apex Partners",
    initials: "MS",
    color: "bg-emerald-500",
    quote: "Their AI workflow automation cut our manual research overhead down from 18 hours per account to under 8 minutes.",
    rating: 5
  },
  {
    name: "Adaeze Okafor",
    role: "Founder @ Rush Online",
    initials: "AO",
    color: "bg-rose-500",
    quote: "Aliyu and his team understand the African digital ecosystem like no one else. They delivered a platform that truly represents our brand.",
    rating: 5
  }
];

// Tools data for marquee
const tools = [
  "Meta Business Suite", "Adobe Creative Cloud", "Google Ads", "Google Analytics",
  "WordPress", "Mailchimp", "GoHighLevel", "HTML5", "CSS3", "JavaScript", "Shopify", "Next.js"
];

export default function Home() {
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  // Smart header: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");
    setTimeout(() => setContactStatus("success"), 1500);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubStatus("success");
        setEmail("");
      } else {
        setSubStatus("error");
      }
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-container/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px]" />
      </div>

      {/* Smart Sticky Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-transform duration-300 ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20">
          <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95">
            <img src="/newlogo.png.jpg" alt="Rush Technomedia Logo" className="h-8 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Services", "Work", "Solutions", "Pricing", "Company"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-label-md text-slate-700 hover:text-primary-container transition-colors duration-200 font-medium">
                {item}
              </Link>
            ))}
            {/* Search icon - last on desktop */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="#portal" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-label-md text-slate-700 border border-slate-300 hover:border-primary-container hover:text-primary-container transition-all duration-200 bg-white">
              Client Portal
            </Link>
            <Link href="#kickoff" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-white text-label-md font-bold hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/20">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: Search + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 px-6 py-4 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search articles, services..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary-container" />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
            <nav className="flex flex-col px-6 py-6 space-y-4 max-w-7xl mx-auto">
              {["Services", "Work", "Solutions", "Pricing", "Company"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-body-lg text-slate-700 hover:text-primary-container font-medium py-2 border-b border-slate-100 last:border-0">
                  {item}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Link href="#portal" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:border-primary-container hover:text-primary-container transition-all">
                  Client Portal
                </Link>
                <Link href="#kickoff" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-lg bg-primary-container text-white font-bold hover:brightness-110 transition-all shadow-md shadow-blue-500/20">
                  Get Started →
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container/80 border border-outline-variant/30 text-tertiary text-caption font-bold tracking-wider uppercase mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            Next-Gen Tech & Media Powerhouse
          </div>
          <h1 className="font-display text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-6">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-white">High-Velocity</span> Digital Experiences.
          </h1>
          <p className="text-on-surface-variant text-body-lg max-w-2xl leading-relaxed mb-10">
            We combine cutting-edge software engineering, strategic SEO, and high-impact media production to build and scale category-defining modern market leaders across Africa and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="#kickoff" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-primary-container text-white text-label-md font-bold shadow-[0_8px_30px_-4px_rgba(20,71,230,0.5)] hover:brightness-110 hover:scale-[1.02] transition-all duration-200">
              Start Your Project <Bolt className="w-5 h-5" />
            </Link>
            <Link href="#work" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-surface-container/50 border border-outline-variant/30 text-on-surface text-label-md hover:bg-surface-container hover:border-outline-variant/60 transition-all duration-200">
              <PlayCircle className="w-5 h-5 text-tertiary" /> Explore Reel & Work
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-outline-variant/20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-tertiary text-label-sm font-bold uppercase tracking-wider">Featured Production</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface mt-2 mb-4">Engineered Case Studies</h2>
          <p className="text-on-surface-variant text-body-md">Measurable, high-velocity outcomes delivered for media enterprises, civic organizations, and global brands.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Rulers World TV", url: "https://rulersworldtv.com/", desc: "Media Broadcasting & Digital Presence" },
            { name: "Eighteen Eleven Media", url: "https://eighteenelevenmedia.com/", desc: "Creative Media & Brand Strategy" },
            { name: "DPSR International", url: "https://dpsrinternational.com/", desc: "Corporate Web Architecture" },
            { name: "Voters Awareness Org", url: "https://votersawareness.org.ng/", desc: "Civic Tech & Information Platform" },
            { name: "Borderless Online NG", url: "https://borderlessonlineng.com/", desc: "Digital Publishing & News Portal" }
          ].map((site, i) => (
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl bg-surface-container/40 border border-outline-variant/20 overflow-hidden hover:border-primary/50 hover:bg-surface-container/80 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
                </div>
                <div className="flex-1 bg-surface-container-high rounded-md px-3 py-1 text-[10px] text-outline font-mono truncate text-center">
                  {site.url}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors">{site.name}</h3>
                  <ExternalLink className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
                <p className="text-body-sm text-on-surface-variant">{site.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Tools Marquee Section */}
      <section className="py-20 bg-white border-y border-slate-200 overflow-hidden">
        <div className="text-center mb-12 px-6">
          <span className="text-slate-500 text-label-sm font-bold uppercase tracking-wider">Our Arsenal</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2">Some Cutting-Edge Toolkit for Digital Success</h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex animate-[scroll_40s_linear_infinite]">
            {[...tools, ...tools, ...tools].map((tool, i) => (
              <div key={i} className="flex-shrink-0 mx-4 px-8 py-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 font-semibold text-sm whitespace-nowrap">{tool}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          @media (max-width: 768px) {
            .animate-\\[scroll_40s_linear_infinite\\] > div {
              margin-left: 0.5rem;
              margin-right: 0.5rem;
            }
          }
        `}</style>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-outline-variant/20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-tertiary text-label-sm font-bold uppercase tracking-wider">Insights & Updates</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface mt-2 mb-4">Read Latest Blog Posts</h2>
          <p className="text-on-surface-variant text-body-md">Stories on visibility, SEO, and how digital presence transforms businesses and individuals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, i) => (
            <article key={i} className="group rounded-2xl bg-surface-container/40 border border-outline-variant/20 overflow-hidden hover:border-primary/50 hover:bg-surface-container/80 transition-all duration-300 hover:-translate-y-1">
              <div className="h-32 bg-gradient-to-br from-primary-container/20 to-tertiary/10 flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-primary/30">0{i + 1}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold uppercase">{post.category}</span>
                  <span className="text-[10px] text-outline">{post.readTime}</span>
                </div>
                <h3 className="font-display text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-body-sm text-on-surface-variant line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                  <span className="text-[10px] text-outline">{post.date}</span>
                  <span className="text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform">Read more →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-caption text-outline uppercase tracking-wider mb-2">Admin Note</p>
          <p className="text-body-sm text-on-surface-variant max-w-xl mx-auto">To add a visual admin backend for managing blog posts, integrate <strong className="text-primary">Sanity.io</strong> or <strong className="text-primary">Contentful</strong> CMS. Contact us for setup.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-container text-label-sm font-bold uppercase tracking-wider">Client Stories</span>
            <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2 mb-4">What Our Clients Say</h2>
            <p className="text-slate-600 text-body-md">Trusted by 3,000+ forward-thinking hypergrowth teams and global enterprises worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-primary-container/30 mb-3" />
                <p className="text-slate-700 text-body-sm italic mb-6 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-sm`}>{t.initials}</div>
                  <div>
                    <p className="text-label-md text-slate-900 font-bold">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-outline-variant/20">
        <div className="text-center mb-16">
          <span className="text-tertiary text-label-sm font-bold uppercase tracking-wider">Common Questions</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface mt-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "How long does a typical web development project take?", a: "A standard MVP or corporate website takes 4–6 weeks from discovery to launch. Complex, custom web applications or AI integrations may take 8–12 weeks." },
            { q: "Do you offer ongoing SEO and maintenance after launch?", a: "Absolutely. We offer flexible monthly retainers for technical SEO monitoring, content updates, security patching, and performance optimization." },
            { q: "What makes Rush Technomedia different from other agencies?", a: "We sit at the intersection of media publishing and technical engineering. We understand audience psychology, content distribution, and the African digital ecosystem." },
            { q: "Do you work with businesses outside of Nigeria?", a: "Yes. While we are proudly rooted in Nigeria (Lagos, Ibadan, Ilorin), we serve clients globally with remote-first workflows." }
          ].map((faq, i) => (
            <details key={i} className="group rounded-xl bg-surface-container/40 border border-outline-variant/20 open:bg-surface-container/80 open:border-primary/30 transition-all duration-300">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors text-left pr-4">{faq.q}</span>
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-bold text-lg">
                  <span className="group-open:hidden"><Plus className="w-5 h-5" /></span>
                  <span className="hidden group-open:block"><Minus className="w-5 h-5" /></span>
                </span>
              </summary>
              <div className="px-6 pb-6 text-body-md text-on-surface-variant leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="kickoff" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative rounded-3xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 p-8 md:p-14 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface">Ready to Accelerate Your Digital Velocity?</h2>
              <p className="text-on-surface-variant text-body-lg leading-relaxed">Book a 30-minute discovery workshop directly with our engineering and creative partners.</p>
              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                {[
                  { icon: ShieldCheck, text: "Strict Mutual NDA Protected Before Any File Exchange" },
                  { icon: Clock, text: "Guaranteed Initial Technical Proposal within 24 Hours" },
                  { icon: Handshake, text: "Zero Obligations • Full Architecture Ownership" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-body-sm text-secondary">
                    <item.icon className="w-5 h-5 text-primary" /> {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 bg-surface-container-lowest/80 rounded-2xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl">
              <h3 className="font-display text-headline-sm text-on-surface mb-2">Claim Your Strategy Session</h3>
              <form onSubmit={handleContact} className="space-y-5">
                <div className="grid grid-cols-2 gap-2">
                  {["Web & Mobile Apps", "SEO & Visibility", "Media & Content", "Full Product Pod"].map((scope) => (
                    <label key={scope} className="flex items-center justify-center p-3 rounded-lg border border-outline-variant/40 bg-surface-container-high/40 cursor-pointer text-xs font-semibold text-on-surface hover:border-primary/60 hover:bg-surface-container-high transition-all">
                      <input type="radio" name="scope" className="hidden" defaultChecked={scope === "Web & Mobile Apps"} /> {scope}
                    </label>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-caption text-outline uppercase tracking-wider">Your Name</label>
                  <input required type="text" placeholder="Alex Morgan" className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-caption text-outline uppercase tracking-wider">Work Email</label>
                  <input required type="email" placeholder="alex@company.com" className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <button type="submit" disabled={contactStatus !== "idle"} className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-primary-container text-white font-label-md font-bold shadow-[0_8px_30px_-4px_rgba(20,71,230,0.5)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {contactStatus === "loading" ? "Processing..." : contactStatus === "success" ? "Session Claimed!" : "Claim Free Strategy Session"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 text-slate-600">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-200">
            <div className="md:col-span-4 space-y-4">
              <img src="/newlogo.png.jpg" alt="Rush Technomedia Logo" className="h-8 w-auto object-contain" />
              <p className="text-body-sm max-w-sm leading-relaxed text-slate-600">Your partner in digital innovation. We design, develop, and deliver transformative media and web experiences for the modern African market.</p>
              <p className="text-caption text-slate-500">RC-7434828</p>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span>Offices: Lagos • Ibadan • Ilorin</span>
              </div>
              {/* Social Media Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center hover:scale-110 transition-transform"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-label-md text-slate-900 font-bold">Solutions</p>
              <ul className="space-y-2 text-body-sm">
                <li><Link href="#services" className="text-slate-600 hover:text-primary-container transition-colors">Services</Link></li>
                <li><Link href="#work" className="text-slate-600 hover:text-primary-container transition-colors">Case Studies</Link></li>
                <li><Link href="#services" className="text-slate-600 hover:text-primary-container transition-colors">AI Solutions</Link></li>
                <li><Link href="#pricing" className="text-slate-600 hover:text-primary-container transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-label-md text-slate-900 font-bold">Company</p>
              <ul className="space-y-2 text-body-sm">
                <li><Link href="#about" className="text-slate-600 hover:text-primary-container transition-colors">About Rush</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-primary-container transition-colors">Careers</Link></li>
                <li><Link href="#portal" className="text-slate-600 hover:text-primary-container transition-colors">Client Portal</Link></li>
                <li><Link href="#kickoff" className="text-slate-600 hover:text-primary-container transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div className="md:col-span-4 space-y-3">
              <p className="text-label-md text-slate-900 font-bold">Technomedia Dispatch</p>
              <p className="text-body-sm text-slate-600">Bi-weekly engineering memos and generative media insights read by 24,000+ tech leaders.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input name="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter work email" disabled={subStatus === "loading" || subStatus === "success"} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-body-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary-container focus:bg-white transition-colors disabled:opacity-50" />
                <button type="submit" disabled={subStatus === "loading" || subStatus === "success"} className="px-4 py-2 bg-primary-container text-white text-body-sm font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  {subStatus === "loading" ? "..." : subStatus === "success" ? "✓" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-body-sm text-slate-500">
            <p>© 2026 Rush Technomedia LTD. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/legal/privacy" className="text-slate-500 hover:text-primary-container transition-colors">Privacy Policy</Link>
              <Link href="/legal/terms" className="text-slate-500 hover:text-primary-container transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-3 pr-4 py-3 rounded-full shadow-[0_8px_30px_-4px_rgba(37,211,102,0.6)] hover:scale-105 hover:shadow-[0_12px_40px_-4px_rgba(37,211,102,0.8)] transition-all duration-300 group">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="font-semibold text-sm hidden group-hover:inline-block transition-all duration-300">Chat with us</span>
      </a>
    </main>
  );
}
