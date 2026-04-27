'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import * as Yup from 'yup';
import { submitUpdate } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UpdateStuffSchema } from '@/lib/validationSchemas';

type SubmitUpdateData = Yup.InferType<typeof UpdateStuffSchema>;

const onSubmit: SubmitHandler<SubmitUpdateData> = async (data) => {
  await submitUpdate(data);

  swal('Success', 'Your update has been submitted', 'success', {
    timer: 2000,
  });
};

const SubmitUpdateForm: React.FC = () => {
  const { status } = useSession();
  const [busyLevelValue, setBusyLevelValue] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitUpdateData>({
    resolver: yupResolver(UpdateStuffSchema),
    defaultValues: {
      location: 'HamiltonLibrary',
      busyLevel: 1,
      comment: '',
    },
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const busyLevelRegister = register('busyLevel', {
    valueAsNumber: true,
    onChange: (event) => {
      setBusyLevelValue(Number(event.target.value));
    },
  });

  const handleReset = () => {
    reset({
      location: 'HamiltonLibrary',
      busyLevel: 1,
      comment: '',
    });
    setBusyLevelValue(1);
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Submit Update</h2>
          </Col>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <select
                    {...register('location')}
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                  >
                    <option value="HamiltonLibrary">Hamilton Library</option>
                    <option value="WarriorRecreationCenter">Warrior Recreation Center</option>
                    <option value="CampusCenterFoodCourt">Campus Center Food Court</option>
                    <option value="CampusCenterOutdoorCourt">Campus Center Outdoor Court</option>
                    <option value="TacoBellFoodCourt">Taco Bell Food Court</option>
                    <option value="ParadisePalms">Paradise Palms</option>
                    <option value="POST2ndFloor">POST 2nd Floor</option>
                  </select>
                  <div className="invalid-feedback">{errors.location?.message}</div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>How busy is it? (1–10)</Form.Label>

                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    {...busyLevelRegister}
                    className="form-range"
                  />

                  <div className="text-center">
                    <strong>{busyLevelValue}</strong>
                  </div>

                  <div className="invalid-feedback d-block">
                    {errors.busyLevel?.message}
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Extra comment?</Form.Label>
                  <input
                    type="text"
                    {...register('comment')}
                    className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.comment?.message}</div>
                </Form.Group>

                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={handleReset}
                        variant="warning"
                        className="float-right"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmitUpdateForm;