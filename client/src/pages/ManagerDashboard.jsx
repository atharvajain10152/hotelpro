import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Building2,
  DollarSign,
  Users,
  Percent,
  BedDouble,
  Edit2,
  Check,
  AlertCircle,
  CheckCircle2,
  Building,
  Save,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';

const ManagerDashboard = ({ initialTab = 'performance' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [categories, setCategories] = useState([]);
  const [hotelData, setHotelData] = useState(null);
  const [hotelForm, setHotelForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingHotel, setSavingHotel] = useState(false);

  // Edit category price state
  const [editingCatId, setEditingCatId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sample analytics data for Recharts
  const revenueData = [
    { month: 'Jun', revenue: 98000, occupancy: 65 },
    { month: 'Jul', revenue: 145000, occupancy: 78 },
    { month: 'Aug', revenue: 120000, occupancy: 70 },
    { month: 'Sep', revenue: 175000, occupancy: 82 },
    { month: 'Oct', revenue: 210000, occupancy: 88 },
    { month: 'Nov', revenue: 185000, occupancy: 85 }
  ];

  const fetchManagerData = async () => {
    setLoading(true);
    try {
      const hotelId = user?.hotelId?._id || user?.hotelId;
      if (hotelId) {
        const [catRes, hotelRes] = await Promise.all([
          axiosClient.get(`/rooms/hotel/${hotelId}/categories`),
          axiosClient.get(`/hotels/${hotelId}`)
        ]);

        if (catRes.data?.success) {
          setCategories(catRes.data.categories || []);
        }

        if (hotelRes.data?.success && hotelRes.data.hotel) {
          const h = hotelRes.data.hotel;
          setHotelData(h);
          setHotelForm({
            name: h.name || '',
            tagline: h.tagline || '',
            description: h.description || '',
            address: h.address || '',
            city: h.city || '',
            state: h.state || '',
            country: h.country || 'India',
            postalCode: h.postalCode || '',
            starRating: h.starRating || 5,
            contactEmail: h.contactEmail || '',
            contactPhone: h.contactPhone || '',
            checkInTime: h.policies?.checkInTime || h.checkInTime || '14:00',
            checkOutTime: h.policies?.checkOutTime || h.checkOutTime || '11:00',
            cancellationPolicy: h.policies?.cancellationPolicy || h.cancellationPolicy || 'Free cancellation up to 48 hours prior to check-in.',
            petPolicy: h.policies?.petPolicy || 'Guide dogs and well-behaved small pets welcome in select suites.',
            smokingPolicy: h.policies?.smokingPolicy || '100% Smoke-Free indoor sanctuary.',
            childPolicy: h.policies?.childPolicy || 'Children under 6 stay complimentary sharing parent bedding.',
            depositPolicy: h.policies?.depositPolicy || 'Government ID and credit card guarantee required at check-in.',
            architecturalStyle: h.propertyDetails?.architecturalStyle || 'Heritage Palace & Classical Grandeur',
            yearBuilt: h.propertyDetails?.yearBuilt || 1903,
            totalRooms: h.propertyDetails?.totalRooms || 285,
            airportDistance: h.propertyDetails?.airportDistance || '24 km from International Airport',
            amenities: (h.amenities || []).join(', '),
            highlights: (h.highlights || []).join('\n'),
            images: (h.images || []).join('\n')
          });
        }
      }
    } catch (err) {
      console.error('Error fetching manager data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, [user]);

  const handleUpdatePrice = async (categoryId) => {
    if (!newPrice || Number(newPrice) <= 0) return;
    try {
      setError('');
      setMessage('');
      const res = await axiosClient.put(`/rooms/category/${categoryId}`, {
        basePrice: Number(newPrice)
      });
      if (res.data?.success) {
        setMessage('Suite base nightly rate updated successfully.');
        setEditingCatId(null);
        fetchManagerData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update category price.');
    }
  };

  const handleHotelFormChange = (e) => {
    const { name, value } = e.target;
    setHotelForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHotelDetails = async (e) => {
    e.preventDefault();
    if (!hotelData?._id) return;

    setSavingHotel(true);
    setError('');
    setMessage('');

    try {
      const amenitiesList = hotelForm.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const highlightsList = hotelForm.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const imagesList = hotelForm.images
        .split('\n')
        .map((img) => img.trim())
        .filter(Boolean);

      const payload = {
        name: hotelForm.name,
        tagline: hotelForm.tagline,
        description: hotelForm.description,
        address: hotelForm.address,
        city: hotelForm.city,
        state: hotelForm.state,
        country: hotelForm.country,
        postalCode: hotelForm.postalCode,
        starRating: Number(hotelForm.starRating),
        contactEmail: hotelForm.contactEmail,
        contactPhone: hotelForm.contactPhone,
        checkInTime: hotelForm.checkInTime,
        checkOutTime: hotelForm.checkOutTime,
        cancellationPolicy: hotelForm.cancellationPolicy,
        policies: {
          checkInTime: hotelForm.checkInTime,
          checkOutTime: hotelForm.checkOutTime,
          cancellationPolicy: hotelForm.cancellationPolicy,
          petPolicy: hotelForm.petPolicy,
          smokingPolicy: hotelForm.smokingPolicy,
          childPolicy: hotelForm.childPolicy,
          depositPolicy: hotelForm.depositPolicy
        },
        propertyDetails: {
          architecturalStyle: hotelForm.architecturalStyle,
          yearBuilt: Number(hotelForm.yearBuilt),
          totalRooms: Number(hotelForm.totalRooms),
          airportDistance: hotelForm.airportDistance
        },
        amenities: amenitiesList,
        highlights: highlightsList,
        images: imagesList.length > 0 ? imagesList : undefined
      };

      const res = await axiosClient.put(`/hotels/${hotelData._id}`, payload);
      if (res.data?.success) {
        setMessage('Hotel property details and policies updated successfully.');
        setHotelData(res.data.hotel);
      }
    } catch (err) {
      setError(err.message || 'Failed to update hotel details.');
    } finally {
      setSavingHotel(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            Executive Hotel Management
          </span>
          <h2 className="font-serif fw-bold text-dark mb-0">
            {hotelData?.name || user?.hotelId?.name || 'Hotel Management Sanctuary'}
          </h2>
          <p className="text-muted small mb-0">
            Performance, Room Inventory, and Property Configuration Control
          </p>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          {hotelData && (
            <Link
              to={`/hotels/${hotelData._id || hotelData.slug}`}
              target="_blank"
              className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1"
            >
              <span>View Live Guest Page</span>
              <ExternalLink size={14} />
            </Link>
          )}
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'performance' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance & Rates
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'hotel-details' ? 'btn-gold text-white' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('hotel-details')}
            >
              <Building size={14} className="me-1" />
              Hotel Details & Profile
            </button>
          </div>
        </div>
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

      {activeTab === 'performance' ? (
        <>
          {/* KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card hp-card border-0 p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small text-uppercase fw-semibold">Total Revenue (YTD)</span>
                    <h3 className="fw-bold mb-0 text-dark mt-1">₹1,85,400</h3>
                  </div>
                  <div className="p-3 bg-success bg-opacity-10 text-success rounded-3">
                    <DollarSign size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card hp-card border-0 p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small text-uppercase fw-semibold">Current Occupancy</span>
                    <h3 className="fw-bold mb-0 text-primary mt-1">75.0%</h3>
                  </div>
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                    <Percent size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card hp-card border-0 p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small text-uppercase fw-semibold">Total Suites</span>
                    <h3 className="fw-bold mb-0 text-dark mt-1">
                      {categories.reduce((acc, c) => acc + (c.totalRooms || 5), 0)}
                    </h3>
                  </div>
                  <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
                    <BedDouble size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card hp-card border-0 p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small text-uppercase fw-semibold">Guest Rating</span>
                    <h3 className="fw-bold mb-0 text-warning mt-1">
                      {hotelData?.averageRating || '4.9'} / 5.0
                    </h3>
                  </div>
                  <div className="p-3 bg-dark bg-opacity-10 text-dark rounded-3">
                    <Users size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card hp-card border-0 p-4 bg-white shadow-sm">
                <h5 className="font-serif fw-bold text-dark mb-1">Monthly Revenue Performance (₹)</h5>
                <p className="text-muted small mb-4">Historical verified booking revenue trajectory</p>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c5a059" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Area type="monotone" dataKey="revenue" stroke="#c5a059" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card hp-card border-0 p-4 bg-white shadow-sm">
                <h5 className="font-serif fw-bold text-dark mb-1">Occupancy Trends (%)</h5>
                <p className="text-muted small mb-4">Average monthly capacity utilization</p>
                <div style={{ height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" unit="%" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="occupancy" fill="#1a1e24" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Room Category & Pricing Management */}
          <div className="card hp-card border-0 shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="font-serif fw-bold text-dark mb-0">Suite Inventory & Rate Management</h5>
                <p className="text-muted small mb-0">Directly modify nightly rates and review capacity rules</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-hp mb-0">
                <thead>
                  <tr>
                    <th>Suite Category</th>
                    <th>Bed & Size</th>
                    <th>Capacity</th>
                    <th>Total Rooms</th>
                    <th>Base Nightly Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <div className="fw-semibold text-dark">{cat.name}</div>
                        <div className="small text-muted">{cat.description?.slice(0, 50)}...</div>
                      </td>
                      <td className="small text-secondary">
                        {cat.bedType} • {cat.roomSizeSqFt} sq.ft
                      </td>
                      <td className="small text-secondary">
                        {cat.capacity.adults} Adults, {cat.capacity.children} Child (Max {cat.capacity.maxGuests})
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {cat.totalRooms || 5} Suites
                        </span>
                      </td>
                      <td>
                        {editingCatId === cat._id ? (
                          <div className="input-group input-group-sm" style={{ maxWidth: '140px' }}>
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              className="form-control"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="fw-bold text-dark fs-6">
                            ₹{cat.basePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingCatId === cat._id ? (
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-success btn-sm p-1 px-2"
                              onClick={() => handleUpdatePrice(cat._id)}
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm p-1 px-2"
                              onClick={() => setEditingCatId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1"
                            onClick={() => {
                              setEditingCatId(cat._id);
                              setNewPrice(cat.basePrice);
                            }}
                          >
                            <Edit2 size={13} /> Update Rate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Hotel Details & Property Settings Tab */
        <div className="bg-white rounded-3 border shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
              <h4 className="font-serif fw-bold text-dark mb-1">Hotel Details & Property Settings</h4>
              <p className="text-muted small mb-0">
                Update public property specifications, location, contact, policies, and signature amenities.
              </p>
            </div>
            {hotelData && (
              <span className="badge bg-light text-dark border p-2">
                Status: <strong className="text-success text-uppercase">{hotelData.status}</strong>
              </span>
            )}
          </div>

          {!hotelForm ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="text-muted small mt-2">Loading hotel configuration...</p>
            </div>
          ) : (
            <form onSubmit={handleSaveHotelDetails}>
              {/* Section 1: Identity & Description */}
              <div className="mb-4">
                <h6 className="font-serif fw-bold text-dark mb-3 text-uppercase small text-warning" style={{ letterSpacing: '1px' }}>
                  1. Brand Identity & Overview
                </h6>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label small fw-semibold text-dark">Hotel Property Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="form-control form-control-sm"
                      value={hotelForm.name}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Star Rating</label>
                    <select
                      name="starRating"
                      className="form-select form-select-sm"
                      value={hotelForm.starRating}
                      onChange={handleHotelFormChange}
                    >
                      <option value="5">5-Star Luxury Resort</option>
                      <option value="4">4-Star Boutique Hotel</option>
                      <option value="3">3-Star Premium Property</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Tagline / Luxury Subtitle</label>
                    <input
                      type="text"
                      name="tagline"
                      className="form-control form-control-sm"
                      value={hotelForm.tagline}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Sanctuary Description *</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      className="form-control form-control-sm"
                      value={hotelForm.description}
                      onChange={handleHotelFormChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section 2: Location & Address */}
              <div className="mb-4 pt-3 border-top">
                <h6 className="font-serif fw-bold text-dark mb-3 text-uppercase small text-warning" style={{ letterSpacing: '1px' }}>
                  2. Physical Address & Location
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="form-control form-control-sm"
                      value={hotelForm.address}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-dark">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="form-control form-control-sm"
                      value={hotelForm.city}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-dark">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      className="form-control form-control-sm"
                      value={hotelForm.state}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control form-control-sm"
                      value={hotelForm.postalCode}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Country</label>
                    <input
                      type="text"
                      name="country"
                      className="form-control form-control-sm"
                      value={hotelForm.country}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Nearest Airport Distance</label>
                    <input
                      type="text"
                      name="airportDistance"
                      className="form-control form-control-sm"
                      value={hotelForm.airportDistance}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Concierge Contact & Policies */}
              <div className="mb-4 pt-3 border-top">
                <h6 className="font-serif fw-bold text-dark mb-3 text-uppercase small text-warning" style={{ letterSpacing: '1px' }}>
                  3. Concierge Contacts & Arrival Times
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Concierge / Reservations Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      className="form-control form-control-sm"
                      value={hotelForm.contactEmail}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Concierge Direct Telephone</label>
                    <input
                      type="text"
                      name="contactPhone"
                      className="form-control form-control-sm"
                      value={hotelForm.contactPhone}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-dark">Standard Check-In Time</label>
                    <input
                      type="text"
                      name="checkInTime"
                      className="form-control form-control-sm"
                      value={hotelForm.checkInTime}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-dark">Standard Check-Out Time</label>
                    <input
                      type="text"
                      name="checkOutTime"
                      className="form-control form-control-sm"
                      value={hotelForm.checkOutTime}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Cancellation Policy Statement</label>
                    <input
                      type="text"
                      name="cancellationPolicy"
                      className="form-control form-control-sm"
                      value={hotelForm.cancellationPolicy}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: House Rules & Details */}
              <div className="mb-4 pt-3 border-top">
                <h6 className="font-serif fw-bold text-dark mb-3 text-uppercase small text-warning" style={{ letterSpacing: '1px' }}>
                  4. House Rules & Property Specifications
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Pet Policy</label>
                    <input
                      type="text"
                      name="petPolicy"
                      className="form-control form-control-sm"
                      value={hotelForm.petPolicy}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Smoking Policy</label>
                    <input
                      type="text"
                      name="smokingPolicy"
                      className="form-control form-control-sm"
                      value={hotelForm.smokingPolicy}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Children & Extra Bed Policy</label>
                    <input
                      type="text"
                      name="childPolicy"
                      className="form-control form-control-sm"
                      value={hotelForm.childPolicy}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Check-in Deposit & ID Policy</label>
                    <input
                      type="text"
                      name="depositPolicy"
                      className="form-control form-control-sm"
                      value={hotelForm.depositPolicy}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Architectural Style</label>
                    <input
                      type="text"
                      name="architecturalStyle"
                      className="form-control form-control-sm"
                      value={hotelForm.architecturalStyle}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Year Established / Built</label>
                    <input
                      type="number"
                      name="yearBuilt"
                      className="form-control form-control-sm"
                      value={hotelForm.yearBuilt}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Total Suite Inventory</label>
                    <input
                      type="number"
                      name="totalRooms"
                      className="form-control form-control-sm"
                      value={hotelForm.totalRooms}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Amenities & Highlights */}
              <div className="mb-4 pt-3 border-top">
                <h6 className="font-serif fw-bold text-dark mb-3 text-uppercase small text-warning" style={{ letterSpacing: '1px' }}>
                  5. Amenities & Signature Highlights
                </h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">
                      Property Amenities (comma-separated list)
                    </label>
                    <input
                      type="text"
                      name="amenities"
                      className="form-control form-control-sm"
                      value={hotelForm.amenities}
                      onChange={handleHotelFormChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">
                      Key Highlights (one per line)
                    </label>
                    <textarea
                      name="highlights"
                      rows="3"
                      className="form-control form-control-sm"
                      value={hotelForm.highlights}
                      onChange={handleHotelFormChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">
                      Photo URLs (one per line)
                    </label>
                    <textarea
                      name="images"
                      rows="3"
                      className="form-control form-control-sm"
                      value={hotelForm.images}
                      onChange={handleHotelFormChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-4"
                  onClick={fetchManagerData}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm px-4 fw-semibold d-flex align-items-center gap-2"
                  disabled={savingHotel}
                >
                  <Save size={15} />
                  <span>{savingHotel ? 'Saving Hotel Details...' : 'Save & Publish Hotel Details'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
