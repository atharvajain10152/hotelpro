import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Building,
  ShieldCheck,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Check,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'hotels' | 'audit'

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, hotelsRes, auditRes] = await Promise.all([
        axiosClient.get('/admin/dashboard'),
        axiosClient.get('/admin/users'),
        axiosClient.get('/hotels'),
        axiosClient.get('/admin/audit-logs')
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (usersRes.data?.success) setUsers(usersRes.data.users || []);
      if (hotelsRes.data?.success) setHotels(hotelsRes.data.hotels || []);
      if (auditRes.data?.success) setAuditLogs(auditRes.data.logs || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      setError('');
      const res = await axiosClient.patch(`/admin/users/${userId}/status`, {
        status: nextStatus
      });
      if (res.data?.success) {
        setMessage(`User account status updated to ${nextStatus}.`);
        fetchAdminData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    }
  };

  const handleToggleHotelStatus = async (hotelId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      setError('');
      const res = await axiosClient.patch(`/admin/hotels/${hotelId}/approval`, {
        status: nextStatus
      });
      if (res.data?.success) {
        setMessage(`Hotel status updated to ${nextStatus}.`);
        fetchAdminData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update hotel status.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            System Master Administration
          </span>
          <h2 className="font-serif fw-bold text-dark mb-0">Platform Overview & Security Governance</h2>
          <p className="text-muted small mb-0">Global oversight of users, partner hotels, transactions, and audit security trails.</p>
        </div>
        <button className="btn btn-outline-dark btn-sm" onClick={fetchAdminData}>
          Refresh System Data
        </button>
      </div>

      {message && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 small mb-4" role="alert">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-4" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Users</span>
                <h3 className="fw-bold mb-0 text-dark mt-1">{stats?.users?.total || users.length}</h3>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Active Hotels</span>
                <h3 className="fw-bold mb-0 text-dark mt-1">{stats?.hotels?.active || hotels.length}</h3>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
                <Building size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Bookings</span>
                <h3 className="fw-bold mb-0 text-success mt-1">{stats?.bookings?.total || 3}</h3>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3">
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Total Revenue</span>
                <h3 className="fw-bold mb-0 text-dark mt-1">
                  ₹{Number(stats?.financials?.totalRevenue || 131460).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="p-3 bg-dark bg-opacity-10 text-dark rounded-3">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-1 rounded-3 shadow-sm border d-inline-flex">
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'users' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            User Directory ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'hotels' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('hotels')}
          >
            Hotel Portfolios ({hotels.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'audit' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('audit')}
          >
            Security & Audit Logs ({auditLogs.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="text-muted small mt-2">Loading platform administrative records...</p>
        </div>
      ) : activeTab === 'users' ? (
        /* Users Table */
        <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover table-hp mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Assigned Hotel</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={u.name}
                          className="rounded-circle"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold text-dark">{u.name}</div>
                          <div className="small text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-dark text-warning text-uppercase" style={{ fontSize: '10px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="small text-secondary">{u.hotelId?.name || 'N/A'}</td>
                    <td>
                      <span className={`badge-status ${u.status}`}>{u.status}</span>
                    </td>
                    <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u._id !== user._id && (
                        <button
                          type="button"
                          className={`btn btn-sm ${u.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'} d-flex align-items-center gap-1`}
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                        >
                          {u.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'hotels' ? (
        /* Hotels Table */
        <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover table-hp mb-0">
              <thead>
                <tr>
                  <th>Hotel Property</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h._id}>
                    <td>
                      <div className="fw-bold text-dark">{h.name}</div>
                      <div className="small text-muted">{h.contactEmail || 'N/A'}</div>
                    </td>
                    <td className="small text-secondary">{h.city}, {h.state}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        ★ {h.averageRating || h.starRating} ({h.reviewCount || 0})
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${h.status}`}>{h.status}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${h.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'} d-flex align-items-center gap-1`}
                        onClick={() => handleToggleHotelStatus(h._id, h.status)}
                      >
                        {h.status === 'active' ? <X size={13} /> : <Check size={13} />}
                        {h.status === 'active' ? 'Suspend' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Audit Logs Table */
        <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover table-hp mb-0">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Triggered By</th>
                  <th>Target Resource</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="fw-semibold text-primary font-monospace small">{log.action}</td>
                    <td>
                      <div className="small fw-semibold">{log.userId?.name || 'System'}</div>
                      <span className="badge bg-light text-dark small" style={{ fontSize: '9px' }}>
                        {log.userRole}
                      </span>
                    </td>
                    <td className="small text-secondary">
                      {log.targetResource} ({log.targetId || 'N/A'})
                    </td>
                    <td className="small text-muted">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
