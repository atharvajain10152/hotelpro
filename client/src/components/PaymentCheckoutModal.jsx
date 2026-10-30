import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentCheckoutModal = ({ booking, isOpen, onClose, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !booking) return null;

  const handleProcessPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Create payment order on server
      const orderRes = await axiosClient.post('/payments/create-order', {
        bookingId: booking._id
      });

      if (!orderRes.data?.success) {
        throw new Error('Could not initiate payment order.');
      }

      const orderData = orderRes.data.order;

      // 2. Process and verify payment on server
      const verifyRes = await axiosClient.post('/payments/verify', {
        bookingId: booking._id,
        orderId: orderData.orderId,
        paymentId: `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        signature: 'sig_mock_verified'
      });

      if (verifyRes.data?.success) {
        setConfirmedBooking(verifyRes.data.booking);
        if (onPaymentSuccess) {
          onPaymentSuccess(verifyRes.data.booking);
        }
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg overflow-hidden">
          {confirmedBooking ? (
            <div className="modal-body p-5 text-center">
              <div className="text-success mb-3">
                <CheckCircle2 size={64} className="mx-auto" />
              </div>
              <h4 className="fw-bold font-serif mb-2 text-dark">Reservation Confirmed!</h4>
              <p className="text-muted small mb-4">
                Your payment was verified and processed successfully. An official booking confirmation and
                receipt have been dispatched to your email.
              </p>

              <div className="bg-light p-3 rounded-3 text-start small mb-4 border">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Booking Reference:</span>
                  <span className="fw-bold font-monospace text-primary">
                    {confirmedBooking.bookingReference}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Status:</span>
                  <span className="badge bg-success">Confirmed & Paid</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total Paid:</span>
                  <span className="fw-bold text-dark">
                    ₹{confirmedBooking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Link
                  to={`/invoice/${confirmedBooking._id}`}
                  className="btn btn-dark-hp d-flex align-items-center justify-content-center gap-2"
                  onClick={onClose}
                >
                  <FileText size={16} />
                  View & Print Official Invoice
                </Link>
                <Link
                  to="/dashboard/guest"
                  className="btn btn-outline-gold d-flex align-items-center justify-content-center gap-2"
                  onClick={onClose}
                >
                  Go to My Reservations
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="modal-header bg-dark text-white p-4">
                <div>
                  <h5 className="modal-title font-serif fs-5 mb-0 text-white">Secure Hospitality Checkout</h5>
                  <span className="text-secondary small">
                    Booking Reference: {booking.bookingReference}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Total Payable Amount:</span>
                    <span className="fs-4 fw-bold text-dark">
                      ₹{booking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="small text-muted">
                    Includes ₹{booking.pricingBreakdown.taxesAndFees.toLocaleString('en-IN')} in taxes & service GST.
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-2">
                    Payment Gateway Integration
                  </label>
                  <div className="border rounded-3 p-3 bg-white mb-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <CreditCard size={22} color="#c5a059" />
                      <div>
                        <div className="fw-semibold text-dark small">Razorpay / Stripe Test Sandbox</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          Verified Server-Side Cryptographic Signature
                        </div>
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      Ready
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted small p-2 rounded bg-light border">
                  <ShieldCheck size={18} color="#15803d" />
                  <span>256-bit TLS encrypted transaction with idempotent server validation.</span>
                </div>
              </div>

              <div className="modal-footer bg-light p-3 px-4 d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                  Cancel Hold
                </button>
                <button
                  type="button"
                  className="btn btn-gold px-4"
                  onClick={handleProcessPayment}
                  disabled={loading}
                >
                  {loading ? 'Verifying & Confirming...' : `Pay ₹${booking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckoutModal;

