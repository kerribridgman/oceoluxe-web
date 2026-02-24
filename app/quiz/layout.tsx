import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('quiz');
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
