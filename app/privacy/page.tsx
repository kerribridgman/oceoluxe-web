import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('privacy');
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader theme="light" />

      {/* Header */}
      <section className="bg-[#f5f0ea] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed">
            Your trust matters. Here is exactly how we handle your information.
          </p>
          <p className="text-sm text-[#967F71] mt-4 font-light">
            Last updated: December 12, 2024
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
                At Oceo Luxe, we believe structure should support you, not complicate things. That includes how we handle your personal information. This policy explains what we collect, why we collect it, and the choices you have.
              </p>
            </div>

            {/* Who We Are */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Who We Are</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                Oceo Luxe is operated by Kerri Bridgman. When we say "we," "us," or "our," we mean Oceo Luxe. When we say "you," we mean you, the person visiting our website or using our services.
              </p>
            </div>

            {/* What We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">What We Collect</h2>

              <h3 className="text-xl font-serif font-light text-[#3B3937] mt-6 mb-3">Information You Give Us</h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                When you sign up, purchase something, take our quiz, or reach out to us, you share information like:
              </p>
              <ul className="list-disc pl-6 text-[#967F71] font-light leading-relaxed space-y-2">
                <li>Your name and email address</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Quiz responses and preferences</li>
                <li>Any messages you send us</li>
              </ul>

              <h3 className="text-xl font-serif font-light text-[#3B3937] mt-6 mb-3">Information We Collect Automatically</h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                When you visit our site, we may collect:
              </p>
              <ul className="list-disc pl-6 text-[#967F71] font-light leading-relaxed space-y-2">
                <li>How you found us and which pages you visit</li>
                <li>Your device type and browser</li>
                <li>General location (country or region, not your exact address)</li>
              </ul>
              <p className="text-[#967F71] font-light leading-relaxed mt-4">
                This helps us understand what is working and where we can improve your experience.
              </p>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">How We Use Your Information</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-[#967F71] font-light leading-relaxed space-y-2">
                <li>Deliver the services and products you purchase</li>
                <li>Send you updates about your account or purchases</li>
                <li>Share helpful resources and updates (only if you have opted in)</li>
                <li>Improve our website and offerings</li>
                <li>Respond when you reach out to us</li>
              </ul>
              <p className="text-[#967F71] font-light leading-relaxed mt-4">
                We will never sell your information. That is not the kind of business we run.
              </p>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Cookies and Tracking</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                We use cookies, which are small files stored on your device. Here is what you need to know:
              </p>

              <h3 className="text-xl font-serif font-light text-[#3B3937] mt-6 mb-3">Essential Cookies</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                These keep the website running. They handle things like keeping you logged in and processing purchases. These cannot be turned off because the site would not work without them.
              </p>

              <h3 className="text-xl font-serif font-light text-[#3B3937] mt-6 mb-3">Analytics Cookies</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                These help us understand how people use our site so we can make it better. We use Google Analytics for this. You can opt out of these when you first visit our site, or change your preference anytime.
              </p>

              <h3 className="text-xl font-serif font-light text-[#3B3937] mt-6 mb-3">Marketing Cookies</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                If enabled, these help us show you relevant content. You have full control over whether these are active.
              </p>

              <p className="text-[#967F71] font-light leading-relaxed mt-6">
                When you first visit our site, you will see a banner asking for your preferences. You can update these choices at any time.
              </p>
            </div>

            {/* Third Parties */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Who We Share With</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                We work with a small number of trusted services to run our business:
              </p>
              <ul className="list-disc pl-6 text-[#967F71] font-light leading-relaxed space-y-2">
                <li><strong className="text-[#3B3937]">Stripe</strong> - Processes payments securely. We never see or store your full card number.</li>
                <li><strong className="text-[#3B3937]">SendGrid</strong> - Sends emails on our behalf.</li>
                <li><strong className="text-[#3B3937]">Google Analytics</strong> - Helps us understand site usage (only with your consent).</li>
                <li><strong className="text-[#3B3937]">Vercel</strong> - Hosts our website.</li>
              </ul>
              <p className="text-[#967F71] font-light leading-relaxed mt-4">
                These services only access what they need to do their job. We do not share your information with anyone else unless required by law.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Your Rights</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                Depending on where you live, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-[#967F71] font-light leading-relaxed space-y-2">
                <li>Know what personal information we have about you</li>
                <li>Request a copy of your data</li>
                <li>Ask us to correct or delete your information</li>
                <li>Opt out of marketing emails at any time</li>
                <li>Opt out of analytics and marketing cookies</li>
              </ul>
              <p className="text-[#967F71] font-light leading-relaxed mt-4">
                To make any of these requests, just email us. We will respond as quickly as we can.
              </p>
            </div>

            {/* California Residents */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">For California Residents</h2>
              <p className="text-[#967F71] font-light leading-relaxed mb-4">
                Under the California Consumer Privacy Act (CCPA), you have specific rights:
              </p>
              <ul className="list-disc pl-6 text-[#967F71] font-light leading-relaxed space-y-2">
                <li>The right to know what personal information we collect and how we use it</li>
                <li>The right to delete your personal information</li>
                <li>The right to opt out of the sale of personal information (we do not sell your data)</li>
                <li>The right to non-discrimination for exercising your privacy rights</li>
              </ul>
              <p className="text-[#967F71] font-light leading-relaxed mt-4">
                To exercise any of these rights, contact us using the information below.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">How We Protect Your Information</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                We use industry-standard security measures to protect your data. All connections to our site are encrypted. Payment information is handled directly by Stripe and never touches our servers. We regularly review our practices to keep your information safe.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">How Long We Keep Your Data</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                We keep your information only as long as we need it to provide our services or meet legal requirements. If you ask us to delete your account, we will remove your personal data, though we may need to retain certain records for legal or accounting purposes.
              </p>
            </div>

            {/* Children */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Children's Privacy</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                Our services are designed for adults. We do not knowingly collect information from anyone under 16. If you believe we have collected information from a child, please contact us and we will delete it.
              </p>
            </div>

            {/* Changes */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Changes to This Policy</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                If we make significant changes to this policy, we will let you know by email or by posting a notice on our site. The date at the top of this page tells you when it was last updated.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-4">Questions?</h2>
              <p className="text-[#967F71] font-light leading-relaxed">
                If you have any questions about this policy or how we handle your information, we would love to hear from you. Reach out anytime at{' '}
                <a href="mailto:kerrib@oceoluxe.com" className="text-[#CDA7B2] hover:underline">
                  kerrib@oceoluxe.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>

      <MarketingFooter theme="light" />
    </div>
  );
}
