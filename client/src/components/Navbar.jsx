import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Building2, User, LogOut, LayoutDashboard, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'manager':
        return '/dashboard/manager';
      case 'staff':
        return '/dashboard/staff';
      default:
        return '/dashboard/guest';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-hp sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#1a1e24',
              borderRadius: '8px',
              border: '1px solid #c5a059'
            }}
          >
            <Crown size={20} color="#c5a059" />
          </div>
          <div>
            <span className="hp-brand fs-4 fw-bold text-dark tracking-wide">HOTELPRO</span>
            <span
              className="d-block text-uppercase text-muted"
              style={{ fontSize: '9px', letterSpacing: '2px', marginTop: '-4px' }}
            >
              Luxury Resorts & Suites
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium">
            <li className="nav-item">
              <Link className="nav-link px-3 text-dark" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-dark" to="/hotels">
                Explore Hotels
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark d-flex align-items-center gap-1" to={getDashboardPath()}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 rounded-pill bg-light border-0 shadow-sm"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                  />
                  <div className="text-start me-1">
                    <span className="d-block fw-semibold text-dark" style={{ fontSize: '13px' }}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <span
                      className="badge bg-dark text-warning p-0 px-1 text-uppercase"
                      style={{ fontSize: '9px', letterSpacing: '0.5px' }}
                    >
                      {user.role}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style={{ minWidth: '200px' }}>
                  <li>
                    <h6 className="dropdown-header text-muted text-uppercase" style={{ fontSize: '11px' }}>
                      Signed in as {user.role}
                    </h6>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2 rounded" to={getDashboardPath()}>
                      <LayoutDashboard size={16} className="text-muted" />
                      {user.role === 'guest'
                        ? 'My Reservations'
                        : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`}
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger rounded"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-gold btn-sm px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-gold btn-sm px-3">
                  Join HotelPro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

