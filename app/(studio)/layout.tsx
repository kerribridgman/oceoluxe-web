'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Home,
  LogOut,
  BookOpen,
  GraduationCap,
  Users,
  FolderOpen,
  Trophy,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { User as UserType } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { cn } from '@/lib/utils';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    return res.json();
  });

const navigation = [
  { name: 'Dashboard', href: '/studio', icon: Home },
  { name: 'My Courses', href: '/studio/my-courses', icon: GraduationCap },
  { name: 'All Courses', href: '/studio/courses', icon: BookOpen },
  { name: 'Community', href: '/studio/community', icon: Users },
  { name: 'Resources', href: '/studio/resources', icon: FolderOpen },
  { name: 'Leaderboard', href: '/studio/leaderboard', icon: Trophy },
  { name: 'Profile', href: '/studio/profile', icon: User },
];

function UserMenu({ user }: { user: UserType }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-[#CDA7B2] focus:ring-offset-2 rounded-full">
        <div className="flex items-center gap-3 cursor-pointer group">
          <Avatar className="size-9 ring-2 ring-white/20 group-hover:ring-[#CDA7B2] transition-all">
            <AvatarImage alt={user.name || ''} />
            <AvatarFallback className="bg-[#CDA7B2] text-white font-semibold">
              {(user.name || user.email)
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white border-gray-200 shadow-xl rounded-xl p-2"
      >
        <div className="px-3 py-2 mb-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">
            {user.name || 'Member'}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-[#CDA7B2]/10 focus:bg-[#CDA7B2]/10 transition-colors">
          <Link href="/studio/profile" className="flex w-full items-center py-1">
            <User className="mr-3 h-4 w-4 text-[#CDA7B2]" />
            <span className="font-medium text-gray-900">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-[#CDA7B2]/10 focus:bg-[#CDA7B2]/10 transition-colors">
          <Link href="/dashboard" className="flex w-full items-center py-1">
            <Home className="mr-3 h-4 w-4 text-[#CDA7B2]" />
            <span className="font-medium text-gray-900">Admin Dashboard</span>
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

function Sidebar({
  user,
  isOpen,
  onClose,
}: {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-[#3B3937] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/studio" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CDA7B2] flex items-center justify-center shadow-lg">
              <span className="text-[#3B3937] font-bold text-lg">OL</span>
            </div>
            <div>
              <h1 className="text-lg font-serif font-light text-white">
                Studio Systems
              </h1>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/studio' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#CDA7B2] text-[#3B3937]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-[#CDA7B2] text-[#3B3937] font-semibold">
                {(user.name || user.email)
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name || 'Member'}
              </p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({
  user,
  onMenuClick,
}: {
  user: UserType;
  onMenuClick: () => void;
}) {
  const pathname = usePathname();

  // Get current page title from navigation
  const currentPage = navigation.find(
    (item) =>
      pathname === item.href ||
      (item.href !== '/studio' && pathname.startsWith(item.href))
  );

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/studio" className="hover:text-gray-900">
              Studio
            </Link>
            {currentPage && currentPage.href !== '/studio' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">
                  {currentPage.name}
                </span>
              </>
            )}
          </div>
        </div>
        <Suspense fallback={<div className="h-9 w-9" />}>
          <UserMenu user={user} />
        </Suspense>
      </div>
    </header>
  );
}

interface SubscriptionStatus {
  hasSubscription: boolean;
  isActive: boolean;
  subscription: {
    tier: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, error } = useSWR<UserType>('/api/user', fetcher);
  const { data: subscription, isLoading: subscriptionLoading } =
    useSWR<SubscriptionStatus>('/api/studio/subscription', fetcher);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pages that don't require subscription
  const publicPages = ['/studio/subscribe'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    // If API returns unauthorized, redirect to sign-in
    if (error && error.message === 'Unauthorized') {
      router.push('/sign-in?redirect=/studio');
    }
  }, [error, router]);

  useEffect(() => {
    // If user has no active subscription and not on subscribe page, redirect
    if (
      subscription &&
      !subscription.isActive &&
      !isPublicPage &&
      !subscriptionLoading
    ) {
      router.push('/studio/subscribe');
    }
  }, [subscription, isPublicPage, subscriptionLoading, router]);

  // Show loading state while checking auth and subscription
  if (!user && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0EB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDA7B2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Studio...</p>
        </div>
      </div>
    );
  }

  // If there's an error (unauthorized), show nothing (redirect will happen)
  if (error) {
    return null;
  }

  // If checking subscription, show loading
  if (subscriptionLoading && !isPublicPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0EB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDA7B2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking membership...</p>
        </div>
      </div>
    );
  }

  // If no subscription and not on public page, show nothing (redirect will happen)
  if (!subscription?.isActive && !isPublicPage) {
    return null;
  }

  // For subscribe page, render without sidebar
  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0EB]">
      <Sidebar
        user={user!}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user!} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
