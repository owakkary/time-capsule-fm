import { NextRequest, NextResponse } from 'next/server';
import { getMoments } from '@/lib/firebase-admin';
import { EmpireId } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const empireId = searchParams.get('empire') as EmpireId | null;

    const moments = getMoments(empireId || undefined);

    return NextResponse.json({
      moments,
      total: moments.length,
      ...(empireId && { empire: empireId }),
    });
  } catch (error) {
    console.error('Error fetching moments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moments' },
      { status: 500 }
    );
  }
}
