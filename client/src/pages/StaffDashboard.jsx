import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  LogIn,
  LogOut,
  BedDouble,
  CheckSquare,
  BellRing,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    arrivals: [],
    departures: [],
    inHouse: [],
    roomStats: { clean: 0, dirty: 0, cleaning: 0, maintenance: 0, total: 0 }
  });
  const [housekeepingTasks, setHousekeepingTasks] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('arrivals'); // 'arrivals' | 'inhouse' | 'housekeeping' | 'services'

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const [overviewRes, hkRes, servicesRes] = await Promise.all([
        axiosClient.get('/operations/overview'),
        axiosClient.get('/operations/housekeeping'),
        axiosClient.get('/operations/services')
      ]);

      if (overviewRes.data?.success) {
        setData(overviewRes.data.data);
      }
      if (hkRes.data?.success) {
        setHousekeepingTasks(hkRes.data.tasks || []);
      }
      if (servicesRes.data?.success) {
        setServiceRequests(servicesRes.data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleCheckIn = async (bookingId) => {
    try {
      setError('');
      setMessage('');
      const res = await axiosClient.post('/operations/check-in', { bookingId });
      if (res.data?.success) {
        setMessage(res.data.message || 'Guest checked in successfully.');
        fetchStaffData();
      }
    } catch (err) {
      setError(err.message || 'Check-in failed.');
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      setError('');
      setMessage('');
      const res = await axiosClient.post('/operations/check-out', { bookingId });
      if (res.data?.success) {
        setMessage(res.data.message || 'Guest checked out successfully.');
        fetchStaffData();
      }
    } catch (err) {
      setError(err.message || 'Check-out failed.');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      setError('');
      const res = await axiosClient.patch(`/operations/housekeeping/${taskId}`, {
        status: newStatus
      });
      if (res.data?.success) {
        setMessage(`Task marked as ${newStatus.replace('_', ' ')}.`);
        fetchStaffData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update task.');
    }
  };

  const handleUpdateServiceStatus = async (reqId, newStatus) => {
    try {
      setError('');
      const res = await axiosClient.patch(`/operations/services/${reqId}`, {
        status: newStatus
      });
      if (res.data?.success) {
        setMessage(`Service request updated to ${newStatus}.`);
        fetchStaffData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update service request.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            Front Desk & Operations Portal
          </span>
          <h2 className="font-serif fw-bold text-dark mb-0">Daily Front Desk Operations</h2>
          <p className="text-muted small mb-0">Assigned Hotel Operations: Front Desk, Check-Ins, Housekeeping & Services</p>
        </div>
        <button className="btn btn-outline-dark btn-sm" onClick={fetchStaffData}>
          Refresh Live Status
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

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Arrivals Today</span>
                <h3 className="fw-bold mb-0 text-dark mt-1">{data.arrivals.length}</h3>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                <LogIn size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Departures Today</span>
                <h3 className="fw-bold mb-0 text-dark mt-1">{data.departures.length}</h3>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
                <LogOut size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">In-House Guests</span>
                <h3 className="fw-bold mb-0 text-dark mt-1">{data.inHouse.length}</h3>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3">
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card hp-card border-0 p-3 bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Dirty / Cleaning</span>
                <h3 className="fw-bold mb-0 text-danger mt-1">
                  {(data.roomStats.dirty || 0) + (data.roomStats.cleaning || 0)}
                </h3>
              </div>
              <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3">
                <BedDouble size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-1 rounded-3 shadow-sm border d-inline-flex">
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'arrivals' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('arrivals')}
          >
            Arrivals Today ({data.arrivals.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'inhouse' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('inhouse')}
          >
            In-House & Departures ({data.inHouse.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'housekeeping' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('housekeeping')}
          >
            Housekeeping Tasks ({housekeepingTasks.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'services' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('services')}
          >
            Service Requests ({serviceRequests.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="text-muted small mt-2">Loading front desk data...</p>
        </div>
      ) : activeTab === 'arrivals' ? (
        /* Arrivals Tab */
        data.arrivals.length === 0 ? (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm">
            <LogIn size={48} className="text-muted mb-3 mx-auto" />
            <h5 className="fw-bold font-serif mb-1">No Pending Arrivals Today</h5>
            <p className="text-muted small mb-0">All expected guests for today have checked in or no bookings scheduled.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-hp mb-0">
                <thead>
                  <tr>
                    <th>Ref / Guest</th>
                    <th>Category</th>
                    <th>Dates / Nights</th>
                    <th>Total Paid</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.arrivals.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="fw-semibold text-dark">{booking.guestSnapshot?.name}</div>
                        <div className="font-monospace small text-muted">{booking.bookingReference}</div>
                        <div className="small text-muted">{booking.guestSnapshot?.phone}</div>
                      </td>
                      <td className="small text-dark fw-medium">{booking.categoryId?.name}</td>
                      <td className="small text-secondary">
                        {new Date(booking.checkInDate).toLocaleDateString()} —{' '}
                        {new Date(booking.checkOutDate).toLocaleDateString()} ({booking.nights}N)
                      </td>
                      <td className="fw-bold small text-dark">
                        ₹{booking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge-status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-gold btn-sm px-3 fw-semibold"
                          onClick={() => handleCheckIn(booking._id)}
                        >
                          Check In Guest
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : activeTab === 'inhouse' ? (
        /* In-House Guests Tab */
        data.inHouse.length === 0 ? (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm">
            <Users size={48} className="text-muted mb-3 mx-auto" />
            <h5 className="fw-bold font-serif mb-1">No Guests Currently In-House</h5>
            <p className="text-muted small mb-0">No active checked-in guests at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-hp mb-0">
                <thead>
                  <tr>
                    <th>Room / Guest</th>
                    <th>Booking Ref</th>
                    <th>Check-in Date</th>
                    <th>Check-out Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inHouse.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <span className="badge bg-dark text-white me-2">
                          Room {booking.roomId?.roomNumber || 'Assigned'}
                        </span>
                        <span className="fw-semibold text-dark">{booking.guestSnapshot?.name}</span>
                      </td>
                      <td className="font-monospace small text-primary">{booking.bookingReference}</td>
                      <td className="small text-muted">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td className="small text-muted">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm px-3"
                          onClick={() => handleCheckOut(booking._id)}
                        >
                          Process Check-Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : activeTab === 'housekeeping' ? (
        /* Housekeeping Tasks Tab */
        housekeepingTasks.length === 0 ? (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm">
            <CheckSquare size={48} className="text-muted mb-3 mx-auto" />
            <h5 className="fw-bold font-serif mb-1">Housekeeping Queue Clean</h5>
            <p className="text-muted small mb-0">No pending room cleaning tasks currently scheduled.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-hp mb-0">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Priority</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {housekeepingTasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <span className="fw-bold text-dark fs-6">
                          Room {task.roomId?.roomNumber}
                        </span>
                        <div className="small text-muted">Floor {task.roomId?.floor || 1}</div>
                      </td>
                      <td>
                        <span className={`badge ${task.priority === 'high' || task.priority === 'urgent' ? 'bg-danger' : 'bg-secondary'}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="small text-secondary">{task.notes || 'Standard turn-down & clean'}</td>
                      <td>
                        <span className={`badge-status ${task.status}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {task.status === 'pending' && (
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleUpdateTaskStatus(task._id, 'in_progress')}
                            >
                              Start Cleaning
                            </button>
                          )}
                          {task.status !== 'completed' && (
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleUpdateTaskStatus(task._id, 'completed')}
                            >
                              Mark Clean & Inspected
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Service Requests Queue */
        serviceRequests.length === 0 ? (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm">
            <BellRing size={48} className="text-muted mb-3 mx-auto" />
            <h5 className="fw-bold font-serif mb-1">No Active Guest Service Requests</h5>
            <p className="text-muted small mb-0">All guest requests have been fulfilled.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-hp mb-0">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Guest</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="fw-semibold text-capitalize text-dark">{req.requestType.replace('_', ' ')}</td>
                      <td>
                        <div className="small fw-semibold">{req.guestId?.name}</div>
                        <div className="small text-muted">{req.guestId?.phone}</div>
                      </td>
                      <td className="small text-secondary">{req.description}</td>
                      <td>
                        <span className={`badge-status ${req.status}`}>{req.status}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {req.status === 'submitted' && (
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleUpdateServiceStatus(req._id, 'in_progress')}
                            >
                              Acknowledge
                            </button>
                          )}
                          {req.status !== 'completed' && (
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleUpdateServiceStatus(req._id, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default StaffDashboard;

