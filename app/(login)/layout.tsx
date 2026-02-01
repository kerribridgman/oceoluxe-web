import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account',
  robots: 'noindex, nofollow',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
