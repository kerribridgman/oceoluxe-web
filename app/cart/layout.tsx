import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart | Oceo Luxe',
  description: 'Review your selected products and resources from Oceo Luxe.',
  robots: 'noindex, nofollow',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
