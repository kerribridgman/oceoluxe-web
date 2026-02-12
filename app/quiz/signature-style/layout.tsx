import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Can You Identify the Signature Style? | Oceo Luxe',
  description: 'Test your knowledge of fashion history. Can you identify the iconic signature styles of legendary fashion houses and designers?',
  alternates: { canonical: 'https://oceoluxe.com/quiz/signature-style' },
};

export default function SignatureStyleQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
