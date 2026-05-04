import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { getHourlyPulseData, getPulseData } from '@/lib/getPulseData';
import { LOCATION_CONFIG } from '@/lib/locationConfig';
import { SLUG_TO_LOCATION } from '@/lib/locationSlugs';

type DataSource = 'LIVE' | 'PREDICTED' | 'NO_DATA' | 'AFTER_HOURS';

const getStatus = (occupancy: number | null | undefined) => {
  if (occupancy === null || occupancy === undefined) return 'AFTER HOURS';
  if (occupancy <= 30) return 'LOW';
  if (occupancy <= 70) return 'MODERATE';
  return 'VERY BUSY';
};

const getStatusColor = (occupancy: number | null | undefined) => {
  if (occupancy === null || occupancy === undefined) return 'text-secondary';
  if (occupancy <= 30) return 'text-success';
  if (occupancy <= 70) return 'text-warning';
  return 'text-danger';
};

const getDataSourceLabel = (dataSource?: DataSource) => {
  if (dataSource === 'LIVE') {
    return {
      label: '🔴 LIVE UPDATE',
      description: 'Based on pulse updates submitted within the last hour.',
    };
  }

  if (dataSource === 'PREDICTED') {
    return {
      label: '🟡 PREDICTED STATUS',
      description: 'Based on historical prediction data for this time of day.',
    };
  }

  if (dataSource === 'AFTER_HOURS') {
    return {
      label: '⚪ AFTER HOURS',
      description: 'This location is currently closed, so current busyness is not shown.',
    };
  }

  return {
    label: '⚪ NO RECENT DATA',
    description: 'No recent live updates or prediction data are available.',
  };
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LocationDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const locationKey = SLUG_TO_LOCATION[slug];

  if (!locationKey) {
    notFound();
  }

  const config = LOCATION_CONFIG[locationKey as keyof typeof LOCATION_CONFIG];

  if (!config) {
    notFound();
  }

  const [pulseData, hourlyPulseData] = await Promise.all([
    getPulseData(),
    getHourlyPulseData(),
  ]);

  const locationPulse = pulseData.find((item) => item.location === locationKey);
  const hourlyAverages =
    hourlyPulseData.find((item) => item.location === locationKey)?.hours ?? [];

  const occupancy = locationPulse?.occupancy ?? null;
  const status = getStatus(occupancy);
  const statusColor = getStatusColor(occupancy);
  const dataSourceInfo = getDataSourceLabel(locationPulse?.dataSource);
  const isAfterHours = locationPulse?.dataSource === 'AFTER_HOURS';

  return (
    <main className="bg-light py-4">
      <Container fluid className="px-5">
        <div className="mb-4">
          <Link href="/locations" className="text-success text-decoration-none fw-semibold">
            ← Back to Locations
          </Link>
        </div>

        <section
          className="text-white p-5 mb-4"
          style={{
            backgroundColor: '#2f7254',
            borderRadius: '2rem',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
          }}
        >
          <Row className="align-items-center">
            <Col md={7}>
              <span
                className="px-3 py-2 rounded-pill small fw-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
              >
                {dataSourceInfo.label}
              </span>

              <h1 className="display-2 fw-bold mt-4 mb-4">
                {config.label}
              </h1>

              <p className="fs-4 mb-3" style={{ maxWidth: '560px' }}>
                {config.description}
              </p>

              <p className="mb-2" style={{ maxWidth: '560px', opacity: 0.9 }}>
                {dataSourceInfo.description}
              </p>

              {locationPulse && (
                <p className="mb-0 fw-semibold" style={{ maxWidth: '560px', opacity: 0.95 }}>
                  {locationPulse.hoursStatus} • Today: {locationPulse.todayHours}
                </p>
              )}
            </Col>

            <Col md={5} className="text-center">
              {isAfterHours ? (
                <>
                  <div className="display-3 fw-bold">AFTER HOURS</div>
                  <div
                    className="bg-white text-secondary fw-bold rounded-pill px-5 py-3 d-inline-block mt-3"
                    style={{ letterSpacing: '0.12rem' }}
                  >
                    CLOSED
                  </div>
                </>
              ) : (
                <>
                  <div className="display-1 fw-bold">{occupancy ?? 0}%</div>
                  <div
                    className={`bg-white ${statusColor} fw-bold rounded-pill px-5 py-3 d-inline-block mt-3`}
                    style={{ letterSpacing: '0.12rem' }}
                  >
                    {status}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </section>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '2rem' }}>
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h2 className="fw-bold text-success">Prediction System</h2>
                    <p className="text-secondary">
                      Historical hourly averages from submitted updates
                    </p>
                  </div>

                  <span className="text-success fw-semibold small">
                    {locationPulse?.samples ?? 0} UPDATES
                  </span>
                </div>

                {hourlyAverages.length > 0 ? (
                  <div
                    className="d-flex align-items-end justify-content-between gap-3 mt-5"
                    style={{ height: '220px' }}
                  >
                    {hourlyAverages.map((hour) => (
                      <div key={hour.hour} className="text-center flex-fill">
                        <div className="d-flex align-items-end justify-content-center" style={{ height: '150px' }}>
                          <div
                            title={`${hour.label}: ${hour.occupancy}% average`}
                            style={{
                              width: '100%',
                              maxWidth: '42px',
                              height: `${Math.max(hour.occupancy, 8)}%`,
                              backgroundColor: hour.occupancy > 70 ? '#dc3545' : '#83e6a5',
                              borderRadius: '0.4rem',
                            }}
                          />
                        </div>
                        <small className="text-muted d-block mt-2">{hour.label}</small>
                        <small className="fw-semibold d-block">{hour.occupancy}%</small>
                        <small className="text-secondary d-block">
                          {hour.samples} update{hour.samples === 1 ? '' : 's'}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light rounded-4 text-center p-5 mt-4">
                    <h4 className="text-secondary mb-0">
                      No submitted updates yet for this location.
                    </h4>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card
              className="border-0 shadow-sm text-white h-100"
              style={{
                borderRadius: '2rem',
                backgroundColor: '#006b3f',
              }}
            >
              <div className="p-4 d-flex flex-column justify-content-between h-100">
                <div>
                  <h2 className="fw-bold">Help fellow Warriors</h2>
                  <p className="mt-4">
                    Is it actually busy? Share what you see right now.
                  </p>
                </div>

                <Link href={`/submit?location=${locationKey}`} className="text-decoration-none">
                  <Button
                    variant="light"
                    className="w-100 rounded-pill fw-bold py-3"
                  >
                    Submit a Pulse Update →
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>

          <Col lg={12}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '2rem' }}>
              <div className="p-4">
                <h2 className="fw-bold text-success">
                  What the busyness numbers mean here
                </h2>

                <p className="text-secondary">
                  The same number can mean different things depending on the type and size of the location.
                </p>

                <Row className="mt-3">
                  {Object.entries(config.scale).map(([level, meaning]) => (
                    <Col md={4} key={level} className="mb-3">
                      <div className="bg-light rounded-4 p-3 h-100">
                        <h4 className="fw-bold text-success">{level}</h4>
                        <p className="mb-0">{meaning}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default LocationDetailPage;