import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      const role = data.user.role;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'manager') {
        navigate('/dashboard/manager');
      } else if (role === 'staff') {
        navigate('/dashboard/staff');
      } else {
        navigate('/dashboard/guest');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card hp-card border-0 shadow-lg p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center text-white mb-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#1a1e24',
                    borderRadius: '12px',
                    border: '1px solid #c5a059'
                  }}
                >
                  <Crown size={24} color="#c5a059" />
                </div>
                <h3 className="font-serif fw-bold text-dark mb-1">Welcome to HotelPro</h3>
                <p className="text-muted small">Sign in to manage your stays, staff operations, or administration</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-4" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Mail size={16} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-muted mb-0">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold w-100 py-2 fw-semibold mb-4" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Quick-Fill Roles */}
              <div className="border-top pt-4">
                <span className="d-block small text-muted text-uppercase fw-semibold mb-2 text-center" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  Instant One-Click Demo Access
                </span>
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm w-100 text-truncate"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleDemoFill('guest@hotelpro.com', 'Password@123')}
                    >
                      👑 Demo Guest
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm w-100 text-truncate"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleDemoFill('staff@hotelpro.com', 'Password@123')}
                    >
                      🛎️ Front Desk Staff
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm w-100 text-truncate"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleDemoFill('manager@hotelpro.com', 'Password@123')}
                    >
                      📊 Hotel Manager
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm w-100 text-truncate"
                      style={{ fontSize: '12px' }}
                      onClick={() => handleDemoFill('admin@hotelpro.com', 'Password@123')}
                    >
                      🛡️ Platform Admin
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4 pt-2">
                <span className="text-muted small">Don't have an account yet? </span>
                <Link to="/register" className="small text-decoration-none fw-semibold text-warning">
                  Join HotelPro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
