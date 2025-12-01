import { getNotionProductBySlug, getPublicNotionProducts } from '@/lib/db/queries-notion-products';
import { getDashboardProductBySlug, getPublicDashboardProducts } from '@/lib/db/queries-dashboard-products';
import { getNotionProductPriceConfig, hasStripeCheckout } from '@/lib/config/notion-product-prices';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, CheckCircle, Package, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { ProductMarkdownRenderer } from '@/components/products/product-markdown-renderer';
import { NotionProductCheckout } from '@/components/checkout/notion-product-checkout';

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

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Check dashboard products first - redirect to checkout if found
  const dashboardProduct = await getDashboardProductBySlug(slug);
  if (dashboardProduct) {
    redirect(`/checkout/${slug}`);
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

  // Check if this product has Stripe checkout configured
  const priceConfig = getNotionProductPriceConfig(slug);
  const hasInlineCheckout = !!priceConfig && !isFree;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Back Button */}
      <div className="bg-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="text-[#CDA7B2] hover:text-[#BD97A2] flex items-center gap-2 font-light">
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              {product.coverImageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-[#967F71]/20 shadow-xl">
                  <img
                    src={product.coverImageUrl}
                    alt={product.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#CDA7B2]/10 to-[#967F71]/10 rounded-2xl flex items-center justify-center h-96 border-2 border-dashed border-[#CDA7B2]/30">
                  <Package className="w-24 h-24 text-[#CDA7B2]/50" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category/Type Badge */}
              {(product.category || product.productType) && (
                <div className="flex gap-2 mb-4">
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
              )}

              <h1 className="text-4xl font-serif font-light text-[#3B3937] mb-4">{product.title}</h1>

              {/* Price */}
              <div className="mb-6">
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

              {/* CTA Buttons or Inline Checkout */}
              <div className="mb-8">
                {hasInlineCheckout ? (
                  /* Inline Stripe Checkout */
                  <NotionProductCheckout
                    productSlug={slug}
                    productTitle={product.title}
                    priceInCents={priceConfig!.priceInCents}
                  />
                ) : (
                  /* External Links */
                  <div className="space-y-3">
                    {product.checkoutUrl && (
                      <a
                        href={product.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button size="lg" className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white text-lg py-6">
                          <ShoppingCart className="w-5 h-5 mr-2" />
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
                        <Button size="lg" variant="outline" className="w-full border-[#CDA7B2] text-[#CDA7B2] hover:bg-[#CDA7B2] hover:text-white text-lg py-6">
                          <Eye className="w-5 h-5 mr-2" />
                          Preview
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <Card className="border-[#EDEBE8] bg-[#F5F3F0]">
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
