import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, ShoppingBag, Megaphone, Palette, Newspaper, Bot } from "lucide-react";

const solutionsData: Record<string, any> = {
  "website-and-app-development": { title: "Website & Application Development", icon: Globe, color: "bg-blue-500", featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGXyBSWAAlSJOTBZU_STe60Uiq924sbsXXOjuYD2Al1GIo_tJ1j8eA66ClO1KTF7vdEo840XuXhTI0VFzQ4fVMj9sKpCrO2qsg-uaXRpy6lmejCvy9QrNalY8nfMbmnaBLyj4zbxk-NnrgLd9eO9fXTDOF-pqpE-6s3iU-E3wB7Jt1lEPBGukIFYaO4uzjbnmNvvf0MlNwkPbvl1-PlHNyvAYuf8mk2lARXQCczvQy", tagline: "High-velocity digital experiences engineered for scale.", description: "We don't just build websites; we engineer digital assets. From lightning-fast corporate sites to complex, data-heavy web applications and native mobile apps, our development stack is optimized for sub-second latency, SEO dominance, and bulletproof security.", features: ["Custom Website Design & Development", "Progressive Web Applications (PWA)", "Native iOS & Android Mobile Apps", "Enterprise-grade Web Portals", "API Integration & Microservices"], mediaPartners: [] },
  "ecommerce-solutions": { title: "E-Commerce Solutions", icon: ShoppingBag, color: "bg-emerald-500", featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC35pYO9-YsLqstNwOSo1jCqS90DbXJsJr6bTSa5rEwvlYTqoGsrvVC-WA-irMqs0BZC3OVy5BtBmc1xX4nd-orqmKO_oZ2s5BIYU2-ghdLW4-jzmkQMNXhqhb4hAcrzeVfecKHGVzMFSDoJpkSbfJwvTqhOykKtyUPJnbjevA-IeoG2cT6XgVhgmI545NX7h0bNW2eQgPvT0M-e6ripxxosippnDQERrD4M6ncszC-", tagline: "Turn browsers into buyers with frictionless storefronts.", description: "Whether you need a custom Shopify build or a fully bespoke headless commerce architecture, we build online stores that convert. We integrate seamless payment gateways (Paystack, Flutterwave, Stripe), inventory management, and automated email flows to maximize your average order value.", features: ["Shopify & WooCommerce Development", "Custom Headless Commerce", "Payment Gateway Integration", "Inventory & CRM Automation", "Conversion Rate Optimization (CRO)"], mediaPartners: [] },
  "digital-marketing": { title: "Digital Marketing", icon: Megaphone, color: "bg-purple-500", featuredImage: "https://lh3.googleusercontent.com/aida/AEtjO1VUxqxWTheCKdKtDDAOBI_Ku18CcQMrVxuurCE72VDI1SFpHd5PvELQ_bdkCVLWwDeFIOvrX9bJJBQCn5RaXsqEesfO2zpHL_MvQGosY2cTXQeEccNQPalFBvVJV15D98aKwoviHRdFK4B_vB-3SNzxtgPdEJuy98AuMBKBlGJix1BMnwrBlNEZ0Txn13QQCrmndNL3djTKTRD9uaBPkg3nvT8G-sy0zdBbD6uMi3ip", tagline: "Data-driven campaigns that dominate your market.", description: "Visibility is currency. Our digital marketing frameworks combine technical SEO, high-ROAS paid advertising, and strategic email marketing to put your brand in front of the right audience at the exact moment they are ready to buy.", features: ["Search Engine Optimization (SEO)", "Social Media Marketing & Ads", "Email Marketing Automation", "Pay-Per-Click (PPC) Management", "Content Marketing Strategy"], mediaPartners: [] },
  "creative-design-and-branding": { title: "Creative Design & Branding", icon: Palette, color: "bg-pink-500", featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKuoa8TSKUZaD7__ApNBsYQ-mqptRELM3QbkfZogQsI10fTrjZNrb3K3CoDmwQZbbxC7-y6iuzYsW23ZLyLiNI_dzjD8etpz9UNOLUx1eKBT6G24iaY1SEVLZGnTowCoCu2mnrcY653Zy7fujYa3JkO2NRrUBbe1yy-mQMCeNwAChp9THYm8-TLIqU5GirXmlLbKarVuD06cedOx2MmZkEvG1apa6V5VoS4QWBBDbqIJBlkO2IKE_iUSMmg3un-ay0fSaYwpvC_S2NQA", tagline: "Identities that command authority and trust.", description: "Your brand is more than a logo; it's the psychological footprint you leave on your audience. We craft comprehensive brand identity systems—from logo design and typography to full brand guidelines—that ensure you look like the market leader you are.", features: ["Logo & Visual Identity Design", "Complete Brand Guidelines", "UI/UX Design Systems", "Marketing Collateral & Print", "Motion Graphics & 3D Assets"], mediaPartners: [] },
  "media-publications": { title: "Media Publications & Reputation", icon: Newspaper, color: "bg-orange-500", featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGXyBSWAAlSJOTBZU_STe60Uiq924sbsXXOjuYD2Al1GIo_tJ1j8eA66ClO1KTF7vdEo840XuXhTI0VFzQ4fVMj9sKpCrO2qsg-uaXRpy6lmejCvy9QrNalY8nfMbmnaBLyj4zbxk-NnrgLd9eO9fXTDOF-pqpE-6s3iU-E3wB7Jt1lEPBGukIFYaO4uzjbnmNvvf0MlNwkPbvl1-PlHNyvAYuf8mk2lARXQCczvQy", tagline: "Strategic visibility in Africa's top news outlets.", description: "We secure high-authority press coverage for your brand. Through our deep relationships with Nigeria's leading news platforms, we publish strategic interviews, press releases, and thought-leadership articles that build instant credibility and manage your online reputation.", features: ["Press Release Distribution", "Executive Interview Placements", "Online Reputation Management (ORM)", "Strategic News Coverage", "Crisis Communication Support"], mediaPartners: ["Punch", "Tribune", "Guardian", "The Nation", "BusinessDay", "Vanguard", "Daily Independent", "New Telegraph", "PMNews", "Sun News NG"] },
  "ai-and-it-solutions": { title: "AI & IT Solutions", icon: Bot, color: "bg-cyan-500", featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC35pYO9-YsLqstNwOSo1jCqS90DbXJsJr6bTSa5rEwvlYTqoGsrvVC-WA-irMqs0BZC3OVy5BtBmc1xX4nd-orqmKO_oZ2s5BIYU2-ghdLW4-jzmkQMNXhqhb4hAcrzeVfecKHGVzMFSDoJpkSbfJwvTqhOykKtyUPJnbjevA-IeoG2cT6XgVhgmI545NX7h0bNW2eQgPvT0M-e6ripxxosippnDQERrD4M6ncszC-", tagline: "Automate the mundane. Scale the exceptional.", description: "We integrate cutting-edge Artificial Intelligence into your business workflows. From custom AI chatbots and automated customer service agents to IT infrastructure consulting, we help you work smarter, faster, and with fewer overhead costs.", features: ["AI Automation Systems", "Custom AI Chatbots & Agents", "IT Infrastructure Consulting", "Cloud Architecture & Security", "Workflow Automation (Zapier/Make)"], mediaPartners: [] }
};

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutionsData[slug];
  if (!solution) notFound();
  
  const allSlugs = Object.keys(solutionsData);
  const otherSolutions = allSlugs.filter(s => s !== slug).map(s => solutionsData[s]);

  return (
    <>
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-surface-container border border-outline-variant/20 mb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <img src={solution.featuredImage} alt={solution.title} className="w-full h-[300px] md:h-[400px] object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${solution.color} flex items-center justify-center shadow-lg`}>
              <solution.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">{solution.title}</h1>
              <p className="text-lg md:text-xl text-tertiary font-medium">{solution.tagline}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface-container/40 border border-outline-variant/20 rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl font-display font-bold text-on-surface mb-4">Overview</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">{solution.description}</p>
              <h3 className="text-xl font-display font-bold text-on-surface mb-4">What We Deliver</h3>
              <ul className="space-y-3">
                {solution.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-on-surface-variant">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {solution.mediaPartners.length > 0 && (
              <div className="bg-surface-container/40 border border-outline-variant/20 rounded-3xl p-8 md:p-10">
                <h3 className="text-xl font-display font-bold text-on-surface mb-6 text-center">Featured In & Media Partners</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {solution.mediaPartners.map((partner: string, i: number) => (
                    <div key={i} className="flex items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-600 font-bold text-sm md:text-base text-center">{partner}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface-container/40 border border-outline-variant/20 rounded-3xl p-6">
              <h3 className="text-lg font-display font-bold text-on-surface mb-4">Explore Other Solutions</h3>
              <div className="space-y-3">
                {otherSolutions.map((other: any, i: number) => (
                  <Link key={i} href={`/solutions/${Object.keys(solutionsData).find(key => solutionsData[key].title === other.title)}`} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-primary-container/50 hover:shadow-md transition-all group">
                    <div className={`w-10 h-10 rounded-full ${other.color}/10 flex items-center justify-center flex-shrink-0`}>
                      <other.icon className={`w-5 h-5 ${other.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary-container truncate">{other.title}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-container group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
