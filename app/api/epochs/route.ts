import { NextResponse } from 'next/server';
import { getEpochs } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const epochs = getEpochs();

    return NextResponse.json({
      epochs,
      total: epochs.length,
    });
  } catch (error) {
    console.error('Error fetching epochs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch epochs' },
      { status: 500 }
    );
  }
}
