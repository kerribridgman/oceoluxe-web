import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db/queries-progress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const leaderboard = await getLeaderboard(limit);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
