import { getPublicNotionProducts } from '@/lib/db/queries-notion-products';
import { getPublicDashboardProducts } from '@/lib/db/queries-dashboard-products';
import { fetchAdharaProducts } from '@/lib/adhara';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('products');
}

// Revalidate every 60 seconds to ensure products are up-to-date
export const revalidate = 60;

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default async function ProductsPage() {
  let notionProducts: Awaited<ReturnType<typeof getPublicNotionProducts>> = [];
  let dashboardProducts: Awaited<ReturnType<typeof getPublicDashboardProducts>> = [];

  try {
    [notionProducts, dashboardProducts] = await Promise.all([
      getPublicNotionProducts(),
      getPublicDashboardProducts(),
    ]);
  } catch (error) {
    console.error('Error loading products:', error);
  }

  // Adhara is the primary product source when NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG is set.
  // Falls back to Notion + Dashboard products if not configured.
  const adharaProducts = await fetchAdharaProducts();

  // Use Adhara products if available; otherwise fall back to Notion products from DB
  type ProductItem = {
    id: string | number;
    slug: string;
    title: string;
    description: string | null | undefined;
    price: string | null | undefined;
    salePrice: string | null | undefined;
    coverImageUrl: string | null | undefined;
  };
  const products: ProductItem[] = adharaProducts.length > 0
    ? adharaProducts
    : notionProducts;

  const isFreeProduct = (p: ProductItem) => {
    if (!p.price) return true;
    const priceStr = p.price.toLowerCase();
    return priceStr === 'free' || priceStr === '$0' || priceStr === '0' || p.title.toLowerCase().includes('free');
  };

  const freeProducts = products.filter(isFreeProduct);
  const paidProducts = products.filter(p => !isFreeProduct(p));

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 relative">
          {/* Decorative circles */}
          <div
            className="absolute top-8 right-0 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 -left-16 w-14 h-14 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-4 -left-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-12 right-12 w-12 h-12 rounded-full bg-[#967F71] opacity-10 animate-float hidden lg:block"
            aria-hidden="true"
          />

          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Products
          </p>
          <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.15] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Notion templates and resources to streamline your fashion business.
          </h1>
        </div>
      </section>

      {/* Products */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          {products.length === 0 && dashboardProducts.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-light text-[#3B3937] mb-2">No products yet</h2>
              <p className="text-[#967F71] font-light">Check back soon for new templates and resources.</p>
            </div>
          ) : (
            <>
              {/* Free Products */}
              {freeProducts.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xl font-medium text-[#3B3937] mb-8 tracking-tight">Free Resources</h2>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {freeProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                        <article className="flex gap-4">
                          {product.coverImageUrl && (
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative bg-[#f5f0ea]">
                              <Image
                                src={product.coverImageUrl}
                                alt={product.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                                quality={75}
                              />
                            </div>
                          )}
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className="text-xs text-[#CDA7B2] font-medium uppercase tracking-wider">Free</p>
                            <h3 className="text-base font-medium text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors leading-snug">
                              {product.title}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-[#967F71] font-light leading-relaxed line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Paid Products */}
              {paidProducts.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xl font-medium text-[#3B3937] mb-8 tracking-tight">Notion Templates</h2>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {paidProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                        <article className="flex gap-4">
                          {product.coverImageUrl && (
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative bg-[#f5f0ea]">
                              <Image
                                src={product.coverImageUrl}
                                alt={product.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                                quality={75}
                              />
                            </div>
                          )}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-[#CDA7B2] font-medium uppercase tracking-wider">{product.salePrice || product.price}</p>
                              {product.salePrice && (
                                <p className="text-xs text-[#967F71] line-through font-light">{product.price}</p>
                              )}
                            </div>
                            <h3 className="text-base font-medium text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors leading-snug">
                              {product.title}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-[#967F71] font-light leading-relaxed line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Dashboard Products */}
              {dashboardProducts.length > 0 && (
                <div>
                  <h2 className="text-xl font-medium text-[#3B3937] mb-8 tracking-tight">Digital Products</h2>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {dashboardProducts.map((product) => (
                      <Link key={product.id} href={`/checkout/${product.slug}`} className="group block">
                        <article className="flex gap-4">
                          {product.coverImageUrl && (
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative bg-[#f5f0ea]">
                              <Image
                                src={product.coverImageUrl}
                                alt={product.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                                quality={75}
                              />
                            </div>
                          )}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-[#CDA7B2] font-medium uppercase tracking-wider">{formatPrice(product.priceInCents)}</p>
                              {product.productType === 'subscription' && (
                                <p className="text-xs text-[#967F71] font-light">/month</p>
                              )}
                            </div>
                            <h3 className="text-base font-medium text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors leading-snug">
                              {product.name}
                            </h3>
                            {product.shortDescription && (
                              <p className="text-sm text-[#967F71] font-light leading-relaxed line-clamp-2">
                                {product.shortDescription}
                              </p>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
            Need something custom?
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-6 tracking-tight">
            We create custom Notion templates tailored to your business.
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light">
            Get workflows designed specifically for how you work.
          </p>
          <Link href="/work-with-oceo-luxe">
            <Button
              size="lg"
              className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
            >
              Explore Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
