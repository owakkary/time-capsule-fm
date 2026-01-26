import { NextRequest, NextResponse } from 'next/server';
import { getEmpireById } from '@/lib/firebase-admin';
import { EmpireId } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const empire = getEmpireById(id as EmpireId);

    if (!empire) {
      return NextResponse.json(
        { error: 'Empire not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(empire);
  } catch (error) {
    console.error('Error fetching empire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch empire' },
      { status: 500 }
    );
  }
}
