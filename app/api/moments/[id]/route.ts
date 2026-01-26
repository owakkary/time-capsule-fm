import { NextRequest, NextResponse } from 'next/server';
import { getMoment } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const moment = getMoment(id);

    if (!moment) {
      return NextResponse.json(
        { error: 'Moment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(moment);
  } catch (error) {
    console.error('Error fetching moment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moment' },
      { status: 500 }
    );
  }
}
