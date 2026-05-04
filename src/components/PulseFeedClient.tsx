'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import {
  GeoAltFill,
  HouseFill,
  PersonFill,
  Search,
  Wifi,
} from 'react-bootstrap-icons';
import { LOCATION_LABELS } from '@/lib/locationLabels';
import type { PulseData } from '@/lib/getPulseData';

type DataSource = 'LIVE' | 'PREDICTED' | 'NO_DATA' | 'AFTER_HOURS';

type Spot = {
  location: string;
  category: 'STUDY' | 'DINING' | 'FITNESS';
  occupancy: number | null;
  updated: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'AFTER_HOURS';
  borderColor: string;
  badgeBg: string;
  badgeColor: string;
  dataSource: DataSource;
  isOpen: boolean;
  hoursStatus: string;
  todayHours: string;
  href?: string;
};

type PulseFeedClientProps = {
  pulseData: PulseData[];
};

const LOCATION_CATEGORIES: Record<string, 'STUDY' | 'DINING' | 'FITNESS'> = {
  HamiltonLibrary: 'STUDY',
  POST2ndFloor: 'STUDY',
  CampusCenterFoodCourt: 'DINING',
  CampusCenterOutdoorCourt: 'DINING',
  TacoBellFoodCourt: 'DINING',
  ParadisePalms: 'DINING',
  WarriorRecreationCenter: 'FITNESS',
};

const LOCATION_HREFS: Record<string, string> = {
  HamiltonLibrary: '/locations/hamilton-library',
  WarriorRecreationCenter: '/locations/warrior-recreation-center',
  CampusCenterFoodCourt: '/locations/campus-center-food-court',
  CampusCenterOutdoorCourt: '/locations/campus-center-outdoor-court',
  TacoBellFoodCourt: '/locations/taco-bell-food-court',
  ParadisePalms: '/locations/paradise-palms',
  POST2ndFloor: '/locations/post-2nd-floor',
};

const getVisualStyle = (occupancy: number | null, dataSource: DataSource) => {
  if (dataSource === 'AFTER_HOURS') {
    return {
      level: 'AFTER_HOURS' as const,
      borderColor: '#6c757d',
      badgeBg: '#e9ecef',
      badgeColor: '#6c757d',
    };
  }

  const safeOccupancy = occupancy ?? 0;

  if (safeOccupancy <= 30) {
    return {
      level: 'LOW' as const,
      borderColor: '#8ce9a9',
      badgeBg: '#dff8e7',
      badgeColor: '#198754',
    };
  }

  if (safeOccupancy <= 70) {
    return {
      level: 'MEDIUM' as const,
      borderColor: '#f6c343',
      badgeBg: '#fff3cd',
      badgeColor: '#b58105',
    };
  }

  return {
    level: 'HIGH' as const,
    borderColor: '#ef4444',
    badgeBg: '#fee2e2',
    badgeColor: '#dc2626',
  };
};

const getDataSourceStyle = (dataSource: DataSource) => {
  if (dataSource === 'LIVE') {
    return {
      label: 'LIVE UPDATE',
      backgroundColor: '#dff8e7',
      color: '#198754',
    };
  }

  if (dataSource === 'PREDICTED') {
    return {
      label: 'PREDICTED',
      backgroundColor: '#fff3cd',
      color: '#b58105',
    };
  }

  if (dataSource === 'AFTER_HOURS') {
    return {
      label: 'AFTER HOURS',
      backgroundColor: '#e9ecef',
      color: '#6c757d',
    };
  }

  return {
    label: 'NO DATA',
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  };
};

const formatLastUpdated = (lastUpdated: string | null, dataSource: DataSource, hoursStatus: string) => {
  if (dataSource === 'AFTER_HOURS') {
    return hoursStatus;
  }

  if (!lastUpdated) {
    return 'No live update';
  }

  const updatedDate = new Date(lastUpdated);
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'Updated just now';
  }

  if (diffMinutes === 1) {
    return 'Updated 1 min ago';
  }

  if (diffMinutes < 60) {
    return `Updated ${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours === 1) {
    return 'Updated 1 hour ago';
  }

  if (diffHours < 24) {
    return `Updated ${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) {
    return 'Updated 1 day ago';
  }

  return `Updated ${diffDays} days ago`;
};

