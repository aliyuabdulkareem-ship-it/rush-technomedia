import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Hide your CMS dashboard from Google!
    },
    sitemap: 'https://rushtechnomedia.com/sitemap.xml',
  }
}
