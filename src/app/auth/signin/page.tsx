'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage('Invalid email or password. Please try again.');
      return;
    }

    router.push('/pulse-feed');
  };

  return (
    <main
      className="d-flex align-items-center"
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f4fbf6 0%, #eef7f1 45%, #ffffff 100%)',
      }}
    >
      <Container fluid className="px-4 px-md-5">
        <Row className="justify-content-center align-items-center g-5">
          <Col lg={6} xl={5}>
            <div className="text-center text-lg-start">
              <span
                className="d-inline-block px-3 py-2 rounded-pill fw-semibold mb-4"
                style={{
                  backgroundColor: '#dff8e7',
                  color: '#0b5d3b',
                }}
              >
                Manoa Pulse
              </span>

              <h1
                className="fw-bold text-success mb-4"
                style={{
                  fontSize: '4rem',
                  lineHeight: 1.05,
                }}
              >
                Welcome back,
                <br />
                Warrior.
              </h1>

              <p className="fs-4 text-secondary mb-0" style={{ maxWidth: '560px' }}>
                Sign in to submit pulse updates, check live campus busyness, and
                help other UH Mānoa students find the right spot.
              </p>
            </div>
          </Col>

          <Col md={8} lg={5} xl={4}>
            <Card
              className="border-0 shadow-lg"
              style={{
                borderRadius: '2rem',
                overflow: 'hidden',
              }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="mb-4 text-center">
                  <h2 className="fw-bold text-success mb-2">Sign In</h2>
                  <p className="text-secondary mb-0">
                    Access your Manoa Pulse account.
                  </p>
                </div>

                {errorMessage && (
                  <Alert variant="danger" className="rounded-4">
                    {errorMessage}
                  </Alert>
                )}

                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <input
                      name="email"
                      type="email"
                      className="form-control form-control-lg rounded-4"
                      placeholder="your-email@email.com"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <input
                      name="password"
                      type="password"
                      className="form-control form-control-lg rounded-4"
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 rounded-pill fw-semibold py-3 border-0"
                    style={{
                      backgroundColor: '#0b5d3b',
                    }}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>
              </div>

              <div
                className="text-center px-4 py-4"
                style={{
                  backgroundColor: '#f4fbf6',
                }}
              >
                <span className="text-secondary">Don&apos;t have an account? </span>
                <Link href="/auth/signup" className="text-success fw-semibold text-decoration-none">
                  Sign up
                </Link>
              </div>
            </Card>

            <p className="text-center text-secondary mt-4 mb-0">
              Live updates, campus trends, and smarter planning in one place.
            </p>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;