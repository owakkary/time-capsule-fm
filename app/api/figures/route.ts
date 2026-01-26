import { NextRequest, NextResponse } from 'next/server';
import { getFigures } from '@/lib/firebase-admin';
import { EmpireId } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empireId = searchParams.get('empire') as EmpireId | null;

    const figures = getFigures(empireId || undefined);

    return NextResponse.json({
      figures,
      total: figures.length,
      ...(empireId && { empire: empireId }),
    });
  } catch (error) {
    console.error('Error fetching figures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch figures' },
      { status: 500 }
    );
  }
}
