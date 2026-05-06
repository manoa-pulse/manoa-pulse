'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import * as Yup from 'yup';
import { submitUpdate } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UpdateStuffSchema } from '@/lib/validationSchemas';
import { getClientLocationHoursStatus } from '@/lib/clientLocationHours';
import { LOCATION_CONFIG } from '@/lib/locationConfig';

type SubmitUpdateData = Yup.InferType<typeof UpdateStuffSchema>;
type LocationKey = keyof typeof LOCATION_CONFIG;

const isValidLocationKey = (value: string | null): value is LocationKey => (
  value !== null && value in LOCATION_CONFIG
);

const getDefaultLocation = (
  locationParam: string | null,
  openLocations: LocationKey[],
): LocationKey => {
  if (isValidLocationKey(locationParam) && openLocations.includes(locationParam)) {
    return locationParam;
  }

  return openLocations[0] ?? 'HamiltonLibrary';
};

const SubmitUpdateForm: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();

  const openLocations = useMemo(
    () => (
      Object.keys(LOCATION_CONFIG).filter((location) => (
        getClientLocationHoursStatus(location as LocationKey).isOpen
      )) as LocationKey[]
    ),
    [],
  );

  const defaultLocation = getDefaultLocation(searchParams.get('location'), openLocations);
  const hasOpenLocations = openLocations.length > 0;

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

  const onSubmit: SubmitHandler<SubmitUpdateData> = async (data) => {
    try {
      const result = await submitUpdate(data);

      if (!result.success) {
        swal('Unable to submit', result.error ?? 'Unable to submit your update. Please try again.', 'error');
        return;
      }

      router.push('/pulse-feed');
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Unable to submit your update. Please try again.';

      swal('Unable to submit', message, 'error');
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return <LoadingSpinner />;
  }

  const selectedLocationConfig = LOCATION_CONFIG[selectedLocation];
  const selectedLocationHoursStatus = getClientLocationHoursStatus(selectedLocation);

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
            <h2 className="text-success"><b>Submit Update</b></h2>
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
                    {openLocations.map((key) => (
                      <option key={key} value={key}>
                        {LOCATION_CONFIG[key].label}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.location?.message}</div>
                </Form.Group>

                <Card className="mb-3">
                  <Card.Body>
                    <h5 style={{ color: '#0b5d3b' }}>{selectedLocationConfig.label}</h5>
                    <p className="text-muted mb-2">{selectedLocationConfig.description}</p>
                    <p className="mb-2">
                      <strong>Category:</strong> {selectedLocationConfig.category}
                    </p>
                    <p
                      className={`fw-semibold mb-2 ${
                        selectedLocationHoursStatus.isOpen ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {selectedLocationHoursStatus.statusText}
                    </p>
                    <p className="text-muted mb-3">
                      Today: {selectedLocationHoursStatus.todayHoursText}
                    </p>
                    {!hasOpenLocations && (
                      <p className="text-danger fw-semibold mb-3">
                        No locations are open for updates right now.
                      </p>
                    )}

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
                      <Button
                        type="submit"
                        variant="success"
                        disabled={!hasOpenLocations}
                      >
                        Submit
                      </Button>
                      {!hasOpenLocations && (
                        <div className="text-danger small fw-semibold mt-2">
                          Updates are closed right now.
                        </div>
                      )}
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={handleReset}
                        variant="danger"
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