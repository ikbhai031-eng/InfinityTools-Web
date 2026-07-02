
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login', '/dashboard/settings'],
    },
    sitemap: 'https://infinitytools.com/sitemap.xml',
  }
}
