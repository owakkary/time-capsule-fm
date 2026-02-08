'use client';

import dynamic from 'next/dynamic';
import { EpochId, EmpireId } from '@/types';

const LeafletMap = dynamic(() => import('./maps/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="map-container w-full aspect-[5/3] flex items-center justify-center">
      <div className="loading-vintage" />
    </div>
  ),
});

interface HistoricalMapProps {
  epochId: EpochId;
  onSelectEmpire?: (empireId: EmpireId) => void;
}

export default function HistoricalMap({
  epochId,
  onSelectEmpire,
}: HistoricalMapProps) {
  return (
    <LeafletMap
      epochId={epochId}
      onSelectEmpire={onSelectEmpire}
    />
  );
}
