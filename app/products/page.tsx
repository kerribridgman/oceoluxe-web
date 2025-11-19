import { getPublicMmfcProducts } from '@/lib/db/queries-mmfc';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart } from 'lucide-react';

export const metadata = {
  title: 'Products | Patrick Farrell',
  description: 'Digital products and services from Patrick Farrell',
};

export default async function ProductsPage() {
  const products = await getPublicMmfcProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navy-medium to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold mb-4">Products</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Digital products, tools, and services to help you build and grow your business
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Products Yet</h2>
            <p className="text-gray-600">Check back soon for new products and services!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-brand-primary">
                  {product.featuredImageUrl && (
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img
                        src={product.featuredImageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.salePrice && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          SALE
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-brand-primary">
                          ${product.salePrice || product.price}
                        </p>
                        {product.salePrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.price}
                          </p>
                        )}
                      </div>
                      <Button className="bg-brand-primary hover:bg-brand-primary/90">
                        View Details
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    {product.deliveryType && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Delivery:</span>{' '}
                          {product.deliveryType === 'download' && 'Instant Download'}
                          {product.deliveryType === 'repository' && 'Git Repository Access'}
                          {product.deliveryType === 'service' && 'Service / Consultation'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
