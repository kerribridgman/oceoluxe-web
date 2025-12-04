import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getAchievementById, updateAchievement, deleteAchievement } from '@/lib/db/queries-achievements';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const achievementId = parseInt(id);

    if (isNaN(achievementId)) {
      return NextResponse.json({ error: 'Invalid achievement ID' }, { status: 400 });
    }

    const achievement = await getAchievementById(achievementId);

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ achievement });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievement' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const achievementId = parseInt(id);

    if (isNaN(achievementId)) {
      return NextResponse.json({ error: 'Invalid achievement ID' }, { status: 400 });
    }

    const body = await request.json();
    const achievement = await updateAchievement(achievementId, body);

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ achievement });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const achievementId = parseInt(id);

    if (isNaN(achievementId)) {
      return NextResponse.json({ error: 'Invalid achievement ID' }, { status: 400 });
    }

    const deleted = await deleteAchievement(achievementId);

    if (!deleted) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}
