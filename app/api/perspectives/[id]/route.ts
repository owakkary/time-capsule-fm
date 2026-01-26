import { NextRequest, NextResponse } from 'next/server';
import { getPerspective } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const perspective = getPerspective(id);

    if (!perspective) {
      return NextResponse.json(
        { error: 'Perspective not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(perspective);
  } catch (error) {
    console.error('Error fetching perspective:', error);
    return NextResponse.json(
      { error: 'Failed to fetch perspective' },
      { status: 500 }
    );
  }
}
