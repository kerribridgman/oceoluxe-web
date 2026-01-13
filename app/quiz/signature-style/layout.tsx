import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Can You Identify the Signature Style? | Oceo Luxe',
  description: 'Test your knowledge of fashion history. Can you identify the iconic signature styles of legendary fashion houses and designers?',
};

export default function SignatureStyleQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
