import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import {
  GeoAltFill,
  HouseFill,
  PersonFill,
  Search,
  Wifi,
} from 'react-bootstrap-icons';

const spots = [
  {
    name: 'Hamilton Library',
    category: 'LIBRARY',
    occupancy: 12,
    occupants: 142,
    updated: '2m ago',
    level: 'LOW',
    borderColor: '#8ce9a9',
    badgeBg: '#dff8e7',
    badgeColor: '#198754',
  },
  {
    name: 'Warrior Recreation',
    category: 'FITNESS',
    occupancy: 64,
    occupants: 385,
    updated: '5m ago',
    level: 'MEDIUM',
    borderColor: '#f6c343',
    badgeBg: '#fff3cd',
    badgeColor: '#b58105',
  },
  {
    name: 'Campus Food Court',
    category: 'DINING',
    occupancy: 92,
    occupants: 512,
    updated: '1m ago',
    level: 'HIGH',
    borderColor: '#ef4444',
    badgeBg: '#fee2e2',
    badgeColor: '#dc2626',
  },
  {
    name: 'Sinclair Library',
    category: 'LIBRARY',
    occupancy: 28,
    occupants: 210,
    updated: '10m ago',
    level: 'LOW',
    borderColor: '#8ce9a9',
    badgeBg: '#dff8e7',
    badgeColor: '#198754',
  },
  {
    name: 'Student Success Center',
    category: 'STUDY',
    occupancy: 55,
    occupants: 88,
    updated: '4m ago',
    level: 'MEDIUM',
    borderColor: '#f6c343',
    badgeBg: '#fff3cd',
    badgeColor: '#b58105',
  },
  {
    name: 'Gateway Cafe',
    category: 'DINING',
    occupancy: 5,
    occupants: 12,
    updated: '15m ago',
    level: 'LOW',
    borderColor: '#8ce9a9',
    badgeBg: '#dff8e7',
    badgeColor: '#198754',
  },
];

const PulseFeed = () => (
  <main className="bg-light min-vh-100 py-5">
    <Container fluid className="px-5">
      <Row>
        <Col lg={3} className="mb-4">
          <div
            className="bg-white shadow-sm h-100 d-flex flex-column justify-content-between p-4"
            style={{ borderRadius: '2rem', minHeight: '850px' }}
          >
            <div>
              <h2 className="fw-bold text-success mb-1">Warrior Dashboard</h2>
              <p className="text-secondary fs-5">UH Mānoa Campus</p>

              <div className="d-flex flex-column gap-3 mt-5">
                <a
                  href="/"
                  className="d-flex align-items-center gap-3 text-decoration-none text-dark fs-5"
                >
                  <HouseFill />
                  Home
                </a>

                <a
                  href="/pulse-feed"
                  className="d-flex align-items-center gap-3 text-decoration-none text-success fw-semibold fs-5 px-3 py-3"
                  style={{
                    backgroundColor: '#dff8e7',
                    borderRadius: '1rem',
                  }}
                >
                  <Wifi />
                  Pulse Feed
                </a>

                <a
                  href="/map"
                  className="d-flex align-items-center gap-3 text-decoration-none text-dark fs-5"
                >
                  <GeoAltFill />
                  Map View
                </a>

                <a
                  href="/profile"
                  className="d-flex align-items-center gap-3 text-decoration-none text-dark fs-5"
                >
                  <PersonFill />
                  Profile
                </a>
              </div>
            </div>

            <div
              className="text-white p-4"
              style={{
                backgroundColor: '#0b5d3b',
                borderRadius: '1.5rem',
              }}
            >
              <p className="small fw-semibold text-uppercase mb-2">Live Status</p>
              <h5 className="fw-semibold mb-4">● Campus is Active</h5>

              <Button
                variant="light"
                className="w-100 rounded-pill fw-semibold py-2"
              >
                View Live Pulse
              </Button>
            </div>
          </div>
        </Col>

        <Col lg={9}>
          <div className="mb-5">
            <h1 className="fw-bold text-success display-4">The Pulse Feed</h1>
            <p className="text-secondary fs-4 mt-3">
              Real-time occupancy data for campus facilities. Plan your study
              sessions and dining breaks with precision.
            </p>
          </div>

          <Row className="align-items-center mb-5 g-3">
            <Col lg={5}>
              <div
                className="bg-white d-flex align-items-center px-4 py-3 shadow-sm"
                style={{ borderRadius: '1.25rem' }}
              >
                <Search className="text-secondary me-3 fs-4" />
                <Form.Control
                  type="text"
                  placeholder="Search buildings or spots..."
                  className="border-0 shadow-none fs-5"
                />
              </div>
            </Col>

            <Col lg={7}>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  className="px-4 py-3 rounded-4 fw-semibold border-0"
                  style={{ backgroundColor: '#0b5d3b' }}
                >
                  All Spots
                </Button>

                <Button variant="light" className="px-4 py-3 rounded-4 fw-semibold">
                  Libraries
                </Button>

                <Button variant="light" className="px-4 py-3 rounded-4 fw-semibold">
                  Dining
                </Button>

                <Button variant="light" className="px-4 py-3 rounded-4 fw-semibold">
                  Study Lounges
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            {spots.map((spot) => (
              <Col md={6} xl={4} key={spot.name}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{
                    borderRadius: '1.75rem',
                    borderLeft: `6px solid ${spot.borderColor}`,
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <p className="small text-uppercase text-muted fw-semibold mb-2">
                          {spot.category}
                        </p>
                        <h3 className="fw-semibold">{spot.name}</h3>
                      </div>

                      <span
                        className="px-3 py-2 rounded-pill fw-semibold small"
                        style={{
                          backgroundColor: spot.badgeBg,
                          color: spot.badgeColor,
                        }}
                      >
                        {spot.level}
                      </span>
                    </div>

                    <div className="mb-4">
                      <span
                        className="fw-bold text-success"
                        style={{ fontSize: '4rem' }}
                      >
                        {String(spot.occupancy).padStart(2, '0')}%
                      </span>
                      <span className="text-muted fw-semibold ms-2">OCCUPANCY</span>
                    </div>

                    <div className="d-flex justify-content-between text-secondary">
                      <small>{spot.occupants} Occupants</small>
                      <small>Updated {spot.updated}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  </main>
);

export default PulseFeed;