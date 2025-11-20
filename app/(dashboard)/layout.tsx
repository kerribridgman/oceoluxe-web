'use client';

import Link from 'next/link';
import { use, useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (res.status === 401) {
    throw new Error('Unauthorized');
  }
  return res.json();
});

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-full">
        <div className="flex items-center gap-3 cursor-pointer group">
          {user.name && (
            <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors hidden sm:block">
              {user.name}
            </span>
          )}
          <Avatar className="size-9 ring-2 ring-white/20 group-hover:ring-brand-primary transition-all">
            <AvatarImage alt={user.name || ''} />
            <AvatarFallback className="bg-brand-primary text-white font-semibold">
              {user.email
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 shadow-xl rounded-xl p-2">
        <div className="px-3 py-2 mb-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-brand-primary/10 focus:bg-brand-primary/10 transition-colors">
          <Link href="/dashboard" className="flex w-full items-center py-1">
            <Home className="mr-3 h-4 w-4 text-brand-primary" />
            <span className="font-medium text-gray-900">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer rounded-lg hover:bg-red-50 focus:bg-red-50 transition-colors">
              <LogOut className="mr-3 h-4 w-4 text-red-600" />
              <span className="font-medium text-red-600">Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="border-b border-[#2a3342]/50 bg-gradient-to-r from-[#1a2332] via-[#1e2838] to-[#243442] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Patrick Farrell"
            width={220}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, error } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    // If API returns unauthorized, redirect to sign-in
    if (error && error.message === 'Unauthorized') {
      router.push('/sign-in');
    }
  }, [error, router]);

  // Show loading state while checking auth
  if (!user && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an error (unauthorized), show nothing (redirect will happen)
  if (error) {
    return null;
  }

  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
