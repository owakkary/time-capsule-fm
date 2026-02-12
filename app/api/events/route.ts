import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { EngagementEvent, EngagementEventType } from '@/types';
import { updateInterestProfileCounters } from '@/lib/interest-profile';

const VALID_EVENT_TYPES: EngagementEventType[] = [
  'episode_started',
  'episode_completed',
  'episode_abandoned',
  'episode_replayed',
  'recommendation_clicked',
  'recommendation_skipped',
];

// POST /api/events - Record an engagement event
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const db = getAdminDb();

    const body = await request.json();
    const {
      eventType,
      episodeId,
      empire,
      epoch,
      contentType,
      contentId,
      completionPercentage,
      recommendationId,
      metadata,
    } = body;

    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid or missing eventType' },
        { status: 400 }
      );
    }

    const eventData = {
      userId,
      eventType,
      ...(episodeId && { episodeId }),
      ...(empire && { empire }),
      ...(epoch && { epoch }),
      ...(contentType && { contentType }),
      ...(contentId && { contentId }),
      ...(completionPercentage !== undefined && { completionPercentage }),
      ...(recommendationId && { recommendationId }),
      ...(metadata && { metadata }),
      createdAt: FieldValue.serverTimestamp(),
    };

    // Write event to Firestore
    await db
      .collection(`users/${userId}/explorer/profile/events`)
      .add(eventData);

    // Update interest profile counters
    await updateInterestProfileCounters(db, userId, {
      eventType,
      episodeId,
      empire,
      epoch,
      contentType,
      contentId,
      completionPercentage,
      userId,
      createdAt: new Date(),
    } as EngagementEvent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Post event error:', error);
    return NextResponse.json(
      { error: 'Failed to record event' },
      { status: 500 }
    );
  }
}
