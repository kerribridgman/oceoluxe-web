import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Systems Waitlist | Founding Member Access',
  description:
    'Join the Studio Systems waitlist and lock in founding member pricing at $33/month. Fashion production membership with live Q&A, Notion systems, and community.',
  keywords: [
    'studio systems waitlist',
    'fashion production membership',
    'founding member pricing',
    'fashion designer community',
  ],
  alternates: {
    canonical: 'https://oceoluxe.com/studio-systems/waitlist',
  },
  openGraph: {
    title: 'Studio Systems Waitlist | Oceo Luxe',
    description:
      'Join the Studio Systems waitlist and lock in founding member pricing at $33/month. Fashion production membership with live Q&A, Notion systems, and community.',
    type: 'website',
    url: 'https://oceoluxe.com/studio-systems/waitlist',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Systems Waitlist | Oceo Luxe',
    description:
      'Join the Studio Systems waitlist and lock in founding member pricing at $33/month. Fashion production membership with live Q&A, Notion systems, and community.',
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
