import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  X,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  Utensils,
  Sparkles,
  Bed,
  CheckCircle2,
  ExternalLink,
  Building,
  Calendar,
  Compass,
  Award
} from 'lucide-react';

const HotelDetailsModal = ({ hotel: initialHotel, hotelId, isOpen, onClose }) => {
  const [hotel, setHotel] = useState(initialHotel || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'amenities' | 'dining' | 'policies' | 'attractions'

  useEffect(() => {
    if (initialHotel) {
      setHotel(initialHotel);
    } else if (hotelId && isOpen) {
      const fetchHotel = async () => {
        setLoading(true);
        try {
          const res = await axiosClient.get(`/hotels/${hotelId}`);
          if (res.data?.success) {
            setHotel(res.data.hotel);
          }
        } catch (err) {
          console.error('Error loading hotel details modal:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchHotel();
    }
  }, [initialHotel, hotelId, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-dark text-white p-4 position-relative border-0">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                  <Star size={13} fill="#1a1e24" color="#1a1e24" />
                  <span>{hotel?.averageRating || hotel?.starRating || 5.0} Stars</span>
                </span>
                <span className="badge bg-light text-dark">{hotel?.city}, {hotel?.state}</span>
                {hotel?.status && (
                  <span className={`badge-status ${hotel.status} text-uppercase`} style={{ fontSize: '10px' }}>
                    {hotel.status}
                  </span>
                )}
              </div>
              <h4 className="modal-title font-serif fs-3 mb-1 text-white">{hotel?.name}</h4>
              {hotel?.tagline && (
                <p className="text-warning small fst-italic mb-1" style={{ letterSpacing: '0.3px' }}>
                  "{hotel.tagline}"
                </p>
              )}
              <div className="d-flex align-items-center gap-3 text-secondary small">
                <span className="d-flex align-items-center gap-1">
                  <MapPin size={14} color="#c5a059" /> {hotel?.address}, {hotel?.city}, {hotel?.state}
                </span>
                {hotel?.contactPhone && (
                  <span className="d-none d-md-flex align-items-center gap-1">
                    <Phone size={14} color="#c5a059" /> {hotel.contactPhone}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Tab Navigation */}
          <div className="bg-light border-bottom px-4 pt-2">
            <ul className="nav nav-tabs border-0 gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link border-0 fw-semibold px-3 py-2 ${activeTab === 'overview' ? 'active text-warning bg-white rounded-top' : 'text-muted'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Property Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 fw-semibold px-3 py-2 ${activeTab === 'amenities' ? 'active text-warning bg-white rounded-top' : 'text-muted'}`}
                  onClick={() => setActiveTab('amenities')}
                >
                  Highlights & Amenities
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 fw-semibold px-3 py-2 ${activeTab === 'dining' ? 'active text-warning bg-white rounded-top' : 'text-muted'}`}
                  onClick={() => setActiveTab('dining')}
                >
                  Dining & Wellness
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 fw-semibold px-3 py-2 ${activeTab === 'policies' ? 'active text-warning bg-white rounded-top' : 'text-muted'}`}
                  onClick={() => setActiveTab('policies')}
                >
                  Policies & Rules
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link border-0 fw-semibold px-3 py-2 ${activeTab === 'attractions' ? 'active text-warning bg-white rounded-top' : 'text-muted'}`}
                  onClick={() => setActiveTab('attractions')}
                >
                  Neighborhood
                </button>
              </li>
            </ul>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 bg-white" style={{ minHeight: '380px' }}>
            {loading || !hotel ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="text-muted small mt-2">Loading hotel sanctuary details...</p>
              </div>
            ) : (
              <>
                {/* At-a-Glance Specs Strip */}
                <div className="row g-2 p-3 bg-light rounded-3 mb-4 text-center">
                  <div className="col-6 col-md-3 border-end-md">
                    <div className="text-muted small">Check-In / Out</div>
                    <div className="fw-bold text-dark small">{hotel.policies?.checkInTime || hotel.checkInTime || '14:00'} / {hotel.policies?.checkOutTime || hotel.checkOutTime || '11:00'}</div>
                  </div>
                  <div className="col-6 col-md-3 border-end-md">
                    <div className="text-muted small">Architecture</div>
                    <div className="fw-bold text-dark small text-truncate">{hotel.propertyDetails?.architecturalStyle || 'Heritage Luxury'}</div>
                  </div>
                  <div className="col-6 col-md-3 border-end-md">
                    <div className="text-muted small">Year Built</div>
                    <div className="fw-bold text-dark small">{hotel.propertyDetails?.yearBuilt || 1903}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-muted small">Suites Inventory</div>
                    <div className="fw-bold text-dark small">{hotel.propertyDetails?.totalRooms || 150} Luxury Suites</div>
                  </div>
                </div>

                {/* Tab: Overview */}
                {activeTab === 'overview' && (
                  <div>
                    {/* Images Gallery Preview */}
                    <div className="row g-2 mb-4">
                      {hotel.images?.slice(0, 3).map((img, idx) => (
                        <div key={idx} className="col-md-4">
                          <img
                            src={img}
                            alt={`${hotel.name} view ${idx + 1}`}
                            className="w-100 rounded-3 shadow-sm"
                            style={{ height: '170px', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>

                    <h5 className="font-serif fw-bold text-dark mb-2">About the Property</h5>
                    <p className="text-secondary small" style={{ lineHeight: '1.8' }}>
                      {hotel.description}
                    </p>

                    <div className="row g-3 mt-2">
                      <div className="col-md-6">
                        <div className="p-3 border rounded-3 h-100">
                          <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                            <MapPin size={16} color="#c5a059" /> Physical Location
                          </h6>
                          <div className="small text-secondary">{hotel.address}</div>
                          <div className="small text-secondary">{hotel.city}, {hotel.state} {hotel.postalCode}</div>
                          <div className="small text-secondary">{hotel.country}</div>
                          {hotel.propertyDetails?.airportDistance && (
                            <div className="small text-muted mt-2 pt-2 border-top">
                              <strong>Airport:</strong> {hotel.propertyDetails.airportDistance}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded-3 h-100">
                          <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                            <Phone size={16} color="#c5a059" /> Concierge & Contact
                          </h6>
                          <div className="small text-secondary mb-1">
                            <strong>Telephone:</strong> {hotel.contactPhone || '+91 22 6665 3366'}
                          </div>
                          <div className="small text-secondary mb-1">
                            <strong>Reservations:</strong> {hotel.contactEmail || 'reservations@hotelpro.com'}
                          </div>
                          {hotel.managerId && (
                            <div className="small text-muted mt-2 pt-2 border-top">
                              <strong>General Manager:</strong> {hotel.managerId.name || 'Assigned'} ({hotel.managerId.email})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Amenities */}
                {activeTab === 'amenities' && (
                  <div>
                    {hotel.highlights && hotel.highlights.length > 0 && (
                      <div className="mb-4">
                        <h6 className="font-serif fw-bold text-dark mb-3">Key Signature Highlights</h6>
                        <div className="row g-2">
                          {hotel.highlights.map((hl, idx) => (
                            <div key={idx} className="col-md-6">
                              <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-2 small text-dark">
                                <Sparkles size={15} color="#c5a059" />
                                <span>{hl}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <h6 className="font-serif fw-bold text-dark mb-3">All Signature Amenities & Privileges</h6>
                    <div className="row g-2">
                      {hotel.amenities?.map((am, idx) => (
                        <div key={idx} className="col-md-4 col-sm-6">
                          <div className="d-flex align-items-center gap-2 p-2 border rounded-2 small text-secondary">
                            <CheckCircle2 size={15} color="#15803d" />
                            <span>{am}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Dining */}
                {activeTab === 'dining' && (
                  <div>
                    <h6 className="font-serif fw-bold text-dark mb-3">On-Site Culinary & Bar Venues</h6>
                    {hotel.dining && hotel.dining.length > 0 ? (
                      <div className="row g-3 mb-4">
                        {hotel.dining.map((rest, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="card h-100 border shadow-sm p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="font-serif fw-bold text-dark mb-0">{rest.name}</h6>
                                <span className="badge bg-light text-dark border small">{rest.dressCode}</span>
                              </div>
                              <div className="text-warning small fw-semibold mb-1">{rest.cuisine}</div>
                              <p className="text-muted small mb-2">{rest.description}</p>
                              <div className="small text-secondary d-flex align-items-center gap-1 mt-auto pt-2 border-top">
                                <Clock size={13} color="#c5a059" /> Service Hours: {rest.hours}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small">Fine dining services are available 24/7 through room service and on-site culinary pavilions.</p>
                    )}

                    {hotel.wellness && (
                      <div className="p-3 bg-light rounded-3 border">
                        <h6 className="font-serif fw-bold text-dark mb-1">{hotel.wellness.title || 'Wellness Sanctuary'}</h6>
                        <p className="text-secondary small mb-2">{hotel.wellness.description}</p>
                        <div className="small text-muted mb-2">
                          <Clock size={13} color="#c5a059" className="me-1" />
                          Hours: {hotel.wellness.hours || '06:00 - 22:00'}
                        </div>
                        {hotel.wellness.facilities && (
                          <div className="d-flex flex-wrap gap-1">
                            {hotel.wellness.facilities.map((fac, idx) => (
                              <span key={idx} className="badge bg-white text-secondary border small">
                                {fac}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Policies */}
                {activeTab === 'policies' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 h-100">
                        <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                          <Clock size={16} color="#c5a059" /> Arrival & Departure
                        </h6>
                        <div className="small text-secondary mb-1">
                          <strong>Check-in Time:</strong> {hotel.policies?.checkInTime || hotel.checkInTime || '14:00'}
                        </div>
                        <div className="small text-secondary mb-1">
                          <strong>Check-out Time:</strong> {hotel.policies?.checkOutTime || hotel.checkOutTime || '11:00'}
                        </div>
                        <div className="small text-secondary">
                          <strong>Cancellation:</strong> {hotel.policies?.cancellationPolicy || hotel.cancellationPolicy}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 border rounded-3 h-100">
                        <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                          <ShieldCheck size={16} color="#c5a059" /> House Rules & Stays
                        </h6>
                        <div className="small text-secondary mb-1">
                          <strong>Pet Policy:</strong> {hotel.policies?.petPolicy || 'Contact concierge for pet stays.'}
                        </div>
                        <div className="small text-secondary mb-1">
                          <strong>Smoking Policy:</strong> {hotel.policies?.smokingPolicy || 'Non-smoking indoor sanctuary.'}
                        </div>
                        <div className="small text-secondary mb-1">
                          <strong>Children:</strong> {hotel.policies?.childPolicy || 'Children stay complimentary under 6 years.'}
                        </div>
                        <div className="small text-secondary">
                          <strong>Check-in Deposit:</strong> {hotel.policies?.depositPolicy || 'Government ID and credit card required.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Attractions */}
                {activeTab === 'attractions' && (
                  <div>
                    <h6 className="font-serif fw-bold text-dark mb-3">Nearby Highlights & Cultural Landmarks</h6>
                    {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 ? (
                      <div className="row g-3">
                        {hotel.nearbyAttractions.map((att, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border rounded-3 h-100">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="fw-bold text-dark mb-0">{att.name}</h6>
                                <span className="badge bg-warning bg-opacity-20 text-dark small">{att.distance}</span>
                              </div>
                              <span className="badge bg-light text-secondary border small mb-2">{att.category}</span>
                              <p className="text-secondary small mb-0">{att.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small">Central prime location with instant access to historic sights, transport, and commercial hubs.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-light p-3 border-top d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={onClose}>
              Close
            </button>
            {hotel && (
              <Link
                to={`/hotels/${hotel._id || hotel.slug}`}
                className="btn btn-gold btn-sm px-4 fw-semibold d-flex align-items-center gap-1"
                onClick={onClose}
              >
                <span>View Full Page & Book Suites</span>
                <ExternalLink size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsModal;

