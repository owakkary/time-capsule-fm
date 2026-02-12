'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { createInitialExplorerProfile } from '@/lib/xp';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // Create/update user profile in Firestore on sign in
      if (user && db) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Also create explorer profile for new users
          const explorerRef = doc(db, 'users', user.uid, 'explorer', 'profile');
          const explorerProfile = createInitialExplorerProfile(user.uid);
          await setDoc(explorerRef, {
            ...explorerProfile,
            lastActivityDate: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return { user: null, error: 'Auth not initialized' };
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) return { user: null, error: 'Auth not initialized' };
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) return { user: null, error: 'Auth not initialized' };
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signOut = async () => {
    if (!auth) return { error: 'Auth not initialized' };
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  // Get ID token for API calls (stable reference — only changes when user changes)
  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return await user.getIdToken();
  }, [user]);

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    getIdToken,
  };
}
