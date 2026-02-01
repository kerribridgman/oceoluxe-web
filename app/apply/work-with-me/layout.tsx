import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('apply/work-with-me');
}

export default function WorkWithMeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
