import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await register({ name, email, phone, password, role });
      const assignedRole = data.user.role;

      if (assignedRole === 'admin') {
        navigate('/dashboard/admin');
      } else if (assignedRole === 'manager') {
        navigate('/dashboard/manager');
      } else if (assignedRole === 'staff') {
        navigate('/dashboard/staff');
      } else {
        navigate('/dashboard/guest');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
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
                <h3 className="font-serif fw-bold text-dark mb-1">Create Your Account</h3>
                <p className="text-muted small">Join HotelPro for verified luxury reservations and member privileges</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-4" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-muted">Full Legal Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={16} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="e.g. Elena Rostova"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
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

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Phone size={16} className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        className="form-control border-start-0 ps-0"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Account Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="guest">Guest (Reservations & Stays)</option>
                      <option value="staff">Hotel Staff (Front Desk / Housekeeping)</option>
                      <option value="manager">Hotel Manager (Inventory & Rates)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-gold w-100 py-2 fw-semibold mb-3" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </form>

              <div className="text-center mt-3 pt-2 border-top">
                <span className="text-muted small">Already a registered member? </span>
                <Link to="/login" className="small text-decoration-none fw-semibold text-warning">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

