import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { leads, quizLeads, educationSubscriptions, clients, emailTemplates, campaigns, dripCampaigns, emailSends, emailList } from '@/lib/db/schema';
import { count, sql, gte, and, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get counts from all relevant tables in parallel
    const [
      leadsResult,
      quizLeadsResult,
      membersResult,
      clientsResult,
      websiteSignupsResult,
      templatesResult,
      campaignsResult,
      dripsResult,
      recentSendsResult,
      emailStatsResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(leads),
      db.select({ count: count() }).from(quizLeads),
      db.select({ count: count() }).from(educationSubscriptions).where(eq(educationSubscriptions.status, 'active')),
      db.select({ count: count() }).from(clients).where(eq(clients.status, 'active')),
      // Website email signups (from popup or /join page)
      db.select({ count: count() }).from(emailList).where(eq(emailList.source, 'website_signup')),
      db.select({ count: count() }).from(emailTemplates).where(eq(emailTemplates.isActive, true)),
      db.select({ count: count() }).from(campaigns).where(eq(campaigns.status, 'sent')),
      db.select({ count: count() }).from(dripCampaigns).where(eq(dripCampaigns.isActive, true)),
      // Recent sends in last 30 days
      db.select({ count: count() }).from(emailSends).where(
        gte(emailSends.sentAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      ),
      // Get open and click stats for last 30 days
      db.select({
        total: count(),
        opened: sql<number>`COUNT(CASE WHEN ${emailSends.openedAt} IS NOT NULL THEN 1 END)`,
        clicked: sql<number>`COUNT(CASE WHEN ${emailSends.clickedAt} IS NOT NULL THEN 1 END)`,
      }).from(emailSends).where(
        gte(emailSends.sentAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      ),
    ]);

    const totalLeads = leadsResult[0]?.count || 0;
    const totalQuizLeads = quizLeadsResult[0]?.count || 0;
    const totalMembers = membersResult[0]?.count || 0;
    const totalClients = clientsResult[0]?.count || 0;
    const totalWebsiteSignups = websiteSignupsResult[0]?.count || 0;
    const totalContacts = totalLeads + totalQuizLeads + totalMembers + totalClients + totalWebsiteSignups;

    const totalTemplates = templatesResult[0]?.count || 0;
    const totalCampaigns = campaignsResult[0]?.count || 0;
    const totalDrips = dripsResult[0]?.count || 0;
    const recentSends = recentSendsResult[0]?.count || 0;

    const emailStats = emailStatsResult[0] || { total: 0, opened: 0, clicked: 0 };
    const openRate = emailStats.total > 0
      ? `${((emailStats.opened / emailStats.total) * 100).toFixed(1)}%`
      : '0%';
    const clickRate = emailStats.total > 0
      ? `${((emailStats.clicked / emailStats.total) * 100).toFixed(1)}%`
      : '0%';

    return NextResponse.json({
      totalContacts,
      totalLeads,
      totalQuizLeads,
      totalMembers,
      totalClients,
      totalWebsiteSignups,
      totalTemplates,
      totalCampaigns,
      totalDrips,
      recentSends,
      openRate,
      clickRate,
    });
  } catch (error) {
    console.error('Error fetching email marketing stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
