import { getMmfcProductBySlug, getPublicMmfcProducts } from '@/lib/db/queries-mmfc';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, Package, Download, GitBranch, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export async function generateStaticParams() {
  const products = await getPublicMmfcProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getMmfcProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | Patrick Farrell`,
    description: product.description || `Buy ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || '',
      images: (product.featuredImageUrl || product.coverImage) ? [product.featuredImageUrl || product.coverImage || ''] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getMmfcProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = product.images as any[] || [];
  const displayImages = [
    // Use featuredImageUrl if available, otherwise use coverImage
    ...(product.featuredImageUrl ? [{ url: product.featuredImageUrl, alt: product.featuredImageAlt || product.title }] :
        product.coverImage ? [{ url: product.coverImage, alt: product.title }] : []),
    ...images
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      {/* Back Button */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="text-[#4a9fd8] hover:underline flex items-center gap-2">
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {displayImages.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl">
                  <img
                    src={displayImages[0].url}
                    alt={displayImages[0].alt || product.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
                {displayImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {displayImages.slice(1, 5).map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.url}
                          alt={image.alt || `${product.title} - Image ${index + 2}`}
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-brand-primary/10 to-blue-600/10 rounded-2xl flex items-center justify-center h-96 border-2 border-dashed border-brand-primary/30">
                <Package className="w-24 h-24 text-brand-primary/50" />
              </div>
            )}

            {product.videoUrl && (
              <div className="mt-6">
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <video controls className="w-full">
                    <source src={product.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <p className="text-5xl font-bold text-[#4a9fd8]">
                  ${product.salePrice || product.price}
                </p>
                {product.salePrice && (
                  <>
                    <p className="text-2xl text-gray-500 line-through">${product.price}</p>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SAVE {Math.round(((parseFloat(product.price || '0') - parseFloat(product.salePrice || '0')) / parseFloat(product.price || '1')) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <a
                href={product.checkoutUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button size="lg" className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8] text-lg py-6">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <p className="text-sm text-gray-500 text-center mt-2">
                Secure checkout powered by Make Money from Coding
              </p>
            </div>

            {/* Features */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">What's Included</h3>
                <div className="space-y-3">
                  {product.hasFiles && (
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-[#4a9fd8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Downloadable Files</p>
                        <p className="text-sm text-gray-600">{product.fileCount} file(s) included</p>
                      </div>
                    </div>
                  )}
                  {product.hasRepository && (
                    <div className="flex items-start gap-3">
                      <GitBranch className="w-5 h-5 text-[#4a9fd8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Git Repository Access</p>
                        <p className="text-sm text-gray-600">Clone and modify the source code</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4a9fd8] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Instant Access</p>
                      <p className="text-sm text-gray-600">Get started immediately after purchase</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4a9fd8] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Lifetime Updates</p>
                      <p className="text-sm text-gray-600">Free updates and improvements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-lg mb-3">About This Product</h3>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
