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
  return await getPageMetadata('about');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'About', url: `${baseUrl}/about` },
]);

export default async function AboutPage() {
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
                About
              </p>
              <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight animate-fade-in-up">
                Behind Oceo Luxe
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-fade-in-up">
                Oceo Luxe was founded by Kerri Bridgman, a FIT-trained production manager who has spent over a decade inside fashion production –managing factories, auditing costing, and catching the risks that cost brands real money.
              </p>
              <p className="text-sm text-[#967F71] font-light animate-fade-in-up">
                FIT-trained Production Manager • 10+ Years Managing Factory Operations & Supply Chains
              </p>
              <div className="pt-2 animate-fade-in-up">
                <Link href="/work-with-oceo-luxe">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Work With Oceo Luxe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative z-10 rounded-lg">
                <Image
                  src="/images/Kerri-11copy.jpeg"
                  alt="Kerri Bridgman"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  quality={75}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/wAARCAAKAAcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBQMDAwUGBQUFBQYIBgYGBgYICggICAgICAoKCgoKCgoKDAwMDAwMDg4ODg4PDw8PDw8PDw8P/9sAQwECAgIEBAQHBAQHEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/90ABAAB/9oADAMBAAIRAxEAPwDhPhn8HbjwL8M5tftGF3oeq6q62GxGf92YUf5my3TGATy3OcYxXQ/Yv+nM/wDfs/4V6F+zPc3C/s+2CrKwEVralAGPykyNkj0Jyc49TXpH9o6h/wA/Mv8A323+NfKqlze9c+glj3TtFrovxSZ//9k="
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 hidden lg:block">
              <div className="aspect-[3/4] overflow-hidden rounded-xl relative">
                <Image
                  src="/images/designer-studio.png"
                  alt="Designer at a clean studio desk with fabric swatches and garment rack"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwCeK5aOZnwDsXGKz/M9qsfxS/SqVZmh/9k="
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                Production Experience, Not Theory
              </h2>
              <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
                <p>
                  Before Oceo Luxe, Kerri spent years inside fashion companies managing production at scale –cutting over $10 million in orders over five years, tracking five concurrent seasons, running four production lines while owning all buying and purchasing across each one. She managed active inventory across 15 suppliers, oversaw multiple sample rounds including inbound CITES samples for runway shows, and was trusted to hire over 100 people based on her understanding of a founder&apos;s vision and standards. The supplier and factory relationships she built over seven years have followed her across companies and industries –a testament to how she operates at the factory level. She has been the person negotiating with factories, auditing costing structures, and solving the production problems that most founders do not see until they become expensive.
                </p>
                <p>
                  That experience taught her something that most consulting frameworks miss: production risk in fashion is not about checklists or templates. It is about understanding how factories actually operate –not how they say they operate. Where costs get hidden. Where timelines slip. Where communication gaps turn into five-figure problems.
                </p>
                <p>
                  Kerri has managed production for brands ranging from independent labels to established houses –and she has been the cross-departmental accountability partner when production stalled because other teams were not getting answers from the people they should have been. She has seen a company spend $35,000 on emergency air freight because factory paperwork delays were not caught. She has helped scale an account 10x in one year by watching the operational efficiency of a single team and finding what everyone else missed.
                </p>
                <p className="text-[#3B3937]">
                  What sets her apart is the approach: systematic frameworks over one-off fixes, knowledge transfer over dependency, and a steady presence in the high-pressure moments where most production relationships fall apart. Oceo Luxe exists because fashion founders deserve a production strategist who has been inside the factories. Not someone who has only studied them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="border-l-2 border-[#CDA7B2] pl-8">
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[#3B3937] leading-relaxed">
              &ldquo;With a production background in fashion, Kerri added a creative edge to everything from financial controls to internal communications.&rdquo;
            </p>
            <p className="text-[#967F71] font-light text-sm mt-4 tracking-wide uppercase">– C-Suite Executive</p>
          </div>
          <div className="border-l-2 border-[#CDA7B2] pl-8">
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[#3B3937] leading-relaxed">
              &ldquo;Her calm presence, clear communication, and ability to spot issues before they surfaced made her a stabilizing force in a high-pressure environment.&rdquo;
            </p>
            <p className="text-[#967F71] font-light text-sm mt-4 tracking-wide uppercase">– C-Suite Executive</p>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;Production risk management is not about distrust. It is about understanding how factories actually operate.&rdquo;
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Production Philosophy
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              <span className="text-[#3B3937]">Verify, then trust.</span> Factories are not adversaries, but they are businesses with their own margins to protect. The best production relationships are built on verification, not blind trust. When you understand how factories actually operate, you negotiate better, plan better, and protect your margins.
            </p>
            <p>
              <span className="text-[#3B3937]">Catch it early or pay for it later.</span> Every production mistake has a cost curve. Caught at the costing stage, it costs nothing. Caught after delivery, it costs thousands. The entire value of production oversight is in the timing.
            </p>
            <p>
              <span className="text-[#3B3937]">Protect the investment.</span> A production order is not a purchase –it is a capital deployment. It deserves the same level of strategic oversight as any other significant business investment.
            </p>
            <p>
              <span className="text-[#3B3937]">Build internal capacity.</span> For focused engagements, the goal is to send you back with the knowledge to make stronger production decisions on your own. For ongoing partnerships, the goal is deeper –your team&apos;s production intelligence compounds with every season, and your operation gets sharper whether we are in the room or not.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Highlight */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-script text-3xl lg:text-4xl italic text-white/90 leading-relaxed mb-6">
            &ldquo;Verify, then trust.&rdquo;
          </p>
          <p className="text-lg text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
            The best production outcomes happen when someone who understands factory operations is reviewing every detail. Not to micromanage, but to protect the investment before problems surface.
          </p>
        </div>
      </section>

      {/* This Is For You Section */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                Who This Is For
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">–</span>
                  <span>Fashion founders placing $50K–$500K production orders who need expert production oversight</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">–</span>
                  <span>Brands that have been burned by factory miscommunication and refuse to let it happen again</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">–</span>
                  <span>Founders who understand that production risk management is a strategic investment, not an expense</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">–</span>
                  <span>Brands committed to protecting their margins through production-level oversight and factory accountability</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/work-with-oceo-luxe">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide w-full sm:w-auto"
                  >
                    Work With Oceo Luxe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/book">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide w-full sm:w-auto"
                  >
                    Schedule a Consultation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
                <Image
                  src="/images/designer-atelier.png"
                  alt="Designer working in an atelier with mood boards and fabric swatches"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJycr6+vr6+vr6+vr//bAEMBGx0dLSktTCkpTLd8Zny3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t//dAAQAAf/aAAwDAQACEQMRAD8Ahjv5EkUBR0z+lVPNNRr/AK0f7v8ASkPWoKP/2Q=="
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-script text-2xl italic text-[#CDA7B2] mb-4">
            Next step
          </p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
            Protect Your Next Production Order
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light">
            Before you commit capital, make sure someone who has been inside factory operations is reviewing the details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Book a Call
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
