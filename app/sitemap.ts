import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rushtechnomedia.com'

  // Fetch blog posts from Supabase
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .order('created_at', { ascending: false })

  // 1. Homepage
  const homeRoute = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 1,
  }

  // 2. Solutions Pages
  const solutionSlugs = [
    'website-and-app-development', 'ecommerce-solutions', 'digital-marketing',
    'creative-design-and-branding', 'media-publications', 'ai-and-it-solutions'
  ]
  const solutionRoutes = solutionSlugs.map(slug => ({
    url: `${baseUrl}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 3. Blog Posts
  const blogRoutes = (posts || []).map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [homeRoute, ...solutionRoutes, ...blogRoutes]
}
