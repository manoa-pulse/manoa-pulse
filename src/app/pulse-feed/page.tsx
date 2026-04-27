import PulseFeedClient from '@/components/PulseFeedClient';
import { getPulseData } from '@/lib/getPulseData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PulseFeedPage = async () => {
  const pulseData = await getPulseData();

  return <PulseFeedClient pulseData={pulseData} />;
};

export default PulseFeedPage;