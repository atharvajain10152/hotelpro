import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Utensils, Award } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const mainImage =
    hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 hp-card hp-card-hover border-0 overflow-hidden">
        <div className="position-relative" style={{ height: '230px', overflow: 'hidden' }}>
          <img
            src={mainImage}
            alt={hotel.name}
            className="w-100 h-100"
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-dark text-warning px-2 py-1 d-flex align-items-center gap-1 shadow-sm">
              <Star size={13} fill="#d4af37" color="#d4af37" />
              <span className="fw-bold">{hotel.averageRating || hotel.starRating}</span>
              <span className="text-secondary small">({hotel.reviewCount || 12})</span>
            </span>
          </div>
          <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-dark text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}>
            <div className="d-flex align-items-center gap-1 small text-light">
              <MapPin size={14} color="#c5a059" />
              <span>{hotel.city}, {hotel.state}</span>
            </div>
          </div>
        </div>

        <div className="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title fw-bold font-serif mb-2 text-dark">{hotel.name}</h5>
            <p className="card-text text-muted small mb-3" style={{ lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {hotel.description}
            </p>

            <div className="d-flex flex-wrap gap-1 mb-3">
              {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="badge bg-light text-secondary border small fw-normal py-1 px-2">
                  {amenity}
                </span>
              ))}
              {hotel.amenities?.length > 3 && (
                <span className="badge bg-light text-muted border small fw-normal py-1 px-2">
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-top d-flex align-items-center justify-content-between mt-auto">
            <div>
              <span className="text-muted small d-block">Starting from</span>
              <span className="fs-5 fw-bold text-dark">
                ₹{Number(hotel.startingPrice || 6500).toLocaleString('en-IN')}
              </span>
              <span className="text-muted small"> / night</span>
            </div>
            <Link to={`/hotels/${hotel._id || hotel.slug}`} className="btn btn-outline-gold btn-sm px-3 py-2 fw-semibold">
              Explore Suites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
