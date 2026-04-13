import { Button, Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main className="bg-light min-vh-100">


    <Container fluid className="px-5 py-5">
      <Row className="align-items-center min-vh-100">
        <Col lg={6} className="mb-5 mb-lg-0">
          <h1
            className="fw-bold text-success"
            style={{
              fontSize: '5rem',
              lineHeight: '1.1',
            }}
          >
            Your Campus
            <br />
            Pulse,
            <br />
            in Real-Time
          </h1>

          <p
            className="text-secondary mt-4"
            style={{
              fontSize: '1.5rem',
              maxWidth: '700px',
            }}
          >
            Navigate UH Mānoa smarter. Get live occupancy data for libraries,
            dining halls, and gyms to find your perfect study spot without the walk.
          </p>

          <div className="d-flex gap-3 mt-5">
            <Button
              size="lg"
              className="px-5 py-3 rounded-4 fw-semibold bg-success border-success"
            >
              View Live Pulse
            </Button>

            <Button
              size="lg"
              variant="light"
              className="px-5 py-3 rounded-4 fw-semibold shadow-sm"
            >
              Explore Map
            </Button>
          </div>
        </Col>

        <Col lg={6} className="text-center">
          <div
            className="position-relative mx-auto shadow-lg"
            style={{
              borderRadius: '3rem',
              overflow: 'hidden',
              maxWidth: '650px',
            }}
          >
            <img
              src="https://hawaiiathletics.com/images/2024/11/19/Lower_Hawaii_Athletics_2024-20.jpg"
              alt="University of Hawaiʻi at Mānoa campus"
              style={{
                height: '700px',
                objectFit: 'cover',
                width: '100%',
                display: 'block',
              }}
            />

            <div
              className="position-absolute bg-white shadow px-5 py-4"
              style={{
                bottom: '2rem',
                left: '2rem',
                right: '2rem',
                borderRadius: '2rem',
              }}
            >
              <p className="text-uppercase text-muted small fw-semibold mb-2">
                Live Campus Status
              </p>

              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="bg-success rounded-circle"
                  style={{
                    width: '15px',
                    height: '15px',
                  }}
                />

                <h4 className="mb-0 fw-semibold text-dark">
                  Optimal Study Conditions
                </h4>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;