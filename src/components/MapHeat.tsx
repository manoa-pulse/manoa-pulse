'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MAP_ZONES } from '@/lib/mapZones';
import { getHeatColor } from '@/lib/heatColors';
import { LOCATION_LABELS } from '@/lib/locationLabels';

type MapHeatProps = {
  data: {
    location: string;
    busyLevel: number;
    occupancy: number;
    dataSource?: 'LIVE' | 'PREDICTED' | 'NO_DATA';
  }[];
};

const LOCATION_HREFS: Record<string, string> = {
  HamiltonLibrary: '/locations/hamilton-library',
  WarriorRecreationCenter: '/locations/warrior-recreation-center',
  CampusCenterFoodCourt: '/locations/campus-center-food-court',
  CampusCenterOutdoorCourt: '/locations/campus-center-outdoor-court',
  TacoBellFoodCourt: '/locations/taco-bell-food-court',
  ParadisePalms: '/locations/paradise-palms',
  POST2ndFloor: '/locations/post-2nd-floor',
};

const getSourceBorderStyle = (dataSource?: 'LIVE' | 'PREDICTED' | 'NO_DATA') => {
  if (dataSource === 'LIVE') {
    return {
      border: '4px solid #0b5d3b',
      boxShadow: '0 0 0 2px rgba(11, 93, 59, 0.12), 0 10px 24px rgba(11, 93, 59, 0.18)',
    };
  }

  if (dataSource === 'PREDICTED') {
    return {
      border: '4px solid #d4a017',
      boxShadow: '0 0 0 2px rgba(212, 160, 23, 0.12), 0 10px 24px rgba(212, 160, 23, 0.18)',
    };
  }

  return {
    border: '4px solid #6c757d',
    boxShadow: '0 0 0 2px rgba(108, 117, 125, 0.12), 0 10px 24px rgba(108, 117, 125, 0.18)',
  };
};

const MapHeat = ({ data }: MapHeatProps) => (
  <div className="d-flex justify-content-center">
    <div
      className="position-relative"
      style={{
        width: '900px',
        maxWidth: '100%',
      }}
    >
      <Image
        src="/HeatMap.png"
        alt="Campus Map"
        width={900}
        height={700}
        className="img-fluid d-block"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />

      {data.map((entry) => {
        const zone = MAP_ZONES[entry.location as keyof typeof MAP_ZONES];

        if (!zone) {
          return null;
        }

        const percent = entry.occupancy ?? Math.round(entry.busyLevel * 10);
        const label = LOCATION_LABELS[entry.location] ?? entry.location;
        const href = LOCATION_HREFS[entry.location];
        const sourceBorderStyle = getSourceBorderStyle(entry.dataSource);

        const heatZone = (
          <div
            style={{
              position: 'absolute',
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
              backgroundColor: getHeatColor(entry.busyLevel),
              borderRadius: '16px',
              opacity: 0.78,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#1f2937',
              fontWeight: 700,
              fontSize: '0.78rem',
              lineHeight: 1.15,
              padding: '8px 6px',
              cursor: href ? 'pointer' : 'default',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              ...sourceBorderStyle,
            }}
          >
            <div>
              <div>{label}</div>
              <div>{percent}%</div>
            </div>
          </div>
        );

        if (!href) {
          return <div key={entry.location}>{heatZone}</div>;
        }

        return (
          <Link
            key={entry.location}
            href={href}
            aria-label={`View ${label} details`}
            style={{ textDecoration: 'none' }}
          >
            {heatZone}
          </Link>
        );
      })}
    </div>
  </div>
);

export default MapHeat;