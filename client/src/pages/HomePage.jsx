import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import HotelCard from '../components/HotelCard';
import {
  Search,
  Calendar,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosClient.get('/hotels?limit=3');
        if (res.data?.success) {
          setFeaturedHotels(res.data.hotels);
        }
      } catch (err) {
        console.error('Error fetching featured hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div>
      {/* Luxury Hero Banner */}
      <section className="hp-hero text-center position-relative">
        <div className="container py-lg-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-dark bg-opacity-75 border border-warning border-opacity-50 text-warning small mb-4">
            <Sparkles size={14} color="#d4af37" />
            <span className="text-uppercase" style={{ letterSpacing: '1px', fontSize: '11px' }}>
              Exquisite 5-Star Hospitality Across India
            </span>
          </div>

          <h1 className="display-4 fw-bold font-serif mb-3 text-white">
            Experience Timeless Luxury & Unrivaled Hospitality
          </h1>
          <p className="lead mx-auto mb-5 text-light opacity-85" style={{ maxWidth: '750px' }}>
            Discover hand-picked royal palaces, tranquil seaside villas, and elite waterfront suites.
            Guaranteed authoritative availability, Michelin-standard dining, and personal concierge services.
          </p>

          {/* Quick Destination Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {['Mumbai', 'Goa', 'Udaipur', 'Jaipur'].map((city) => (
              <button
                key={city}
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 bg-dark bg-opacity-50"
                onClick={() => {
                  setDestination(city);
                  navigate(`/hotels?destination=${city}`);
                }}
              >
                Explore {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Booking Search Bar */}
      <div className="container">
        <div className="hp-search-box">
          <form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-semibold text-muted text-uppercase">
                <Compass size={14} className="me-1 text-warning" /> Destination / Hotel
              </label>
              <input
                type="text"
                className="form-control py-2"
                placeholder="e.g. Mumbai, Goa, Udaipur, Palace..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted text-uppercase">
                <Calendar size={14} className="me-1 text-warning" /> Check-in Date
              </label>
              <input
                type="date"
                className="form-control py-2"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted text-uppercase">
                <Calendar size={14} className="me-1 text-warning" /> Check-out Date
              </label>
              <input
                type="date"
                className="form-control py-2"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-6 d-grid">
              <button type="submit" className="btn btn-gold py-2 d-flex align-items-center justify-content-center gap-2">
                <Search size={16} />
                Find Suites
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Luxury Sanctuaries */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
                Curated Luxury
              </span>
              <h2 className="font-serif fw-bold text-dark mb-0">Featured Sanctuaries & Palaces</h2>
            </div>
            <Link to="/hotels" className="btn btn-outline-dark btn-sm mt-3 mt-md-0 d-inline-flex align-items-center gap-1">
              View All Destinations <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="text-muted small mt-2">Loading curated hotels from database...</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center mb-3 rounded-circle"
                style={{ width: '56px', height: '56px', backgroundColor: '#fbf7ee' }}
              >
                <ShieldCheck size={28} color="#c5a059" />
              </div>
              <h5 className="fw-bold mb-1 font-serif">Guaranteed Rates</h5>
              <p className="text-muted small mb-0">
                Authoritative pricing calculated directly on server. No surprise charges upon arrival.
              </p>
            </div>

            <div className="col-md-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center mb-3 rounded-circle"
                style={{ width: '56px', height: '56px', backgroundColor: '#fbf7ee' }}
              >
                <Clock size={28} color="#c5a059" />
              </div>
              <h5 className="fw-bold mb-1 font-serif">Instant Hold & Confirmation</h5>
              <p className="text-muted small mb-0">
                15-minute temporary reservation holds with concurrency protection against double-booking.
              </p>
            </div>

            <div className="col-md-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center mb-3 rounded-circle"
                style={{ width: '56px', height: '56px', backgroundColor: '#fbf7ee' }}
              >
                <Award size={28} color="#c5a059" />
              </div>
              <h5 className="fw-bold mb-1 font-serif">Verified Stay Reviews</h5>
              <p className="text-muted small mb-0">
                Only guests with checked-out stays can submit reviews, guaranteeing genuine ratings.
              </p>
            </div>

            <div className="col-md-3">
              <div
                className="mx-auto d-flex align-items-center justify-content-center mb-3 rounded-circle"
                style={{ width: '56px', height: '56px', backgroundColor: '#fbf7ee' }}
              >
                <Sparkles size={28} color="#c5a059" />
              </div>
              <h5 className="fw-bold mb-1 font-serif">24/7 Butler & Service</h5>
              <p className="text-muted small mb-0">
                Submit guest service requests directly through your dashboard for instant staff fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-5 text-center text-white bg-dark position-relative">
        <div className="container py-4">
          <h2 className="font-serif fw-bold mb-3 text-white">Join the HotelPro Privileges Program</h2>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
            Complimentary airport limousine transfers, flexible cancellations, and member-exclusive suite upgrades.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-gold px-4 py-2 fw-semibold">
              Create Complimentary Account
            </Link>
            <Link to="/login" className="btn btn-outline-light px-4 py-2">
              Sign In to Your Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

