import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

export async function generateMetadata() {
  return await getPageMetadata('studio-systems');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Studio Systems', url: `${baseUrl}/studio-systems` },
]);

export default async function StudioSystemsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] animate-fade-in-up">
                Studio Systems
              </p>
              <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight animate-fade-in-up">
                Operational Systems Designed for Independent Fashion Brands
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-fade-in-up">
                These systems reflect real-world production leadership, not generic digital templates. Built from the same frameworks used in private partnerships, now available as an ongoing membership for brands ready to operate with precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in-up">
                <Link href="/studio-systems/waitlist">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative z-10 rounded-lg">
                <Image
                  src="/images/hero-workspace.jpg"
                  alt="Fashion design workspace"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  quality={75}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAGAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwC59vlXr2z2po1OXHQVSfqfpUNJgf/Z"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Different */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Built From Experience, Not Theory
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              Every system inside Studio Systems was developed through real production work: factory relationships, supplier management, collection launches, and the operational decisions that determine whether a brand scales or stalls.
            </p>
            <p>
              This is not a library of generic Notion templates. It is a curated operational environment designed to give independent fashion brands the same level of structure and clarity that larger operations rely on.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="aspect-square overflow-hidden relative rounded-lg">
                <Image
                  src="/images/designer-fabrics-cityview.png"
                  alt="Fashion designer reviewing fabric swatches with city skyline in background"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwCf7arDZOApX+8MZPfH40fabX1X86zbQlrg7jnjvWrgelJsdj//2Q=="
                />
              </div>
            </div>
            <div className="lg:order-1">
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                The Operational Gaps That Hold Brands Back
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Production timelines that slip because there is no system to hold them</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Supplier communication that fragments across email, DMs, and spreadsheets</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Pricing decisions made without clear costing frameworks</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Launch coordination that relies on memory instead of process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Oceo Method */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
            The Signature Framework
          </p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-6 tracking-tight">
            The Oceo Method
          </h2>
          <p className="text-xl text-[#967F71] font-light leading-relaxed mb-12">
            A structured approach to production operations for fashion founders who value both precision and creative freedom.
          </p>

          <div className="space-y-8">
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2 text-lg">Organize</p>
              <p className="text-[#967F71] font-light">Build your operational foundation. Supplier systems, production calendars, and costing frameworks that give you clarity at every stage.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2 text-lg">Optimize</p>
              <p className="text-[#967F71] font-light">Streamline communication and workflows with proven protocols that reduce friction and accelerate decision-making.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2 text-lg">Own It</p>
              <p className="text-[#967F71] font-light">Develop the operational confidence and decision-making clarity to lead your brand with calm authority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
            What's Inside
          </p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-12 tracking-tight">
            Inside Studio Systems
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="hidden lg:block">
              <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
                <Image
                  src="/images/designer-workspace.png"
                  alt="Designer working at desk with fabric swatches, sketchbooks, and computer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAHAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwBkd+Z4hbY4PX866NbuJVC46DFcVZf60V0VSUf/2Q=="
                />
              </div>
            </div>

            <div>
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">Twice-Monthly Live Q&A Calls</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Direct access to real-time support for pressure-testing decisions, resolving production questions, and moving forward with accuracy.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">Complete Notion System</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Done-for-you operational templates covering production, distribution, marketing, sales, and launches. Built from real production workflows, not generic frameworks.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">Private Designer Community</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Connect with fashion founders navigating the same operational challenges. Supplier insights, real-time feedback, and a community that values precision.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">Leadership & Somatic Support</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Practical tools for staying grounded and decisive, including regulation practices designed for creative founders managing complex operations.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/studio-systems/waitlist">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
            Founding Member Pricing
          </p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-8 tracking-tight">
            Investment
          </h2>
          <div className="mb-8">
            <p className="text-white/50 line-through text-lg mb-2 font-light">Regular Price: $111/month</p>
            <div className="text-5xl font-light text-white mb-2">
              $77<span className="text-2xl text-white/70">/month</span>
            </div>
            <p className="text-white/70 font-light">No contracts. Cancel anytime.</p>
            <p className="text-sm text-[#CDA7B2] mt-4 font-medium">Founding member pricing for the first 20 members</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio-systems/waitlist">
              <Button
                size="lg"
                className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Have Questions? Let's Talk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Studio Systems Section */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">The difference</p>
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                Why This Membership Exists
              </h2>
              <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
                <p>
                  Most fashion founders are forced to choose between expensive one-on-one consulting or free content that stays surface-level. Neither builds the operational foundation a growing brand actually needs.
                </p>
                <p>
                  Studio Systems was created to close that gap. To give independent fashion brands access to the same caliber of production systems, frameworks, and strategic thinking that private partnership clients receive, at a price point that makes ongoing support sustainable.
                </p>
                <p className="text-[#3B3937]">
                  This is not a course you complete and forget. It is an operational environment you work inside. Updated, supported, and built to evolve alongside your brand.
                </p>
              </div>
            </div>
            <div className="aspect-[3/4] overflow-hidden relative rounded-lg">
              <Image
                src="/images/runway.png"
                alt="Fashion runway show"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-lg"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/wAARCAAGAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwDDiihe1kdl+bIx7VU81BxsFXYP+PR/wrLPWmB//9k="
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-6 tracking-tight">
            Ready to Operate with Precision?
          </h2>
          <p className="text-lg text-[#967F71] mb-10 font-light leading-relaxed">
            Join Studio Systems as a Founding Member and get access to The Oceo Method, live Q&A calls, and a community of fashion founders building with clarity.
          </p>
          <Link href="/studio-systems/waitlist">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
            >
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-[#967F71] mt-6 font-light">
            $77/month for founding members • $111/month after the first 20
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
