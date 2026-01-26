import { NextRequest, NextResponse } from 'next/server';
import { getFigure } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const figure = getFigure(id);

    if (!figure) {
      return NextResponse.json(
        { error: 'Figure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(figure);
  } catch (error) {
    console.error('Error fetching figure:', error);
    return NextResponse.json(
      { error: 'Failed to fetch figure' },
      { status: 500 }
    );
  }
}
