import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockListings } from '../mockData/listings';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ListingPage.css';

const ListingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const listing = mockListings.find(l => l.id === parseInt(id));

  if (!listing) {
    return <div className="error-container">Listing not found</div>;
  }

  const similarListings = mockListings
    .filter(l => l.id !== listing.id)
    .slice(0, 3);

  return (
    <div className="listing-container">
      {/* Main Image Gallery */}
      <div className="listing-gallery">
        <img src={listing.images[0]} alt={listing.title} className="main-image" />
      </div>

      {/* Listing Information */}
      <div className="listing-info-grid">
        <div className="listing-main-info">
          <h1>{listing.title}</h1>
          <p className="location">📍 {listing.location}</p>
          <div className="price-tag">{listing.price}₸/month</div>
          
          <div className="key-features">
            <div className="feature">
              <span>🛏</span>
              <p>{listing.bedrooms} Bedrooms</p>
            </div>
            <div className="feature">
              <span>🚿</span>
              <p>{listing.bathrooms} Bathrooms</p>
            </div>
            <div className="feature">
              <span>📏</span>
              <p>{listing.area}m²</p>
            </div>
          </div>

          <div className="description">
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>

          <div className="amenities">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              <div className="amenity">✨ Air Conditioning</div>
              <div className="amenity">🚗 Parking</div>
              <div className="amenity">🏊‍♂️ Swimming Pool</div>
              <div className="amenity">🏋️‍♂️ Gym</div>
              <div className="amenity">📶 WiFi</div>
              <div className="amenity">🔒 Security</div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {user ? (
          <div className="contact-section">
            <div className="contact-card">
              <h3>Contact Owner</h3>
              <form className="contact-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Message"></textarea>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </div>
        ) : (
          <div className="contact-section">
            <div className="contact-card">
              <h3>Want to contact the owner?</h3>
              <Link to="/login" className="auth-link">
                Login to send a message
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Similar Listings */}
      <div className="similar-listings">
        <h2>Similar Properties</h2>
        <div className="similar-listings-grid">
          {similarListings.map(similar => (
            <motion.div
              key={similar.id}
              className="similar-listing-card"
              whileHover={{ scale: 1.05 }}
            >
              <img src={similar.images[0]} alt={similar.title} />
              <div className="similar-listing-content">
                <h3>{similar.title}</h3>
                <p className="similar-location">{similar.location}</p>
                <p className="similar-price">{similar.price}₸/month</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;

// export const aboutUsContent = {
//   title: "About HomeSwap",
//   description: "HomeSwap is your trusted partner in finding the perfect living space. Founded in 2024, we've been connecting people with their dream homes.",
//   mission: "Our mission is to make home searching simple, transparent, and enjoyable for everyone.",
//   features: [
//     {
//       id: 1,
//       title: "Wide Selection",
//       description: "Thousands of verified listings across the country"
//     },
//     {
//       id: 2,
//       title: "Secure Platform",
//       description: "Safe and secure transactions with verified users"
//     },
//     {
//       id: 3,
//       title: "24/7 Support",
//       description: "Our dedicated team is always here to help"
//     }
//   ],
//   team: [
//     {
//       id: 1,
//       name: "John Smith",
//       role: "Founder & CEO",
//       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
//     },
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       role: "Head of Operations",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
//     },
//     {
//       id: 3,
//       name: "Michael Chen",
//       role: "Lead Developer",
//       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
//     }
//   ],
//   contactInfo: {
//     email: "contact@homeswap.com",
//     phone: "+1 (555) 123-4567",
//     address: "123 Real Estate Street, New York, NY 10001"
//   }
// };
