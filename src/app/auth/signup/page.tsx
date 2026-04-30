'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Alert, Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

/** The sign up page. */
const SignUp = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await createUser(data);

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setErrorMessage('Account was created, but automatic sign-in failed. Please sign in manually.');
        setIsSubmitting(false);
        return;
      }

      router.push('/');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create account. Please try again.',
      );
      setIsSubmitting(false);
    }
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
                Join the
                <br />
                campus pulse.
              </h1>

              <p className="fs-4 text-secondary mb-0" style={{ maxWidth: '560px' }}>
                Create an account to submit live busyness updates, help fellow
                students, and make campus planning easier.
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
                  <h2 className="fw-bold text-success mb-2">Create Account</h2>
                  <p className="text-secondary mb-0">
                    Start contributing to Manoa Pulse.
                  </p>
                </div>

                {errorMessage && (
                  <Alert variant="danger" className="rounded-4">
                    {errorMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`form-control form-control-lg rounded-4 ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                      placeholder="your-email@email.edu"
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`form-control form-control-lg rounded-4 ${
                        errors.password ? 'is-invalid' : ''
                      }`}
                      placeholder="Create a password"
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className={`form-control form-control-lg rounded-4 ${
                        errors.confirmPassword ? 'is-invalid' : ''
                      }`}
                      placeholder="Confirm your password"
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </Form.Group>

                  <Row className="g-3">
                    <Col>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-100 rounded-pill fw-semibold py-3 border-0"
                        style={{
                          backgroundColor: '#0b5d3b',
                        }}
                      >
                        {isSubmitting ? 'Creating...' : 'Register'}
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        type="button"
                        onClick={() => {
                          reset();
                          setErrorMessage('');
                        }}
                        variant="light"
                        className="w-100 rounded-pill fw-semibold py-3 shadow-sm"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>

              <div
                className="text-center px-4 py-4"
                style={{
                  backgroundColor: '#f4fbf6',
                }}
              >
                <span className="text-secondary">Already have an account? </span>
                <Link href="/auth/signin" className="text-success fw-semibold text-decoration-none">
                  Sign in
                </Link>
              </div>
            </Card>

            <p className="text-center text-secondary mt-4 mb-0">
              Your updates help students find better study, dining, and fitness spaces.
            </p>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;