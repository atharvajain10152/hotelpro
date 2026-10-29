import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Building,
  Users,
  CheckSquare,
  BellRing,
  BarChart3,
  ShieldCheck,
  LogOut,
  Home,
  Crown,
  Settings,
  BedDouble
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <>
          <div className="text-uppercase text-muted fw-bold px-3 mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
            Platform Admin
          </div>
          <NavLink to="/dashboard/admin" end className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} />
            <span>Platform Overview</span>
          </NavLink>
          <NavLink to="/dashboard/admin/users" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>User Management</span>
          </NavLink>
          <NavLink to="/dashboard/admin/hotels" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <Building size={18} />
            <span>Hotel Approvals</span>
          </NavLink>
          <NavLink to="/dashboard/admin/audit" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <ShieldCheck size={18} />
            <span>Audit & Security Logs</span>
          </NavLink>
        </>
      );
    }

    if (user.role === 'manager') {
      return (
        <>
          <div className="text-uppercase text-muted fw-bold px-3 mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
            Hotel Management
          </div>
          <NavLink to="/dashboard/manager" end className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} />
            <span>Occupancy & Revenue</span>
          </NavLink>
          <NavLink to="/dashboard/manager/inventory" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <BedDouble size={18} />
            <span>Room Inventory & Rates</span>
          </NavLink>
          <NavLink to="/dashboard/staff" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <CheckSquare size={18} />
            <span>Daily Front Desk Ops</span>
          </NavLink>
        </>
      );
    }

    if (user.role === 'staff') {
      return (
        <>
          <div className="text-uppercase text-muted fw-bold px-3 mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
            Front Desk & Operations
          </div>
          <NavLink to="/dashboard/staff" end className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <CheckSquare size={18} />
            <span>Today's Front Desk</span>
          </NavLink>
          <NavLink to="/dashboard/staff/housekeeping" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <BedDouble size={18} />
            <span>Housekeeping Tasks</span>
          </NavLink>
          <NavLink to="/dashboard/staff/services" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
            <BellRing size={18} />
            <span>Guest Service Requests</span>
          </NavLink>
        </>
      );
    }

    // Default: Guest
    return (
      <>
        <div className="text-uppercase text-muted fw-bold px-3 mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
          Guest Stays
        </div>
        <NavLink to="/dashboard/guest" end className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
          <Calendar size={18} />
          <span>My Reservations</span>
        </NavLink>
        <NavLink to="/dashboard/guest/services" className={({ isActive }) => `hp-sidebar-link ${isActive ? 'active' : ''}`}>
          <BellRing size={18} />
          <span>Service Requests</span>
        </NavLink>
      </>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Bar */}
      <header className="navbar navbar-expand bg-white border-bottom px-4 py-2 sticky-top">
        <div className="container-fluid p-0">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#1a1e24',
                borderRadius: '6px',
                border: '1px solid #c5a059'
              }}
            >
              <Crown size={18} color="#c5a059" />
            </div>
            <span className="hp-brand fw-bold fs-5 tracking-wide">HOTELPRO</span>
            <span className="badge bg-dark text-warning ms-2 text-uppercase" style={{ fontSize: '10px' }}>
              {user?.role} Portal
            </span>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-pill px-3">
              <Home size={14} />
              Public Site
            </Link>
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light border-0 d-flex align-items-center gap-2 py-1 px-2 rounded-pill"
                type="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.name}
                  className="rounded-circle"
                  style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                />
                <span className="fw-semibold small d-none d-md-inline">{user?.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li>
                  <button className="dropdown-item text-danger d-flex align-items-center gap-2 small" onClick={handleLogout}>
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          {/* Sidebar */}
          <aside className="col-lg-2 col-md-3 hp-sidebar py-4 px-3 d-none d-md-block">
            <nav className="d-flex flex-column h-100 justify-content-between">
              <div>{renderNavLinks()}</div>
              <div className="pt-3 border-top">
                <button
                  className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Dynamic Content */}
          <main className="col-lg-10 col-md-9 p-4 p-lg-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
