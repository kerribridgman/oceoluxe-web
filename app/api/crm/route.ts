import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { leads, users, educationSubscriptions, userProfiles } from '@/lib/db/schema';
import { eq, desc, and, sql, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'waitlist';

    if (tab === 'waitlist') {
      // Get waitlist leads
      const waitlistLeads = await db.query.leads.findMany({
        where: eq(leads.source, 'studio_waitlist'),
        orderBy: [desc(leads.createdAt)],
      });

      // Calculate stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const thisWeekSignups = waitlistLeads.filter(
        (lead) => new Date(lead.createdAt) >= oneWeekAgo
      ).length;

      // Check for conversions (waitlist emails that became members)
      const waitlistEmails = waitlistLeads.map((l) => l.email.toLowerCase());
      const convertedUsers = await db
        .select({ email: users.email })
        .from(users)
        .innerJoin(educationSubscriptions, eq(users.id, educationSubscriptions.userId))
        .where(eq(educationSubscriptions.status, 'active'));

      const convertedCount = convertedUsers.filter((u) =>
        waitlistEmails.includes(u.email.toLowerCase())
      ).length;

      const conversionRate =
        waitlistLeads.length > 0
          ? ((convertedCount / waitlistLeads.length) * 100).toFixed(1)
          : '0';

      return NextResponse.json({
        data: waitlistLeads,
        stats: {
          total: waitlistLeads.length,
          thisWeek: thisWeekSignups,
          converted: convertedCount,
          conversionRate: `${conversionRate}%`,
        },
      });
    }

    if (tab === 'members') {
      // Get active members with their subscription info
      const activeMembers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
          subscriptionId: educationSubscriptions.id,
          tier: educationSubscriptions.tier,
          status: educationSubscriptions.status,
          currentPeriodEnd: educationSubscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: educationSubscriptions.cancelAtPeriodEnd,
          memberSince: educationSubscriptions.createdAt,
          points: userProfiles.points,
          lastActivityAt: userProfiles.lastActivityAt,
        })
        .from(users)
        .innerJoin(educationSubscriptions, eq(users.id, educationSubscriptions.userId))
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(
          and(
            eq(educationSubscriptions.status, 'active'),
          )
        )
        .orderBy(desc(educationSubscriptions.createdAt));

      // Also get trialing members
      const trialingMembers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
          subscriptionId: educationSubscriptions.id,
          tier: educationSubscriptions.tier,
          status: educationSubscriptions.status,
          currentPeriodEnd: educationSubscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: educationSubscriptions.cancelAtPeriodEnd,
          memberSince: educationSubscriptions.createdAt,
          points: userProfiles.points,
          lastActivityAt: userProfiles.lastActivityAt,
        })
        .from(users)
        .innerJoin(educationSubscriptions, eq(users.id, educationSubscriptions.userId))
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(eq(educationSubscriptions.status, 'trialing'))
        .orderBy(desc(educationSubscriptions.createdAt));

      const allMembers = [...activeMembers, ...trialingMembers];

      // Calculate stats
      const atRiskCount = allMembers.filter((m) => m.cancelAtPeriodEnd).length;

      // Estimate MRR (simplified - just count monthly equivalents)
      const monthlyCount = allMembers.filter(
        (m) => m.tier === 'monthly' || m.tier === 'earlyBird_monthly'
      ).length;
      const yearlyCount = allMembers.filter(
        (m) => m.tier === 'yearly' || m.tier === 'earlyBird_yearly'
      ).length;
      // Assuming $33/mo for monthly and $297/yr ($24.75/mo) for yearly
      const estimatedMRR = monthlyCount * 33 + yearlyCount * 24.75;

      return NextResponse.json({
        data: allMembers,
        stats: {
          total: allMembers.length,
          active: activeMembers.length,
          trialing: trialingMembers.length,
          atRisk: atRiskCount,
          estimatedMRR: `$${estimatedMRR.toFixed(0)}`,
        },
      });
    }

    if (tab === 'churned') {
      // Get churned members
      const churnedMembers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          subscriptionId: educationSubscriptions.id,
          tier: educationSubscriptions.tier,
          status: educationSubscriptions.status,
          memberSince: educationSubscriptions.createdAt,
          churnedAt: educationSubscriptions.updatedAt,
        })
        .from(users)
        .innerJoin(educationSubscriptions, eq(users.id, educationSubscriptions.userId))
        .where(eq(educationSubscriptions.status, 'canceled'))
        .orderBy(desc(educationSubscriptions.updatedAt));

      // Calculate stats
      const totalActiveAndChurned = await db
        .select({ count: sql<number>`count(*)` })
        .from(educationSubscriptions);

      const totalCount = Number(totalActiveAndChurned[0]?.count || 0);
      const churnRate =
        totalCount > 0
          ? ((churnedMembers.length / totalCount) * 100).toFixed(1)
          : '0';

      // Calculate average membership duration
      const durations = churnedMembers.map((m) => {
        const start = new Date(m.memberSince!);
        const end = new Date(m.churnedAt!);
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
      });
      const avgDurationDays =
        durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;

      return NextResponse.json({
        data: churnedMembers,
        stats: {
          total: churnedMembers.length,
          churnRate: `${churnRate}%`,
          avgMembershipDays: Math.round(avgDurationDays),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching CRM data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CRM data' },
      { status: 500 }
    );
  }
}
