import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Clock,
  FileText,
  XCircle,
  BellRing,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

const GuestDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'services'

  // Service Request Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedBookingForService, setSelectedBookingForService] = useState(null);
  const [serviceType, setServiceType] = useState('towels');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceSubmitting, setServiceSubmitting] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchGuestData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        axiosClient.get('/bookings/my'),
        axiosClient.get('/operations/services')
      ]);

      if (bookingsRes.data?.success) {
        setBookings(bookingsRes.data.bookings || []);
      }
      if (servicesRes.data?.success) {
        setServiceRequests(servicesRes.data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching guest data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation and initiate an eligible refund?')) {
      return;
    }

    try {
      setError('');
      setMessage('');
      const res = await axiosClient.post(`/bookings/${bookingId}/cancel`, {
        reason: 'Guest initiated cancellation via dashboard'
      });
      if (res.data?.success) {
        setMessage('Reservation cancelled and refund processed successfully.');
        fetchGuestData();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation.');
    }
  };

  const handleOpenServiceModal = (booking) => {
    setSelectedBookingForService(booking);
    setServiceDescription('');
    setIsServiceModalOpen(true);
  };

  const handleSubmitServiceRequest = async (e) => {
    e.preventDefault();
    setServiceSubmitting(true);
    try {
      const res = await axiosClient.post('/operations/services', {
        bookingId: selectedBookingForService._id,
        requestType: serviceType,
        description: serviceDescription,
        priority: 'medium'
      });
      if (res.data?.success) {
        setIsServiceModalOpen(false);
        setMessage('Service request dispatched to hotel staff.');
        fetchGuestData();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit service request.');
    } finally {
      setServiceSubmitting(false);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setReviewTitle('');
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const res = await axiosClient.post('/reviews', {
        hotelId: selectedBookingForReview.hotelId._id,
        bookingId: selectedBookingForReview._id,
        rating,
        title: reviewTitle,
        comment: reviewComment
      });
      if (res.data?.success) {
        setIsReviewModalOpen(false);
        setMessage('Thank you! Your verified stay review has been submitted.');
        fetchGuestData();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            Guest Privileges
          </span>
          <h2 className="font-serif fw-bold text-dark mb-0">Welcome, {user?.name}</h2>
          <p className="text-muted small mb-0">Manage your upcoming retreats, download invoices, and request hotel services.</p>
        </div>
        <Link to="/hotels" className="btn btn-gold btn-sm mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
          <Plus size={16} /> Explore New Destinations
        </Link>
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

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-1 rounded-3 shadow-sm border d-inline-flex">
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'bookings' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Stays & Bookings ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${activeTab === 'services' ? 'active bg-dark text-warning' : 'text-secondary'}`}
            onClick={() => setActiveTab('services')}
          >
            My Service Requests ({serviceRequests.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="text-muted small mt-2">Retrieving your hospitality records...</p>
        </div>
      ) : activeTab === 'bookings' ? (
        bookings.length === 0 ? (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm">
            <Calendar size={48} className="text-muted mb-3 mx-auto" />
            <h4 className="fw-bold font-serif mb-1">No Reservations Found</h4>
            <p className="text-muted small mb-4">You do not have any active or past reservations with HotelPro yet.</p>
            <Link to="/hotels" className="btn btn-gold btn-sm px-4">
              Explore Luxury Suites
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="card hp-card border-0 shadow-sm p-4 bg-white">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={booking.hotelId?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                      alt={booking.hotelId?.name}
                      className="rounded-3 w-100"
                      style={{ height: '140px', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={`badge-status ${booking.status}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className="text-muted small font-monospace">
                        Ref: <strong>{booking.bookingReference}</strong>
                      </span>
                    </div>

                    <h5 className="font-serif fw-bold text-dark mb-1">{booking.hotelId?.name}</h5>
                    <p className="text-muted small mb-2 d-flex align-items-center gap-1">
                      <MapPin size={14} color="#c5a059" />
                      <span>{booking.hotelId?.city}, {booking.hotelId?.state}</span>
                    </p>

                    <div className="d-flex flex-wrap gap-3 small text-secondary">
                      <span>
                        <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
                      </span>
                      <span>
                        <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                      <span>
                        <strong>Nights:</strong> {booking.nights}
                      </span>
                      <span>
                        <strong>Suite:</strong> {booking.categoryId?.name}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3 text-md-end d-flex flex-column justify-content-between h-100">
                    <div>
                      <span className="text-muted small d-block">Total Paid</span>
                      <span className="fs-4 fw-bold text-dark">
                        ₹{booking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="d-flex flex-column gap-2 mt-3">
                      <Link
                        to={`/invoice/${booking._id}`}
                        className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-1"
                      >
                        <FileText size={14} /> Official Invoice
                      </Link>

                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleOpenServiceModal(booking)}
                          >
                            <BellRing size={14} /> Request Service
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            <XCircle size={14} /> Cancel & Refund
                          </button>
                        </>
                      )}

                      {booking.status === 'checked_in' && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleOpenServiceModal(booking)}
                        >
                          <BellRing size={14} /> Request Room Service
                        </button>
                      )}

                      {booking.status === 'checked_out' && (
                        <button
                          type="button"
                          className="btn btn-outline-gold btn-sm d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleOpenReviewModal(booking)}
                        >
                          <Star size={14} /> Write Verified Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Service Requests Tab */
        serviceRequests.length === 0 ? (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm">
            <BellRing size={48} className="text-muted mb-3 mx-auto" />
            <h4 className="fw-bold font-serif mb-1">No Active Requests</h4>
            <p className="text-muted small mb-0">You have not submitted any guest service requests.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-hp mb-0">
                <thead>
                  <tr>
                    <th>Request Type</th>
                    <th>Description</th>
                    <th>Booking Ref</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="fw-semibold text-capitalize text-dark">{req.requestType.replace('_', ' ')}</td>
                      <td className="small text-secondary">{req.description}</td>
                      <td className="font-monospace small text-primary">{req.bookingId?.bookingReference || 'N/A'}</td>
                      <td className="small text-muted">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge-status ${req.status}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Guest Service Modal */}
      {isServiceModalOpen && selectedBookingForService && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark text-white p-3 px-4">
                <h5 className="modal-title font-serif fs-5 mb-0 text-white">Request Guest Service</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsServiceModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmitServiceRequest}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Service Type</label>
                    <select
                      className="form-select"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="towels">Extra Towels & Linens</option>
                      <option value="cleaning">Daily Room Cleaning</option>
                      <option value="room_service">In-Room Dining / Butler</option>
                      <option value="maintenance">Maintenance Assistance</option>
                      <option value="wakeup_call">Wake-Up Call</option>
                      <option value="other">Special Guest Request</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Instructions / Details</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Please bring 2 extra bath sheets and ice bucket..."
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3 px-4 d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsServiceModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold btn-sm px-4" disabled={serviceSubmitting}>
                    {serviceSubmitting ? 'Sending...' : 'Dispatch Request to Front Desk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedBookingForReview && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark text-white p-3 px-4">
                <h5 className="modal-title font-serif fs-5 mb-0 text-white">Write Verified Stay Review</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsReviewModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted d-block">Overall Rating (1 - 5 Stars)</label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="btn btn-sm p-1 border-0"
                          onClick={() => setRating(star)}
                        >
                          <Star
                            size={28}
                            fill={star <= rating ? '#d4af37' : 'none'}
                            color={star <= rating ? '#d4af37' : '#cbd5e1'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Review Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Unforgettable waterfront experience"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Your Written Feedback</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Share your stay experience, dining quality, and staff hospitality..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3 px-4 d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsReviewModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold btn-sm px-4" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Posting...' : 'Submit Verified Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDashboard;
