import Link from 'next/link';
import Image from 'next/image';

interface RecommendedProduct {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  price: string;
  href: string;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-[#967F71]/10 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-[#3B3937] mb-8">From the Shop</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group block"
            >
              <article className="flex gap-4">
                {product.coverImageUrl && (
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative bg-[#f5f0ea]">
                    <Image
                      src={product.coverImageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      quality={75}
                    />
                  </div>
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs text-[#CDA7B2] font-medium uppercase tracking-wider">
                    {product.price}
                  </p>
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
    </section>
  );
}
