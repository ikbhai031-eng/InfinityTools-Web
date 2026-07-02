
import { MetadataRoute } from 'next'
import { TOOLS, CATEGORIES } from '@/lib/tools-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://infinitytools.com'

  const toolUrls = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categories/${cat.id.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const staticUrls = [
    '',
    '/about-us',
    '/contact-us',
    '/privacy-policy',
    '/terms-of-service',
    '/link-directory',
    '/categories',
    '/dashboard'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }))

  return [...staticUrls, ...toolUrls, ...categoryUrls]
}
