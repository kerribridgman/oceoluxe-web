import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You | Oceo Luxe',
  description: 'Your order has been confirmed. Thank you for shopping with Oceo Luxe.',
  robots: 'noindex, nofollow',
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
