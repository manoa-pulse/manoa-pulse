'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import * as Yup from 'yup';
import { submitUpdate } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UpdateStuffSchema } from '@/lib/validationSchemas';
import { LOCATION_CONFIG } from '@/lib/locationConfig';

type SubmitUpdateData = Yup.InferType<typeof UpdateStuffSchema>;
type LocationKey = keyof typeof LOCATION_CONFIG;

const isValidLocationKey = (value: string | null): value is LocationKey => (
  value !== null && value in LOCATION_CONFIG
);

const getDefaultLocation = (locationParam: string | null): LocationKey => {
  if (isValidLocationKey(locationParam)) {
    return locationParam;
  }

  return 'HamiltonLibrary';
};

const onSubmit: SubmitHandler<SubmitUpdateData> = async (data) => {
  await submitUpdate(data);

  swal('Success', 'Your update has been submitted', 'success', {
    timer: 2000,
  });
};

const SubmitUpdateForm: React.FC = () => {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const defaultLocation = getDefaultLocation(searchParams.get('location'));

  const [busyLevelValue, setBusyLevelValue] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<LocationKey>(defaultLocation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitUpdateData>({
    resolver: yupResolver(UpdateStuffSchema),
    defaultValues: {
      location: defaultLocation,
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

  const selectedLocationConfig = LOCATION_CONFIG[selectedLocation];

  const locationRegister = register('location', {
    onChange: (event) => {
      setSelectedLocation(event.target.value as LocationKey);
    },
  });

  const busyLevelRegister = register('busyLevel', {
    valueAsNumber: true,
    onChange: (event) => {
      setBusyLevelValue(Number(event.target.value));
    },
  });

  const handleReset = () => {
    reset({
      location: defaultLocation,
      busyLevel: 1,
      comment: '',
    });
    setSelectedLocation(defaultLocation);
    setBusyLevelValue(1);
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Col className="text-center">
            <h2>Submit Update</h2>
          </Col>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <select
                    {...locationRegister}
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                  >
                    {Object.entries(LOCATION_CONFIG).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.location?.message}</div>
                </Form.Group>

                <Card className="mb-3">
                  <Card.Body>
                    <h5>{selectedLocationConfig.label}</h5>
                    <p className="text-muted mb-2">{selectedLocationConfig.description}</p>
                    <p className="mb-2">
                      <strong>Category:</strong> {selectedLocationConfig.category}
                    </p>

                    <div>
                      <strong>Busyness Scale:</strong>
                      <div className="mt-2">
                        {Object.entries(selectedLocationConfig.scale).map(([level, text]) => (
                          <div key={level}>
                            <strong>{level}:</strong> {text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Form.Group className="mb-3">
                  <Form.Label>How busy is it? (1-10)</Form.Label>

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

                <Form.Group className="mb-3">
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