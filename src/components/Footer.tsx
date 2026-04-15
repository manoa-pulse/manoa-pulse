import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-light border-top">
    <Container>
      <Col className="text-center text-muted">
        © 2026 Manoa Pulse.
      </Col>
    </Container>
  </footer>
);

export default Footer;
