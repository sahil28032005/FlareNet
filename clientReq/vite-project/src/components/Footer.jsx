import React from 'react';
import './Footer.css'; // Import custom CSS file for footer styling

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-16">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title glowing-text">Company</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">About Us</a></li>
                            <li><a href="#" className="footer-link">Careers</a></li>
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                            <li><a href="#" className="footer-link">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3 className="footer-title glowing-text">Contact</h3>
                        <ul className="footer-links">
                            <li><a href="mailto:info@example.com" className="footer-link">Email Us</a></li>
                            <li><a href="tel:+1234567890" className="footer-link">Call Us</a></li>
                            <li><a href="#" className="footer-link">Support</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3 className="footer-title glowing-text">Follow Us</h3>
                        <div className="social-links">
                            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-text">© 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