const PulseFeedClient = ({ pulseData }: PulseFeedClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const spots: Spot[] = useMemo(() => {
    return pulseData.map((item) => ({
      location: item.location,
      category: LOCATION_CATEGORIES[item.location] ?? 'STUDY',
      occupancy: item.occupancy,
      updated: formatLastUpdated(item.lastUpdated, item.dataSource, item.hoursStatus),
      dataSource: item.dataSource,
      isOpen: item.isOpen,
      hoursStatus: item.hoursStatus,
      todayHours: item.todayHours,
      href: LOCATION_HREFS[item.location],
      ...getVisualStyle(item.occupancy, item.dataSource),
    }));
  }, [pulseData]);

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const label = LOCATION_LABELS[spot.location] ?? spot.location;

      const matchesCategory =
        selectedCategory === 'ALL' || spot.category === selectedCategory;

      const matchesSearch = label
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, spots]);

  const categoryButton = (label: string, value: string) => (
    <Button
      key={value}
      onClick={() => setSelectedCategory(value)}
      className="px-4 py-3 rounded-4 fw-semibold border-0"
      variant={selectedCategory === value ? undefined : 'light'}
      style={selectedCategory === value ? { backgroundColor: '#0b5d3b' } : {}}
    >
      {label}
    </Button>
  );

  return (
    <main className="bg-light py-5">
      <Container fluid className="px-5">
        <Row>
          <Col lg={3} className="mb-4">
            <div
              className="bg-white shadow-sm h-100 d-flex flex-column justify-content-between p-4"
              style={{ borderRadius: '2rem' }}
            >
              <div>
                <h2 className="fw-bold text-success mb-1">Warrior Dashboard</h2>
                <p className="text-secondary fs-5">UH Mānoa Campus</p>

                <div className="d-flex flex-column gap-3 mt-5">
                  <Link
                    href="/"
                    className="d-flex align-items-center gap-3 text-decoration-none text-dark fs-5"
                  >
                    <HouseFill />
                    Home
                  </Link>

                  <Link
                    href="/pulse-feed"
                    className="d-flex align-items-center gap-3 text-decoration-none text-success fw-semibold fs-5 px-3 py-3"
                    style={{
                      backgroundColor: '#dff8e7',
                      borderRadius: '1rem',
                    }}
                  >
                    <Wifi />
                    Pulse Feed
                  </Link>

                  <Link
                    href="/map-view"
                    className="d-flex align-items-center gap-3 text-decoration-none text-dark fs-5"
                  >
                    <GeoAltFill />
                    Map View
                  </Link>

                  <Link
                    href="/profile"
                    className="d-flex align-items-center gap-3 text-decoration-none text-dark fs-5"
                  >
                    <PersonFill />
                    Profile
                  </Link>
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

                <Link href="/map-view" className="text-decoration-none">
                  <Button
                    variant="light"
                    className="w-100 rounded-pill fw-semibold py-2"
                  >
                    View Live Pulse
                  </Button>
                </Link>
              </div>
            </div>
          </Col>

          <Col lg={9}>
            <div className="mb-5">
              <h1 className="fw-bold text-success display-4">The Pulse Feed</h1>
              <p className="text-secondary fs-4 mt-3">
                Real-time busyness data for campus study, dining, and fitness locations.
                Plan your study sessions, dining breaks, and workouts with precision.
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
                    placeholder="Search campus locations..."
                    className="border-0 shadow-none fs-5"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>

              <Col lg={7}>
                <div className="d-flex gap-3 flex-wrap">
                  {categoryButton('All Spots', 'ALL')}
                  {categoryButton('Study', 'STUDY')}
                  {categoryButton('Dining', 'DINING')}
                  {categoryButton('Fitness', 'FITNESS')}
                </div>
              </Col>
            </Row>

            <Row className="g-4">
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => {
                  const label = LOCATION_LABELS[spot.location] ?? spot.location;
                  const sourceStyle = getDataSourceStyle(spot.dataSource);
                  const isAfterHours = spot.dataSource === 'AFTER_HOURS';

                  const cardContent = (
                    <Card
                      className="border-0 shadow-sm h-100"
                      style={{
                        borderRadius: '1.75rem',
                        borderLeft: `6px solid ${spot.borderColor}`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: spot.href ? 'pointer' : 'default',
                        opacity: isAfterHours ? 0.82 : 1,
                      }}
                    >
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <div>
                            <p className="small text-uppercase text-muted fw-semibold mb-2">
                              {spot.category}
                            </p>
                            <h3 className="fw-semibold">{label}</h3>
                          </div>

                          <span
                            className="px-3 py-2 rounded-pill fw-semibold small"
                            style={{
                              backgroundColor: spot.badgeBg,
                              color: spot.badgeColor,
                            }}
                          >
                            {isAfterHours ? 'CLOSED' : spot.level}
                          </span>
                        </div>

                        <div className="mb-4">
                          {isAfterHours ? (
                            <>
                              <span
                                className="fw-bold text-secondary"
                                style={{ fontSize: '2.7rem' }}
                              >
                                AFTER HOURS
                              </span>
                              <div className="text-muted fw-semibold mt-2">
                                Busyness hidden while closed
                              </div>
                            </>
                          ) : (
                            <>
                              <span
                                className="fw-bold text-success"
                                style={{ fontSize: '4rem' }}
                              >
                                {String(spot.occupancy ?? 0).padStart(2, '0')}%
                              </span>
                              <span className="text-muted fw-semibold ms-2">
                                BUSYNESS
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mb-3">
                          <p className="text-secondary small mb-0">
                            {spot.hoursStatus}
                          </p>
                          <p className="text-muted small mb-0">
                            Today: {spot.todayHours}
                          </p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center text-secondary">
                          <span
                            className="px-3 py-2 rounded-pill fw-semibold small"
                            style={{
                              backgroundColor: sourceStyle.backgroundColor,
                              color: sourceStyle.color,
                            }}
                          >
                            {sourceStyle.label}
                          </span>

                          <small>{spot.updated}</small>
                        </div>
                      </div>
                    </Card>
                  );

                  return (
                    <Col md={6} xl={4} key={spot.location}>
                      {spot.href ? (
                        <Link
                          href={spot.href}
                          className="text-decoration-none text-dark d-block h-100"
                        >
                          {cardContent}
                        </Link>
                      ) : (
                        cardContent
                      )}
                    </Col>
                  );
                })
              ) : (
                <Col>
                  <div
                    className="bg-white text-center py-5 shadow-sm"
                    style={{ borderRadius: '2rem' }}
                  >
                    <h4 className="text-secondary">
                      No spots found for your search.
                    </h4>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default PulseFeedClient;