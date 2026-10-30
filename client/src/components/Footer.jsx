import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto" style={{ borderTop: '3px solid #c5a059' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Crown size={24} color="#c5a059" />
              <span className="hp-brand fs-4 fw-bold tracking-wide text-white">HOTELPRO</span>
            </div>
            <p className="text-secondary small mb-3" style={{ lineHeight: '1.7' }}>
              The premier luxury hotel reservation and hospitality platform. Delivering curated 5-star
              accommodations, Michelin-standard dining, and world-class concierge service across India's
              most celebrated destinations.
            </p>
            <div className="d-flex gap-3 text-secondary small">
              <div className="d-flex align-items-center gap-1">
                <ShieldCheck size={16} color="#c5a059" /> Best Rate Guaranteed
              </div>
              <div className="d-flex align-items-center gap-1">
                <Award size={16} color="#c5a059" /> Verified Stays
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase text-warning fw-semibold mb-3" style={{ letterSpacing: '1px' }}>
              Destinations
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li><Link to="/hotels?destination=Mumbai" className="text-secondary text-decoration-none hover-white">Mumbai Waterfront</Link></li>
              <li><Link to="/hotels?destination=Goa" className="text-secondary text-decoration-none hover-white">Goa Beachfront</Link></li>
              <li><Link to="/hotels?destination=Udaipur" className="text-secondary text-decoration-none hover-white">Udaipur Lake Palaces</Link></li>
              <li><Link to="/hotels?destination=Jaipur" className="text-secondary text-decoration-none hover-white">Jaipur Royal Heritage</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase text-warning fw-semibold mb-3" style={{ letterSpacing: '1px' }}>
              Platform
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li><Link to="/hotels" className="text-secondary text-decoration-none">Explore All Hotels</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none">Staff & Manager Portal</Link></li>
              <li><Link to="/register" className="text-secondary text-decoration-none">Guest Loyalty Club</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none">Demo Login Accounts</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase text-warning fw-semibold mb-3" style={{ letterSpacing: '1px' }}>
              24/7 Luxury Concierge
            </h6>
            <p className="text-secondary small mb-2 d-flex align-items-center gap-2">
              <Phone size={16} color="#c5a059" />
              <span>+91 22 8000 4455 (Toll Free Concierge)</span>
            </p>
            <p className="text-secondary small mb-2 d-flex align-items-center gap-2">
              <Mail size={16} color="#c5a059" />
              <span>concierge@hotelpro.com</span>
            </p>
            <p className="text-secondary small mb-0 d-flex align-items-center gap-2">
              <MapPin size={16} color="#c5a059" />
              <span>Executive Towers, Nariman Point, Mumbai 400021</span>
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4 opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <div>© {new Date().getFullYear()} HotelPro Platform Ltd. All rights reserved.</div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Reservation</span>
            <span>•</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

