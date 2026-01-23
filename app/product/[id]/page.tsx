import Header from '@/app/components/Header'
import ProductDetails from '@/app/productdetails'
import { Metadata } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Script from 'next/script'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    await dbConnect()
    const { id } = await params
    const product = await Product.findById(id).lean()

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for could not be found.',
      }
    }

    const productName = product.name
    const category = product.category
    const price = `₦${product.price.toLocaleString()}`
    const firstImage = product.images[0] || '/og.jpg'

    return {
      title: `${productName} - ${category}`,
      description: `${product.description.substring(0, 155)}... | ${price} | Shop at Bikudiratillah, Ibadan's premium Islamic modest fashion store.`,
      keywords: [
        productName,
        category,
        `${category} Nigeria`,
        `${category} Ibadan`,
        'Islamic clothing',
        'modest fashion',
        'Bikudiratillah',
      ],
      openGraph: {
        title: `${productName} | Bikudiratillah`,
        description: `${product.description.substring(0, 155)}... | ${price}`,
        type: 'website',
        url: `https://bikudiratillah.com/product/${id}`,
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} | Bikudiratillah`,
        description: `${product.description.substring(0, 155)}...`,
        images: [firstImage],
      },
      alternates: {
        canonical: `/product/${id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Bikudiratillah | Islamic Modest Fashion',
      description: 'Shop quality abayas, jalabiyas, hijabs and Islamic modest wear in Ibadan.',
    }
  }
}

async function getProductStructuredData(productId: string) {
  try {
    await dbConnect()
    const product = await Product.findById(productId).lean()

    if (!product) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      brand: {
        '@type': 'Brand',
        name: 'Bikudiratillah',
      },
      offers: {
        '@type': 'Offer',
        url: `https://bikudiratillah.com/product/${productId}`,
        priceCurrency: 'NGN',
        price: product.price,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Bikudiratillah',
        },
      },
      category: product.category,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '1',
      },
    }
  } catch (error) {
    console.error('Error generating structured data:', error)
    return null
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const structuredData = await getProductStructuredData(id)

  return (
    <>
      {structuredData && (
        <Script
          id="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <main className="min-h-screen bg-background">
        <Header />
        <ProductDetails productId={id} />
      </main>
    </>
  )
}