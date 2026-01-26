import { NextRequest, NextResponse } from 'next/server';
import { getEmpires } from '@/lib/firebase-admin';
import { EpochId } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const epochId = searchParams.get('epoch') as EpochId | null;

    const empires = getEmpires(epochId || undefined);

    return NextResponse.json({
      empires,
      total: empires.length,
      ...(epochId && { epoch: epochId }),
    });
  } catch (error) {
    console.error('Error fetching empires:', error);
    return NextResponse.json(
      { error: 'Failed to fetch empires' },
      { status: 500 }
    );
  }
}
