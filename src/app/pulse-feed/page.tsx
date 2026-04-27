import PulseFeedClient from '@/components/PulseFeedClient';
import { getPulseData } from '@/lib/getPulseData';

const PulseFeedPage = async () => {
  const pulseData = await getPulseData();

  return <PulseFeedClient pulseData={pulseData} />;
};

export default PulseFeedPage;