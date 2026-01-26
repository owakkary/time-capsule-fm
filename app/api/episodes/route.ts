import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getAdminDb } from '@/lib/firebase-admin';

// GET /api/episodes - List user's episodes
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Query user's episodes, ordered by creation date
    const episodesSnap = await getAdminDb()
      .collection('episodes')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const episodes = episodesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to ISO string
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ episodes });

  } catch (error) {
    console.error('Fetch episodes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}

// DELETE /api/episodes?id=xxx - Delete an episode
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('id');

    if (!episodeId) {
      return NextResponse.json(
        { error: 'Missing episode ID' },
        { status: 400 }
      );
    }

    // Verify user owns this episode before deleting
    const episodeRef = getAdminDb().collection('episodes').doc(episodeId);
    const episodeSnap = await episodeRef.get();

    if (!episodeSnap.exists) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    if (episodeSnap.data()?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await episodeRef.delete();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete episode' },
      { status: 500 }
    );
  }
}
