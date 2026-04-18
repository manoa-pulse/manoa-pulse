'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { submitUpdate } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UpdateStuffSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: { location: string; busyLevel: number; comment: string; }) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await submitUpdate(data);
  swal('Success', 'Your item has been added', 'success', {
    timer: 2000,
  });
};

const SubmitUpdateForm: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddStuffForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdateStuffSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

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
                  <select {...register('location')} className={`form-control ${errors.location ? 'is-invalid' : ''}`}>
                    <option value="Keller">Keller Hall</option>
                    <option value="Art">Art Building</option>
                    <option value="Kuykendall">Kuykendall Hall</option>
                    <option value="Bilger">Bilger Hall</option>
                    <option value="CampusCenter">Campus Center</option>
                    <option value="Moore">Moore Hall</option>
                    <option value="ParadisePalms">Paradise Palms</option>
                    <option value="POST">Pacific Ocean Sciences & Technology Building</option>
                  </select>
                  <div className="invalid-feedback">{errors.location?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>How busy is it? 1-10 Scale</Form.Label>
                  <input
                    type="number"
                    {...register('busyLevel')}
                    className={`form-control ${errors.busyLevel ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.busyLevel?.message}</div>
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
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
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
