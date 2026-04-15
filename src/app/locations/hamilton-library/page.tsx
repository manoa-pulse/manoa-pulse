'use client';

import Link from 'next/link';
import { Button, Col, Container, Row } from 'react-bootstrap';
import {
  ArrowLeft,
  BellFill,
  Search,
} from 'react-bootstrap-icons';

const HamiltonLibraryPage = () => (
  <main className="bg-light py-5">
    <Container fluid className="px-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="d-flex align-items-center gap-3">
          <Link
            href="/pulse-feed"
            className="text-success text-decoration-none fs-3"
          >
            <ArrowLeft />
          </Link>

          <h2 className="fw-bold text-success mb-0">Manoa Pulse</h2>
        </div>

        <div className="d-flex gap-4 text-secondary fs-4">
          <Search />
          <BellFill />
        </div>
      </div>

      <div
        className="position-relative overflow-hidden shadow-lg mb-5"
        style={{
          borderRadius: '2.5rem',
          minHeight: '420px',
          backgroundImage:
            "linear-gradient(rgba(0, 70, 40, 0.75), rgba(0, 70, 40, 0.75)), url('https://www.hawaii.edu/news/wp-content/uploads/2021/08/manoa-hamilton-library.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Row className="h-100 p-5 align-items-center">
          <Col lg={6}>
            <div
              className="px-3 py-2 d-inline-block text-white mb-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '2rem',
              }}
            >
              🔴 LIVE STATUS
            </div>

            <h1
              className="fw-bold text-white mb-4"
              style={{
                fontSize: '5rem',
                lineHeight: '1',
              }}
            >
              Hamilton
              <br />
              Library
            </h1>

            <p
              className="text-white"
              style={{
                fontSize: '1.5rem',
                maxWidth: '550px',
              }}
            >
              Main research library at UH Mānoa campus. Popular for late-night
              study sessions and quiet zones.
            </p>
          </Col>

          <Col lg={6} className="text-center">
            <h2
              className="fw-bold text-white mb-4"
              style={{
                fontSize: '8rem',
              }}
            >
              85%
            </h2>

            <div
              className="d-inline-block px-5 py-3 fw-bold"
              style={{
                backgroundColor: 'white',
                color: '#dc3545',
                borderRadius: '2rem',
                fontSize: '1.2rem',
                letterSpacing: '2px',
              }}
            >
              VERY BUSY
            </div>
          </Col>
        </Row>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <div
            className="bg-white shadow-sm p-5 h-100"
            style={{
              borderRadius: '2.5rem',
              minHeight: '420px',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h2 className="fw-bold text-success mb-2">Prediction System</h2>
                <p className="text-secondary fs-5">
                  Historical busyness trends for today
                </p>
              </div>

              <span
                className="fw-semibold text-success"
                style={{
                  borderBottom: '3px solid #8ce9a9',
                }}
              >
                TUESDAY
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-end h-75 px-3">
              {[
                { time: '8A', height: '20%' },
                { time: '10A', height: '35%' },
                { time: '12P', height: '60%' },
                { time: '2P', height: '85%', active: true },
                { time: '4P', height: '75%' },
                { time: '6P', height: '45%' },
                { time: '8P', height: '25%' },
              ].map((item) => (
                <div
                  key={item.time}
                  className="d-flex flex-column align-items-center justify-content-end h-100"
                >
                  <div
                    className="rounded-top"
                    style={{
                      width: '40px',
                      height: item.height,
                      backgroundColor: item.active ? '#dc3545' : '#8ce9a9',
                    }}
                  />

                  {item.active && (
                    <span
                      className="mt-2 px-3 py-1 text-white fw-semibold small"
                      style={{
                        backgroundColor: '#dc3545',
                        borderRadius: '1rem',
                      }}
                    >
                      NOW
                    </span>
                  )}

                  <small className="mt-3 text-secondary fw-semibold">
                    {item.time}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div
            className="text-white shadow-sm p-5 h-100 d-flex flex-column justify-content-between"
            style={{
              borderRadius: '2.5rem',
              minHeight: '420px',
              backgroundColor: '#0b5d3b',
            }}
          >
            <div>
              <h2 className="fw-bold mb-4">Help fellow Warriors</h2>

              <p
                style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.7',
                }}
              >
                Is it actually full? Share what you see right now.
              </p>
            </div>

            <Button
              variant="light"
              className="w-100 py-4 rounded-5 fw-semibold border-0"
              style={{
                fontSize: '1.3rem',
              }}
            >
              Submit a Pulse Update →
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);

export default HamiltonLibraryPage;