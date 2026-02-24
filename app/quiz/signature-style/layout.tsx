import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('quiz/signature-style');
}

export default function SignatureStyleQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
