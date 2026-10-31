"use client";

import { useState } from "react";
import { motion } from "framer-motion";


import { ArrowRight, Bolt, PlayCircle, TrendingUp, Star, Terminal, MonitorPlay, Brain, Globe, ShieldCheck, Clock, Handshake, CheckCircle, ExternalLink } from "lucide-react";


import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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

      

           {/* Sticky Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20">
          <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95">
            <img src="/logo.png.jpg" alt="Rush Technomedia Logo" className="h-8 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {["Services", "Work", "Solutions", "Pricing", "Company"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-label-md text-slate-700 hover:text-primary-container transition-colors duration-200 font-medium">
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="#portal" className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-label-md text-slate-700 border border-slate-300 hover:border-primary-container hover:text-primary-container transition-all duration-200 bg-white">
              Client Portal
            </Link>
            <Link href="#kickoff" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-white text-label-md font-bold hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/20">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto z-10">
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

        {/* Hero Visual Showcase */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative w-full max-w-5xl mx-auto mt-8">
          <div className="relative rounded-2xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/20 p-4 md:p-8 shadow-[0_16px_36px_-8px_rgba(11,21,54,0.8),0_0_24px_-2px_rgba(20,71,230,0.2)] overflow-hidden">
            <div className="absolute -top-3 -right-3 md:top-12 md:-right-6 bg-surface-container/90 backdrop-blur-md border border-outline-variant/30 px-4 py-3 rounded-xl shadow-xl animate-float-slow flex items-center gap-3 z-20">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-white"><TrendingUp className="w-5 h-5" /></div>
              <div><p className="text-caption text-outline">Client Revenue</p><p className="text-label-md text-white font-bold">Sales Growth +140%</p></div>
            </div>
            <div className="absolute -bottom-4 -left-2 md:bottom-10 md:-left-6 bg-surface-container/90 backdrop-blur-md border border-outline-variant/30 px-4 py-3 rounded-xl shadow-xl animate-float-delayed flex items-center gap-3 z-20">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary"><Star className="w-5 h-5 fill-tertiary" /></div>
              <div><p className="text-caption text-outline">Clutch & G2 Enterprise</p><p className="text-label-md text-white font-bold">Client Rating 4.9 / 5.0</p></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 bg-surface-container-lowest/80 rounded-xl p-5 border border-outline-variant/20 font-mono text-xs text-on-surface-variant">
                <div className="flex items-center justify-between text-outline text-[11px] mb-3">
                  <span>ORCHESTRATION PIPELINE</span>
                  <span className="text-tertiary">STATUS: LIVE</span>
                </div>
                <div className="space-y-1.5 text-secondary">
                  <p><span className="text-tertiary">const</span> engine = <span className="text-primary">initRushCluster</span>({"{"}</p>
                  <p className="pl-4">mode: <span className="text-tertiary-fixed">'hyper-velocity'</span>,</p>
                  <p className="pl-4">seoOptimized: <span className="text-white">true</span>,</p>
                  <p className="pl-4">cdnLatency: <span className="text-tertiary">&lt; 14ms</span></p>
                  <p>{"}"}</p>
                </div>
              </div>
              <div className="md:col-span-8 relative rounded-xl overflow-hidden min-h-[280px] flex flex-col justify-between p-6 bg-gradient-to-br from-surface-container via-surface-container-low to-surface-container-lowest border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary"><MonitorPlay className="w-4 h-4" /></div>
                    <div>
                      <h2 className="text-label-md text-on-surface">Autonomous Growth Engine</h2>
                      <p className="text-caption text-on-surface-variant">Real-time engagement telemetry</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary text-xs font-semibold">Live Feed</span>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-outline-variant/20 text-center">
                  <div><p className="text-caption text-outline">LATENCY</p><p className="text-label-md text-tertiary">14ms</p></div>
                  <div><p className="text-caption text-outline">CONVERSION</p><p className="text-label-md text-on-surface">+140%</p></div>
                  <div><p className="text-caption text-outline">UPTIME</p><p className="text-label-md text-primary">100.0%</p></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Founder & Story Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-outline-variant/20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 text-primary text-caption font-bold uppercase tracking-wider">
              Our Story & Leadership
            </div>
            <h2 className="font-display text-headline-lg text-on-surface">
              "If you can't be found, you don't exist."
            </h2>
            <p className="text-on-surface-variant text-body-lg leading-relaxed">
              Founded by digital strategist and SEO consultant <strong className="text-on-surface">Aliyu Abdulkareem</strong>, Rush Technomedia sits at the powerful intersection of modern media publishing and technical web architecture. In today’s digital-first economy, visibility is the ultimate currency.
            </p>
            <p className="text-on-surface-variant text-body-md leading-relaxed">
              Operating alongside digital media initiatives like <em>Rush Online</em>, we help businesses, brands, and professionals across Nigeria and Africa scale their digital presence, build absolute market credibility, and turn online visibility into sustainable revenue.
            </p>
            <div className="pt-4 border-t border-outline-variant/20">
              <p className="text-on-surface font-display text-headline-sm italic">"Investing in SEO and a robust digital presence is no longer optional—it is foundational. Our goal is to future-proof African businesses by giving them the technical infrastructure and media visibility they need to compete globally."</p>
              <p className="text-primary text-label-md mt-2 font-bold">— Aliyu Abdulkareem, Founder</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Globe, title: "The Media + Tech Advantage", desc: "We don't just write code; we understand how content, storytelling, and audience psychology drive online growth." },
              { icon: TrendingUp, title: "Results-Driven Frameworks", desc: "Focused entirely on metrics that matter—visibility, credibility, and revenue generation." },
              { icon: ShieldCheck, title: "Deep Local Insight, Global Standard", desc: "Tailored specifically for the realities of the African digital ecosystem while maintaining international benchmarks." }
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-xl bg-surface-container/40 border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container/80 transition-all duration-300 hover:-translate-y-1">
                <item.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-headline-sm text-on-surface mb-2">{item.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Bento Grid */}
      <section id="services" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 text-primary text-caption font-bold uppercase tracking-wider mb-3">
              Engineering & Media Scope
            </div>
            <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface">Engineered for Unfair Competitive Advantage</h2>
          </div>
          <p className="text-on-surface-variant text-body-md max-w-md">We dismiss generic templates. Every deliverable is bespoke, mathematically optimized for speed, scalability, and market impact.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {[
            { col: "md:col-span-7", icon: Terminal, title: "Modern Web Development & Engineering", desc: "Custom, lightning-fast, and mobile-responsive websites. We combine sleek UI/UX design with robust backend structures (Next.js, Rust, Edge Computing) to deliver seamless user experiences.", tags: ["Micro-Frontends", "Sub-second Latency", "Edge-Cached GraphQL"] },
            { col: "md:col-span-5", icon: Brain, title: "Strategic SEO & Digital Visibility", desc: "Moving beyond basic web design, we audit, engineer, and execute data-driven SEO strategies. We ensure your brand dominates SERPs, turning organic traffic into high-converting leads.", tags: ["Technical SEO Audits", "Content Strategy", "SERP Domination"] },
            { col: "md:col-span-5", icon: MonitorPlay, title: "Digital Media Publishing & Content", desc: "Leveraging our background in digital journalism (via Rush Online), we help organizations craft compelling brand narratives and manage digital content workflows.", tags: ["Brand Storytelling", "Content Distribution", "Thought Leadership"] },
            { col: "md:col-span-7", icon: Globe, title: "Cloud Architecture & High-Scale Infra", desc: "Battle-tested Kubernetes clustering, multi-region database sharding, and serverless compute configured to effortlessly withstand hyper-growth surges.", tags: ["SOC2 Compliant", "Multi-Region AWS/GCP", "Zero-Downtime CI/CD"] }
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`${card.col} group relative rounded-2xl bg-surface-container/40 backdrop-blur-sm border border-outline-variant/20 p-8 hover:border-primary/50 hover:bg-surface-container/80 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-primary-container/5 rounded-full blur-2xl group-hover:bg-primary-container/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-headline-sm text-on-surface mb-3 group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-on-surface-variant text-body-md mb-6 leading-relaxed">{card.desc}</p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/20">
                {card.tags.map((tag, j) => (
                  <span key={j} className="px-3 py-1 rounded-lg bg-surface-container-high text-xs font-medium text-secondary">{tag}</span>
                ))}
              </div>
            </motion.div>
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
              <p className="text-on-surface-variant text-body-lg leading-relaxed">Book a 30-minute discovery workshop directly with our engineering and creative partners. We audit your bottlenecks and map a definitive deployment blueprint within 24 hours.</p>
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
                <p className="text-center text-caption text-outline">No spam ever. 100% confidential.</p>
              </form>
            </div>
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
              {/* Fake Browser Top Bar */}
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
              {/* Preview Content */}
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-outline-variant/20">
        <div className="text-center mb-16">
          <span className="text-tertiary text-label-sm font-bold uppercase tracking-wider">Common Questions</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface mt-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "How long does a typical web development project take?", a: "A standard MVP or corporate website takes 4–6 weeks from discovery to launch. Complex, custom web applications or AI integrations may take 8–12 weeks. We provide a detailed timeline during our initial strategy session." },
            { q: "Do you offer ongoing SEO and maintenance after launch?", a: "Absolutely. We don't just build and leave. We offer flexible monthly retainers for technical SEO monitoring, content updates, security patching, and performance optimization to ensure your site continues to rank and convert." },
            { q: "What makes Rush Technomedia different from other agencies?", a: "We sit at the intersection of media publishing and technical engineering. We don't just write code; we understand audience psychology, content distribution, and the specific nuances of the African digital ecosystem, ensuring global standards with local relevance." },
            { q: "Do you work with businesses outside of Nigeria?", a: "Yes. While we are proudly rooted in Nigeria (with offices in Lagos, Ibadan, and Ilorin), we serve clients globally. Our remote-first engineering and media workflows allow us to collaborate seamlessly with international teams." }
          ].map((faq, i) => (
            <details key={i} className="group rounded-xl bg-surface-container/40 border border-outline-variant/20 open:bg-surface-container/80 open:border-primary/30 transition-all duration-300">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors text-left">{faq.q}</span>
                <span className="ml-4 text-primary transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-body-md text-on-surface-variant leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>



      

      {/* Footer */}
      
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 text-on-surface-variant">

        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-outline-variant/20">
            <div className="md:col-span-4 space-y-4">
              <span className="font-display font-bold text-xl text-on-surface tracking-tight">Rush<span className="text-primary-container">Technomedia</span></span>
              <p className="text-body-sm max-w-sm leading-relaxed">Your partner in digital innovation. We design, develop, and deliver transformative media and web experiences for the modern African market. RC-7434828</p>
              <div className="flex items-center gap-3 text-xs font-medium"><span>Offices: Lagos • Ibadan • Ilorin</span></div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-label-md text-on-surface font-bold">Solutions</p>
              <ul className="space-y-2 text-body-sm">
                {["Services", "Case Studies", "SEO Consulting", "Pricing"].map(item => (
                  <li key={item}><Link href="#" className="hover:text-primary transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-label-md text-on-surface font-bold">Company</p>
              <ul className="space-y-2 text-body-sm">
                {["About Rush", "Careers", "Client Portal", "Contact Us"].map(item => (
                  <li key={item}><Link href="#" className="hover:text-primary transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-4 space-y-3">
              <p className="text-label-md text-on-surface font-bold">Technomedia Dispatch</p>
              <p className="text-body-sm">Bi-weekly engineering memos and generative media insights read by 24,000+ tech leaders.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  name="email" 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email" 
                  disabled={subStatus === "loading" || subStatus === "success"}
                  className="flex-1 bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors disabled:opacity-50" 
                />
                <button 
                  type="submit" 
                  disabled={subStatus === "loading" || subStatus === "success"}
                  className="px-4 py-2 bg-primary-container text-white text-body-sm font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
                >
                  {subStatus === "loading" ? "..." : subStatus === "success" ? "✓" : "Subscribe"}
                </button>
              </form>
              {subStatus === "error" && <p className="text-xs text-error mt-2">Failed to subscribe. Please try again.</p>}
              {subStatus === "success" && <p className="text-xs text-tertiary mt-2">Welcome to the dispatch!</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-body-sm text-outline">
            <p>© 2026 Rush Technomedia LTD. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/legal/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/2348108031437" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-3 pr-4 py-3 rounded-full shadow-[0_8px_30px_-4px_rgba(37,211,102,0.6)] hover:scale-105 hover:shadow-[0_12px_40px_-4px_rgba(37,211,102,0.8)] transition-all duration-300 group"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="font-semibold text-sm hidden group-hover:inline-block transition-all duration-300">Chat with us</span>
      </a>







      
    </main>
  );
}
