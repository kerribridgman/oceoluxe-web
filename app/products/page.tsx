import { getPublicNotionProducts } from '@/lib/db/queries-notion-products';
import { getPublicDashboardProducts } from '@/lib/db/queries-dashboard-products';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart, Download, Gift, Sparkles } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export const metadata = {
  title: 'Products | Oceo Luxe',
  description: 'Notion templates, digital products, and resources for fashion entrepreneurs and creative founders',
};

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
    // Continue with empty products array to show "No Products Yet" message
  }

  // For backwards compatibility, keep using the notion products variable name
  const products = notionProducts;

  // Separate free and paid products - check for "Free", "$0", or no price
  const isFreeProduct = (p: typeof products[0]) => {
    if (!p.price) return true;
    const priceStr = p.price.toLowerCase();
    return priceStr === 'free' || priceStr === '$0' || priceStr === '0' || p.title.toLowerCase().includes('free');
  };

  const freeProducts = products.filter(isFreeProduct);
  const paidProducts = products.filter(p => !isFreeProduct(p));

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Header */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-light text-[#3B3937] mb-4">Products & Templates</h1>
          <p className="text-lg text-[#967F71] max-w-2xl font-light leading-relaxed">
            Notion templates, digital products, and resources to streamline your fashion business operations
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <div className="bg-[#faf8f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 && dashboardProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-[#967F71] mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-2">No Products Yet</h2>
              <p className="text-[#967F71] font-light">Check back soon for new templates and resources!</p>
            </div>
          ) : (
            <>
              {/* Free Products Section */}
              {freeProducts.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Gift className="w-8 h-8 text-[#CDA7B2]" />
                    <h2 className="text-3xl font-serif font-light text-[#3B3937]">Free Resources</h2>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {freeProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group">
                        <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#EDEBE8] bg-[#F5F3F0] hover:border-[#CDA7B2]">
                          {product.coverImageUrl && (
                            <div className="relative h-56 overflow-hidden bg-[#faf8f5]">
                              <img
                                src={product.coverImageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-4 right-4 bg-[#CDA7B2] text-white px-3 py-1 rounded-full text-sm font-medium">
                                FREE
                              </div>
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="text-2xl line-clamp-2 group-hover:text-[#CDA7B2] transition-colors font-serif font-light">
                              {product.title}
                            </CardTitle>
                            {product.description && (
                              <CardDescription className="line-clamp-3 text-base text-[#967F71] font-light">
                                {product.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-3xl font-serif font-light text-[#CDA7B2]">
                                  Free
                                </p>
                              </div>
                              <Button className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white">
                                Get Now
                                <Download className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                            {product.productType && (
                              <div className="mt-4 pt-4 border-t border-[#967F71]/10">
                                <p className="text-sm text-[#967F71] font-light">
                                  <span className="font-medium">Type:</span> {product.productType}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Paid Products Section */}
              {paidProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <ShoppingCart className="w-8 h-8 text-[#CDA7B2]" />
                    <h2 className="text-3xl font-serif font-light text-[#3B3937]">Premium Products</h2>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {paidProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group">
                        <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#EDEBE8] bg-[#F5F3F0] hover:border-[#CDA7B2]">
                          {product.coverImageUrl && (
                            <div className="relative h-56 overflow-hidden bg-[#faf8f5]">
                              <img
                                src={product.coverImageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="text-2xl line-clamp-2 group-hover:text-[#CDA7B2] transition-colors font-serif font-light">
                              {product.title}
                            </CardTitle>
                            {product.description && (
                              <CardDescription className="line-clamp-3 text-base text-[#967F71] font-light">
                                {product.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-3xl font-serif font-light text-[#3B3937]">
                                  {product.salePrice || product.price}
                                </p>
                                {product.salePrice && (
                                  <p className="text-sm text-[#967F71] line-through font-light">
                                    {product.price}
                                  </p>
                                )}
                              </div>
                              <Button className="bg-[#3B3937] hover:bg-[#4A4745] text-white">
                                View Details
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                            {product.productType && (
                              <div className="mt-4 pt-4 border-t border-[#967F71]/10">
                                <p className="text-sm text-[#967F71] font-light">
                                  <span className="font-medium">Type:</span> {product.productType}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dashboard Products Section */}
      {dashboardProducts.length > 0 && (
        <div className="bg-[#faf8f5] pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-[#CDA7B2]" />
              <h2 className="text-3xl font-serif font-light text-[#3B3937]">Digital Products</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {dashboardProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/checkout/${product.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#EDEBE8] bg-[#F5F3F0] hover:border-[#CDA7B2]">
                    {product.coverImageUrl && (
                      <div className="relative h-56 overflow-hidden bg-[#faf8f5]">
                        <img
                          src={product.coverImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.productType === 'subscription' && (
                          <div className="absolute top-4 right-4 bg-[#3B3937] text-white px-3 py-1 rounded-full text-sm font-medium">
                            Subscription
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl line-clamp-2 group-hover:text-[#CDA7B2] transition-colors font-serif font-light">
                        {product.name}
                      </CardTitle>
                      {product.shortDescription && (
                        <CardDescription className="line-clamp-3 text-base text-[#967F71] font-light">
                          {product.shortDescription}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-serif font-light text-[#3B3937]">
                            {formatPrice(product.priceInCents)}
                          </p>
                          {product.productType === 'subscription' && (
                            <p className="text-sm text-[#967F71] font-light">/month</p>
                          )}
                        </div>
                        <Button className="bg-[#3B3937] hover:bg-[#4A4745] text-white">
                          {product.productType === 'subscription' ? 'Subscribe' : 'Buy Now'}
                          <ShoppingCart className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#f5f0ea] to-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-6">
            Need Something Custom?
          </h2>
          <p className="text-xl text-[#967F71] font-light mb-8 leading-relaxed">
            We create custom Notion templates and workflows tailored to your specific business needs
          </p>
          <Link href="/services">
            <Button size="lg" className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white text-lg px-8 h-14">
              Explore Custom Services
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
