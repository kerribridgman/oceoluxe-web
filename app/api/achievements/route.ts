import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getAllAchievements, createAchievement } from '@/lib/db/queries-achievements';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSecret = searchParams.get('includeSecret') === 'true';

    const achievements = await getAllAchievements(includeSecret);
    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, iconUrl, pointsValue, triggerType, triggerValue, isSecret } = body;

    if (!name || !slug || !triggerType) {
      return NextResponse.json(
        { error: 'Name, slug, and trigger type are required' },
        { status: 400 }
      );
    }

    const achievement = await createAchievement({
      name,
      slug,
      description,
      iconUrl,
      pointsValue: pointsValue || 0,
      triggerType,
      triggerValue,
      isSecret: isSecret || false,
    });

    return NextResponse.json({ achievement }, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}
