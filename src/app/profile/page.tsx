import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import { auth } from '@/lib/auth';

const ProfilePage = async () => {
  const session = await auth();
  const email = session?.user?.email ?? 'Not logged in';
  const isLoggedIn = session?.user?.email;

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
          <Row className="align-items-center g-4">
            <Col lg={12}>
              <h2 className="fw-bold mb-2">Note</h2>
              <p className="text-secondary mb-0">
                This page shows minimal account information. It only uses the current
                session email and login state.
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </main>
  );
};

export default ProfilePage;
