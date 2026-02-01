import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('join');
}

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
