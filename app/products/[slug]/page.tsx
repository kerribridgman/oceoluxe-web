import { getNotionProductBySlug, getPublicNotionProducts } from '@/lib/db/queries-notion-products';
import { getDashboardProductBySlug, getPublicDashboardProducts } from '@/lib/db/queries-dashboard-products';
import { getNotionProductPriceConfig, isFreeNotionProduct } from '@/lib/config/notion-product-prices';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { ProductMarkdownRenderer } from '@/components/products/product-markdown-renderer';
import { ProductAddToCart } from '@/components/product';
import { FreeProductClaimForm } from '@/components/products/free-product-claim-form';

// Revalidate every 60 seconds to ensure products are up-to-date
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const [notionProducts, dashboardProducts] = await Promise.all([
      getPublicNotionProducts(),
      getPublicDashboardProducts(),
    ]);

    const notionSlugs = notionProducts.map((product) => ({
      slug: product.slug,
    }));

    const dashboardSlugs = dashboardProducts.map((product) => ({
      slug: product.slug,
    }));

    return [...notionSlugs, ...dashboardSlugs];
  } catch (error) {
    console.error('Error generating static params for products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Check dashboard products first
  const dashboardProduct = await getDashboardProductBySlug(slug);
  if (dashboardProduct) {
    return {
      title: `${dashboardProduct.name} | Oceo Luxe`,
      description: dashboardProduct.shortDescription || dashboardProduct.description || `Discover ${dashboardProduct.name}`,
      openGraph: {
        title: dashboardProduct.name,
        description: dashboardProduct.shortDescription || dashboardProduct.description || '',
        images: dashboardProduct.coverImageUrl ? [dashboardProduct.coverImageUrl] : [],
      },
    };
  }

  // Fall back to Notion products
  const product = await getNotionProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | Oceo Luxe`,
    description: product.description || product.excerpt || `Discover ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || product.excerpt || '',
      images: product.coverImageUrl ? [product.coverImageUrl] : [],
    },
  };
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Check dashboard products first
  const dashboardProduct = await getDashboardProductBySlug(slug);

  if (dashboardProduct) {
    // Render dashboard product with Add to Cart
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <MarketingHeader />

        {/* Back Button */}
        <div className="bg-[#faf8f5] border-b border-[#967F71]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/products" className="text-[#CDA7B2] hover:text-[#BD97A2] flex items-center gap-2 font-light text-sm">
              ← Back to Products
            </Link>
          </div>
        </div>

        {/* Product Detail - Horizontal Layout */}
        <section className="bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image - Left Side */}
              <div className="sticky top-24">
                {dashboardProduct.coverImageUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-[#967F71]/10 shadow-lg bg-white">
                    <div className="relative aspect-square">
                      <Image
                        src={dashboardProduct.coverImageUrl}
                        alt={dashboardProduct.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#CDA7B2]/10 to-[#967F71]/10 rounded-2xl flex items-center justify-center aspect-square border border-[#CDA7B2]/20">
                    <Package className="w-24 h-24 text-[#CDA7B2]/50" />
                  </div>
                )}
              </div>

              {/* Product Info - Right Side */}
              <div className="space-y-6">
                {/* Category Badge */}
                {dashboardProduct.productType && (
                  <span className="inline-block bg-[#967F71]/10 text-[#967F71] px-3 py-1 rounded-full text-sm font-medium">
                    {dashboardProduct.productType === 'one_time' ? 'Digital Product' : 'Subscription'}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-serif font-light text-[#3B3937]">
                  {dashboardProduct.name}
                </h1>

                {/* Short Description */}
                {dashboardProduct.shortDescription && (
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    {dashboardProduct.shortDescription}
                  </p>
                )}

                {/* Add to Cart Section */}
                <ProductAddToCart
                  product={{
                    id: dashboardProduct.id,
                    productSource: 'dashboard',
                    slug: dashboardProduct.slug,
                    name: dashboardProduct.name,
                    priceInCents: dashboardProduct.priceInCents,
                    coverImageUrl: dashboardProduct.coverImageUrl,
                    productType: dashboardProduct.productType as 'one_time' | 'subscription' || 'one_time',
                  }}
                  priceDisplay={formatPrice(dashboardProduct.priceInCents)}
                />

                {/* Features Card */}
                <Card className="border-[#EDEBE8] bg-white/50 mt-8">
                  <CardContent className="pt-6">
                    <h3 className="font-serif font-light text-lg mb-4 text-[#3B3937]">What's Included</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[#3B3937]">Instant Access</p>
                          <p className="text-sm text-[#967F71] font-light">Get started immediately after purchase</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[#3B3937]">Lifetime Updates</p>
                          <p className="text-sm text-[#967F71] font-light">Free updates and improvements</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[#3B3937]">Support Included</p>
                          <p className="text-sm text-[#967F71] font-light">Get help when you need it</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Full Description */}
            {dashboardProduct.description && (
              <div className="mt-16 max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-6">About This Product</h2>
                  <div className="text-[#967F71] font-light leading-relaxed whitespace-pre-wrap">
                    {dashboardProduct.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <MarketingFooter />
      </div>
    );
  }

  // Fall back to Notion product
  const product = await getNotionProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Check if product is free
  const isFree = !product.price ||
    product.price.toLowerCase() === 'free' ||
    product.price === '$0' ||
    product.price === '0';

  // Check if this product has Stripe checkout configured (paid products)
  const priceConfig = getNotionProductPriceConfig(slug);
  const hasPaidCheckout = !!priceConfig && !isFree;

  // Check if this is a configured free product (can be added to cart)
  const isConfiguredFreeProduct = isFreeNotionProduct(slug);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Back Button */}
      <div className="bg-[#faf8f5] border-b border-[#967F71]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="text-[#CDA7B2] hover:text-[#BD97A2] flex items-center gap-2 font-light text-sm">
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Product Detail - Horizontal Layout */}
      <section className="bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image - Left Side */}
            <div className="sticky top-24">
              {product.coverImageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-[#967F71]/10 shadow-lg bg-white">
                  <div className="relative aspect-square">
                    <Image
                      src={product.coverImageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#CDA7B2]/10 to-[#967F71]/10 rounded-2xl flex items-center justify-center aspect-square border border-[#CDA7B2]/20">
                  <Package className="w-24 h-24 text-[#CDA7B2]/50" />
                </div>
              )}
            </div>

            {/* Product Info - Right Side */}
            <div className="space-y-6">
              {/* Category/Type Badges */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <span className="bg-[#CDA7B2]/10 text-[#CDA7B2] px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
                {product.productType && (
                  <span className="bg-[#967F71]/10 text-[#967F71] px-3 py-1 rounded-full text-sm font-medium">
                    {product.productType}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif font-light text-[#3B3937]">
                {product.title}
              </h1>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  {isFree ? (
                    <p className="text-3xl font-serif font-light text-[#CDA7B2]">Free</p>
                  ) : (
                    <>
                      <p className="text-3xl font-serif font-light text-[#3B3937]">
                        {product.salePrice || product.price}
                      </p>
                      {product.salePrice && product.price && (
                        <p className="text-xl text-[#967F71] line-through font-light">{product.price}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {(product.description || product.excerpt) && (
                <p className="text-lg text-[#967F71] font-light leading-relaxed">
                  {product.description || product.excerpt}
                </p>
              )}

              {/* Add to Cart for PAID products with price config */}
              {hasPaidCheckout && (
                <ProductAddToCart
                  product={{
                    id: product.id,
                    productSource: 'notion',
                    slug: product.slug,
                    name: product.title,
                    priceInCents: priceConfig!.priceInCents,
                    coverImageUrl: product.coverImageUrl || undefined,
                    productType: 'one_time',
                  }}
                  priceDisplay={formatPrice(priceConfig!.priceInCents)}
                />
              )}

              {/* Free product claim form */}
              {isConfiguredFreeProduct && (
                <FreeProductClaimForm
                  productSlug={product.slug}
                  productName={product.title}
                />
              )}

              {/* External checkout for products without cart config */}
              {!hasPaidCheckout && !isConfiguredFreeProduct && (
                <div className="space-y-3 pt-4">
                  {product.checkoutUrl && (
                    <a
                      href={product.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button size="lg" className="w-full bg-[#CDA7B2] hover:bg-[#c49aa5] text-white text-lg py-6">
                        {isFree ? 'Get It Now' : 'Buy Now'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  )}
                  {product.previewUrl && (
                    <a
                      href={product.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button size="lg" variant="outline" className="w-full border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white text-lg py-6">
                        <Eye className="w-5 h-5 mr-2" />
                        Preview
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Features Card */}
              <Card className="border-[#EDEBE8] bg-white/50 mt-4">
                <CardContent className="pt-6">
                  <h3 className="font-serif font-light text-lg mb-4 text-[#3B3937]">What's Included</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#3B3937]">Instant Access</p>
                        <p className="text-sm text-[#967F71] font-light">Get started immediately after purchase</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#3B3937]">Lifetime Updates</p>
                        <p className="text-sm text-[#967F71] font-light">Free updates and improvements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#3B3937]">Support Included</p>
                        <p className="text-sm text-[#967F71] font-light">Get help when you need it</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Content (Markdown from Notion) */}
          {product.content && (
            <div className="mt-16 max-w-4xl mx-auto">
              <ProductMarkdownRenderer content={product.content} />
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
