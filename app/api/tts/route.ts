import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, getAdminDb, getAdminStorage } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const authHeader = request.headers.get('authorization');
    const decodedToken = await verifyAuthToken(authHeader);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    const body = await request.json();
    const { episodeId, text } = body;

    if (!episodeId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: episodeId, text' },
        { status: 400 }
      );
    }

    // Verify user owns this episode
    const episodeRef = getAdminDb().collection('episodes').doc(episodeId);
    const episodeSnap = await episodeRef.get();

    if (!episodeSnap.exists) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      );
    }

    const episode = episodeSnap.data();
    if (episode?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate audio with ElevenLabs
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate audio' },
        { status: 500 }
      );
    }

    // Get audio as buffer
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    
    // Upload to Firebase Storage
    const bucket = getAdminStorage().bucket();
    const fileName = `episodes/${userId}/${episodeId}.mp3`;
    const file = bucket.file(fileName);

    await file.save(audioBuffer, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Update episode with audio URL
    await episodeRef.update({ audioUrl: publicUrl });

    return NextResponse.json({
      audioUrl: publicUrl,
    });

  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
