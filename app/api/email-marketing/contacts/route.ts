import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import {
  leads,
  quizLeads,
  educationSubscriptions,
  clients,
  emailList,
  users,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface UnifiedContact {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const source = searchParams.get('source');
    const search = searchParams.get('search')?.trim()?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Query all source tables in parallel
    const [
      allLeads,
      allQuizLeads,
      allMembers,
      allClients,
      allEmailListEntries,
    ] = await Promise.all([
      db
        .select({
          email: leads.email,
          name: leads.name,
          productName: leads.productName,
          instagramHandle: leads.instagramHandle,
          createdAt: leads.createdAt,
        })
        .from(leads),

      db
        .select({
          email: quizLeads.email,
          name: quizLeads.name,
          archetype: quizLeads.archetype,
          createdAt: quizLeads.createdAt,
        })
        .from(quizLeads),

      db
        .select({
          email: users.email,
          name: users.name,
          tier: educationSubscriptions.tier,
          createdAt: educationSubscriptions.createdAt,
        })
        .from(educationSubscriptions)
        .innerJoin(users, eq(educationSubscriptions.userId, users.id))
        .where(eq(educationSubscriptions.status, 'active')),

      db
        .select({
          email: clients.email,
          firstName: clients.firstName,
          lastName: clients.lastName,
          packageType: clients.packageType,
          instagramHandle: clients.instagramHandle,
          createdAt: clients.createdAt,
        })
        .from(clients)
        .where(eq(clients.status, 'active')),

      db.select().from(emailList),
    ]);

    // Build unsubscribe status lookup from emailList
    const unsubscribeMap = new Map<
      string,
      {
        unsubscribedFromMarketing: boolean;
        unsubscribedFromDrips: boolean;
        unsubscribedFromAll: boolean;
      }
    >();
    for (const entry of allEmailListEntries) {
      unsubscribeMap.set(entry.email.toLowerCase(), {
        unsubscribedFromMarketing: entry.unsubscribedFromMarketing || false,
        unsubscribedFromDrips: entry.unsubscribedFromDrips || false,
        unsubscribedFromAll: entry.unsubscribedFromAll || false,
      });
    }

    // Merge all contacts by email
    const contactMap = new Map<string, UnifiedContact>();

    function getOrCreate(email: string): UnifiedContact {
      const key = email.toLowerCase();
      if (!contactMap.has(key)) {
        const unsub = unsubscribeMap.get(key);
        contactMap.set(key, {
          email: key,
          firstName: null,
          lastName: null,
          sources: [],
          productName: null,
          archetype: null,
          membershipTier: null,
          clientPackage: null,
          instagramHandle: null,
          unsubscribedFromMarketing: unsub?.unsubscribedFromMarketing || false,
          unsubscribedFromDrips: unsub?.unsubscribedFromDrips || false,
          unsubscribedFromAll: unsub?.unsubscribedFromAll || false,
          createdAt: new Date(0).toISOString(),
        });
      }
      return contactMap.get(key)!;
    }

    function updateCreatedAt(contact: UnifiedContact, date: Date | null) {
      if (date && new Date(date) > new Date(contact.createdAt)) {
        contact.createdAt = new Date(date).toISOString();
      }
    }

    function addSource(contact: UnifiedContact, src: string) {
      if (!contact.sources.includes(src)) {
        contact.sources.push(src);
      }
    }

    // Process free product leads
    for (const lead of allLeads) {
      const contact = getOrCreate(lead.email);
      addSource(contact, 'lead');
      if (lead.name && !contact.firstName) contact.firstName = lead.name;
      if (lead.productName) contact.productName = lead.productName;
      if (lead.instagramHandle) contact.instagramHandle = lead.instagramHandle;
      updateCreatedAt(contact, lead.createdAt);
    }

    // Process quiz leads
    for (const ql of allQuizLeads) {
      const contact = getOrCreate(ql.email);
      addSource(contact, 'quiz_lead');
      if (ql.name && !contact.firstName) contact.firstName = ql.name;
      if (ql.archetype) contact.archetype = ql.archetype;
      updateCreatedAt(contact, ql.createdAt);
    }

    // Process members
    for (const member of allMembers) {
      const contact = getOrCreate(member.email);
      addSource(contact, 'member');
      if (member.name && !contact.firstName) contact.firstName = member.name;
      if (member.tier) contact.membershipTier = member.tier;
      updateCreatedAt(contact, member.createdAt);
    }

    // Process 1-on-1 clients
    for (const client of allClients) {
      const contact = getOrCreate(client.email);
      addSource(contact, 'client');
      if (client.firstName) contact.firstName = client.firstName;
      if (client.lastName) contact.lastName = client.lastName;
      if (client.packageType) contact.clientPackage = client.packageType;
      if (client.instagramHandle) contact.instagramHandle = client.instagramHandle;
      updateCreatedAt(contact, client.createdAt);
    }

    // Process emailList entries (website signups, manual, and any synced entries)
    for (const entry of allEmailListEntries) {
      const contact = getOrCreate(entry.email);
      addSource(contact, entry.source);
      if (entry.firstName) contact.firstName = entry.firstName;
      if (entry.lastName) contact.lastName = entry.lastName;
      if (entry.productName) contact.productName = entry.productName;
      if (entry.archetype) contact.archetype = entry.archetype;
      if (entry.membershipTier) contact.membershipTier = entry.membershipTier;
      if (entry.clientPackage) contact.clientPackage = entry.clientPackage;
      if (entry.instagramHandle) contact.instagramHandle = entry.instagramHandle;
      contact.unsubscribedFromMarketing = entry.unsubscribedFromMarketing || false;
      contact.unsubscribedFromDrips = entry.unsubscribedFromDrips || false;
      contact.unsubscribedFromAll = entry.unsubscribedFromAll || false;
      updateCreatedAt(contact, entry.createdAt);
    }

    // Convert to array
    let contacts = Array.from(contactMap.values());

    // Filter by source
    if (source && source !== 'all') {
      contacts = contacts.filter((c) => c.sources.includes(source));
    }

    // Apply search filter
    if (search && search.length >= 2) {
      contacts = contacts.filter(
        (c) =>
          c.email.includes(search) ||
          (c.firstName && c.firstName.toLowerCase().includes(search)) ||
          (c.lastName && c.lastName.toLowerCase().includes(search))
      );
    }

    // Sort by most recent first
    contacts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const total = contacts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedContacts = contacts.slice(offset, offset + limit);

    return NextResponse.json({
      contacts: paginatedContacts,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
