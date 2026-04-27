import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { getPulseData } from '@/lib/getPulseData';
import { LOCATION_CONFIG } from '@/lib/locationConfig';
import { SLUG_TO_LOCATION } from '@/lib/locationSlugs';

const getStatus = (occupancy: number) => {
  if (occupancy <= 30) return 'LOW';
  if (occupancy <= 70) return 'MODERATE';
  return 'VERY BUSY';
};

const getStatusColor = (occupancy: number) => {
  if (occupancy <= 30) return 'text-success';
  if (occupancy <= 70) return 'text-warning';
  return 'text-danger';
};

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

  const pulseData = await getPulseData();
  const locationPulse = pulseData.find((item) => item.location === locationKey);

  const occupancy = locationPulse?.occupancy ?? 0;
  const status = getStatus(occupancy);
  const statusColor = getStatusColor(occupancy);

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
                🔴 LIVE STATUS
              </span>

              <h1 className="display-2 fw-bold mt-4 mb-4">
                {config.label}
              </h1>

              <p className="fs-4 mb-0" style={{ maxWidth: '560px' }}>
                {config.description}
              </p>
            </Col>

            <Col md={5} className="text-center">
              <div className="display-1 fw-bold">{occupancy}%</div>
              <div
                className={`bg-white ${statusColor} fw-bold rounded-pill px-5 py-3 d-inline-block mt-3`}
                style={{ letterSpacing: '0.12rem' }}
              >
                {status}
              </div>
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
                    <p className="text-secondary">Historical busyness trends for today</p>
                  </div>

                  <span className="text-success fw-semibold small">TODAY</span>
                </div>

                <div
                  className="d-flex align-items-end justify-content-between mt-5"
                  style={{ height: '180px' }}
                >
                  {[20, 35, 60, occupancy, 75, 45, 25].map((height, index) => (
                    <div key={index} className="text-center">
                      <div
                        style={{
                          width: '36px',
                          height: `${Math.max(height, 8)}%`,
                          backgroundColor: index === 3 ? '#dc3545' : '#83e6a5',
                          borderRadius: '0.4rem',
                        }}
                      />
                      <small className="text-muted d-block mt-2">
                        {['8A', '10A', '12P', '2P', '4P', '6P', '8P'][index]}
                      </small>
                    </div>
                  ))}
                </div>
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

                <Link href="/submit" className="text-decoration-none">
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