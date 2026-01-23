import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://bikudiratillah.com' // Update this for client projects

    try {
        // Fetch all products from database
        await dbConnect()
        const products = await Product.find({}).select('_id updatedAt').lean()

        // Generate product URLs dynamically
        const productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${product._id}`,
            lastModified: product.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        // Static pages
        const staticPages = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1.0,
            },
            {
                url: `${baseUrl}/marketplace`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/products`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            },
            {
                url: `${baseUrl}/cart`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            },
            {
                url: `${baseUrl}/checkout`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            },
        ]

        return [...staticPages, ...productUrls]
    } catch (error) {
        console.error('Error generating sitemap:', error)

        // Fallback to static pages only if database fails
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1.0,
            },
            {
                url: `${baseUrl}/marketplace`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            },
        ]
    }
}
