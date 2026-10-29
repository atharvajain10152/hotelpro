import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="py-5 min-vh-100 d-flex align-items-center justify-content-center text-center bg-light">
      <div className="card hp-card border-0 shadow-sm p-5 bg-white" style={{ maxWidth: '480px' }}>
        <div
          className="mx-auto d-flex align-items-center justify-content-center text-white mb-3"
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#1a1e24',
            borderRadius: '12px',
            border: '1px solid #c5a059'
          }}
        >
          <Crown size={28} color="#c5a059" />
        </div>
        <h1 className="font-serif fw-bold display-4 mb-2">404</h1>
        <h4 className="fw-semibold text-dark mb-2">Page Not Found</h4>
        <p className="text-muted small mb-4">
          The luxury destination or page you were looking for does not exist or has been relocated.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/" className="btn btn-gold btn-sm d-flex align-items-center gap-1 px-3">
            <Home size={14} /> Return Home
          </Link>
          <Link to="/hotels" className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 px-3">
            <Compass size={14} /> Explore Hotels
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
