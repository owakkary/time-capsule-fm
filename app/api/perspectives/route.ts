import { NextRequest, NextResponse } from 'next/server';
import { getPerspectives } from '@/lib/firebase-admin';
import { EmpireId } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empireId = searchParams.get('empire') as EmpireId | null;

    const perspectives = getPerspectives(empireId || undefined);

    return NextResponse.json({
      perspectives,
      total: perspectives.length,
      ...(empireId && { empire: empireId }),
    });
  } catch (error) {
    console.error('Error fetching perspectives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch perspectives' },
      { status: 500 }
    );
  }
}
