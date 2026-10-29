import React, { useState, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 15,
    occupiedRooms: 3,
    occupancyRate: 20,
    monthlyRevenue: 131460
  });
  const [loading, setLoading] = useState(true);

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
        const res = await axiosClient.get(`/rooms/hotel/${hotelId}/categories`);
        if (res.data?.success) {
          setCategories(res.data.categories || []);
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

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            Executive Hotel Management
          </span>
          <h2 className="font-serif fw-bold text-dark mb-0">Hotel Performance & Room Inventory</h2>
          <p className="text-muted small mb-0">
            {user?.hotelId?.name || 'The Grand Royal Palace & Spa'} — Performance & Pricing Control
          </p>
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
                <h3 className="fw-bold mb-0 text-warning mt-1">4.9 / 5.0</h3>
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
    </div>
  );
};

export default ManagerDashboard;
