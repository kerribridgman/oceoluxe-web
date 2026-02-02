import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { emailList } from '@/lib/db/schema';
import { desc, eq, or, ilike, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const source = searchParams.get('source');
    const search = searchParams.get('search')?.trim();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const conditions = [];

    if (source && source !== 'all') {
      conditions.push(eq(emailList.source, source));
    }

    if (search && search.length >= 2) {
      const pattern = `%${search}%`;
      conditions.push(
        or(
          ilike(emailList.email, pattern),
          ilike(emailList.firstName, pattern),
          ilike(emailList.lastName, pattern)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [contacts, countResult] = await Promise.all([
      db
        .select()
        .from(emailList)
        .where(where)
        .orderBy(desc(emailList.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(emailList)
        .where(where),
    ]);

    return NextResponse.json({
      contacts,
      total: countResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((countResult[0]?.count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
