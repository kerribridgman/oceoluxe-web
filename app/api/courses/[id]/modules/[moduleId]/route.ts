import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getModuleById, updateModule, deleteModule } from '@/lib/db/queries-courses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const id = parseInt(moduleId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const module = await getModuleById(id);

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ module });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;
    const id = parseInt(moduleId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const body = await request.json();
    const module = await updateModule(id, body);

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ module });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;
    const id = parseInt(moduleId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const deleted = await deleteModule(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}
