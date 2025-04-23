import { useState } from "react";
import "../IndexComponent/indexxx.css";
import land from '../assets/mec image.png';
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 11H10V13H14V11Z" fill="currentColor" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 5V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H20C21.6569 5 23 6.34315 23 8V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V8C1 6.34315 2.34315 5 4 5H7ZM9 4H15V5H9V4ZM4 7C3.44772 7 3 7.44772 3 8V14H21V8C21 7.44772 20.5523 7 20 7H4ZM3 18V16H21V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1>MechBill</h1>
        </div>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          <div className="auth-buttons">
            <button className="login-btn">
<Link to="/loginbilling">Login</Link>
             

            </button>
             
            <button className="register-btn"> <Link to="/registerpage">Register</Link></button>
            
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Streamline Your Mechanical Workshop Billing</h1>
          <p>
            Powerful, intuitive software designed specifically for auto repair shops and mechanical workshops. Save
            time, reduce errors, and focus on what matters most - your customers.
          </p>
          
        </div>
        <div className="hero-image">
          <img
            src={land}
            alt="MechBill Dashboard Interface showing invoice management and parts inventory" style={{width:'800px',height:'70vh'}}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your mechanical workshop efficiently</p>
        </div>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Smart Invoicing</h3>
            <p>
              Create professional invoices in seconds with customizable templates. Automatically calculate labor costs,
              parts, and taxes with precision.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 3H3V10H10V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 3H14V10H21V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 14H14V21H21V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 14H3V21H10V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Parts Inventory</h3>
            <p>
              Track parts inventory in real-time. Get low stock alerts, manage suppliers, and automatically update
              inventory when creating invoices.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3>Time Tracking</h3>
            <p>
              Track labor hours with precision. Assign technicians to jobs, monitor productivity, and automatically
              calculate labor costs for billing.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M9 7H7V17H9V7Z" stroke="currentColor" strokeWidth="2" />
                <path d="M13 7H11V17H13V7Z" stroke="currentColor" strokeWidth="2" />
                <path d="M17 7H15V17H17V7Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3>Advanced Reporting</h3>
            <p>
              Gain valuable insights with detailed reports on sales, inventory, technician performance, and customer
              history to make data-driven decisions.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2>Why Choose MechBill</h2>
          <p>Built by mechanics for mechanics</p>
        </div>
        <div className="about-container">
          <div className="about-image">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Mechanic using MechBill software on a tablet in an auto repair shop"
            />
          </div>
          <div className="about-content">
            <div className="about-item">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3>Designed for Auto Repair Shops</h3>
                <p>
                  Created specifically for the unique needs of mechanical workshops with industry-specific features.
                </p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3>Cloud-Based Solution</h3>
                <p>
                  Access your workshop data from anywhere, on any device, with secure cloud storage and automatic
                  backups.
                </p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3>Exceptional Support</h3>
                <p>
                  Our dedicated support team understands the automotive industry and is available to help you succeed.
                </p>
              </div>
            </div>

            <div className="about-item">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3>Regular Updates</h3>
                <p>We continuously improve our software based on customer feedback and industry trends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="testimonial-section">
        <div className="section-header light">
          <h2>What Our Customers Say</h2>
          <p>Join hundreds of satisfied workshop owners</p>
        </div>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "MechBill has transformed how we handle our workshop billing. We've saved hours every week on paperwork
                and reduced billing errors by 95%. The inventory management is a game-changer."
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/placeholder.svg?height=60&width=60" alt="John Smith" className="author-image" />
              <div className="author-info">
                <h4>John Smith</h4>
                <p>Smith's Auto Repair</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "The customer database feature alone has paid for the subscription. We can now track vehicle history,
                set service reminders, and provide a much more personalized experience to our customers."
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/placeholder.svg?height=60&width=60" alt="Sarah Johnson" className="author-image" />
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Johnson's Mechanics</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "As someone who's not tech-savvy, I was worried about implementing new software. MechBill's interface is
                so intuitive, and their support team helped me every step of the way. Couldn't be happier!"
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/placeholder.svg?height=60&width=60" alt="Mike Rodriguez" className="author-image" />
              <div className="author-info">
                <h4>Mike Rodriguez</h4>
                <p>Rodriguez Auto Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p>Have questions? Our team is here to help</p>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p>
              We're dedicated to providing exceptional support to our customers. Reach out to us through any of these
              channels:
            </p>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M3 5L12 14L21 5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h4>Email Us</h4>
                <p>info@bellaryinfotech.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 4H9L11 9L8.5 10.5C9.5 12.5 11.5 14.5 13.5 15.5L15 13L20 15V19C20 20.1046 19.1046 21 18 21C9.71573 21 3 14.2843 3 6C3 4.89543 3.89543 4 5 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h4>Call Us</h4>
                <p>+ 91 9603299266</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 21C16 17 20 13.4183 20 10C20 6.13401 16.4183 3 12 3C7.58172 3 4 6.13401 4 10C4 13.4183 8 17 12 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h4>Visit Us</h4>
                <p>
                Plot No 7, Ward No 18/21, Kappagal Road,
                <br/> M V Nagar 9th Cross, Bellary 583103
                </p>
              </div>
            </div>

            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>
                Monday - Friday: 8:00 AM - 6:00 PM
                <br />
                Saturday: 9:00 AM - 2:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          <form className="contact-form">
            <h3>Send Us a Message</h3>
            <div className="form-group">
            
              <input type="text" id="name" placeholder="Your Name" required />
            </div>

            <div className="form-group">
               
              <input type="email" id="email" placeholder="Your Email" required />
            </div>

            <div className="form-group">
               
              <input type="tel" id="phone" placeholder="Your Phone Number" />
            </div>

            <div className="form-group">
               
              <input type="text" id="subject" placeholder="Subject" required />
            </div>

            <div className="form-group">
              
              <textarea id="message" rows="5" placeholder="How can we help you?" required></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 11H10V13H14V11Z" fill="currentColor" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 5V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H20C21.6569 5 23 6.34315 23 8V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V8C1 6.34315 2.34315 5 4 5H7ZM9 4H15V5H9V4ZM4 7C3.44772 7 3 7.44772 3 8V14H21V8C21 7.44772 20.5523 7 20 7H4ZM3 18V16H21V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 style={{color:'white'}}>MechBill</h2>
            <p>
              Streamlining mechanical workshop billing since 2023. Our mission is to help auto repair shops run more
              efficiently with powerful, easy-to-use software.
            </p>
          </div>

          <div className="footer-links">
            
            <ul>
              <li>
                <a href="#home" style={{color:'white'}}>Home</a>
              </li>
              <li>
                <a href="#features" style={{color:'white'}}>Features</a>
              </li>
              <li>
                <a href="#about" style={{color:'white'}}>About Us</a>
              </li>
              <li>
                <a href="#testimonials" style={{color:'white'}}>Testimonials</a>
              </li>
              <li>
                <a href="#contact" style={{color:'white'}}>Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
             
            <ul>
              <li>
                <a href="#" style={{color:'white'}}>Help Center</a>
              </li>
              <li>
                <a href="#" style={{color:'white'}}>Blog</a>
              </li>
              <li>
                <a href="#" style={{color:'white'}}>Video Tutorials</a>
              </li>
              <li>
                <a href="#" style={{color:'white'}}>API Documentation</a>
              </li>
              <li>
                <a href="#" style={{color:'white'}}>System Status</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            
            <ul>
              <li>
                <a href="#" style={{color:'white'}}>Privacy Policy</a>
              </li>
              <li>
                <a href="#" style={{color:'white'}}>Terms of Service</a>
              </li>
              <li>
                <a href="#" style={{color:'white'}}>Cookie Policy</a>
              </li>
             
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 MechBill. All rights reserved.</p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9H2V21H6V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2H8C4.68629 2 2 4.68629 2 8V16C2 19.3137 4.68629 22 8 22H16C19.3137 22 22 19.3137 22 16V8C22 4.68629 19.3137 2 16 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M17.5 6.5H17.51"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage;

