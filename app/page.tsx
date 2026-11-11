"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bolt, PlayCircle, Star, ShieldCheck, Clock, Handshake, ExternalLink, Plus, Minus, Quote } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

const defaultBlogPosts = [
  { title: "Why 90% of Nigerian Businesses Fail at SEO", excerpt: "Most businesses build beautiful websites that nobody can find. Here's the data-driven framework we use to fix that.", category: "SEO Strategy", read_time: "5 min read", date: "Oct 28, 2026" },
  { title: "The Visibility Economy: How Being Found Online Became Your Biggest Asset", excerpt: "In 2026, digital visibility isn't marketing—it's survival.", category: "Digital Strategy", read_time: "7 min read", date: "Oct 22, 2026" },
  { title: "From 0 to 10,000 Monthly Visitors: A Lagos Startup's SEO Journey", excerpt: "How a small fintech in Yaba tripled their organic traffic in 6 months.", category: "Case Study", read_time: "6 min read", date: "Oct 15, 2026" },
  { title: "AI-Powered Content: How to Scale Your Brand Without Losing Your Voice", excerpt: "Generative AI can 10x your content output.", category: "AI & Media", read_time: "8 min read", date: "Oct 10, 2026" }
];

const testimonials = [
  { name: "David Kim", role: "CTO @ HyperFlow Systems", initials: "DK", color: "bg-blue-500", quote: "Rush Technomedia operates like an elite special forces team for software.", rating: 5 },
  { name: "Elena Rostova", role: "VP Marketing @ OmniCloud", initials: "ER", color: "bg-purple-500", quote: "The design aesthetics and technical robustness they delivered transformed our conversion rates overnight.", rating: 5 },
  { name: "Marcus Sterling", role: "MD @ Apex Partners", initials: "MS", color: "bg-emerald-500", quote: "Their AI workflow automation cut our manual research overhead down from 18 hours to under 8 minutes.", rating: 5 },
  { name: "Adaeze Okafor", role: "Founder @ Rush Online", initials: "AO", color: "bg-rose-500", quote: "Aliyu and his team understand the African digital ecosystem like no one else.", rating: 5 }
];

const faqs = [
  { q: "How long does a typical web development project take?", a: "A standard MVP or corporate website takes 4–6 weeks from discovery to launch. Complex, custom web applications or AI integrations may take 8–12 weeks." },
  { q: "Do you offer ongoing SEO and maintenance after launch?", a: "Absolutely. We offer flexible monthly retainers for technical SEO monitoring, content updates, security patching, and performance optimization." },
  { q: "What makes Rush Technomedia different from other agencies?", a: "We sit at the intersection of media publishing and technical engineering. We understand audience psychology, content distribution, and the African digital ecosystem." },
  { q: "Do you work with businesses outside of Nigeria?", a: "Yes. While we are proudly rooted in Nigeria (Lagos, Ibadan, Ilorin), we serve clients globally with remote-first workflows." }
];

