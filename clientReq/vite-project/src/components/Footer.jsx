import React from "react";
import "./Footer.css"; // Import the CSS module

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">About Us</h3>
            <p className="footer-text">
              Our deployment service simplifies hosting, integrates seamlessly
              with CI/CD pipelines, and provides cloud products such as IDEs,
              automation tools, and more.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <a href="#" className="footer-link">Home</a>
            <a href="#" className="footer-link">Features</a>
            <a href="#" className="footer-link">Pricing</a>
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">Contact</a>
          </div>

          {/* Products Section */}
          <div className="footer-section">
            <h3 className="footer-title">Products</h3>
            <a href="#" className="footer-link">Cloud IDE</a>
            <a href="#" className="footer-link">Workflow Automation</a>
            <a href="#" className="footer-link">Monitoring Tools</a>
            <a href="#" className="footer-link">Custom Hosting</a>
          </div>

          {/* Social Media Section */}
          <div className="footer-section">
            <h3 className="footer-title">Follow Us</h3>
            <a href="#" className="footer-link"><i className="fab fa-twitter"></i> Twitter</a>
            <a href="#" className="footer-link"><i className="fab fa-linkedin"></i> LinkedIn</a>
            <a href="#" className="footer-link"><i className="fab fa-github"></i> GitHub</a>
            <a href="#" className="footer-link"><i className="fab fa-facebook"></i> Facebook</a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-text glowing-text">
            &copy; 2025 Sahil Sadekar. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
