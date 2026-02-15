'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailX,
  Users,
} from 'lucide-react';

interface Contact {
  email: string;
  firstName: string | null;
  lastName: string | null;
  sources: string[];
  productName: string | null;
  archetype: string | null;
  membershipTier: string | null;
  clientPackage: string | null;
  instagramHandle: string | null;
  unsubscribedFromMarketing: boolean;
  unsubscribedFromDrips: boolean;
  unsubscribedFromAll: boolean;
  createdAt: string;
}

const sourceLabels: Record<string, string> = {
  lead: 'Free Product Lead',
  quiz_lead: 'Quiz Lead',
  member: 'Member',
  client: '1-on-1 Client',
  manual: 'Manual',
  website_signup: 'Website Signup',
};

const sourceFilters = [
  { value: 'all', label: 'All Sources' },
  { value: 'website_signup', label: 'Email Signups' },
  { value: 'lead', label: 'Free Product Leads' },
  { value: 'quiz_lead', label: 'Quiz Leads' },
  { value: 'member', label: 'Members' },
  { value: 'client', label: '1-on-1 Clients' },
  { value: 'manual', label: 'Manual' },
];

function getSourceColor(source: string) {
  switch (source) {
    case 'lead':
      return 'bg-blue-100 text-blue-800';
    case 'quiz_lead':
      return 'bg-purple-100 text-purple-800';
    case 'member':
      return 'bg-green-100 text-green-800';
    case 'client':
      return 'bg-pink-100 text-pink-800';
    case 'website_signup':
      return 'bg-amber-100 text-amber-800';
    case 'manual':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function ContactsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSource = searchParams.get('source') || 'all';

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [source, setSource] = useState(initialSource);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '50');
      if (source !== 'all') params.set('source', source);
      if (search) params.set('search', search);

      const response = await fetch(`/api/email-marketing/contacts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, source, search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  function handleSourceChange(newSource: string) {
    setSource(newSource);
    setPage(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const emailableCount = contacts.filter((c) => !c.unsubscribedFromAll).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/crm/email-marketing"
          className="flex items-center gap-2 text-[#967F71] hover:text-[#3B3937] mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Email Marketing
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-light text-[#3B3937]">Contacts</h1>
            <p className="text-[#967F71] mt-1">
              {total} total contacts{' '}
              {source !== 'all' && (
                <span>
                  in{' '}
                  <span className="font-medium">
                    {sourceFilters.find((f) => f.value === source)?.label}
                  </span>
                </span>
              )}
            </p>
          </div>
          <Link href="/dashboard/crm/email-marketing/campaigns">
            <Button className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
              <Mail className="h-4 w-4 mr-2" />
              Send Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Source Filter Pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          {sourceFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleSourceChange(filter.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                source === filter.value
                  ? 'bg-[#CDA7B2]/15 text-[#CDA7B2]'
                  : 'text-[#967F71] hover:text-[#3B3937] hover:bg-[#967F71]/5'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#967F71]" />
            <Input
              placeholder="Search name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
          {search && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearch('');
                setSearchInput('');
                setPage(1);
              }}
              className="text-[#967F71]"
            >
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* Contacts Table */}
      {isLoading ? (
        <div className="text-center py-12 text-[#967F71]">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
            <h3 className="text-lg font-medium text-[#3B3937] mb-2">No contacts found</h3>
            <p className="text-[#967F71]">
              {search ? 'Try a different search term.' : 'No contacts in this category yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#967F71]/10">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#967F71]">Contact</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#967F71]">Source</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#967F71]">Details</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#967F71]">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#967F71]">Added</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.email}
                    className="border-b border-[#967F71]/5 hover:bg-[#faf8f5]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#3B3937]">
                          {contact.firstName || contact.lastName
                            ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                            : '—'}
                        </p>
                        <p className="text-sm text-[#967F71]">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.sources.map((src) => (
                          <span
                            key={src}
                            className={`text-xs px-2 py-0.5 rounded-full ${getSourceColor(src)}`}
                          >
                            {sourceLabels[src] || src}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-[#967F71] space-y-0.5">
                        {contact.productName && <p>Product: {contact.productName}</p>}
                        {contact.archetype && <p>Archetype: {contact.archetype}</p>}
                        {contact.membershipTier && <p>Tier: {contact.membershipTier}</p>}
                        {contact.clientPackage && <p>Package: {contact.clientPackage}</p>}
                        {contact.instagramHandle && <p>@{contact.instagramHandle}</p>}
                        {!contact.productName &&
                          !contact.archetype &&
                          !contact.membershipTier &&
                          !contact.clientPackage &&
                          !contact.instagramHandle && <p className="text-[#967F71]/50">—</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {contact.unsubscribedFromAll ? (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <MailX className="h-3 w-3" />
                          Unsubscribed
                        </span>
                      ) : contact.unsubscribedFromMarketing ? (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <MailX className="h-3 w-3" />
                          No marketing
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <Mail className="h-3 w-3" />
                          Subscribed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#967F71]">
                      {formatDate(contact.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#967F71]/10">
              <p className="text-sm text-[#967F71]">
                Page {page} of {totalPages} ({total} contacts)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
