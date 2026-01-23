import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://bikudiratillah.com' // Update for client projects

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',           // Don't index API routes
                    '/admin/',         // Don't index admin dashboard
                    '/checkout/',      // Don't index checkout pages
                    '/cart/',          // Don't index cart pages
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/', '/checkout/', '/cart/'],
                crawlDelay: 0,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
