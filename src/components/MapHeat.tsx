'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MAP_ZONES } from '@/lib/mapZones';
import { getHeatColor } from '@/lib/heatColors';
import { LOCATION_LABELS } from '@/lib/locationLabels';

type MapHeatProps = {
  data: {
    location: string;
    busyLevel: number;
  }[];
};

const LOCATION_LINKS: Record<string, string> = {
  HamiltonLibrary: '/locations/hamilton-library',
  WarriorRecreationCenter: '/locations/warrior-recreation-center',
  CampusCenterFoodCourt: '/locations/campus-center-food-court',
  CampusCenterOutdoorCourt: '/locations/campus-center-outdoor-court',
  TacoBellFoodCourt: '/locations/taco-bell-food-court',
  ParadisePalms: '/locations/paradise-palms',
  POST2ndFloor: '/locations/post-2nd-floor',
};

const MapHeat = ({ data }: MapHeatProps) => {
  const router = useRouter();

  return (
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
          priority
        />

        {data.map((entry) => {
          const zone = MAP_ZONES[entry.location as keyof typeof MAP_ZONES];

          if (!zone) {
            return null;
          }

          const percent = Math.round(entry.busyLevel * 10);
          const label = LOCATION_LABELS[entry.location] ?? entry.location;
          const href = LOCATION_LINKS[entry.location];

          return (
            <div
              key={entry.location}
              role="button"
              tabIndex={0}
              title={`Open ${label}`}
              onClick={() => router.push(href)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  router.push(href);
                }
              }}
              style={{
                position: 'absolute',
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
                backgroundColor: getHeatColor(entry.busyLevel),
                borderRadius: '14px',
                boxShadow: `0 0 24px ${getHeatColor(entry.busyLevel)}`,
                opacity: 0.75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'black',
                fontWeight: 700,
                fontSize: '0.75rem',
                lineHeight: 1.1,
                textShadow: '0 1px 3px rgba(255, 255, 255, 0.55)',
                padding: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'scale(1.05)';
                event.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'scale(1)';
                event.currentTarget.style.opacity = '0.75';
              }}
            >
              <div>
                <div>{label}</div>
                <div>{percent}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapHeat;