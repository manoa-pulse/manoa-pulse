'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
};

/** The change password page. */
const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';

  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Current password is required'),
    password: Yup.string()
      .required('New password is required')
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
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    await changePassword({ email, ...data });
    await swal('Password Changed', 'Your password has been changed', 'success', {
      timer: 2000,
    });
    reset();
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

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
                Keep your
                <br />
                account secure.
              </h1>

              <p className="fs-4 text-secondary mb-0" style={{ maxWidth: '560px' }}>
                Update your password to protect your profile, pulse submissions,
                and account access.
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
                  <h2 className="fw-bold text-success mb-2">Change Password</h2>
                  <p className="text-secondary mb-0">
                    Signed in as {email || 'your account'}.
                  </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Current Password</Form.Label>
                    <input
                      type="password"
                      {...register('oldpassword')}
                      className={`form-control form-control-lg rounded-4 ${
                        errors.oldpassword ? 'is-invalid' : ''
                      }`}
                      placeholder="Enter your current password"
                    />
                    <div className="invalid-feedback">{errors.oldpassword?.message}</div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">New Password</Form.Label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`form-control form-control-lg rounded-4 ${
                        errors.password ? 'is-invalid' : ''
                      }`}
                      placeholder="Create a new password"
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
                      placeholder="Confirm your new password"
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </Form.Group>

                  <Row className="g-3">
                    <Col>
                      <Button
                        type="submit"
                        className="w-100 rounded-pill fw-semibold py-3 border-0"
                        style={{
                          backgroundColor: '#0b5d3b',
                        }}
                      >
                        Update
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        type="button"
                        onClick={() => reset()}
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
                <Link href="/profile" className="text-success fw-semibold text-decoration-none">
                  Back to Profile
                </Link>
              </div>
            </Card>

            <p className="text-center text-secondary mt-4 mb-0">
              Use at least 6 characters for your new password.
            </p>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ChangePassword;