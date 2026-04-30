import Link from 'next/link';
import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { ArrowRight, ClockHistory, GeoAltFill, PeopleFill } from 'react-bootstrap-icons';
import {
  formatHourLabel,
  getCurrentHistoricalHour,
  getHourlyPulseData,
  getPulseData,
} from '@/lib/getPulseData';
import { LOCATION_CONFIG } from '@/lib/locationConfig';
import { LOCATION_SLUGS } from '@/lib/locationSlugs';

type LocationKey = keyof typeof LOCATION_CONFIG;
type DataSource = 'LIVE' | 'PREDICTED' | 'NO_DATA' | 'AFTER_HOURS';

const getStatus = (occupancy: number | null, dataSource: DataSource) => {
  if (dataSource === 'AFTER_HOURS') return 'AFTER HOURS';
  if (occupancy === null) return 'NO DATA';
  if (occupancy <= 30) return 'LOW';
  if (occupancy <= 70) return 'MODERATE';
  return 'VERY BUSY';
};

const getStatusStyle = (occupancy: number | null, dataSource: DataSource) => {
  if (dataSource === 'AFTER_HOURS') {
    return {
      backgroundColor: '#e9ecef',
      color: '#6c757d',
    };
  }

  if (occupancy === null) {
    return {
      backgroundColor: '#e9ecef',
      color: '#6c757d',
    };
  }

  if (occupancy <= 30) {
    return {
      backgroundColor: '#dff8e7',
      color: '#198754',
    };
  }

  if (occupancy <= 70) {
    return {
      backgroundColor: '#fff3cd',
      color: '#b58105',
    };
  }

  return {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  };
};

const getProgressVariant = (occupancy: number) => {
  if (occupancy <= 30) return 'success';
  if (occupancy <= 70) return 'warning';
  return 'danger';
};

const formatAverage = (busyLevel: number | null) => {
  if (busyLevel === null) return 'N/A';
  if (busyLevel === 0) return '0.0';
  return busyLevel.toFixed(1);
};

const getDataSourceLabel = (dataSource: DataSource) => {
  if (dataSource === 'LIVE') return 'Live update';
  if (dataSource === 'PREDICTED') return 'Predicted';
  if (dataSource === 'AFTER_HOURS') return 'After hours';
  return 'No data';
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LocationsPage = async () => {
  const currentHour = getCurrentHistoricalHour();
  const currentHourLabel = formatHourLabel(currentHour);

  const [hourlyPulseData, pulseData] = await Promise.all([
    getHourlyPulseData(),
    getPulseData(),
  ]);

  const hourlyByLocation = new Map(
    hourlyPulseData.map((item) => [item.location, item.hours]),
  );

  const pulseByLocation = new Map(
    pulseData.map((item) => [item.location, item]),
  );

  const locations = Object.entries(LOCATION_CONFIG).map(([locationKey, config]) => {
    const pulse = pulseByLocation.get(locationKey);
    const hourlyAverages = hourlyByLocation.get(locationKey) ?? [];
    const currentHourAverage = hourlyAverages.find((hour) => hour.hour === currentHour);

    const dataSource = pulse?.dataSource ?? 'NO_DATA';
    const isAfterHours = dataSource === 'AFTER_HOURS';

    return {
      key: locationKey as LocationKey,
      config,
      averageBusyLevel: isAfterHours ? null : currentHourAverage?.busyLevel ?? null,
      occupancy: isAfterHours ? null : currentHourAverage?.occupancy ?? null,
      samples: isAfterHours ? 0 : currentHourAverage?.samples ?? 0,
      lastUpdated: currentHourAverage?.lastUpdated ?? null,
      dataSource,
      isOpen: pulse?.isOpen ?? false,
      hoursStatus: pulse?.hoursStatus ?? 'Hours unavailable',
      todayHours: pulse?.todayHours ?? 'Hours unavailable',
    };
  });

  const locationsWithData = locations.filter(
    (location) => location.occupancy !== null && location.samples > 0,
  );

  const campusAverage =
    locationsWithData.length > 0
      ? Math.round(
          locationsWithData.reduce((sum, location) => sum + (location.occupancy ?? 0), 0) /
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
                Compare campus locations using normal operating hours. Closed locations
                are marked as after-hours instead of showing a busyness percentage.
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
                    {locationsWithData.length} open locations with submission history.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Row className="g-4">
          {locations.map((location) => {
            const status = getStatus(location.occupancy, location.dataSource);
            const statusStyle = getStatusStyle(location.occupancy, location.dataSource);
            const href = `/locations/${LOCATION_SLUGS[location.key]}`;
            const isAfterHours = location.dataSource === 'AFTER_HOURS';
            const hasBusynessValue = location.occupancy !== null;

            return (
              <Col xl={6} key={location.key}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{
                    borderRadius: '1.75rem',
                    opacity: isAfterHours ? 0.85 : 1,
                  }}
                >
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <div className="d-flex align-items-center gap-2 text-secondary text-uppercase small fw-semibold mb-2">
                          <GeoAltFill />
                          {location.config.category}
                        </div>

                        <h2 className="fw-bold mb-2">{location.config.label}</h2>

                        <p className="text-secondary mb-3">{location.config.description}</p>

                        <div className="d-flex flex-column gap-1">
                          <span className="text-success fw-semibold">
                            {location.hoursStatus}
                          </span>
                          <span className="text-muted small">
                            Today: {location.todayHours}
                          </span>
                        </div>
                      </div>

                      <div
                        className="px-3 py-2 fw-semibold"
                        style={{
                          ...statusStyle,
                          borderRadius: '999px',
                        }}
                      >
                        {status}
                      </div>
                    </div>

                    {isAfterHours ? (
                      <div className="bg-light rounded-4 p-4 mb-4">
                        <h3 className="fw-bold text-secondary mb-2">AFTER HOURS</h3>
                        <p className="text-secondary mb-0">
                          Current busyness is hidden because this location is closed.
                        </p>
                      </div>
                    ) : (
                      <>
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
                            {hasBusynessValue ? `${location.occupancy}%` : 'No data'}
                          </div>
                        </div>

                        <ProgressBar
                          now={location.occupancy ?? 0}
                          style={{ height: '0.9rem', borderRadius: '999px' }}
                          variant={getProgressVariant(location.occupancy ?? 0)}
                        />
                      </>
                    )}

                    <div className="d-flex flex-wrap justify-content-between gap-3 mt-4 text-secondary">
                      <span>
                        {isAfterHours
                          ? getDataSourceLabel(location.dataSource)
                          : location.samples > 0
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