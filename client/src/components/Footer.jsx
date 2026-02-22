import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import zanizaLogo from '../assets/zaniza-logo.png';
import './Footer.css';

const Footer = () => {
    const location = useLocation();

    // Hide footer on login, register, admin pages
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="footer">
            <div className="container footer-content">
                {/* Brand Section */}
                <div className="footer-section brand">
                    <Link to="/" className="footer-logo-link">
                        <img src={zanizaLogo} alt="Zaniza" className="footer-logo-img" />
                    </Link>
                    <p className="footer-tagline">Wear Your Desire.</p>
                    <p className="footer-description">
                        Premium traditional and ethnic wear in Chittagong. Quality you can trust, style you'll love.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop Collection</Link></li>
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/cart">My Cart</Link></li>
                    </ul>
                </div>

                {/* Contact & specific Facebook Link request */}
                <div className="footer-section contact">
                    <h3>Connect With Us</h3>
                    <div className="contact-item">
                        <a href="https://www.facebook.com/authenticbychandny/" target="_blank" rel="noopener noreferrer" className="fb-link-group">
                            <Facebook size={24} />
                            <span>Visit us on Facebook</span>
                        </a>
                    </div>
                    {/* Placeholder for other contacts if needed, keeping it clean for now as per request */}
                    {/* <div className="contact-item">
                        <Mail size={18} />
                        <span>support@authenticbd.com</span>
                    </div> */}
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Zaniza | Chittagong. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
