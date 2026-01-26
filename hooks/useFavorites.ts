'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Favorites {
  figures: string[];
  moments: string[];
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorites>({ figures: [], moments: [] });
  const [loading, setLoading] = useState(true);

  // Load favorites from Firestore when user logs in
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || !db) {
        setLoading(false);
        return;
      }

      try {
        const favRef = doc(db, 'users', user.uid, 'preferences', 'favorites');
        const favSnap = await getDoc(favRef);

        if (favSnap.exists()) {
          setFavorites(favSnap.data() as Favorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Save favorites to Firestore
  const saveFavorites = async (newFavorites: Favorites) => {
    if (!user || !db) return;

    try {
      const favRef = doc(db, 'users', user.uid, 'preferences', 'favorites');
      await setDoc(favRef, newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFigureFavorite = (figureId: string) => {
    setFavorites(prev => {
      const newFavorites = {
        ...prev,
        figures: prev.figures.includes(figureId)
          ? prev.figures.filter(id => id !== figureId)
          : [...prev.figures, figureId]
      };
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const toggleMomentFavorite = (momentId: string) => {
    setFavorites(prev => {
      const newFavorites = {
        ...prev,
        moments: prev.moments.includes(momentId)
          ? prev.moments.filter(id => id !== momentId)
          : [...prev.moments, momentId]
      };
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFigureFavorite = (figureId: string) => favorites.figures.includes(figureId);
  const isMomentFavorite = (momentId: string) => favorites.moments.includes(momentId);

  return {
    favorites,
    loading,
    toggleFigureFavorite,
    toggleMomentFavorite,
    isFigureFavorite,
    isMomentFavorite,
  };
}
