import { redirect } from 'next/navigation';

export default function SignUpPage() {
  // Public sign-up is disabled - redirect to Studio join page
  // Admin accounts should be created manually or via team invitation
  redirect('/studio-join');
}