export default function Home() {
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts);
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success">("idle");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [selectedScope, setSelectedScope] = useState("Web & Mobile Apps");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [arsenalActive, setArsenalActive] = useState(0);
  const [mediaActive, setMediaActive] = useState(0);

  const portfolioRef = useRef<HTMLDivElement>(null);
  const arsenalRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Fetch blog posts from Supabase safely in the background
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setBlogPosts(data);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const setupMarquee = (ref: React.RefObject<HTMLDivElement>, uniqueCount: number, setActive: React.Dispatch<React.SetStateAction<number>>) => {
      const el = ref.current;
      if (!el) return;

      let intervalId: ReturnType<typeof setInterval>;
      let resumeTimeout: ReturnType<typeof setTimeout>;
      let isPaused = false;

      const getStep = () => el.scrollWidth / (uniqueCount * 2);

      const scrollStep = () => {
        if (el.scrollWidth > el.clientWidth) {
          const step = getStep();
          el.scrollBy({ left: step, behavior: 'smooth' });
        }
      };

      const startAutoScroll = () => {
        intervalId = setInterval(scrollStep, 2500);
      };

      const pause = () => {
        isPaused = true;
        clearInterval(intervalId);
        clearTimeout(resumeTimeout);
      };

      const resume = () => {
        isPaused = false;
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(startAutoScroll, 2000);
      };

      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', resume);
      el.addEventListener('touchstart', pause, { passive: true });
      el.addEventListener('touchend', resume);
      
      const handleManualScroll = () => {
        if (el.scrollWidth > el.clientWidth) {
          const step = getStep();
          const index = Math.round(el.scrollLeft / step) % uniqueCount;
          setActive(index);
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
        }
        if (!isPaused) {
          pause();
          resume();
        }
      };
      el.addEventListener('scroll', handleManualScroll, { passive: true });

      startAutoScroll();

      return () => {
        clearInterval(intervalId);
        clearTimeout(resumeTimeout);
        el.removeEventListener('mouseenter', pause);
        el.removeEventListener('mouseleave', resume);
        el.removeEventListener('touchstart', pause);
        el.removeEventListener('touchend', resume);
        el.removeEventListener('scroll', handleManualScroll);
      };
    };

    const cleanupArsenal = setupMarquee(arsenalRef, 9, setArsenalActive);
    const cleanupMedia = setupMarquee(mediaRef, 10, setMediaActive);

    let portfolioInterval: ReturnType<typeof setInterval>;
    const pel = portfolioRef.current;
    if (pel) {
       let isHovering = false;
       portfolioInterval = setInterval(() => {
          if (!isHovering) {
             const step = window.innerWidth >= 768 ? 392 : 332;
             pel.scrollBy({ left: step, behavior: 'smooth' });
             if (pel.scrollLeft >= pel.scrollWidth / 2) pel.scrollLeft = 0;
          }
       }, 4000);
       const pPause = () => { isHovering = true; };
       const pResume = () => { isHovering = false; };
       pel.addEventListener('mouseenter', pPause);
       pel.addEventListener('mouseleave', pResume);
       pel.addEventListener('touchstart', pPause);
       pel.addEventListener('touchend', pResume);
    }

    return () => {
      cleanupArsenal?.();
      cleanupMedia?.();
      clearInterval(portfolioInterval);
    };
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, phone: contactPhone, scope: selectedScope, message: contactMessage })
      });
      if (res.ok) {
        setContactStatus("success");
        setContactName(""); setContactEmail(""); setContactPhone(""); setContactMessage("");
      } else {
        setContactStatus("idle");
        alert("Something went wrong. Please try again.");
      }
    } catch {
      setContactStatus("idle");
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION (Dark Blue) */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto z-10 bg-slate-900 text-white">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-300 text-caption font-bold tracking-wider uppercase mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Next-Gen Tech & Media Powerhouse
          </div>
          <h1 className="font-display text-display-hero-mobile md:text-display-hero tracking-tight mb-6">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">High-Velocity</span> Digital Experiences.
          </h1>
          <p className="text-slate-300 text-body-lg max-w-2xl leading-relaxed mb-10">
            We combine cutting-edge software engineering, strategic SEO, and high-impact media production to build and scale category-defining modern market leaders across Africa and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/#kickoff" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-blue-600 text-white text-label-md font-bold shadow-lg hover:bg-blue-500 transition-all duration-200">Start Your Project <Bolt className="w-5 h-5" /></Link>
            <Link href="/#work" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-white/10 border border-white/20 text-white text-label-md hover:bg-white/20 transition-all duration-200"><PlayCircle className="w-5 h-5" /> Explore Reel & Work</Link>
          </div>
        </motion.div>
      </section>

      {/* 2. SOLUTIONS SECTION (White Background, Perfect Circles) */}
      <section id="solutions" className="py-24 bg-white border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <span className="text-blue-600 text-label-sm font-bold uppercase tracking-wider">What We Do</span>
            <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2">Our Solutions</h2>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { slug: "website-and-app-development", title: "Website & App Development", icon: "/web.png", color: "bg-blue-500" },
              { slug: "ecommerce-solutions", title: "E-Commerce Solutions", icon: "/e-commerce.png", color: "bg-emerald-500" },
              { slug: "digital-marketing", title: "Digital Marketing", icon: "/digital.png", color: "bg-purple-500" },
              { slug: "creative-design-and-branding", title: "Creative Design & Branding", icon: "/brand.png", color: "bg-pink-500" },
              { slug: "media-publications", title: "Media Publications", icon: "/Publication.png", color: "bg-orange-500" },
              { slug: "ai-and-it-solutions", title: "AI & IT Solutions", icon: "/ai.png", color: "bg-cyan-500" }
            ].map((sol, i) => (
              <Link key={i} href={`/solutions/${sol.slug}`} className="flex-shrink-0 w-[160px] md:w-[280px] snap-center">
                {/* aspect-square guarantees a perfect circle on all devices */}
                <div className="group flex flex-col items-center justify-center p-4 md:p-8 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer aspect-square">
                  <img src={sol.icon} alt={sol.title} className="w-12 h-12 md:w-24 md:h-24 object-contain mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300 invert brightness-0" loading="lazy" />
                  <h3 className="text-center text-white font-bold text-[11px] md:text-lg font-display group-hover:text-blue-400 transition-colors leading-tight px-2 line-clamp-3">{sol.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Fixed >>> syntax and added indicator */}
        <div className="md:hidden text-center mt-4">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5 font-medium">
            <span className="text-blue-600 text-lg">{'>>>'}</span> Swipe to explore more solutions
          </p>
        </div>
      </section>

      {/* 3. PORTFOLIO SECTION (Dark Blue) */}
      <section id="work" className="bg-slate-900 pb-32 text-white">
        <div className="pt-20 pb-48 px-6 text-center relative">
          <span className="text-blue-400 text-label-sm font-bold uppercase tracking-wider">Featured Production</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-white mt-2 mb-4">Engineered Case Studies</h2>
          <p className="text-slate-300 text-body-md max-w-2xl mx-auto">Measurable, high-velocity outcomes delivered for media enterprises, civic organizations, and global brands.</p>
        </div>
        
        <div className="relative -mt-32 z-10">
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          
          <div className="w-[300px] md:w-[752px] mx-auto">
            <div className="overflow-hidden pb-16">
              <div ref={portfolioRef} className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-8 px-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[
                  { name: "Rulers World TV", url: "https://rulersworldtv.com/", desc: "Media Broadcasting & Digital Presence", image: "/Rulers.png" },
                  { name: "Eighteen Eleven Media", url: "https://eighteenelevenmedia.com/", desc: "Creative Media & Brand Strategy", image: "/18mk.png" },
                  { name: "DPSR International", url: "https://dpsrinternational.com/", desc: "Corporate Web Architecture", image: "/DPSR.png" },
                  { name: "Voters Awareness Org", url: "https://votersawareness.org.ng/", desc: "Civic Tech & Information Platform", image: "/Voters.png" },
                  { name: "Borderless Online NG", url: "https://borderlessonlineng.com/", desc: "Digital Publishing & News Portal", image: "/Borderless.png" },
                  { name: "Rulers World TV", url: "https://rulersworldtv.com/", desc: "Media Broadcasting & Digital Presence", image: "/Rulers.png" },
                  { name: "Eighteen Eleven Media", url: "https://eighteenelevenmedia.com/", desc: "Creative Media & Brand Strategy", image: "/18mk.png" },
                  { name: "DPSR International", url: "https://dpsrinternational.com/", desc: "Corporate Web Architecture", image: "/DPSR.png" },
                  { name: "Voters Awareness Org", url: "https://votersawareness.org.ng/", desc: "Civic Tech & Information Platform", image: "/Voters.png" },
                  { name: "Borderless Online NG", url: "https://borderlessonlineng.com/", desc: "Digital Publishing & News Portal", image: "/Borderless.png" }
                ].map((site, i) => (
                  <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[300px] md:w-[360px] snap-center group relative">
                    <div className="h-[220px] md:h-[260px] rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-sm">
                      <img src={site.image} alt={site.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="absolute -bottom-10 left-4 right-4 bg-white rounded-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] p-5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                      <h3 className="font-display font-bold text-slate-900 text-lg leading-tight text-center">{site.name}</h3>
                      <p className="text-sm text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-center">{site.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(5)].map((_, i) => (<div key={i} className="h-1.5 w-6 bg-white/30 rounded-full"></div>))}
          </div>
        </div>
      </section>

      {/* 4. ARSENAL SECTION (White) */}
      <section className="py-24 bg-white border-y border-slate-200 overflow-hidden">
        <div className="text-center mb-16 px-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-label-sm font-bold uppercase tracking-wider mb-4">Our Arsenal</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2">Cutting-Edge Toolkit for Digital Success</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Powerful tools and technologies we leverage to deliver exceptional results</p>
        </div>
        
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div ref={arsenalRef} className="flex overflow-x-auto scrollbar-hide gap-8 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              "/html-js-css.png", "/google-analytics.png", "/google.png", "/meta-business-suite.png", "/google-ads.png", "/mailchimp.png", "/highlevel.png", "/adobe-suite.png", "/shopify.png",
              "/html-js-css.png", "/google-analytics.png", "/google.png", "/meta-business-suite.png", "/google-ads.png", "/mailchimp.png", "/highlevel.png", "/adobe-suite.png", "/shopify.png"
            ].map((src, i) => (
              <div key={i} className="flex-shrink-0 mx-4 md:mx-8 flex items-center justify-center">
                <img src={src} alt="Tool Logo" className="h-8 md:h-10 w-auto object-contain hover:grayscale hover:opacity-60 transition-all duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${arsenalActive === i ? 'w-6 bg-slate-800' : 'w-3 bg-slate-300'}`}></div>
          ))}
        </div>
      </section>

      {/* 5. MEDIA PARTNERS SECTION (Dark Blue) */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 overflow-hidden text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="text-center mb-16 px-6 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-label-sm font-bold uppercase tracking-wider mb-4 border border-blue-500/30">Media Partners</span>
          {/* Removed "Nigeria's" */}
          <h2 className="font-display text-headline-md md:text-headline-lg text-white mt-2">Featured In Top Outlets</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">We secure high-authority press coverage for our clients across the most trusted news platforms in the country.</p>
        </div>
        
        <div className="relative w-full z-10">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          
          <div ref={mediaRef} className="flex overflow-x-auto scrollbar-hide gap-6 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              "/Punch.png", "/Tribune.png", "/Guardianng.png", "/nation.png", "/Vanguard.png", 
              "/BusinessDay.png", "/Independent.png", "/The_Sun.png", "/pmnews.png", "/Telegraph.png",
              "/Punch.png", "/Tribune.png", "/Guardianng.png", "/nation.png", "/Vanguard.png", 
              "/BusinessDay.png", "/Independent.png", "/The_Sun.png", "/pmnews.png", "/Telegraph.png"
            ].map((src, i) => (
              <div key={i} className="flex-shrink-0 mx-4 md:mx-8 flex items-center justify-center">
                <img src={src} alt="Media Partner Logo" className="h-10 md:h-14 w-auto object-contain hover:grayscale hover:opacity-60 transition-all duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-12 relative z-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${mediaActive === i ? 'w-6 bg-white' : 'w-3 bg-white/30'}`}></div>
          ))}
        </div>
      </section>

      {/* 6. BLOG SECTION (White Background, Dark Scrollable Cards) */}
      <section id="blog" className="py-24 bg-white overflow-hidden">
        <div className="text-center max-w-3xl mx-auto mb-12 px-6">
          <span className="text-blue-600 text-label-sm font-bold uppercase tracking-wider">Insights & Updates</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2 mb-4">Read Latest Blog Posts</h2>
          <p className="text-slate-600 text-body-md">Stories on visibility, SEO, and how digital presence transforms businesses.</p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-12 pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {blogPosts.map((post: any, i: number) => (
            <article key={i} className="flex-shrink-0 w-[85vw] md:w-[calc(25%-1.125rem)] snap-center group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-32 bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center border-b border-slate-800">
                <span className="text-4xl font-display font-bold text-white/20">0{i + 1}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">{post.category}</span>
                  <span className="text-[10px] text-slate-500">{post.read_time}</span>
                </div>
                <h3 className="font-display text-headline-sm text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-body-sm text-slate-400 line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500">{post.date}</span>
                  <span className="text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">Read more →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION (Dark Blue, Scrollable) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-400 text-label-sm font-bold uppercase tracking-wider">Client Stories</span>
            <h2 className="font-display text-headline-md md:text-headline-lg text-white mt-2 mb-4">What Our Clients Say</h2>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[85vw] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] snap-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col text-slate-900">
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => (<Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />))}</div>
                <Quote className="w-6 h-6 text-blue-600/30 mb-3" />
                <p className="text-slate-700 text-body-sm italic mb-6 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-sm`}>{t.initials}</div>
                  <div><p className="text-label-md text-slate-900 font-bold">{t.name}</p><p className="text-[11px] text-slate-500">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION (White) */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto bg-white">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-label-sm font-bold uppercase tracking-wider">Common Questions</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`rounded-xl border transition-all duration-300 ${openFaq === i ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                className="flex items-center justify-between w-full p-6 text-left cursor-pointer"
              >
                <span className="font-display text-headline-sm text-slate-900 pr-4">{faq.q}</span>
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {openFaq === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-body-md text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. LEAD CAPTURE FORM (Dark Blue) */}
      <section id="kickoff" className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-slate-900">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 md:p-14 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-6 space-y-6 text-white">
              <h2 className="font-display text-headline-md md:text-headline-lg">Ready to Accelerate Your Digital Velocity?</h2>
              <p className="text-slate-300 text-body-lg leading-relaxed">Book a 30-minute discovery workshop directly with our engineering and creative partners.</p>
              <div className="space-y-3 pt-4 border-t border-slate-700">
                {[{ icon: ShieldCheck, text: "Strict Mutual NDA Protected Before Any File Exchange" }, { icon: Clock, text: "Guaranteed Initial Technical Proposal within 24 Hours" }, { icon: Handshake, text: "Zero Obligations • Full Architecture Ownership" }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-body-sm text-slate-300"><item.icon className="w-5 h-5 text-blue-400" /> {item.text}</div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
              <h3 className="font-display text-headline-sm text-slate-900 mb-2">Claim Your Strategy Session</h3>
              <form onSubmit={handleContact} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {["Web & Mobile Apps", "SEO & Visibility", "Media & Content", "Full Product Pod"].map((scope) => (
                    <label key={scope} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${selectedScope === scope ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300'}`}>
                      <input type="radio" name="scope" className="hidden" value={scope} checked={selectedScope === scope} onChange={() => setSelectedScope(scope)} /> 
                      {scope}
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-caption text-slate-500 uppercase tracking-wider">Your Name</label>
                    <input required type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Alex Morgan" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-caption text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+234 800 000 0000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-caption text-slate-500 uppercase tracking-wider">Work Email</label>
                  <input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="alex@company.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-caption text-slate-500 uppercase tracking-wider">How can we help? (Optional)</label>
                  <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Tell us about your project..." rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-body-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                </div>
                <button type="submit" disabled={contactStatus !== "idle"} className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-blue-600 text-white font-label-md font-bold shadow-lg hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                  {contactStatus === "loading" ? "Processing..." : contactStatus === "success" ? "Session Claimed!" : "Claim Free Strategy Session"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
