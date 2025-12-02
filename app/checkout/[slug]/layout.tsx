import { Metadata } from 'next';
import { getDashboardProductBySlug } from '@/lib/db/queries-dashboard-products';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDashboardProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Oceoluxe',
      description: 'The product you are looking for could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.oceoluxe.com';

  // Use SEO fields if available, fallback to product name/description
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.shortDescription || product.description?.slice(0, 160);

  // Open Graph fields with fallbacks
  const ogTitle = product.ogTitle || product.seoTitle || product.name;
  const ogDescription = product.ogDescription || product.seoDescription || product.shortDescription || product.description?.slice(0, 200);
  const ogImage = product.ogImageUrl || product.coverImageUrl;

  return {
    title: `${title} | Oceoluxe`,
    description: description || undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription || undefined,
      url: `${baseUrl}/checkout/${slug}`,
      siteName: 'Oceoluxe',
      type: 'website',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    other: {
      'og:price:amount': String(product.priceInCents / 100),
      'og:price:currency': product.currency?.toUpperCase() || 'USD',
    },
  };
}

export default function CheckoutLayout({ children }: Props) {
  return children;
}
