import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const legalContent = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "October 31, 2026",
    content: `<p class="mb-4">At Rush Technomedia LTD (RC-7434828), we take your privacy seriously.</p><h3 class="text-lg font-bold text-on-surface mt-6 mb-2">1. Information We Collect</h3><p class="mb-4">We collect information you provide directly (e.g., name, email) and automated data (e.g., cookies) to improve our services.</p><h3 class="text-lg font-bold text-on-surface mt-6 mb-2">2. How We Use Your Data</h3><p class="mb-4">Data is used to communicate with you and send our newsletter (with easy opt-out). We do not sell your data.</p>`
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "October 31, 2026",
    content: `<p class="mb-4">Welcome to Rush Technomedia. By accessing our website, you agree to these terms.</p><h3 class="text-lg font-bold text-on-surface mt-6 mb-2">1. Services</h3><p class="mb-4">We provide web development, SEO consulting, and digital media services governed by separate Statements of Work.</p>`
  },
  cookies: {
    title: "Cookie Policy",
    lastUpdated: "October 31, 2026",
    content: `<p class="mb-4">This policy explains how Rush Technomedia uses cookies.</p><h3 class="text-lg font-bold text-on-surface mt-6 mb-2">1. What Are Cookies?</h3><p class="mb-4">Small text files stored on your device to remember preferences and analyze site traffic.</p>`
  }
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = legalContent[slug as keyof typeof legalContent];
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-fixed transition-colors mb-8 text-label-md">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-headline-lg text-on-surface mb-2">{page.title}</h1>
        <p className="text-caption text-outline uppercase tracking-wider mb-8">Last Updated: {page.lastUpdated}</p>
        <div className="prose prose-invert prose-headings:font-display prose-headings:text-on-surface prose-p:text-on-surface-variant prose-a:text-primary max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </main>
  );
}
