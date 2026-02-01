import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsubscribe | Oceo Luxe',
  description: 'Manage your email preferences with Oceo Luxe.',
  robots: 'noindex, nofollow',
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
