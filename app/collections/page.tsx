'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CollectionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to accolades page with collections tab
    router.replace('/accolades');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading-vintage" />
    </div>
  );
}
