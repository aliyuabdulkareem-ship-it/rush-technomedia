"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bolt, PlayCircle, Star, ShieldCheck, Clock, Handshake, ExternalLink, Plus, Minus, Quote } from "lucide-react";
import Link from "next/link";

const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

const blogPosts = [
  { title: "Why 90% of Nigerian Businesses Fail at SEO", excerpt: "Most businesses build beautiful websites that nobody can find. Here's the data-driven framework we use to fix that.", category: "SEO Strategy", readTime: "5 min read", date: "Oct 28, 2026" },
  { title: "The Visibility Economy: How Being Found Online Became Your Biggest Asset", excerpt: "In 2026, digital visibility isn't marketing—it's survival.", category: "Digital Strategy", readTime: "7 min read", date: "Oct 22, 2026" },
  { title: "From 0 to 10,000 Monthly Visitors: A Lagos Startup's SEO Journey", excerpt: "How a small fintech in Yaba tripled their organic traffic in 6 months.", category: "Case Study", readTime: "6 min read", date: "Oct 15, 2026" },
  { title: "AI-Powered Content: How to Scale Your Brand Without Losing Your Voice", excerpt: "Generative AI can 10x your content output.", category: "AI & Media", readTime: "8 min read", date: "Oct 10, 2026" }
];

const testimonials = [
  { name: "David Kim", role: "CTO @ HyperFlow Systems", initials: "DK", color: "bg-blue-500", quote: "Rush Technomedia operates like an elite special forces team for software.", rating: 5 },
  { name: "Elena Rostova", role: "VP Marketing @ OmniCloud", initials: "ER", color: "bg-purple-500", quote: "The design aesthetics and technical robustness they delivered transformed our conversion rates overnight.", rating: 5 },
  { name: "Marcus Sterling", role: "MD @ Apex Partners", initials: "MS", color: "bg-emerald-500", quote: "Their AI workflow automation cut our manual research overhead down from 18 hours to under 8 minutes.", rating: 5 },
  { name: "Adaeze Okafor", role: "Founder @ Rush Online", initials: "AO", color: "bg-rose-500", quote: "Aliyu and his team understand the African digital ecosystem like no one else.", rating: 5 }
];

