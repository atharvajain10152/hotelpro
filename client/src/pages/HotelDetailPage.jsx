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
  Sparkles,
  Utensils,
  Coffee,
  Waves,
  Dumbbell,
  Compass,
  Phone,
  Mail,
  HelpCircle,
  Calendar,
  Building,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const HotelDetailPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // FAQ accordion open states
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  const allImages = hotel.images && hotel.images.length > 0
    ? hotel.images
    : [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      ];

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

        {/* Title, Tagline & Location Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span className="badge bg-dark text-warning d-inline-flex align-items-center gap-1">
                <Star size={13} fill="#d4af37" color="#d4af37" />
                <span>{hotel.averageRating || hotel.starRating || 5.0} ({hotel.reviewCount || 0} verified reviews)</span>
              </span>
              <span className="badge bg-light text-secondary border">5-Star Luxury Resort</span>
              {hotel.propertyDetails?.yearBuilt && (
                <span className="badge bg-light text-muted border">Est. {hotel.propertyDetails.yearBuilt}</span>
              )}
            </div>
            <h1 className="font-serif fw-bold text-dark mb-1">{hotel.name}</h1>
            {hotel.tagline && (
              <p className="text-warning fst-italic mb-2 fs-6" style={{ letterSpacing: '0.2px' }}>
                "{hotel.tagline}"
              </p>
            )}
            <p className="text-muted small mb-0 d-flex align-items-center gap-1">
              <MapPin size={15} color="#c5a059" />
              <span>{hotel.address}, {hotel.city}, {hotel.state}, {hotel.country} {hotel.postalCode}</span>
            </p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1"
              onClick={() => {
                setSelectedPhotoIndex(0);
                setIsGalleryOpen(true);
              }}
            >
              <ImageIcon size={15} />
              <span>View All Photos ({allImages.length})</span>
            </button>
            <button
              type="button"
              className="btn btn-gold btn-sm px-3 fw-semibold"
              onClick={() => scrollToSection('suites-section')}
            >
              Reserve A Suite
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="row g-2 mb-4 rounded-4 overflow-hidden shadow-sm position-relative">
          <div className="col-md-8">
            <img
              src={allImages[0]}
              alt={hotel.name}
              className="w-100 cursor-pointer"
              style={{ height: '420px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => {
                setSelectedPhotoIndex(0);
                setIsGalleryOpen(true);
              }}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-2">
            <img
              src={allImages[1] || allImages[0]}
              alt={`${hotel.name} 2`}
              className="w-100 cursor-pointer"
              style={{ height: '206px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => {
                setSelectedPhotoIndex(1);
                setIsGalleryOpen(true);
              }}
            />
            <div className="position-relative">
              <img
                src={allImages[2] || allImages[0]}
                alt={`${hotel.name} 3`}
                className="w-100 cursor-pointer"
                style={{ height: '206px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedPhotoIndex(2);
                  setIsGalleryOpen(true);
                }}
              />
              <button
                type="button"
                className="btn btn-dark bg-opacity-75 position-absolute bottom-0 end-0 m-3 btn-sm text-white border-0 d-flex align-items-center gap-1 shadow"
                onClick={() => {
                  setSelectedPhotoIndex(0);
                  setIsGalleryOpen(true);
                }}
              >
                <ImageIcon size={14} /> See Photos
              </button>
            </div>
          </div>
        </div>

        {/* Quick Specs At-A-Glance Bar */}
        <div className="card border-0 shadow-sm p-3 bg-white mb-4 rounded-3">
          <div className="row g-3 text-center align-items-center">
            <div className="col-6 col-md-2 border-end-md">
              <span className="text-muted small d-block">Check-In</span>
              <strong className="text-dark small">{hotel.policies?.checkInTime || hotel.checkInTime || '14:00'}</strong>
            </div>
            <div className="col-6 col-md-2 border-end-md">
              <span className="text-muted small d-block">Check-Out</span>
              <strong className="text-dark small">{hotel.policies?.checkOutTime || hotel.checkOutTime || '11:00'}</strong>
            </div>
            <div className="col-6 col-md-3 border-end-md">
              <span className="text-muted small d-block">Architecture</span>
              <strong className="text-dark small text-truncate d-block">{hotel.propertyDetails?.architecturalStyle || 'Heritage Luxury'}</strong>
            </div>
            <div className="col-6 col-md-2 border-end-md">
              <span className="text-muted small d-block">Suites</span>
              <strong className="text-dark small">{hotel.propertyDetails?.totalRooms || 150} Suites</strong>
            </div>
            <div className="col-12 col-md-3">
              <span className="text-muted small d-block">Nearest Airport</span>
              <strong className="text-dark small text-truncate d-block">{hotel.propertyDetails?.airportDistance || '24 km (BOM)'}</strong>
            </div>
          </div>
        </div>

        {/* Sticky Section Navigator */}
        <div className="bg-white border rounded-3 p-2 mb-4 d-flex gap-2 overflow-auto shadow-sm sticky-top" style={{ top: '70px', zIndex: 1020 }}>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('overview-section')}>
            Overview
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('suites-section')}>
            Suites & Rates ({categories.length})
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('highlights-section')}>
            Highlights & Amenities
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('dining-section')}>
            Dining & Venues
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('wellness-section')}>
            Wellness & Spa
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('policies-section')}>
            Policies & Stays
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('neighborhood-section')}>
            Location & Sights
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('faqs-section')}>
            FAQs
          </button>
          <button className="btn btn-sm btn-light border-0 fw-semibold text-nowrap" onClick={() => scrollToSection('reviews-section')}>
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="row g-4">
          {/* Main Content Column */}
          <div className="col-lg-8">
            {/* Section 1: Overview */}
            <div id="overview-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <h4 className="font-serif fw-bold mb-3 text-dark">About the Sanctuary & Heritage</h4>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                {hotel.description}
              </p>

              {hotel.highlights && hotel.highlights.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <h6 className="font-serif fw-bold text-dark mb-3">Distinguished Guest Privileges</h6>
                  <div className="row g-2">
                    {hotel.highlights.map((hl, idx) => (
                      <div key={idx} className="col-md-6">
                        <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-2 h-100">
                          <Sparkles size={16} color="#c5a059" className="flex-shrink-0" />
                          <span className="small text-dark fw-medium">{hl}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Room Categories */}
            <div id="suites-section" className="mb-4">
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

            {/* Section 3: Signature Amenities */}
            <div id="highlights-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <h4 className="font-serif fw-bold mb-3 text-dark">Signature Amenities & Hotel Facilities</h4>
              <p className="text-muted small mb-4">
                Designed for discerning guests, every element reflects uncompromised luxury and intuitive service.
              </p>
              <div className="row g-3">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="col-md-6 col-sm-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light text-secondary small">
                      <CheckCircle2 size={16} color="#15803d" />
                      <span className="fw-medium text-dark">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Dining Venues */}
            <div id="dining-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Utensils size={20} color="#c5a059" />
                <h4 className="font-serif fw-bold mb-0 text-dark">Culinary Experiences & Lounges</h4>
              </div>
              <p className="text-muted small mb-4">
                Embark on an epicurean journey featuring award-winning chefs, private dining salons, and master mixology.
              </p>

              {hotel.dining && hotel.dining.length > 0 ? (
                <div className="row g-3">
                  {hotel.dining.map((rest, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="card h-100 border-0 bg-light rounded-3 overflow-hidden shadow-sm">
                        {rest.image && (
                          <img
                            src={rest.image}
                            alt={rest.name}
                            style={{ height: '160px', objectFit: 'cover' }}
                            className="w-100"
                          />
                        )}
                        <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <h5 className="font-serif fw-bold text-dark mb-0 fs-6">{rest.name}</h5>
                              <span className="badge bg-white text-dark border small">{rest.dressCode}</span>
                            </div>
                            <div className="text-warning small fw-semibold mb-2">{rest.cuisine}</div>
                            <p className="text-secondary small mb-3">{rest.description}</p>
                          </div>
                          <div className="pt-2 border-top small text-muted d-flex align-items-center gap-1">
                            <Clock size={13} color="#c5a059" /> Service Hours: <strong>{rest.hours}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-light rounded-3 text-secondary small">
                  24-Hour In-Suite Dining and private dining pavilions are available for all guests.
                </div>
              )}
            </div>

            {/* Section 5: Wellness & Spa */}
            <div id="wellness-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Waves size={20} color="#c5a059" />
                <h4 className="font-serif fw-bold mb-0 text-dark">{hotel.wellness?.title || 'Jiva Luxury Spa & Wellness Retreat'}</h4>
              </div>
              <p className="text-secondary small mb-3" style={{ lineHeight: '1.7' }}>
                {hotel.wellness?.description ||
                  'Surrender to holistic restorative therapies blending ancient Ayurvedic healing sciences, signature botanical aromatherapies, and modern wellness rituals.'}
              </p>

              <div className="p-3 bg-light rounded-3 mb-3">
                <div className="small text-muted mb-2 d-flex align-items-center gap-1">
                  <Clock size={14} color="#c5a059" />
                  <span>Spa & Hydrotherapy Operating Hours: <strong>{hotel.wellness?.hours || '06:00 - 22:30 daily'}</strong></span>
                </div>
                <h6 className="fw-bold text-dark small mb-2">Sanctuary Facilities & Offerings:</h6>
                <div className="row g-2">
                  {(
                    hotel.wellness?.facilities || [
                      'Ayurvedic Consultation & Therapy Suites',
                      'Heated Bayside Hydrotherapy Vitality Pool',
                      'Himalayan Salt Steam Rooms & Cedar Saunas',
                      '24/7 Technogym Olympic Fitness Studio',
                      'Sunken Relaxation Lounges & Herbarium'
                    ]
                  ).map((fac, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="d-flex align-items-center gap-2 small text-secondary">
                        <Check size={14} color="#c5a059" />
                        <span>{fac}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 6: Policies & House Rules */}
            <div id="policies-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3">
                <ShieldCheck size={20} color="#c5a059" />
                <h4 className="font-serif fw-bold mb-0 text-dark">Hotel Policies & House Rules</h4>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1">
                      <Clock size={14} color="#c5a059" /> Arrival & Departure Timings
                    </h6>
                    <div className="small text-secondary mb-1">
                      <strong>Check-in:</strong> From {hotel.policies?.checkInTime || hotel.checkInTime || '14:00'}
                    </div>
                    <div className="small text-secondary mb-2">
                      <strong>Check-out:</strong> Until {hotel.policies?.checkOutTime || hotel.checkOutTime || '11:00'}
                    </div>
                    <div className="small text-muted">
                      Early check-in and express late check-out available upon concierge request.
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1">
                      <ShieldCheck size={14} color="#c5a059" /> Cancellation & Refunds
                    </h6>
                    <div className="small text-secondary mb-2">
                      {hotel.policies?.cancellationPolicy || hotel.cancellationPolicy}
                    </div>
                    <div className="badge bg-success-subtle text-success small">
                      Guaranteed Direct Booking Rate Protection
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-2">Pet Policy</h6>
                    <p className="small text-secondary mb-0">
                      {hotel.policies?.petPolicy || 'Guide dogs and well-behaved small pets welcome in select suites.'}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-2">Smoking & Environmental Policy</h6>
                    <p className="small text-secondary mb-0">
                      {hotel.policies?.smokingPolicy || '100% Smoke-Free indoor sanctuary. Dedicated outdoor lounges provided.'}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-2">Children & Extra Bedding</h6>
                    <p className="small text-secondary mb-0">
                      {hotel.policies?.childPolicy || 'Children under 6 stay complimentary sharing parent bedding.'}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100">
                    <h6 className="fw-bold text-dark small mb-2">Check-in Deposit & ID</h6>
                    <p className="small text-secondary mb-0">
                      {hotel.policies?.depositPolicy || 'Government-issued photo identification and credit card pre-authorization required.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Neighborhood & Location */}
            <div id="neighborhood-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Compass size={20} color="#c5a059" />
                <h4 className="font-serif fw-bold mb-0 text-dark">Neighborhood Guide & Sights</h4>
              </div>
              <p className="text-muted small mb-4">
                Explore premier cultural landmarks, coastal promenades, and shopping boulevards located nearby.
              </p>

              {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 ? (
                <div className="row g-3">
                  {hotel.nearbyAttractions.map((att, idx) => (
                    <div key={idx} className="col-md-6">
                      <div className="p-3 border rounded-3 h-100 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="fw-bold text-dark mb-0 fs-6">{att.name}</h6>
                          <span className="badge bg-warning bg-opacity-25 text-dark small">{att.distance}</span>
                        </div>
                        <span className="badge bg-white text-secondary border small mb-2">{att.category}</span>
                        <p className="text-secondary small mb-0">{att.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-light rounded-3 text-secondary small">
                  Ideally positioned in the historic heart with easy access to city attractions and luxury transport.
                </div>
              )}
            </div>

            {/* Section 8: Frequently Asked Questions */}
            <div id="faqs-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3">
                <HelpCircle size={20} color="#c5a059" />
                <h4 className="font-serif fw-bold mb-0 text-dark">Frequently Asked Questions</h4>
              </div>

              <div className="d-flex flex-column gap-2">
                {(hotel.faqs && hotel.faqs.length > 0 ? hotel.faqs : [
                  {
                    question: 'What are the check-in and check-out times?',
                    answer: `Check-in starts at ${hotel.policies?.checkInTime || hotel.checkInTime || '14:00'}, and check-out is until ${hotel.policies?.checkOutTime || hotel.checkOutTime || '11:00'}. Early arrival and late check-out can be requested.`
                  },
                  {
                    question: 'Is private limousine transfer available from the airport?',
                    answer: 'Yes, our concierge provides chauffeur-driven luxury vehicle transfers with in-car Wi-Fi, flight tracking, and luggage assistance.'
                  },
                  {
                    question: 'Can dietary restrictions be accommodated at hotel restaurants?',
                    answer: 'Our culinary master chefs cater to vegan, gluten-free, Jain, halal, and allergen-sensitive diets upon request.'
                  }
                ]).map((faq, idx) => (
                  <div key={idx} className="border rounded-3 overflow-hidden">
                    <button
                      type="button"
                      className="btn w-100 text-start p-3 bg-light d-flex justify-content-between align-items-center fw-semibold text-dark small"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    >
                      <span>{faq.question}</span>
                      {openFaqIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-3 bg-white text-secondary small border-top" style={{ lineHeight: '1.7' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Verified Reviews */}
            <div id="reviews-section" className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
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

          {/* Right Column: Reservation Assistance & Policies Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 bg-white sticky-top" style={{ top: '130px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <span className="text-muted small">Starting Suite Rate</span>
                <div>
                  <span className="fs-4 fw-bold text-dark">
                    ₹{categories[0] ? categories[0].basePrice.toLocaleString('en-IN') : '6,500'}
                  </span>
                  <span className="text-muted small"> / night</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-gold w-100 py-2 fw-semibold mb-3 shadow-sm"
                onClick={() => scrollToSection('suites-section')}
              >
                Explore & Reserve Suites
              </button>

              <h5 className="font-serif fw-bold text-dark mb-3">Key Stay Privileges</h5>

              <div className="mb-3">
                <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                  <Clock size={15} color="#c5a059" /> Check-in & Check-out
                </div>
                <div className="fw-semibold small text-dark">
                  Check-in from {hotel.policies?.checkInTime || hotel.checkInTime || '14:00'} • Check-out until {hotel.policies?.checkOutTime || hotel.checkOutTime || '11:00'}
                </div>
              </div>

              <div className="mb-3">
                <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                  <ShieldCheck size={15} color="#c5a059" /> Cancellation Policy
                </div>
                <div className="small text-secondary">
                  {hotel.policies?.cancellationPolicy || hotel.cancellationPolicy || 'Free cancellation up to 48 hours prior to check-in.'}
                </div>
              </div>

              <div className="mb-4">
                <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                  <Award size={15} color="#c5a059" /> Direct Booking Privileges
                </div>
                <ul className="list-unstyled small text-secondary mb-0">
                  <li className="mb-1">✓ Authoritative server-verified pricing</li>
                  <li className="mb-1">✓ No hidden taxes or platform booking fees</li>
                  <li className="mb-1">✓ High-speed Wi-Fi across all suites</li>
                  <li className="mb-1">✓ Early check-in priority subject to availability</li>
                </ul>
              </div>

              <div className="p-3 bg-light rounded-3 text-center border">
                <div className="small text-muted mb-1">Need Concierge Assistance?</div>
                <div className="fw-bold text-dark small d-flex align-items-center justify-content-center gap-1">
                  <Phone size={13} color="#c5a059" />
                  <a href={`tel:${hotel.contactPhone || '+912266653366'}`} className="text-dark text-decoration-none">
                    {hotel.contactPhone || '+91 22 6665 3366'}
                  </a>
                </div>
                <div className="text-muted small mt-1 d-flex align-items-center justify-content-center gap-1">
                  <Mail size={13} color="#c5a059" />
                  <a href={`mailto:${hotel.contactEmail || 'reservations@hotelpro.com'}`} className="text-muted text-decoration-none">
                    {hotel.contactEmail || 'reservations@hotelpro.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Photo Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(10, 15, 25, 0.92)', zIndex: 1070 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 bg-transparent text-white">
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="text-white">
                  <span className="font-serif fs-5 fw-bold text-white me-2">{hotel.name}</span>
                  <span className="badge bg-warning text-dark">
                    Photo {selectedPhotoIndex + 1} of {allImages.length}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm rounded-circle p-2"
                  onClick={() => setIsGalleryOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body p-0 text-center position-relative">
                <img
                  src={allImages[selectedPhotoIndex]}
                  alt={`Sanctuary photo ${selectedPhotoIndex + 1}`}
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>

              {/* Thumbnails Row */}
              <div className="p-3 d-flex justify-content-center gap-2 overflow-auto">
                {allImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className={`rounded-2 cursor-pointer ${selectedPhotoIndex === idx ? 'border border-warning border-2' : 'opacity-50'}`}
                    style={{ width: '80px', height: '55px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setSelectedPhotoIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
