import { NextRequest, NextResponse } from 'next/server';
import { validateUnsubscribeToken, processUnsubscribe, UnsubscribeListType } from '@/lib/email/unsubscribe';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const validation = await validateUnsubscribeToken(token);

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, error: validation.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: validation.email,
      firstName: validation.firstName,
      listType: validation.listType,
      currentPreferences: validation.currentPreferences,
    });
  } catch (error) {
    console.error('Error validating unsubscribe token:', error);
    return NextResponse.json(
      { valid: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, listType, reason } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const validListTypes: UnsubscribeListType[] = ['marketing', 'drips', 'all'];
    if (!listType || !validListTypes.includes(listType)) {
      return NextResponse.json(
        { success: false, error: 'Valid list type is required' },
        { status: 400 }
      );
    }

    const result = await processUnsubscribe(token, listType, reason);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing unsubscribe:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
