import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('apply');
}

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