export default function Home() {
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success">("idle");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [selectedScope, setSelectedScope] = useState("Web & Mobile Apps");

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, scope: selectedScope })
      });
      if (res.ok) {
        setContactStatus("success");
        setContactName("");
        setContactEmail("");
      } else {
        setContactStatus("idle"); // Reset on error so they can try again
        alert("Something went wrong. Please try again.");
      }
    } catch {
      setContactStatus("idle");
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container/80 border border-outline-variant/30 text-tertiary text-caption font-bold tracking-wider uppercase mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" /> Next-Gen Tech & Media Powerhouse
          </div>
          <h1 className="font-display text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-6">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-white">High-Velocity</span> Digital Experiences.
          </h1>
          <p className="text-on-surface-variant text-body-lg max-w-2xl leading-relaxed mb-10">
            We combine cutting-edge software engineering, strategic SEO, and high-impact media production to build and scale category-defining modern market leaders across Africa and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/#kickoff" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-primary-container text-white text-label-md font-bold shadow-[0_8px_30px_-4px_rgba(20,71,230,0.5)] hover:brightness-110 hover:scale-[1.02] transition-all duration-200">Start Your Project <Bolt className="w-5 h-5" /></Link>
            <Link href="/#work" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-surface-container/50 border border-outline-variant/30 text-on-surface text-label-md hover:bg-surface-container hover:border-outline-variant/60 transition-all duration-200"><PlayCircle className="w-5 h-5 text-tertiary" /> Explore Reel & Work</Link>
          </div>
        </motion.div>
      </section>

      {/* OUR SOLUTIONS SECTION */}
      <section id="solutions" className="py-24 bg-surface-container-lowest border-y border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <span className="text-tertiary text-label-sm font-bold uppercase tracking-wider">What We Do</span>
            <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface mt-2">Our Solutions</h2>
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
              <Link key={i} href={`/solutions/${sol.slug}`} className="flex-shrink-0 w-[45%] md:w-[280px] snap-center">
                <div className="group flex flex-col items-center p-4 md:p-6 rounded-full bg-white border border-slate-200 hover:border-primary-container/50 hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square justify-center">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full ${sol.color}/10 flex items-center justify-center mb-2 md:mb-4 p-3 md:p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <img src={sol.icon} alt={sol.title} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-center text-slate-900 font-bold text-xs md:text-lg font-display group-hover:text-primary-container transition-colors leading-tight">{sol.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="md:hidden text-center mt-4"><p className="text-caption text-outline">Swipe to explore more solutions</p></div>
      </section>


      {/* PORTFOLIO SECTION */}
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
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Image Container with Zoom Effect */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/18mk.png" 
                  alt={site.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary-container/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    View Project <ExternalLink className="w-5 h-5" />
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">{site.name}</h3>
                <p className="text-body-sm text-slate-600">{site.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>



      

      {/* OUR ARSENAL - SEAMLESS INFINITE MARQUEE */}
      <section className="py-20 bg-white border-y border-slate-200 overflow-hidden">
        <div className="text-center mb-12 px-6">
          <span className="text-slate-500 text-label-sm font-bold uppercase tracking-wider">Our Arsenal</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2">Some Cutting-Edge Toolkit for Digital Success</h2>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
            {["/html-js-css.png", "/google-analytics.png", "/google.png", "/meta-business-suite.png", "/google-ads.png", "/mailchimp.png", "/highlevel.png", "/adobe-suite.png", "/shopify.png", "/html-js-css.png", "/google-analytics.png", "/google.png", "/meta-business-suite.png", "/google-ads.png", "/mailchimp.png", "/highlevel.png", "/adobe-suite.png", "/shopify.png"].map((src, i) => (
              <div key={i} className="flex-shrink-0 mx-4 md:mx-8 flex items-center justify-center">
                <img src={src} alt="Tool Logo" className="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </section>

      {/* BLOG SECTION */}
      <section id="blog" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-outline-variant/20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-tertiary text-label-sm font-bold uppercase tracking-wider">Insights & Updates</span>
          <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface mt-2 mb-4">Read Latest Blog Posts</h2>
          <p className="text-on-surface-variant text-body-md">Stories on visibility, SEO, and how digital presence transforms businesses.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, i) => (
            <article key={i} className="group rounded-2xl bg-surface-container/40 border border-outline-variant/20 overflow-hidden hover:border-primary/50 hover:bg-surface-container/80 transition-all duration-300 hover:-translate-y-1">
              <div className="h-32 bg-gradient-to-br from-primary-container/20 to-tertiary/10 flex items-center justify-center"><span className="text-4xl font-display font-bold text-primary/30">0{i + 1}</span></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3"><span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold uppercase">{post.category}</span><span className="text-[10px] text-outline">{post.readTime}</span></div>
                <h3 className="font-display text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-body-sm text-on-surface-variant line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20"><span className="text-[10px] text-outline">{post.date}</span><span className="text-xs text-primary font-semibold group-hover:translate-x-1 transition-transform">Read more →</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-container text-label-sm font-bold uppercase tracking-wider">Client Stories</span>
            <h2 className="font-display text-headline-md md:text-headline-lg text-slate-900 mt-2 mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => (<Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />))}</div>
                <Quote className="w-6 h-6 text-primary-container/30 mb-3" />
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

      {/* FAQ */}
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
              <div className="px-6 pb-6 text-body-md text-on-surface-variant leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* LEAD CAPTURE FORM (NOW CONNECTED TO BACKEND) */}
      <section id="kickoff" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative rounded-3xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 p-8 md:p-14 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display text-headline-md md:text-headline-lg text-on-surface">Ready to Accelerate Your Digital Velocity?</h2>
              <p className="text-on-surface-variant text-body-lg leading-relaxed">Book a 30-minute discovery workshop directly with our engineering and creative partners.</p>
              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                {[{ icon: ShieldCheck, text: "Strict Mutual NDA Protected Before Any File Exchange" }, { icon: Clock, text: "Guaranteed Initial Technical Proposal within 24 Hours" }, { icon: Handshake, text: "Zero Obligations • Full Architecture Ownership" }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-body-sm text-secondary"><item.icon className="w-5 h-5 text-primary" /> {item.text}</div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 bg-surface-container-lowest/80 rounded-2xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl">
              <h3 className="font-display text-headline-sm text-on-surface mb-2">Claim Your Strategy Session</h3>
              <form onSubmit={handleContact} className="space-y-5">
                <div className="grid grid-cols-2 gap-2">
                  {["Web & Mobile Apps", "SEO & Visibility", "Media & Content", "Full Product Pod"].map((scope) => (
                    <label key={scope} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${selectedScope === scope ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/40 bg-surface-container-high/40 text-on-surface hover:border-primary/60'}`}>
                      <input type="radio" name="scope" className="hidden" value={scope} checked={selectedScope === scope} onChange={() => setSelectedScope(scope)} /> 
                      {scope}
                    </label>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-caption text-outline uppercase tracking-wider">Your Name</label>
                  <input required type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Alex Morgan" className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-caption text-outline uppercase tracking-wider">Work Email</label>
                  <input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="alex@company.com" className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
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
    </div>
  );
}
