'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <main
    id="signout-page"
    className="d-flex align-items-center"
    style={{
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #f4fbf6 0%, #eef7f1 45%, #ffffff 100%)',
    }}
  >
    <Container fluid className="px-4 px-md-5">
      <Row className="justify-content-center align-items-center">
        <Col md={8} lg={5} xl={4}>
          <Card
            className="border-0 shadow-lg text-center"
            style={{
              borderRadius: '2rem',
              overflow: 'hidden',
            }}
          >
            <div className="card-body p-4 p-md-5">
              <span
                className="d-inline-block px-3 py-2 rounded-pill fw-semibold mb-4"
                style={{
                  backgroundColor: '#dff8e7',
                  color: '#0b5d3b',
                }}
              >
                Manoa Pulse
              </span>

              <h1 className="fw-bold text-success mb-3">
                Sign out?
              </h1>

              <p className="text-secondary fs-5 mb-4">
                You can always sign back in to submit pulse updates and check live campus activity.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button
                  variant="danger"
                  className="rounded-pill fw-semibold px-4 py-3"
                  onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                >
                  Sign Out
                </Button>

                <Link href="/" className="text-decoration-none">
                  <Button
                    variant="light"
                    className="rounded-pill fw-semibold px-4 py-3 shadow-sm w-100"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="px-4 py-4"
              style={{
                backgroundColor: '#f4fbf6',
              }}
            >
              <p className="text-secondary mb-0">
                Thanks for helping keep UH Mānoa connected.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default SignOut;