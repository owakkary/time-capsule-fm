'use client';

import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { EngagementEvent } from '@/types';

export function useEventLogger() {
  const { getIdToken } = useAuth();

  const logEvent = useCallback(
    (event: Partial<EngagementEvent>) => {
      getIdToken().then((token) => {
        if (!token) return;
        fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(event),
        }).catch(console.error);
      });
    },
    [getIdToken]
  );

  return { logEvent };
}
