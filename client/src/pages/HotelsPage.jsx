import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import HotelCard from '../components/HotelCard';
import { Search, Filter, SlidersHorizontal, MapPin, Star, Building2 } from 'lucide-react';

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating_desc');
  const [page, setPage] = useState(1);

  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {
        destination: destination || undefined,
        city: city || undefined,
        minRating: minRating || undefined,
        sort,
        page,
        limit: 9
      };

      const res = await axiosClient.get('/hotels', { params });
      if (res.data?.success) {
        setHotels(res.data.hotels);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [destination, city, minRating, sort, page]);

  const handleResetFilters = () => {
    setDestination('');
    setCity('');
    setMinRating('');
    setSort('rating_desc');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            Exclusive Portfolios
          </span>
          <h1 className="font-serif fw-bold text-dark mb-1">Luxury Hotels & Sanctuaries</h1>
          <p className="text-muted">
            Explore 5-star properties, royal heritage estates, and beachfront retreats with verified availability.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-lg-4 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search hotel or location..."
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <select
                className="form-select"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Destinations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Goa">Goa</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <select
                className="form-select"
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Rating (Any)</option>
                <option value="4.8">4.8+ Exceptional</option>
                <option value="4.5">4.5+ Very Good</option>
                <option value="4.0">4.0+ Good</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6 d-flex gap-2">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="rating_desc">Top Rated First</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>

              {(destination || city || minRating) && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-2 text-nowrap"
                  onClick={handleResetFilters}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted small">
            Showing <strong className="text-dark">{hotels.length}</strong> of{' '}
            <strong className="text-dark">{total}</strong> luxury properties
          </div>
        </div>

        {/* Hotel Grid */}
        {loading ? (
          <div className="text-center py-5 my-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-muted small mt-2">Loading hotel inventory from database...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-5 my-5 bg-white rounded-3 border p-5">
            <Building2 size={48} className="text-muted mb-3 mx-auto" />
            <h4 className="fw-bold font-serif mb-2">No Properties Found</h4>
            <p className="text-muted small mb-4">
              We couldn't find any hotels matching your current filter criteria.
            </p>
            <button className="btn btn-gold btn-sm px-4" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>
                      {p}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;

