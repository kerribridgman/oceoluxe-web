import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Designer Quiz | Oceo Luxe',
  description: 'Discover what kind of fashion designer you are. Take our quiz to learn how you connect with your clients and craft your collections.',
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
