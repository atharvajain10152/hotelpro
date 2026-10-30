import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { X, Building2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const AddHotelModal = ({ isOpen, onClose, onHotelCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '',
    starRating: 5,
    contactEmail: '',
    contactPhone: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in.',
    amenities: 'Free High-Speed Wi-Fi, Swimming Pool, Luxury Spa, 24/7 Butler Service, Fine Dining, Valet Parking',
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    highlights: 'Panoramic City Views, Award-Winning Culinary Experiences, Luxury Airport Transfers',
    architecturalStyle: 'Modern Luxury Sanctuary',
    yearBuilt: 2022,
    totalRooms: 120,
    airportDistance: '15 km from International Airport'
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description || !formData.address || !formData.city || !formData.state) {
      setError('Please fill in all required property information.');
      return;
    }

    setSubmitting(true);
    try {
      const amenitiesList = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const imagesList = formData.images
        .split('\n')
        .map((img) => img.trim())
        .filter(Boolean);

      const highlightsList = formData.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        starRating: Number(formData.starRating),
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        cancellationPolicy: formData.cancellationPolicy,
        amenities: amenitiesList.length > 0 ? amenitiesList : undefined,
        images: imagesList.length > 0 ? imagesList : undefined,
        highlights: highlightsList.length > 0 ? highlightsList : undefined,
        propertyDetails: {
          architecturalStyle: formData.architecturalStyle,
          yearBuilt: Number(formData.yearBuilt),
          totalRooms: Number(formData.totalRooms),
          airportDistance: formData.airportDistance
        }
      };

      const res = await axiosClient.post('/hotels', payload);
      if (res.data?.success) {
        onHotelCreated(res.data.hotel);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create hotel.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white p-4 position-relative border-0">
            <div>
              <span className="badge bg-warning text-dark text-uppercase mb-1" style={{ fontSize: '10px' }}>
                Property Administration
              </span>
              <h5 className="modal-title font-serif fs-4 mb-0 text-white">Add New Luxury Hotel Sanctuary</h5>
              <p className="text-secondary small mb-0">Register a new property with full hospitality details</p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 bg-white">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Details */}
              <h6 className="font-serif fw-bold text-dark border-bottom pb-2 mb-3">1. Basic Property Information</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold text-dark">Hotel Property Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-control form-control-sm"
                    placeholder="e.g. The Imperial Royal Manor & Spa"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Star Rating</label>
                  <select
                    name="starRating"
                    className="form-select form-select-sm"
                    value={formData.starRating}
                    onChange={handleChange}
                  >
                    <option value="5">5-Star Ultra Luxury</option>
                    <option value="4">4-Star Premium Boutique</option>
                    <option value="3">3-Star Standard Heritage</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">Tagline / Luxury Subtitle</label>
                  <input
                    type="text"
                    name="tagline"
                    className="form-control form-control-sm"
                    placeholder="e.g. Waterfront Palace Blending Edwardian Heritage With Timeless Elegance"
                    value={formData.tagline}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows="3"
                    className="form-control form-control-sm"
                    placeholder="Provide a comprehensive narrative about the hotel, setting, history, and guest experience..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Location & Contact */}
              <h6 className="font-serif fw-bold text-dark border-bottom pb-2 mb-3">2. Location & Concierge Contacts</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="form-control form-control-sm"
                    placeholder="e.g. 1 Apollo Bunder, Colaba"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold text-dark">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="form-control form-control-sm"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold text-dark">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    className="form-control form-control-sm"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-control form-control-sm"
                    placeholder="400001"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Concierge Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    className="form-control form-control-sm"
                    placeholder="reservations@grandroyal.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Contact Phone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    className="form-control form-control-sm"
                    placeholder="+91 22 6665 3366"
                    value={formData.contactPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Policies & Operations */}
              <h6 className="font-serif fw-bold text-dark border-bottom pb-2 mb-3">3. Policies & Specifications</h6>
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label small fw-semibold text-dark">Check-in Time</label>
                  <input
                    type="text"
                    name="checkInTime"
                    className="form-control form-control-sm"
                    value={formData.checkInTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold text-dark">Check-out Time</label>
                  <input
                    type="text"
                    name="checkOutTime"
                    className="form-control form-control-sm"
                    value={formData.checkOutTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Cancellation Policy</label>
                  <input
                    type="text"
                    name="cancellationPolicy"
                    className="form-control form-control-sm"
                    value={formData.cancellationPolicy}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Architecture Style</label>
                  <input
                    type="text"
                    name="architecturalStyle"
                    className="form-control form-control-sm"
                    value={formData.architecturalStyle}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    className="form-control form-control-sm"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-dark">Total Room Count</label>
                  <input
                    type="number"
                    name="totalRooms"
                    className="form-control form-control-sm"
                    value={formData.totalRooms}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Highlights & Amenities */}
              <h6 className="font-serif fw-bold text-dark border-bottom pb-2 mb-3">4. Amenities & Images</h6>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    name="amenities"
                    className="form-control form-control-sm"
                    value={formData.amenities}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">Key Highlights (one per line)</label>
                  <textarea
                    name="highlights"
                    rows="2"
                    className="form-control form-control-sm"
                    value={formData.highlights}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">Image URLs (one per line)</label>
                  <textarea
                    name="images"
                    rows="2"
                    className="form-control form-control-sm"
                    value={formData.images}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light p-3 border-top d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-gold btn-sm px-4 fw-semibold d-flex align-items-center gap-1"
                disabled={submitting}
              >
                {submitting ? 'Creating Hotel...' : 'Register & Publish Hotel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHotelModal;

