import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import FavoritePlaceButton from '@/components/FavoritePlaceButton';
import { auth } from '@/lib/auth';
import { getCurrentUserFavoriteLocations } from '@/lib/favorites';
import { LOCATION_CONFIG } from '@/lib/locationConfig';
import { LOCATION_SLUGS } from '@/lib/locationSlugs';

type LocationKey = keyof typeof LOCATION_CONFIG;

const ProfilePage = async () => {
  const [session, rawFavoriteLocations] = await Promise.all([
    auth(),
    getCurrentUserFavoriteLocations(),
  ]);

  const favoriteLocations = rawFavoriteLocations as LocationKey[];

  const email = session?.user?.email ?? 'Not logged in';
  const isLoggedIn = Boolean(session?.user?.email);

  return (
    <main
      className="py-5"
      style={{
        background: 'linear-gradient(180deg, #eef8f1 0%, #f6f8fb 50%, #ffffff 100%)',
      }}
    >
      <Container className="py-4">
        <div
          className="text-white shadow-lg p-4 p-md-5 mb-4"
          style={{
            borderRadius: '2rem',
            background: 'linear-gradient(135deg, #0b5d3b 0%, #1a7f5b 55%, #54a67b 100%)',
          }}
        >
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <p className="text-uppercase fw-semibold small mb-2">User Profile</p>
              <h1 className="fw-bold display-5 mb-3">Account Overview</h1>
              <p className="fs-5 mb-0">
                Basic account information for the current session.
              </p>
            </Col>

            <Col lg={4}>
              <div
                className="bg-white text-dark p-4"
                style={{ borderRadius: '1.5rem' }}
              >
                <p className="text-uppercase text-muted fw-semibold small mb-2">Email</p>
                <p className="fs-5 fw-semibold mb-3">{email}</p>
                <p className="text-uppercase text-muted fw-semibold small mb-2">Status</p>
                <p className="mb-0">{isLoggedIn ? 'Logged in' : 'Guest view'}</p>
              </div>
            </Col>
          </Row>
        </div>

        <Row className="g-4">
          <Col lg={6}>
            <div className="bg-white shadow-sm p-4 h-100" style={{ borderRadius: '1.5rem' }}>
              <h2 className="fw-bold h4 mb-4">Account Details</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <p className="text-uppercase text-muted fw-semibold small mb-1">Email</p>
                  <p className="mb-0 fs-5">{email}</p>
                </div>
                <div>
                  <p className="text-uppercase text-muted fw-semibold small mb-1">Session State</p>
                  <p className="mb-0 fs-5">{isLoggedIn ? 'Authenticated' : 'Not logged in'}</p>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="bg-white shadow-sm p-4 h-100" style={{ borderRadius: '1.5rem' }}>
              <h2 className="fw-bold h4 mb-4">Quick Access</h2>
              <Row className="g-3">
                <Col xs={12}>
                  <Link href="/pulse-feed" className="btn btn-success w-100 btn-lg rounded-4 fw-semibold">
                    Open Pulse Feed
                  </Link>
                </Col>
                <Col xs={12}>
                  <Link href="/locations" className="btn btn-light w-100 btn-lg rounded-4 fw-semibold border">
                    View Locations
                  </Link>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="bg-white shadow-sm p-4 p-md-5 mt-4" style={{ borderRadius: '1.5rem' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-2">Favorite Places</h2>
              <p className="text-secondary mb-0">
                Bookmarked campus spots for quicker check-ins.
              </p>
            </div>

            <Link href="/locations" className="btn btn-success rounded-pill fw-semibold px-4">
              Browse Locations
            </Link>
          </div>

          {isLoggedIn && favoriteLocations.length > 0 ? (
            <Row className="g-3">
              {favoriteLocations.map((location: LocationKey) => {
                const config = LOCATION_CONFIG[location];

                return (
                  <Col md={6} xl={4} key={location}>
                    <div className="border bg-light p-4 h-100" style={{ borderRadius: '1rem' }}>
                      <p className="text-uppercase text-muted fw-semibold small mb-2">
                        {config.category}
                      </p>
                      <h3 className="fw-bold h5 mb-2">{config.label}</h3>
                      <p className="text-secondary mb-4">{config.description}</p>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          href={`/locations/${LOCATION_SLUGS[location]}`}
                          className="btn btn-light border rounded-pill fw-semibold"
                        >
                          View Details
                        </Link>
                        <FavoritePlaceButton
                          isFavorited
                          isLoggedIn={isLoggedIn}
                          location={location}
                          size="sm"
                        />
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <div className="bg-light rounded-4 p-4">
              <p className="text-secondary mb-0">
                {isLoggedIn
                  ? 'No favorite places yet. Bookmark locations you check often.'
                  : 'Sign in to save favorite places to your account.'}
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};

export default ProfilePage;