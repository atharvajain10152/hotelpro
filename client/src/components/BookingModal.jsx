import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Tag, ShieldCheck, Clock, X, AlertCircle } from 'lucide-react';

const BookingModal = ({ hotel, category, isOpen, onClose, onHoldSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  const getTomorrowStr = (daysAhead = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [checkInDate, setCheckInDate] = useState(getTomorrowStr(1));
  const [checkOutDate, setCheckOutDate] = useState(getTomorrowStr(4));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [pricing, setPricing] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch live pricing whenever dates, guests, or coupon change
  useEffect(() => {
    if (!isOpen || !hotel || !category) return;

    const fetchPrice = async () => {
      setLoadingPrice(true);
      setError('');
      try {
        const res = await axiosClient.get(
          `/rooms/hotel/${hotel._id}/category/${category._id}/availability`,
          {
            params: {
              checkInDate,
              checkOutDate,
              adults,
              children,
              couponCode
            }
          }
        );
        if (res.data?.success && res.data.pricing) {
          setPricing(res.data.pricing);
        }
      } catch (err) {
        setError(err.message || 'Availability check failed.');
        setPricing(null);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [isOpen, hotel?._id, category?._id, checkInDate, checkOutDate, adults, children, couponCode]);

  if (!isOpen || !hotel || !category) return null;

  const handleCreateHold = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please sign in or register to complete your reservation.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await axiosClient.post('/bookings/hold', {
        hotelId: hotel._id,
        categoryId: category._id,
        checkInDate,
        checkOutDate,
        guests: { adults: Number(adults), children: Number(children) },
        specialRequests,
        couponCode
      });

      if (res.data?.success && res.data.booking) {
        onHoldSuccess(res.data.booking);
      }
    } catch (err) {
      setError(err.message || 'Failed to hold room reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white p-4 position-relative">
            <div>
              <span className="badge bg-warning text-dark text-uppercase mb-1" style={{ fontSize: '10px' }}>
                Direct Reservation Hold
              </span>
              <h5 className="modal-title font-serif fs-4 mb-0 text-white">{category.name}</h5>
              <p className="text-secondary small mb-0">{hotel.name} — {hotel.city}</p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleCreateHold}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">
                    <Calendar size={14} className="me-1" /> Check-in Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">
                    <Calendar size={14} className="me-1" /> Check-out Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">
                    <Users size={14} className="me-1" /> Adults
                  </label>
                  <select
                    className="form-select"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} Adult{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">
                    <Users size={14} className="me-1" /> Children
                  </label>
                  <select
                    className="form-select"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                  >
                    {[0, 1, 2, 3].map((num) => (
                      <option key={num} value={num}>
                        {num} Child{num !== 1 ? 'ren' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Requests & Coupon */}
              <div className="row g-3 mb-4">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold text-muted">Special Requests</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. High floor, quiet room, late check-in"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">
                    <Tag size={14} className="me-1" /> Promo Code
                  </label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    placeholder="e.g. HOTELPRO10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Authoritative Pricing Summary */}
              <div className="bg-light p-3 rounded-3 border">
                <h6 className="fw-bold mb-3 small text-uppercase text-secondary" style={{ letterSpacing: '0.5px' }}>
                  Authoritative Price Breakdown
                </h6>
                {loadingPrice ? (
                  <div className="text-center py-3 text-muted small">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Calculating authoritative pricing for dates...
                  </div>
                ) : pricing ? (
                  <div>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>₹{pricing.baseNightlyRate.toLocaleString('en-IN')} × {pricing.nights} Night{pricing.nights > 1 ? 's' : ''}</span>
                      <span>₹{pricing.roomSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {pricing.extraGuestFee > 0 && (
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Extra Guest Fees</span>
                        <span>₹{pricing.extraGuestFee.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {pricing.discount > 0 && (
                      <div className="d-flex justify-content-between small text-success mb-2">
                        <span>Promo Code Discount</span>
                        <span>-₹{pricing.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Taxes & Hospitality GST (18%)</span>
                      <span>₹{pricing.taxesAndFees.toLocaleString('en-IN')}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold text-dark fs-5">
                      <span>Total Guaranteed Amount:</span>
                      <span className="text-dark">₹{pricing.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted small">Select dates to view guaranteed pricing.</div>
                )}
              </div>

              <div className="d-flex align-items-center gap-2 mt-3 text-muted small">
                <Clock size={15} color="#c5a059" />
                <span>Temporary 15-minute hold placed upon initiating booking. Instant confirmation upon payment.</span>
              </div>
            </div>

            <div className="modal-footer bg-light p-3 px-4 d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-gold px-4"
                disabled={submitting || !pricing || loadingPrice}
              >
                {submitting ? 'Holding Reservation...' : 'Proceed to Secure Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
