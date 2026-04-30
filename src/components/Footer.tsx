import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer
    className="mt-auto border-top"
    style={{
      background:
        'linear-gradient(135deg, #f4fbf6 0%, #eef7f1 45%, #ffffff 100%)',
      borderColor: 'rgba(11, 93, 59, 0.12)',
    }}
  >
    <Container fluid className="px-4 px-md-5 py-4">
      <Row className="align-items-center gy-3">
        <Col md={4} className="text-center text-md-start">
          <h5 className="fw-bold text-success mb-1">Manoa Pulse</h5>
          <p className="text-secondary mb-0 small">
            Campus busyness updates for UH Mānoa.
          </p>
        </Col>

        <Col md={4} className="text-center">
          <p className="text-secondary mb-1 small fw-semibold">
            Contact
          </p>
          <a
            href="mailto:manoapulse@gmail.com"
            className="text-success fw-semibold text-decoration-none"
          >
            manoapulse@gmail.com
          </a>
        </Col>

        <Col md={4} className="text-center text-md-end">
          <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-2">
            <Link href="/pulse-feed" className="text-secondary text-decoration-none small">
              Pulse Feed
            </Link>
            <Link href="/locations" className="text-secondary text-decoration-none small">
              Locations
            </Link>
            <Link href="/map-view" className="text-secondary text-decoration-none small">
              Map View
            </Link>
          </div>

          <p className="text-secondary mb-1 small">
            Have a location request?{' '}
            <a
              href="mailto:manoapulse@gmail.com"
              className="text-success fw-semibold text-decoration-none"
            >
              Email us
            </a>
          </p>

          <p className="text-muted mb-0 small">
            © 2026 Manoa Pulse.
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;