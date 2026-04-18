import Link from 'next/link';
import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { ArrowRight, ClockHistory, GeoAltFill, PeopleFill } from 'react-bootstrap-icons';

type TimePeriod = {
  label: string;
  occupancy: number;
  detail: string;
};

type LocationTrend = {
  name: string;
  type: string;
  accent: string;
  periods: TimePeriod[];
};

const timeLabels = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];

const locationTrends: LocationTrend[] = [
  {
    name: 'Hamilton Library',
    type: 'Library',
    accent: '#0b5d3b',
    periods: [
      { label: '6 AM', occupancy: 18, detail: 'Open seats almost everywhere' },
      { label: '9 AM', occupancy: 42, detail: 'Morning rush starts' },
      { label: '12 PM', occupancy: 68, detail: 'Lunch-hour study traffic' },
      { label: '3 PM', occupancy: 84, detail: 'Peak library demand' },
      { label: '6 PM', occupancy: 63, detail: 'Evening crowd eases' },
      { label: '9 PM', occupancy: 37, detail: 'Late-night calm returns' },
    ],
  },
  {
    name: 'Sinclair Library',
    type: 'Library',
    accent: '#1f7a8c',
    periods: [
      { label: '6 AM', occupancy: 12, detail: 'Very light foot traffic' },
      { label: '9 AM', occupancy: 35, detail: 'Group work begins' },
      { label: '12 PM', occupancy: 58, detail: 'Steady midday demand' },
      { label: '3 PM', occupancy: 71, detail: 'Class breaks push traffic up' },
      { label: '6 PM', occupancy: 79, detail: 'After-class peak' },
      { label: '9 PM', occupancy: 54, detail: 'Still moderately busy' },
    ],
  },
  {
    name: 'Campus Center Food Court',
    type: 'Dining',
    accent: '#e07a24',
    periods: [
      { label: '6 AM', occupancy: 8, detail: 'Mostly closed or empty' },
      { label: '9 AM', occupancy: 28, detail: 'Breakfast traffic' },
      { label: '12 PM', occupancy: 91, detail: 'Lunch rush hits maximum' },
      { label: '3 PM', occupancy: 44, detail: 'Quiet mid-afternoon gap' },
      { label: '6 PM', occupancy: 67, detail: 'Dinner crowd returns' },
      { label: '9 PM', occupancy: 19, detail: 'Traffic drops quickly' },
    ],
  },
  {
    name: 'Warrior Recreation Center',
    type: 'Fitness',
    accent: '#8f2d56',
    periods: [
      { label: '6 AM', occupancy: 39, detail: 'Early workout crowd' },
      { label: '9 AM', occupancy: 31, detail: 'Morning lull' },
      { label: '12 PM', occupancy: 52, detail: 'Midday gym sessions' },
      { label: '3 PM', occupancy: 76, detail: 'Classes end, crowd builds' },
      { label: '6 PM', occupancy: 88, detail: 'Evening peak demand' },
      { label: '9 PM', occupancy: 46, detail: 'Night crowd thins' },
    ],
  },
];

const LocationsPage = () => (
  <main
    className="py-5"
    style={{
      background:
        'linear-gradient(180deg, #f4fbf6 0%, #eef3f8 45%, #ffffff 100%)',
      minHeight: '100vh',
    }}
  >
    <Container fluid className="px-4 px-md-5">
      <div
        className="text-white p-4 p-md-5 mb-5 shadow-lg"
        style={{
          borderRadius: '2rem',
          background:
            'linear-gradient(135deg, #0b5d3b 0%, #117a65 55%, #2a9d8f 100%)',
        }}
      >
        <Row className="align-items-center g-4">
          <Col lg={8}>
            <div
              className="d-inline-block rounded-pill px-3 py-2 fw-semibold mb-3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
            >
              Location Trends
            </div>
            <h1 className="fw-bold display-4 mb-3">Campus activity by time of day</h1>
            <p className="fs-5 mb-0" style={{ maxWidth: '760px' }}>
              Compare how busy key UH Manoa locations get from early morning to late
              evening. Each trend shows when a spot is typically easiest to visit and
              when it hits peak traffic.
            </p>
          </Col>

          <Col lg={4}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: '1.5rem' }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 text-success fw-semibold mb-3">
                  <ClockHistory />
                  Daily Snapshot
                </div>
                <p className="text-secondary mb-4">
                  Use the timeline below to spot the best study windows, avoid lunch
                  rushes, and plan around evening surges.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {timeLabels.map((label) => (
                    <span
                      key={label}
                      className="px-3 py-2 bg-light text-dark fw-semibold"
                      style={{ borderRadius: '999px' }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Row className="g-4">
        {locationTrends.map((location) => (
          <Col xl={6} key={location.name}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: '1.75rem' }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-2 text-secondary text-uppercase small fw-semibold mb-2">
                      <GeoAltFill />
                      {location.type}
                    </div>
                    <h2 className="fw-bold mb-2">{location.name}</h2>
                  </div>

                  <div
                    className="text-white px-3 py-2 fw-semibold"
                    style={{
                      backgroundColor: location.accent,
                      borderRadius: '999px',
                    }}
                  >
                    Daily Population
                  </div>
                </div>

                <div className="d-flex flex-column gap-4">
                  {location.periods.map((period) => (
                    <div key={`${location.name}-${period.label}`}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <div className="fw-semibold">{period.label}</div>
                          <div className="text-secondary small">{period.detail}</div>
                        </div>
                        <div className="d-flex align-items-center gap-2 fw-semibold">
                          <PeopleFill style={{ color: location.accent }} />
                          {period.occupancy}%
                        </div>
                      </div>

                      <ProgressBar
                        now={period.occupancy}
                        style={{ height: '0.9rem', borderRadius: '999px' }}
                        variant=""
                      >
                        <ProgressBar
                          now={period.occupancy}
                          style={{ backgroundColor: location.accent }}
                        />
                      </ProgressBar>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5 pt-2">
        <Link
          href="/"
          className="btn px-4 py-3 rounded-pill fw-semibold border-0 text-white"
          style={{ backgroundColor: '#0b5d3b' }}
        >
          Back to Home <ArrowRight className="ms-2" />
        </Link>
      </div>
    </Container>
  </main>
);

export default LocationsPage;
