import React from 'react';
import './Footer.css'; // Import custom CSS file for footer styling

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-16">
            <div className="container mx-auto px-4">
                <div className="footer-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div className="footer-section">
                        <h3 className="footer-title glowing-text text-xl font-bold mb-4">About</h3>
                        <p className="text-white/90">
                            We provide scalable and reliable deployment solutions tailored to meet modern development needs.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-section">
                        <h3 className="footer-title glowing-text text-xl font-bold mb-4">Contact</h3>
                        <ul className="footer-links space-y-2">
                            <li>
                                <a href="mailto:support@deploymentservice.com" className="footer-link text-white/90 hover:text-yellow-500">
                                    <i className="fas fa-envelope mr-2"></i> support@deploymentservice.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+1234567890" className="footer-link text-white/90 hover:text-yellow-500">
                                    <i className="fas fa-phone mr-2"></i> +1 234 567 890
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Explore Section */}
                    <div className="footer-section">
                        <h3 className="footer-title glowing-text text-xl font-bold mb-4">Explore</h3>
                        <ul className="footer-links space-y-2">
                            <li>
                                <a href="#features" className="footer-link text-white/90 hover:text-yellow-500">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="footer-link text-white/90 hover:text-yellow-500">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#docs" className="footer-link text-white/90 hover:text-yellow-500">
                                    Documentation
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="footer-social mt-8 flex justify-center space-x-6">
                    <a href="https://github.com/sahil28032005" target="_blank" rel="noopener noreferrer" className="social-link text-white/90 hover:text-yellow-500">
                        <i className="fab fa-github fa-2x"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/sahil-sadekar-06218722b" target="_blank" rel="noopener noreferrer" className="social-link text-white/90 hover:text-yellow-500">
                        <i className="fab fa-linkedin fa-2x"></i>
                    </a>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom mt-8 text-center border-t border-gray-700 pt-4">
                    <p className="footer-text text-white/80">
                        © {new Date().getFullYear()} Sahil Sadekar. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
