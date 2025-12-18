'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Heart,
  Check,
  Video,
  LayoutGrid,
  Users,
  Instagram,
  Mail,
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const benefits = [
  {
    icon: Video,
    title: 'Twice-Monthly Live Q&A Calls',
  },
  {
    icon: LayoutGrid,
    title: 'Complete Notion System',
  },
  {
    icon: Users,
    title: 'Private Designer Community',
  },
  {
    icon: Heart,
    title: 'Leadership & Somatic Support',
  },
];

export default function ComingSoonPage() {
  const { data: user } = useSWR('/api/user', fetcher);

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B3937] to-[#5a5654] p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#CDA7B2] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Founding Member
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
              You're In!
            </h1>
            <p className="text-white/80 text-lg">
              {user?.name ? `${user.name}, your` : 'Your'} founding member spot is secured.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif text-[#3B3937] mb-3">
                Studio Systems is launching soon
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We're putting the finishing touches on everything to make sure it's perfect for you.
                You'll receive an email the moment we're live.
              </p>
            </div>

            {/* What's Included */}
            <div className="bg-[#FAF8F6] rounded-2xl p-6 mb-8">
              <p className="text-sm font-semibold text-[#CDA7B2] uppercase tracking-wide mb-4">
                What you've locked in:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-[#CDA7B2]" />
                    </div>
                    <span className="text-sm text-[#3B3937] font-medium">{benefit.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your rate:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 line-through text-sm">$77/mo</span>
                    <span className="text-2xl font-serif text-[#3B3937]">$33</span>
                    <span className="text-gray-500 text-sm">/month forever</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What to do while waiting */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-[#3B3937] mb-4">While you wait:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    <a href="https://instagram.com/oceoluxe" target="_blank" rel="noopener noreferrer" className="text-[#3B3937] font-medium hover:text-[#CDA7B2]">
                      Follow us on Instagram
                    </a>
                    {' '}for behind-the-scenes updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Take the{' '}
                    <Link href="/quiz" className="text-[#3B3937] font-medium hover:text-[#CDA7B2]">
                      Designer Archetype Quiz
                    </Link>
                    {' '}if you haven't already
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Check out our{' '}
                    <Link href="/blog" className="text-[#3B3937] font-medium hover:text-[#CDA7B2]">
                      blog
                    </Link>
                    {' '}for production tips and insights
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-4">
                Questions? We're here to help.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="mailto:kerrib@oceoluxe.com"
                  className="inline-flex items-center gap-2 text-sm text-[#3B3937] hover:text-[#CDA7B2] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
                <a
                  href="https://instagram.com/oceoluxe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#3B3937] hover:text-[#CDA7B2] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Return to Oceo Luxe
          </Link>
        </div>
      </div>
    </div>
  );
}
