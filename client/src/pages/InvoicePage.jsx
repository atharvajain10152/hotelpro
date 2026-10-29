import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Printer, Crown, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const InvoicePage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axiosClient.get(`/bookings/${id}`);
        if (res.data?.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking invoice.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="text-muted small mt-2">Generating official tax invoice...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <h3>Invoice Not Found</h3>
        <p className="text-muted">{error || 'Could not retrieve invoice details.'}</p>
        <Link to="/dashboard/guest" className="btn btn-gold btn-sm">Return to My Dashboard</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const pb = booking.pricingBreakdown;

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Navigation & Print Action */}
        <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
          <Link to="/dashboard/guest" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Back to Reservations
          </Link>
          <button type="button" className="btn btn-dark-hp btn-sm d-flex align-items-center gap-2" onClick={handlePrint}>
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>

        {/* Invoice Paper */}
        <div className="card border-0 shadow p-5 bg-white rounded-3">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Crown size={28} color="#c5a059" />
                <span className="hp-brand fs-3 fw-bold text-dark">HOTELPRO</span>
              </div>
              <p className="text-muted small mb-0">Official Hospitality Tax Invoice & Receipt</p>
              <p className="text-muted small mb-0">GSTIN: 27AABCH1234F1Z8 • Reg # HP-IN-2026</p>
            </div>
            <div className="text-end">
              <span className="badge bg-success-subtle text-success border border-success px-3 py-1 fs-6 mb-2">
                PAID & CONFIRMED
              </span>
              <div className="small text-muted">Invoice Date:</div>
              <div className="fw-semibold text-dark small">{new Date(booking.createdAt).toLocaleDateString()}</div>
              <div className="font-monospace small text-primary fw-bold">Ref: {booking.bookingReference}</div>
            </div>
          </div>

          {/* Hotel & Guest Information */}
          <div className="row g-4 mb-4">
            <div className="col-6">
              <h6 className="text-uppercase text-muted fw-bold small mb-2" style={{ letterSpacing: '0.5px' }}>
                Sanctuary Details
              </h6>
              <div className="fw-bold text-dark fs-6">{booking.hotelId?.name}</div>
              <div className="small text-secondary">{booking.hotelId?.address}</div>
              <div className="small text-secondary">{booking.hotelId?.city}, {booking.hotelId?.state}</div>
              <div className="small text-secondary">Concierge: {booking.hotelId?.contactPhone || '+91 22 8000 4455'}</div>
            </div>

            <div className="col-6 text-end">
              <h6 className="text-uppercase text-muted fw-bold small mb-2" style={{ letterSpacing: '0.5px' }}>
                Billed To (Guest)
              </h6>
              <div className="fw-bold text-dark fs-6">{booking.guestSnapshot?.name}</div>
              <div className="small text-secondary">{booking.guestSnapshot?.email}</div>
              <div className="small text-secondary">{booking.guestSnapshot?.phone}</div>
              <div className="small text-muted">Payment Method: Online Verified Sandbox</div>
            </div>
          </div>

          {/* Stay Timeline Details */}
          <div className="bg-light p-3 rounded-3 mb-4 border">
            <div className="row text-center">
              <div className="col-4 border-end">
                <span className="text-muted small d-block">Check-In Date</span>
                <span className="fw-bold text-dark">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                <span className="d-block small text-muted">From {booking.hotelId?.checkInTime || '14:00'}</span>
              </div>
              <div className="col-4 border-end">
                <span className="text-muted small d-block">Check-Out Date</span>
                <span className="fw-bold text-dark">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                <span className="d-block small text-muted">Until {booking.hotelId?.checkOutTime || '11:00'}</span>
              </div>
              <div className="col-4">
                <span className="text-muted small d-block">Duration & Suite</span>
                <span className="fw-bold text-dark">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</span>
                <span className="d-block small text-secondary">{booking.categoryId?.name}</span>
              </div>
            </div>
          </div>

          {/* Itemized Charges Table */}
          <table className="table table-bordered mb-4">
            <thead className="table-light">
              <tr>
                <th>Description</th>
                <th className="text-center">Rate</th>
                <th className="text-center">Duration</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="fw-semibold text-dark">{booking.categoryId?.name}</div>
                  <div className="small text-muted">
                    {booking.guests.adults} Adults, {booking.guests.children} Children
                  </div>
                </td>
                <td className="text-center small">₹{pb.baseNightlyRate.toLocaleString('en-IN')}</td>
                <td className="text-center small">{pb.nights} Night{pb.nights > 1 ? 's' : ''}</td>
                <td className="text-end fw-semibold">₹{pb.roomSubtotal.toLocaleString('en-IN')}</td>
              </tr>
              {pb.extraGuestFee > 0 && (
                <tr>
                  <td colSpan="3" className="small text-secondary">Extra Guest Accommodations</td>
                  <td className="text-end small">₹{pb.extraGuestFee.toLocaleString('en-IN')}</td>
                </tr>
              )}
              {pb.discount > 0 && (
                <tr>
                  <td colSpan="3" className="small text-success">Promo Discount Applied</td>
                  <td className="text-end small text-success">-₹{pb.discount.toLocaleString('en-IN')}</td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="small text-secondary">Hospitality GST (18%)</td>
                <td className="text-end small">₹{pb.taxesAndFees.toLocaleString('en-IN')}</td>
              </tr>
              <tr className="table-light">
                <td colSpan="3" className="fw-bold text-dark fs-6">Total Amount Paid</td>
                <td className="text-end fw-bold text-dark fs-5">
                  ₹{pb.totalAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div className="border-top pt-3 text-muted small d-flex justify-content-between align-items-center">
            <div>
              <span>Thank you for choosing HotelPro Luxury Hospitality.</span>
            </div>
            <div className="d-flex align-items-center gap-1 text-success">
              <CheckCircle2 size={16} /> Verified Official Invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
