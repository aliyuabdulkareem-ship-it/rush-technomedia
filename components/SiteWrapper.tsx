"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Facebook, Twitter, Linkedin, Instagram, Menu, X, ChevronDown, MapPin, Phone, Mail, Plus, Minus, ArrowUp } from "lucide-react";
import Link from "next/link";

// Exact, case-sensitive labels for consistency across Header, Mobile Menu, and Footer
const serviceLinks = [
  { slug: "website-and-app-development", label: "Website & Application Development" },
  { slug: "ecommerce-solutions", label: "E-commerce Solutions" },
  { slug: "digital-marketing", label: "Digital Marketing" },
  { slug: "creative-design-and-branding", label: "Creative Design & Branding" },
  { slug: "media-publications", label: "Media Publications" },
  { slug: "ai-and-it-solutions", label: "AI & IT Solutions" }
];

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header hide/show
      if (currentScrollY > lastScrollY && currentScrollY > 100) setHeaderVisible(false);
      else setHeaderVisible(true);
      
      // Scroll to top button show/hide
      if (currentScrollY > 400) setShowScrollTop(true);
      else setShowScrollTop(false);
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault(); setSubStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) { setSubStatus("success"); setEmail(""); } else { setSubStatus("error"); }
    } catch { setSubStatus("error"); }
  };

  const toggleDropdown = (name: string) => setOpenDropdown(openDropdown === name ? null : name);

  const searchableContent = serviceLinks.map(link => ({ title: link.label, type: "Solution", url: `/solutions/${link.slug}` }));
  const filteredResults = searchableContent.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* GLOBAL HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-transform duration-300 ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20">
          <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95">
            <img src="/newlogo.png.jpg" alt="Rush Technomedia Logo" className="h-8 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {/* Desktop Services Menu: Hover to open */}
            <div className="relative group" onMouseEnter={() => setOpenDropdown('services')} onMouseLeave={() => setOpenDropdown(null)}>
              <button className="flex items-center gap-1 text-label-md text-slate-700 hover:text-primary-container font-medium py-2">
                Services <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 transition-all duration-200 ${openDropdown === 'services' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {serviceLinks.map((link) => (
                  <Link key={link.slug} href={`/solutions/${link.slug}`} onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-container">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/#about" className="text-label-md text-slate-700 hover:text-primary-container font-medium">About</Link>

            {/* Desktop News Menu: Hover to open */}
            <div className="relative group" onMouseEnter={() => setOpenDropdown('news')} onMouseLeave={() => setOpenDropdown(null)}>
              <button className="flex items-center gap-1 text-label-md text-slate-700 hover:text-primary-container font-medium py-2">
                News <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'news' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 transition-all duration-200 ${openDropdown === 'news' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link href="/#blog" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-container">Our News (Blog)</Link>
                <Link href="#" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-container">Our Mentions</Link>
                <Link href="#" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-container">Our Videos</Link>
              </div>
            </div>

            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"><Search className="w-5 h-5" /></button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/#portal" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-label-md text-slate-700 border border-slate-300 hover:border-primary-container hover:text-primary-container transition-all duration-200 bg-white">Client Portal</Link>
            <Link href="/#kickoff" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-white text-label-md font-bold hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/20">Get Started <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"><Search className="w-5 h-5" /></button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-lg max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col px-6 py-6 space-y-4">
              
              {/* Mobile Services: +/- Expand/Collapse */}
              <div className="space-y-2">
                <button onClick={() => toggleDropdown('mobile-services')} className="flex items-center justify-between w-full text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                  Services 
                  {openDropdown === 'mobile-services' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
                {openDropdown === 'mobile-services' && (
                  <div className="space-y-1 pl-2">
                    {serviceLinks.map((link) => (
                      <Link key={link.slug} href={`/solutions/${link.slug}`} onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 py-2 border-b border-slate-100 text-sm">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 py-2 border-b border-slate-100 font-medium">About</Link>
              
              {/* Mobile News: +/- Expand/Collapse */}
              <div className="space-y-2">
                <button onClick={() => toggleDropdown('mobile-news')} className="flex items-center justify-between w-full text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                  News 
                  {openDropdown === 'mobile-news' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
                {openDropdown === 'mobile-news' && (
                  <div className="space-y-1 pl-2">
                    <Link href="/#blog" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 py-2 border-b border-slate-100 text-sm">Our News (Blog)</Link>
                    <Link href="#" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 py-2 border-b border-slate-100 text-sm">Our Mentions</Link>
                    <Link href="#" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 py-2 border-b border-slate-100 text-sm">Our Videos</Link>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-3">
                <Link href="/#portal" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold">Client Portal</Link>
                <Link href="/#kickoff" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-lg bg-primary-container text-white font-bold">Get Started →</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 px-4">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input autoFocus type="text" placeholder="Search solutions..." className="flex-1 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {searchQuery.length > 0 ? (
                  filteredResults.length > 0 ? (
                    <div className="space-y-2">
                      {filteredResults.map((item, i) => (
                        <Link key={i} href={item.url} onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                          <div>
                            <p className="font-semibold text-slate-800 group-hover:text-primary-container">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.type}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-container" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500"><p className="text-lg font-semibold">No results found</p></div>
                  )
                ) : (
                  <div className="text-center py-12 text-slate-400"><p>Type to search across all solutions.</p></div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="relative min-h-screen bg-background overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-container/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* SCROLL TO TOP BUTTON (Bottom Left) */}
      {showScrollTop && (
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-primary-container text-white shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      {/* GLOBAL FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 text-slate-600 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-200">
            <div className="md:col-span-4 space-y-4">
              <img src="/newlogo.png.jpg" alt="Rush Technomedia Logo" className="h-8 w-auto object-contain" />
              <p className="text-body-sm max-w-sm leading-relaxed text-slate-600">Your partner in digital innovation. We design, develop, and deliver transformative media and web experiences for the modern African market.</p>
              <p className="text-caption text-slate-500">RC-7434828</p>
              
              <div className="space-y-2 text-sm text-slate-600">
                <a href="https://maps.google.com/?q=Ososami+Rd,+Ibadan+200273,+Oyo+State,+Nigeria" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-container transition-colors w-fit">
                  <MapPin className="w-4 h-4 flex-shrink-0" /> Ososami Rd, Ibadan 200273, Oyo State, Nigeria
                </a>
                <a href="tel:+2348108031437" className="flex items-center gap-2 hover:text-primary-container transition-colors w-fit">
                  <Phone className="w-4 h-4 flex-shrink-0" /> +234 810 803 1437
                </a>
                <a href="mailto:hello@rushtechnomedia.com" className="flex items-center gap-2 hover:text-primary-container transition-colors w-fit">
                  <Mail className="w-4 h-4 flex-shrink-0" /> hello@rushtechnomedia.com
                </a>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center hover:scale-110 transition-transform"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><Instagram className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Footer Solutions: Now contains ALL 6 */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-label-md text-slate-900 font-bold">Solutions</p>
              <ul className="space-y-2 text-body-sm">
                {serviceLinks.map((link) => (
                  <li key={link.slug}>
                    <Link href={`/solutions/${link.slug}`} className="text-slate-600 hover:text-primary-container transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <p className="text-label-md text-slate-900 font-bold">Company</p>
              <ul className="space-y-2 text-body-sm">
                <li><Link href="/#about" className="text-slate-600 hover:text-primary-container transition-colors">About Rush</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-primary-container transition-colors">Careers</Link></li>
                <li><Link href="/#portal" className="text-slate-600 hover:text-primary-container transition-colors">Client Portal</Link></li>
                <li><Link href="/#kickoff" className="text-slate-600 hover:text-primary-container transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <p className="text-label-md text-slate-900 font-bold">Technomedia Dispatch</p>
              <p className="text-body-sm text-slate-600">Bi-weekly engineering memos and generative media insights read by 24,000+ tech leaders.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input name="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter work email" disabled={subStatus === "loading" || subStatus === "success"} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-body-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary-container focus:bg-white transition-colors disabled:opacity-50" />
                <button type="submit" disabled={subStatus === "loading" || subStatus === "success"} className="px-4 py-2 bg-primary-container text-white text-body-sm font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">{subStatus === "loading" ? "..." : subStatus === "success" ? "✓" : "Subscribe"}</button>
              </form>
            </div>
          </div>

          {/* Extreme Footer: Dark Blue Background */}
          <div className="w-full bg-surface-container border-t border-outline-variant/20 mt-12 -mx-6 -mb-16 px-6 md:px-12 py-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm text-on-surface-variant">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                <p>© 2026 Rush Technomedia LTD</p>
                <p className="hidden sm:inline">•</p>
                <p>All rights reserved.</p>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* WHATSAPP BUTTON (Bottom Right) */}
      <a href="https://wa.me/2348108031437" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-3 pr-4 py-3 rounded-full shadow-[0_8px_30px_-4px_rgba(37,211,102,0.6)] hover:scale-105 hover:shadow-[0_12px_40px_-4px_rgba(37,211,102,0.8)] transition-all duration-300 group">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="font-semibold text-sm hidden group-hover:inline-block transition-all duration-300">Chat with us</span>
      </a>
    </>
  );
}
