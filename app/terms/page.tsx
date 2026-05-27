import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('terms');
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader theme="light" />

      {/* Header */}
      <section className="bg-[#f5f0ea] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed">
            The guidelines for using our services and resources.
          </p>
          <p className="text-sm text-[#967F71] mt-4 font-light">
            Last updated: December 23, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-[#967F71] font-light leading-relaxed">
                Welcome to Oceo Luxe and Studio Systems. By accessing our website, purchasing our products, or using our services, you agree to these Terms of Service. Please read them carefully.
              </p>
            </div>

            {/* Agreement to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Agreement to Terms</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                By accessing or using our website at oceoluxe.com, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed">
                We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.
              </p>
            </div>

            {/* Services Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Our Services</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                Oceo Luxe provides educational content, digital products, and membership services focused on fashion production and business development through our Studio Systems platform. Our services include:
              </p>
              <ul className="space-y-2 text-[#967F71] font-light">
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Digital downloads (templates, guides, resources)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Online courses and educational content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Membership programs with community access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Coaching and consulting services</span>
                </li>
              </ul>
            </div>

            {/* Account Registration */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Account Registration</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                Some services require you to create an account. When you register, you agree to:
              </p>
              <ul className="space-y-2 text-[#967F71] font-light">
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Provide accurate and complete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Keep your account credentials secure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Notify us immediately of any unauthorized access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Be responsible for all activity under your account</span>
                </li>
              </ul>
            </div>

            {/* Purchases and Payments */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Purchases and Payments</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                <strong className="text-[#3B3937]">Pricing:</strong> All prices are displayed in USD unless otherwise noted. We reserve the right to change prices at any time, though changes will not affect orders already placed.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                <strong className="text-[#3B3937]">Payment Processing:</strong> Payments are processed securely through Stripe. We do not store your credit card information on our servers.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                <strong className="text-[#3B3937]">Subscriptions:</strong> Membership subscriptions renew automatically until cancelled. You may cancel at any time through your account settings or by contacting us. Cancellation takes effect at the end of the current billing period.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed">
                <strong className="text-[#3B3937]">Refunds:</strong> Due to the digital nature of our products, all sales are generally final. However, if you are unsatisfied with a purchase, please contact us within 14 days and we will work with you to find a resolution.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Intellectual Property</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                All content on this website, including text, images, templates, course materials, and branding, is owned by Oceo Luxe and protected by copyright law.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                <strong className="text-[#3B3937]">Personal Use:</strong> Digital products you purchase are licensed for your personal or internal business use only. You may not resell, redistribute, or share purchased materials with others.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed">
                <strong className="text-[#3B3937]">Templates:</strong> Our templates are provided as starting points for your own work. While you own the final products you create using our templates, you may not sell or distribute the templates themselves.
              </p>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">User Conduct</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                When using our services, you agree not to:
              </p>
              <ul className="space-y-2 text-[#967F71] font-light">
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Share your account credentials or purchased content with others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Use our services for any unlawful purpose</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Harass or harm other community members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Attempt to gain unauthorized access to our systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Copy, scrape, or reproduce our content without permission</span>
                </li>
              </ul>
            </div>

            {/* Community Guidelines */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Community Guidelines</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                Studio Systems includes community features where members can interact. We expect all members to:
              </p>
              <ul className="space-y-2 text-[#967F71] font-light">
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Treat others with respect and professionalism</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Keep discussions relevant and constructive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Avoid spam, self-promotion, or solicitation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CDA7B2]">-</span>
                  <span>Respect the confidentiality of other members</span>
                </li>
              </ul>
              <p className="text-[#967F71] font-light leading-relaxed mt-4">
                We reserve the right to remove content or revoke access for members who violate these guidelines.
              </p>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Disclaimers</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                <strong className="text-[#3B3937]">Educational Content:</strong> Our courses, templates, and resources are provided for educational and informational purposes. Results vary based on individual effort, circumstances, and market conditions. We do not guarantee specific business outcomes or income.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                <strong className="text-[#3B3937]">Professional Advice:</strong> Our content is not a substitute for professional legal, financial, or business advice. We recommend consulting qualified professionals for specific situations.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed">
                <strong className="text-[#3B3937]">Third-Party Links:</strong> Our website may contain links to third-party sites. We are not responsible for the content or practices of these external sites.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Limitation of Liability</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                To the fullest extent permitted by law, Oceo Luxe shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed">
                Our total liability for any claim shall not exceed the amount you paid for the specific product or service giving rise to the claim.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Termination</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                We reserve the right to suspend or terminate your access to our services at any time for violation of these terms or for any other reason at our discretion.
              </p>
              <p className="text-[#967F71] font-light leading-relaxed">
                You may terminate your account at any time by contacting us. Upon termination, your right to access purchased content may be revoked, depending on the nature of the purchase.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Governing Law</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved in the appropriate courts of the jurisdiction where Oceo Luxe operates.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Contact Us</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[#faf8f5] p-6 rounded-lg">
                <p className="text-[#967F71] font-light">
                  <strong className="text-[#3B3937]">Email:</strong> kerrib@oceoluxe.com
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <MarketingFooter theme="light" />
    </div>
  );
}
