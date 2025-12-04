import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { seedDefaultAchievements } from '@/lib/db/queries-achievements';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await seedDefaultAchievements();
    return NextResponse.json({ success: true, message: 'Default achievements seeded' });
  } catch (error) {
    console.error('Error seeding achievements:', error);
    return NextResponse.json(
      { error: 'Failed to seed achievements' },
      { status: 500 }
    );
  }
}
