import MapHeat from '@/components/MapHeat';
import { getPulseData } from '@/lib/getPulseData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MapPage = async () => {
  const averaged = await getPulseData();

  return (
    <main>
      <h2 className="text-center mb-3">Map View</h2>
      <MapHeat data={averaged} />
      <p className="text-center text-muted mt-3">
        Green indicates low activity, yellow indicates moderate activity, and red indicates high activity.
      </p>
    </main>
  );
};

export default MapPage;