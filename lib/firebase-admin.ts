import { filterByAvailableEmpire, getAvailableEpochs, isContentTypeAvailable, isEmpireAvailable } from '@/lib/availability';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import {
  EPOCHS,
  EMPIRES,
  EpochId,
  EmpireId,
  KeyFigure,
  KeyMoment,
  Perspective,
  EmpireOverview,
  getEmpiresForEpoch,
} from '@/types';
import {
  KEY_FIGURES,
  getFiguresByEmpire,
  getFigureById,
} from '@/lib/seed-data/figures';
import {
  KEY_MOMENTS,
  getMomentsByEmpire,
  getMomentById,
} from '@/lib/seed-data/moments';
import {
  PERSPECTIVES,
  getPerspectivesByEmpire,
  getPerspectiveById,
} from '@/lib/seed-data/perspectives';
import {
  EMPIRE_OVERVIEWS,
  getOverviewByEmpire,
  getAllOverviews,
} from '@/lib/seed-data/overviews';

// Lazy initialization - only initialize when actually needed at runtime
let _adminApp: App | null = null;
let _adminAuth: Auth | null = null;
let _adminDb: Firestore | null = null;
let _adminStorage: Storage | null = null;

function getFirebaseAdmin(): App {
  if (_adminApp) {
    return _adminApp;
  }

  if (getApps().length > 0) {
    _adminApp = getApps()[0];
    return _adminApp;
  }

  // Only initialize if we have the required env vars (runtime only)
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('Firebase Admin SDK requires FIREBASE_PROJECT_ID environment variable');
  }

  // Initialize with service account credentials
  _adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newlines in private key from env var
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return _adminApp;
}

// Lazy getters for Firebase services
export function getAdminAuth(): Auth {
  if (!_adminAuth) {
    _adminAuth = getAuth(getFirebaseAdmin());
  }
  return _adminAuth;
}

export function getAdminDb(): Firestore {
  if (!_adminDb) {
    _adminDb = getFirestore(getFirebaseAdmin());
  }
  return _adminDb;
}

export function getAdminStorage(): Storage {
  if (!_adminStorage) {
    _adminStorage = getStorage(getFirebaseAdmin());
  }
  return _adminStorage;
}

// Legacy exports for backward compatibility (now using lazy getters)
export const adminAuth = { get current() { return getAdminAuth(); } };
export const adminDb = { get current() { return getAdminDb(); } };
export const adminStorage = { get current() { return getAdminStorage(); } };

// Helper to verify ID token from request
export async function verifyAuthToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// ============================================
// EPOCH FUNCTIONS
// ============================================

// Every catalog reader below is scoped to the available empires, so the API
// can't hand out content the UI deliberately hides.
export function getEpochs() {
  return getAvailableEpochs().map(epoch => {
    const empiresList = getEmpiresForEpoch(epoch.id as EpochId).filter(e => isEmpireAvailable(e.id));
    return {
      ...epoch,
      empireCount: empiresList.length,
      empiresList,
    };
  });
}

export function getEpochById(epochId: EpochId) {
  const epoch = EPOCHS.find(e => e.id === epochId);
  if (!epoch) return null;

  return {
    ...epoch,
    empireCount: epoch.empires.length,
    empiresList: getEmpiresForEpoch(epochId),
  };
}

// ============================================
// EMPIRE FUNCTIONS
// ============================================

export function getEmpires(epochId?: EpochId) {
  const available = EMPIRES.filter(e => isEmpireAvailable(e.id));
  if (epochId) {
    return available.filter(e => e.epochId === epochId);
  }
  return available;
}

export function getEmpireById(empireId: EmpireId) {
  const empire = EMPIRES.find(e => e.id === empireId);
  if (!empire) return null;

  return {
    ...empire,
    figures: getFiguresByEmpire(empireId),
    moments: getMomentsByEmpire(empireId),
    perspectives: getPerspectivesByEmpire(empireId),
    overview: getOverviewByEmpire(empireId),
    contentCounts: {
      figures: getFiguresByEmpire(empireId).length,
      moments: getMomentsByEmpire(empireId).length,
      perspectives: getPerspectivesByEmpire(empireId).length,
      overview: getOverviewByEmpire(empireId) ? 1 : 0,
    },
  };
}

// ============================================
// FIGURES FUNCTIONS
// ============================================

export function getFigures(empireId?: EmpireId): KeyFigure[] {
  if (empireId) {
    return isEmpireAvailable(empireId) ? getFiguresByEmpire(empireId) : [];
  }
  return filterByAvailableEmpire(KEY_FIGURES);
}

export function getFigure(id: string): KeyFigure | undefined {
  return getFigureById(id);
}

// ============================================
// MOMENTS FUNCTIONS
// ============================================

export function getMoments(empireId?: EmpireId): KeyMoment[] {
  if (empireId) {
    return isEmpireAvailable(empireId) ? getMomentsByEmpire(empireId) : [];
  }
  return filterByAvailableEmpire(KEY_MOMENTS);
}

export function getMoment(id: string): KeyMoment | undefined {
  return getMomentById(id);
}

// ============================================
// PERSPECTIVES FUNCTIONS
// ============================================

export function getPerspectives(empireId?: EmpireId): Perspective[] {
  if (!isContentTypeAvailable('perspective')) return [];
  if (empireId) {
    return isEmpireAvailable(empireId) ? getPerspectivesByEmpire(empireId) : [];
  }
  return filterByAvailableEmpire(PERSPECTIVES);
}

export function getPerspective(id: string): Perspective | undefined {
  return getPerspectiveById(id);
}

// ============================================
// OVERVIEWS FUNCTIONS
// ============================================

export function getOverviews(): EmpireOverview[] {
  return getAllOverviews();
}

export function getOverview(empireId: EmpireId): EmpireOverview | undefined {
  return getOverviewByEmpire(empireId);
}

// ============================================
// SEED DATA FUNCTIONS (for Firestore migration)
// ============================================

export async function seedFiguresToFirestore() {
  const db = getAdminDb();
  const batch = db.batch();

  for (const figure of KEY_FIGURES) {
    const ref = db.collection('keyFigures').doc(figure.id);
    batch.set(ref, figure);
  }

  await batch.commit();
  return { seeded: KEY_FIGURES.length };
}

export async function seedMomentsToFirestore() {
  const db = getAdminDb();
  const batch = db.batch();

  for (const moment of KEY_MOMENTS) {
    const ref = db.collection('keyMoments').doc(moment.id);
    batch.set(ref, moment);
  }

  await batch.commit();
  return { seeded: KEY_MOMENTS.length };
}

export async function seedPerspectivesToFirestore() {
  const db = getAdminDb();
  const batch = db.batch();

  for (const perspective of PERSPECTIVES) {
    const ref = db.collection('perspectives').doc(perspective.id);
    batch.set(ref, perspective);
  }

  await batch.commit();
  return { seeded: PERSPECTIVES.length };
}

export async function seedOverviewsToFirestore() {
  const db = getAdminDb();
  const batch = db.batch();

  for (const overview of EMPIRE_OVERVIEWS) {
    const ref = db.collection('empireOverviews').doc(overview.id);
    batch.set(ref, overview);
  }

  await batch.commit();
  return { seeded: EMPIRE_OVERVIEWS.length };
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

export async function migrateEpisodesToNewSchema() {
  const LEGACY_ERA_TO_EMPIRE: Record<string, string | 'archived'> = {
    'ancient-egypt': 'ancient-egypt',
    'classical-greece': 'classical-greece',
    'roman-empire': 'roman-empire',
    'medieval-europe': 'archived',
    'renaissance': 'archived',
    'american-revolution': 'united-states',
  };

  const EMPIRE_TO_EPOCH: Record<string, string> = {
    'ancient-egypt': 'ancient-world',
    'persian-empire': 'ancient-world',
    'classical-greece': 'ancient-world',
    'roman-empire': 'ancient-world',
    'british-empire': 'revolutionary-period',
    'french-empire': 'revolutionary-period',
    'spanish-empire': 'revolutionary-period',
    'qing-china': 'revolutionary-period',
    'united-states': 'revolutionary-period',
  };

  const db = getAdminDb();
  const episodesSnapshot = await db.collection('episodes').get();
  const batch = db.batch();
  let migrated = 0;
  let archived = 0;

  for (const doc of episodesSnapshot.docs) {
    const data = doc.data();

    // Skip if already migrated
    if (data.empire && data.epoch) continue;

    const legacyTimePeriod = data.timePeriod;
    const newEmpire = LEGACY_ERA_TO_EMPIRE[legacyTimePeriod];

    if (newEmpire === 'archived') {
      // Mark as archived
      batch.update(doc.ref, {
        archived: true,
        archiveReason: 'Legacy time period not in current epochs',
      });
      archived++;
    } else if (newEmpire) {
      // Migrate to new schema
      batch.update(doc.ref, {
        empire: newEmpire,
        epoch: EMPIRE_TO_EPOCH[newEmpire],
        contentType: 'overview', // Legacy episodes are generic overviews
      });
      migrated++;
    }
  }

  await batch.commit();
  return { migrated, archived, total: episodesSnapshot.size };
}
