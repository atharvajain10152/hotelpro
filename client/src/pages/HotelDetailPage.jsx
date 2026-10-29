import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import BookingModal from '../components/BookingModal';
import PaymentCheckoutModal from '../components/PaymentCheckoutModal';
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Bed,
  Users,
  Maximize2,
  Check,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const HotelDetailPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [heldBooking, setHeldBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/hotels/${id}`);
        if (res.data?.success) {
          setHotel(res.data.hotel);
          setCategories(res.data.categories || []);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleOpenBooking = (category) => {
    setSelectedCategory(category);
    setIsBookingModalOpen(true);
  };

  const handleHoldSuccess = (booking) => {
    setIsBookingModalOpen(false);
    setHeldBooking(booking);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="text-muted small mt-2">Loading hotel sanctuary details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container py-5 text-center">
        <h3>Hotel Not Found</h3>
        <p className="text-muted">The requested property is not currently listed.</p>
        <Link to="/hotels" className="btn btn-gold btn-sm">Return to Hotels Directory</Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/hotels" className="text-decoration-none text-muted">Hotels</Link></li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">{hotel.name}</li>
          </ol>
        </nav>

        {/* Title & Location Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-dark text-warning d-inline-flex align-items-center gap-1">
                <Star size={13} fill="#d4af37" color="#d4af37" />
                <span>{hotel.averageRating || hotel.starRating} ({hotel.reviewCount || 0} verified reviews)</span>
              </span>
              <span className="badge bg-light text-secondary border">5-Star Luxury Resort</span>
            </div>
            <h1 className="font-serif fw-bold text-dark mb-1">{hotel.name}</h1>
            <p className="text-muted small mb-0 d-flex align-items-center gap-1">
              <MapPin size={15} color="#c5a059" />
              <span>{hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}</span>
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="row g-2 mb-5 rounded-4 overflow-hidden shadow-sm">
          <div className="col-md-8">
            <img
              src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
              alt={hotel.name}
              className="w-100"
              style={{ height: '420px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-2">
            <img
              src={hotel.images?.[1] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'}
              alt={hotel.name}
              className="w-100"
              style={{ height: '206px', objectFit: 'cover' }}
            />
            <img
              src={hotel.images?.[2] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'}
              alt={hotel.name}
              className="w-100"
              style={{ height: '206px', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Details & Room Suites */}
          <div className="col-lg-8">
            {/* Overview */}
            <div className="bg-white p-4 rounded-3 border mb-4">
              <h4 className="font-serif fw-bold mb-3 text-dark">About the Sanctuary</h4>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                {hotel.description}
              </p>

              <hr className="my-4" />

              <h5 className="font-serif fw-bold mb-3 text-dark">Signature Amenities & Facilities</h5>
              <div className="row g-2">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="col-md-6 d-flex align-items-center gap-2 small text-secondary">
                    <Check size={16} color="#c5a059" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Categories */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="font-serif fw-bold text-dark mb-0">Select Your Luxury Suite</h3>
                <span className="text-muted small">{categories.length} suite categories available</span>
              </div>

              <div className="d-flex flex-column gap-4">
                {categories.map((cat) => (
                  <div key={cat._id} className="card hp-card border-0 overflow-hidden shadow-sm">
                    <div className="row g-0">
                      <div className="col-md-5">
                        <img
                          src={cat.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'}
                          alt={cat.name}
                          className="w-100 h-100"
                          style={{ minHeight: '220px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="font-serif fw-bold text-dark mb-0">{cat.name}</h5>
                            <span className="fs-5 fw-bold text-dark text-nowrap">
                              ₹{cat.basePrice.toLocaleString('en-IN')}
                              <span className="text-muted small fw-normal"> / night</span>
                            </span>
                          </div>

                          <p className="text-muted small mb-3">{cat.description}</p>

                          <div className="d-flex flex-wrap gap-3 small text-muted mb-3">
                            <span className="d-flex align-items-center gap-1">
                              <Users size={15} color="#c5a059" /> Up to {cat.capacity.maxGuests} Guests
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <Bed size={15} color="#c5a059" /> {cat.bedType}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                              <Maximize2 size={15} color="#c5a059" /> {cat.roomSizeSqFt} sq.ft
                            </span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                          <span className="text-success small fw-medium d-flex align-items-center gap-1">
                            <Sparkles size={14} /> Free Cancellation Available
                          </span>
                          <button
                            type="button"
                            className="btn btn-gold btn-sm px-4 fw-semibold"
                            onClick={() => handleOpenBooking(cat)}
                          >
                            Reserve Suite
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reviews */}
            <div className="bg-white p-4 rounded-3 border mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="font-serif fw-bold mb-0 text-dark">Verified Stay Reviews</h4>
                <div className="badge bg-dark text-warning px-3 py-2 fs-6">
                  ★ {hotel.averageRating || '5.0'} / 5.0
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted small mb-0">No reviews submitted yet for this hotel.</p>
              ) : (
                <div className="d-flex flex-column gap-3 mt-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="border-bottom pb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={rev.guestId?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                            alt={rev.guestId?.name}
                            className="rounded-circle"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                          <div>
                            <span className="fw-semibold text-dark small d-block">{rev.guestId?.name}</span>
                            <span className="badge bg-success-subtle text-success small" style={{ fontSize: '10px' }}>
                              Verified Stay
                            </span>
                          </div>
                        </div>
                        <div className="text-warning small">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      {rev.title && <h6 className="fw-bold mb-1 small">{rev.title}</h6>}
                      <p className="text-secondary small mb-1">{rev.comment}</p>
                      <span className="text-muted" style={{ fontSize: '11px' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Policies & Highlights Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="font-serif fw-bold text-dark mb-3">Hotel Policies & Stays</h5>

              <div className="mb-3">
                <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                  <Clock size={15} color="#c5a059" /> Check-in & Check-out
                </div>
                <div className="fw-semibold small text-dark">
                  Check-in from {hotel.checkInTime || '14:00'} • Check-out until {hotel.checkOutTime || '11:00'}
                </div>
              </div>

              <div className="mb-3">
                <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                  <ShieldCheck size={15} color="#c5a059" /> Cancellation Policy
                </div>
                <div className="small text-secondary">
                  {hotel.cancellationPolicy || 'Free cancellation up to 48 hours prior to check-in.'}
                </div>
              </div>

              <div className="mb-4">
                <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                  <Award size={15} color="#c5a059" /> Direct Booking Privileges
                </div>
                <ul className="list-unstyled small text-secondary mb-0">
                  <li className="mb-1">✓ No booking fees or hidden charges</li>
                  <li className="mb-1">✓ Free Wi-Fi across all suites</li>
                  <li className="mb-1">✓ Early check-in subject to availability</li>
                </ul>
              </div>

              <div className="p-3 bg-light rounded-3 text-center">
                <div className="small text-muted mb-1">Need assistance reserving?</div>
                <div className="fw-bold text-dark small">{hotel.contactPhone || '+91 22 8000 4455'}</div>
                <div className="text-muted small">{hotel.contactEmail || 'reservations@hotelpro.com'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Hold Modal */}
      <BookingModal
        hotel={hotel}
        category={selectedCategory}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onHoldSuccess={handleHoldSuccess}
      />

      {/* Payment Checkout Modal */}
      <PaymentCheckoutModal
        booking={heldBooking}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {}}
      />
    </div>
  );
};

export default HotelDetailPage;
