import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Globe, Smartphone, ShoppingBag, Megaphone, Palette, Newspaper, ShieldCheck, Bot } from "lucide-react";

const solutionsData: Record<string, any> = {
  "website-and-app-development": { title: "Website & Application Development", icon: Globe, tagline: "High-velocity digital experiences engineered for scale.", description: "We don't just build websites; we engineer digital assets. From lightning-fast corporate sites to complex, data-heavy web applications and native mobile apps, our development stack is optimized for sub-second latency, SEO dominance, and bulletproof security.", features: ["Custom Website Design & Development", "Progressive Web Applications (PWA)", "Native iOS & Android Mobile Apps", "Enterprise-grade Web Portals", "API Integration & Microservices"], mediaPartners: [] },
  "ecommerce-solutions": { title: "E-Commerce Solutions", icon: ShoppingBag, tagline: "Turn browsers into buyers with frictionless storefronts.", description: "Whether you need a custom Shopify build or a fully bespoke headless commerce architecture, we build online stores that convert. We integrate seamless payment gateways (Paystack, Flutterwave, Stripe), inventory management, and automated email flows to maximize your average order value.", features: ["Shopify & WooCommerce Development", "Custom Headless Commerce", "Payment Gateway Integration", "Inventory & CRM Automation", "Conversion Rate Optimization (CRO)"], mediaPartners: [] },
  "digital-marketing": { title: "Digital Marketing", icon: Megaphone, tagline: "Data-driven campaigns that dominate your market.", description: "Visibility is currency. Our digital marketing frameworks combine technical SEO, high-ROAS paid advertising, and strategic email marketing to put your brand in front of the right audience at the exact moment they are ready to buy.", features: ["Search Engine Optimization (SEO)", "Social Media Marketing & Ads", "Email Marketing Automation", "Pay-Per-Click (PPC) Management", "Content Marketing Strategy"], mediaPartners: [] },
  "creative-design-and-branding": { title: "Creative Design & Branding", icon: Palette, tagline: "Identities that command authority and trust.", description: "Your brand is more than a logo; it's the psychological footprint you leave on your audience. We craft comprehensive brand identity systems—from logo design and typography to full brand guidelines—that ensure you look like the market leader you are.", features: ["Logo & Visual Identity Design", "Complete Brand Guidelines", "UI/UX Design Systems", "Marketing Collateral & Print", "Motion Graphics & 3D Assets"], mediaPartners: [] },
  "media-publications": { title: "Media Publications & Reputation", icon: Newspaper, tagline: "Strategic visibility in Africa's top news outlets.", description: "We secure high-authority press coverage for your brand. Through our deep relationships with Nigeria's leading news platforms, we publish strategic interviews, press releases, and thought-leadership articles that build instant credibility and manage your online reputation.", features: ["Press Release Distribution", "Executive Interview Placements", "Online Reputation Management (ORM)", "Strategic News Coverage", "Crisis Communication Support"], mediaPartners: ["Punch", "Tribune", "Guardian", "The Nation", "BusinessDay", "Vanguard", "Daily Independent", "New Telegraph", "PMNews", "Sun News NG"] },
  "ai-and-it-solutions": { title: "AI & IT Solutions", icon: Bot, tagline: "Automate the mundane. Scale the exceptional.", description: "We integrate cutting-edge Artificial Intelligence into your business workflows. From custom AI chatbots and automated customer service agents to IT infrastructure consulting, we help you work smarter, faster, and with fewer overhead costs.", features: ["AI Automation Systems", "Custom AI Chatbots & Agents", "IT Infrastructure Consulting", "Cloud Architecture & Security", "Workflow Automation (Zapier/Make)"], mediaPartners: [] }
};

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutionsData[slug];
  if (!solution) notFound();
  const allSlugs = Object.keys(solutionsData);
  const currentIndex = allSlugs.indexOf(slug);
  const nextSolution = solutionsData[allSlugs[(currentIndex + 1) % allSlugs.length]];

  return (
    <main className="min-h-screen bg-background text-on-surface font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-20">
          <Link href="/" className="flex items-center gap-3">
            <img src="/newlogo.png.jpeg" alt="Rush Technomedia" className="h-8 w-auto object-contain" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-white text-sm font-bold hover:brightness-110 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/20 text-primary mb-6"><solution.icon className="w-8 h-8" /></div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-on-surface mb-4 tracking-tight">{solution.title}</h1>
        <p className="text-xl text-tertiary font-medium">{solution.tagline}</p>
      </section>
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24">
        <div className="bg-surface-container/40 border border-outline-variant/20 rounded-3xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-display font-bold text-on-surface mb-4">Overview</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-8">{solution.description}</p>
          <h3 className="text-xl font-display font-bold text-on-surface mb-4">What We Deliver</h3>
          <ul className="space-y-3">{solution.features.map((feature: string, i: number) => (<li key={i} className="flex items-center gap-3 text-on-surface-variant"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />{feature}</li>))}</ul>
        </div>
        {solution.mediaPartners.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-display font-bold text-on-surface mb-6 text-center">Featured In & Media Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{solution.mediaPartners.map((partner: string, i: number) => (<div key={i} className="flex items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm"><span className="text-slate-600 font-bold text-sm md:text-base text-center">{partner}</span></div>))}</div>
          </div>
        )}
        <div className="border-t border-outline-variant/20 pt-12 text-center">
          <p className="text-caption text-outline uppercase tracking-wider mb-4">Explore Another Solution</p>
          <Link href={`/solutions/${allSlugs[(currentIndex + 1) % allSlugs.length]}`} className="inline-flex items-center gap-3 group">
            <div className="text-left"><p className="text-xs text-outline uppercase">Next Up</p><p className="text-lg font-display font-bold text-primary group-hover:underline">{nextSolution.title}</p></div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      <footer className="w-full bg-white border-t border-slate-200 text-slate-600">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 text-center">
          <img src="/newlogo.png.jpeg" alt="Rush Technomedia" className="h-8 w-auto object-contain mx-auto mb-4" />
          <p className="text-sm">© 2026 Rush Technomedia LTD. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
