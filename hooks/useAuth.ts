'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

    // Completes the signInWithRedirect round-trip (the fallback used where
    // popups aren't available). Errors here are non-fatal: the user simply
    // isn't signed in, and the login page still works.
    getRedirectResult(auth).catch(() => {});

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
      // Popups don't exist in installed home-screen apps (iOS standalone
      // mode) and some in-app browsers — fall back to the full-page redirect
      // flow. onAuthStateChanged picks the user up when we land back.
      const popupUnavailable = [
        'auth/popup-blocked',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment',
      ].includes(error.code);
      if (popupUnavailable) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { user: null, error: null }; // page is navigating away
        } catch (redirectError: any) {
          return { user: null, error: redirectError.message };
        }
      }
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
