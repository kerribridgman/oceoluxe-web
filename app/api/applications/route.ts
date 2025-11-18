import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { applications } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      socialHandle,
      interest,
      experiences,
      growthAreas,
      obstacles,
      willingToInvest,
      additionalInfo,
    } = body;

    // Validate required fields
    if (!type || !name || !email || !phone || !socialHandle || !interest || !experiences || !growthAreas || !obstacles || !willingToInvest) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate application type
    if (type !== 'coaching' && type !== 'entrepreneur-circle') {
      return NextResponse.json(
        { message: 'Invalid application type' },
        { status: 400 }
      );
    }

    // Insert application into database
    await db.insert(applications).values({
      type,
      name,
      email,
      phone,
      socialHandle,
      interest,
      experiences,
      growthAreas,
      obstacles,
      willingToInvest,
      additionalInfo: additionalInfo || null,
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const allApplications = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));

    return NextResponse.json({ applications: allApplications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
