import Link from 'next/link';
import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { ArrowRight, ClockHistory, GeoAltFill, PeopleFill } from 'react-bootstrap-icons';
import {
  formatHourLabel,
  getCurrentHistoricalHour,
  getHourlyPulseData,
} from '@/lib/getPulseData';
import { LOCATION_CONFIG } from '@/lib/locationConfig';
import { LOCATION_SLUGS } from '@/lib/locationSlugs';

type LocationKey = keyof typeof LOCATION_CONFIG;

const getStatus = (occupancy: number) => {
  if (occupancy <= 30) return 'LOW';
  if (occupancy <= 70) return 'MODERATE';
  return 'VERY BUSY';
};

const getProgressVariant = (occupancy: number) => {
  if (occupancy <= 30) return 'success';
  if (occupancy <= 70) return 'warning';
  return 'danger';
};

const formatAverage = (busyLevel: number) => {
  if (busyLevel === 0) return '0.0';
  return busyLevel.toFixed(1);
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LocationsPage = async () => {
  const currentHour = getCurrentHistoricalHour();
  const currentHourLabel = formatHourLabel(currentHour);
  const hourlyPulseData = await getHourlyPulseData();
  const hourlyByLocation = new Map(
    hourlyPulseData.map((item) => [item.location, item.hours]),
  );

  const locations = Object.entries(LOCATION_CONFIG).map(([locationKey, config]) => {
    const hourlyAverages = hourlyByLocation.get(locationKey) ?? [];
    const currentHourAverage = hourlyAverages.find((hour) => hour.hour === currentHour);

    return {
      key: locationKey as LocationKey,
      config,
      averageBusyLevel: currentHourAverage?.busyLevel ?? 0,
      occupancy: currentHourAverage?.occupancy ?? 0,
      samples: currentHourAverage?.samples ?? 0,
      lastUpdated: currentHourAverage?.lastUpdated ?? null,
    };
  });

  const locationsWithData = locations.filter((location) => location.samples > 0);
  const campusAverage =
    locationsWithData.length > 0
      ? Math.round(
          locationsWithData.reduce((sum, location) => sum + location.occupancy, 0) /
            locationsWithData.length,
        )
      : 0;

  return (
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
              <h1 className="fw-bold display-4 mb-3">Campus activity by location</h1>
              <p className="fs-5 mb-0" style={{ maxWidth: '760px' }}>
                Compare historical busyness averages for UH Manoa study, dining, and
                fitness spots for the current time, based on pulse updates submitted
                during the {currentHourLabel} hour.
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
                    Historical Snapshot
                  </div>
                  <div className="display-5 fw-bold text-dark mb-1">{campusAverage}%</div>
                  <p className="text-secondary mb-0">
                    Average busyness at {currentHourLabel} across{' '}
                    {locationsWithData.length} locations with submission history.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Row className="g-4">
          {locations.map((location) => {
            const status = location.samples > 0 ? getStatus(location.occupancy) : 'NO DATA';
            const href = `/locations/${LOCATION_SLUGS[location.key]}`;

            return (
              <Col xl={6} key={location.key}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{ borderRadius: '1.75rem' }}
                >
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <div className="d-flex align-items-center gap-2 text-secondary text-uppercase small fw-semibold mb-2">
                          <GeoAltFill />
                          {location.config.category}
                        </div>
                        <h2 className="fw-bold mb-2">{location.config.label}</h2>
                        <p className="text-secondary mb-0">{location.config.description}</p>
                      </div>

                      <div
                        className="text-white px-3 py-2 fw-semibold"
                        style={{
                          backgroundColor: '#0b5d3b',
                          borderRadius: '999px',
                        }}
                      >
                        {status}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-end mb-2">
                      <div>
                        <div className="text-secondary small fw-semibold text-uppercase">
                          Historical Average at {currentHourLabel}
                        </div>
                        <div className="display-6 fw-bold">
                          {formatAverage(location.averageBusyLevel)}/10
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 fw-semibold fs-4">
                        <PeopleFill className="text-success" />
                        {location.occupancy}%
                      </div>
                    </div>

                    <ProgressBar
                      now={location.occupancy}
                      style={{ height: '0.9rem', borderRadius: '999px' }}
                      variant={getProgressVariant(location.occupancy)}
                    />

                    <div className="d-flex flex-wrap justify-content-between gap-3 mt-4 text-secondary">
                      <span>
                        {location.samples > 0
                          ? `${location.samples} update${
                              location.samples === 1 ? '' : 's'
                            } submitted at ${currentHourLabel}`
                          : `No updates submitted at ${currentHourLabel}`}
                      </span>
                      <Link href={href} className="text-success fw-semibold text-decoration-none">
                        View details <ArrowRight className="ms-1" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
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
};

export default LocationsPage;
