'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Activity, Menu, FileText, Search, LayoutDashboard, ChevronRight, BarChart3, Link as LinkIcon, Plug, Package, UserCog, Calendar, Key, Briefcase } from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { href: '/dashboard/blog', icon: FileText, label: 'Blog Posts' },
        { href: '/dashboard/products', icon: Package, label: 'Products' },
        { href: '/dashboard/mmfc-services', icon: Briefcase, label: 'MMFC Services' },
        { href: '/dashboard/scheduling', icon: Calendar, label: 'Scheduling' },
        { href: '/dashboard/applications', icon: FileText, label: 'Applications' },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { href: '/dashboard/general', icon: Settings, label: 'General' },
        { href: '/dashboard/security', icon: Shield, label: 'Security' },
        { href: '/dashboard/api-keys', icon: Key, label: 'API Keys' },
        { href: '/dashboard/integrations', icon: Plug, label: 'Integrations' },
        { href: '/dashboard/seo', icon: Search, label: 'SEO' },
        { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/dashboard/links', icon: LinkIcon, label: 'Links' },
        { href: '/dashboard/users', icon: UserCog, label: 'User Management' },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f5f0ea] to-[#faf8f5]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#3B3937] backdrop-blur-lg border-b border-[#CDA7B2]/20 p-4 shadow-lg">
        <Button
          className="-ml-3 text-white hover:bg-[#CDA7B2]/20"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center">
          <span className="font-serif font-light text-white text-lg">
            Oceo Luxe
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#3B3937] lg:block ${
          isSidebarOpen ? 'block' : 'hidden'
        } z-40 shadow-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#CDA7B2]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#CDA7B2] flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-5 w-5 text-[#3B3937]" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-light text-white">Oceo Luxe</h2>
                <p className="text-xs text-[#967F71] tracking-wide">STUDIO SYSTEMS</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                    return (
                      <Link key={item.href} href={item.href}>
                        <button
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                            isActive
                              ? 'bg-[#CDA7B2]/10 text-white shadow-lg shadow-[#CDA7B2]/5 border border-[#CDA7B2]/30'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`h-4 w-4 ${isActive ? 'text-[#CDA7B2]' : 'text-gray-400 group-hover:text-gray-300'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && (
                            <ChevronRight className="h-4 w-4 text-[#CDA7B2]" />
                          )}
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#CDA7B2]/10">
            <div className="bg-gradient-to-r from-[#CDA7B2]/10 to-[#967F71]/10 rounded-lg p-4 border border-[#CDA7B2]/20">
              <p className="text-xs font-medium text-white mb-1">Need Help?</p>
              <p className="text-xs text-gray-300">Check our documentation</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0 mt-16 lg:mt-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
