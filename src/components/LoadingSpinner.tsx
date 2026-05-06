import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <main
    className="d-flex flex-column justify-content-center align-items-center"
    style={{
      minHeight: '70vh',
      background:
        'linear-gradient(135deg, #f4fbf6 0%, #eef7f1 45%, #ffffff 100%)',
    }}
  >
    <div
      className="bg-white shadow-sm text-center p-5"
      style={{
        borderRadius: '2rem',
        minWidth: '280px',
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{
          color: '#0b5d3b',
          width: '3rem',
          height: '3rem',
        }}
      />

      <h4 className="fw-bold text-success mt-4 mb-2">Loading</h4>

      <p className="text-secondary mb-0">
        Getting the latest campus activity...
      </p>
    </div>
  </main>
);

export default LoadingSpinner;