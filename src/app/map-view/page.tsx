import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import MapHeat from '@/components/MapHeat';
import { getPulseData } from '@/lib/getPulseData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

const MapPage = async () => {
  const averaged = await getPulseData();

  const liveLocations = averaged.filter((item) => item.dataSource === 'LIVE').length;
  const predictedLocations = averaged.filter((item) => item.dataSource === 'PREDICTED').length;
  const noDataLocations = averaged.filter((item) => item.dataSource === 'NO_DATA').length;

  return (
    <main
      className="py-5"
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f4fbf6 0%, #eef3f8 45%, #ffffff 100%)',
      }}
    >
      <Container fluid className="px-4 px-md-5">
        <section
          className="text-white p-4 p-md-5 mb-4 shadow-lg"
          style={{
            borderRadius: '2rem',
            background:
              'linear-gradient(135deg, #0b5d3b 0%, #117a65 55%, #2a9d8f 100%)',
          }}
        >
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <Badge
                bg="light"
                text="success"
                className="rounded-pill px-3 py-2 mb-3"
              >
                CAMPUS HEAT MAP
              </Badge>

              <h1 className="display-5 fw-bold mb-3">Map View</h1>

              <p className="fs-5 mb-0" style={{ maxWidth: '780px' }}>
                Explore UH Mānoa activity by location. Colored heat zones show
                current busyness using either recent live updates or prediction data.
              </p>
            </Col>

            <Col lg={4}>
              <Row className="g-3">
                <Col sm={4}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
                    <div className="card-body p-3 text-center">
                      <div className="fw-bold text-success fs-3">{liveLocations}</div>
                      <div className="text-secondary small fw-semibold">Live</div>
                    </div>
                  </Card>
                </Col>

                <Col sm={4}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
                    <div className="card-body p-3 text-center">
                      <div className="fw-bold text-warning fs-3">{predictedLocations}</div>
                      <div className="text-secondary small fw-semibold">Predicted</div>
                    </div>
                  </Card>
                </Col>

                <Col sm={4}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '1.25rem' }}>
                    <div className="card-body p-3 text-center">
                      <div className="fw-bold text-secondary fs-3">{noDataLocations}</div>
                      <div className="text-secondary small fw-semibold">No Data</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>

        <Row className="g-4">
          <Col lg={9}>
            <Card
              className="border-0 shadow-sm"
              style={{
                borderRadius: '2rem',
                overflow: 'hidden',
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <h2 className="fw-bold text-success mb-1">Campus Activity Map</h2>
                    <p className="text-secondary mb-0">
                      Click a heat zone to view details for that location.
                    </p>
                  </div>

                  <Button
                    as="a"
                    href="/map-view"
                    variant="success"
                    className="rounded-pill px-4 py-2 fw-semibold"
                  >
                    Refresh Map
                  </Button>
                </div>

                <div
                  className="p-3 p-md-4"
                  style={{
                    backgroundColor: '#f8fbf9',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(11, 93, 59, 0.08)',
                  }}
                >
                  <MapHeat data={averaged} />
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={3}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{
                borderRadius: '2rem',
              }}
            >
              <div className="card-body p-4">
                <h2 className="fw-bold text-success mb-3">Legend</h2>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '999px',
                        backgroundColor: '#83e6a5',
                        boxShadow: '0 0 18px rgba(131, 230, 165, 0.8)',
                      }}
                    />
                    <div>
                      <div className="fw-semibold">Low Activity</div>
                      <div className="text-secondary small">0% to 30%</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '999px',
                        backgroundColor: '#f6d96f',
                        boxShadow: '0 0 18px rgba(246, 217, 111, 0.8)',
                      }}
                    />
                    <div>
                      <div className="fw-semibold">Moderate Activity</div>
                      <div className="text-secondary small">31% to 60%</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '999px',
                        backgroundColor: '#f4a261',
                        boxShadow: '0 0 18px rgba(244, 162, 97, 0.8)',
                      }}
                    />
                    <div>
                      <div className="fw-semibold">Busy Activity</div>
                      <div className="text-secondary small">61% to 80%</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '999px',
                        backgroundColor: '#f87171',
                        boxShadow: '0 0 18px rgba(248, 113, 113, 0.8)',
                      }}
                    />
                    <div>
                      <div className="fw-semibold">High Activity</div>
                      <div className="text-secondary small">81% to 100%</div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold text-success">Data Source</h5>

                <div className="d-flex flex-column gap-3 mt-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '0.5rem',
                        border: '4px solid #0b5d3b',
                      }}
                    />
                    <div className="text-secondary small">
                      Green border means live data from the last hour.
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '0.5rem',
                        border: '4px solid #d4a017',
                      }}
                    />
                    <div className="text-secondary small">
                      Gold border means predicted data from historical trends.
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '0.5rem',
                        border: '4px solid #6c757d',
                      }}
                    />
                    <div className="text-secondary small">
                      Gray border means no recent or historical data.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default MapPage;