"use client"

import { useState } from "react"
import "../UserCredentialsDesign/Register_page_design.css"
import { FaRupeeSign } from "react-icons/fa"
import axios from "axios"
import {Link ,  useNavigate } from "react-router-dom"
import logo from '../assets/blogo.jpg'

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  })

  
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showGooglePopup, setShowGooglePopup] = useState(false)
  const [isStrongPassword, setIsStrongPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value,
    })

    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    setIsStrongPassword(password.length >= 8)
  }

  const validateForm = () => {
    const tempErrors = {}
    let isValid = true

    if (!user.fullname.trim()) {
      tempErrors.fullName = "Full name is required"
      isValid = false
    }

    if (!user.username.trim()) {
      tempErrors.username = "Username is required"
      isValid = false
    }

    if (!user.email.trim()) {
      tempErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      tempErrors.email = "Email is invalid"
      isValid = false
    }

    if (!user.password) {
      tempErrors.password = "Password is required"
      isValid = false
    } else if (!isStrongPassword) {
      tempErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (!user.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(user.phoneNumber.replace(/[^0-9]/g, ""))) {
      tempErrors.phoneNumber = "Phone number is invalid"
      isValid = false
    }

    setErrors(tempErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
 
        const response = await axios.post("http://195.35.45.56:5522/api/register", user)
 

        alert("Registration Successful!")
        navigate("/loginbilling") // Navigate to login page after successful registration
      } catch (err) {
        setError("Registration failed. Please try again!")
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleGoogleSignIn = (e) => {
    e.preventDefault()
    setShowGooglePopup(true)
    setTimeout(() => {
      setShowGooglePopup(false)
    }, 3000)
  }

  return (
    <section className="bodyooo">
      <div className="page-container">
        <div className="register-container">
          <div className="register-left">
            <div className="billing-software-content">
              <h1 className="main-heading">Advanced Billing Software</h1>
              <p className="sub-heading">Streamline your invoicing process with our powerful tools</p>

              <div className="feature-tables">
                <div className="feature-table floating">
                  <div className="table-header">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <h3>Invoice Management</h3>
                  </div>
                  <ul className="feature-list">
                    <li>Create professional invoices</li>
                    <li>Automated recurring billing</li>
                    <li>Custom invoice templates</li>
                    <li>Multi-currency support</li>
                  </ul>
                </div>

                <div className="feature-table floating delay-1">
                  <div className="table-header">
                    <FaRupeeSign />
                    <h3>Payment Processing</h3>
                  </div>
                  <ul className="feature-list">
                    <li>Multiple payment gateways</li>
                    <li>Automatic payment reminders</li>
                    <li>Secure transaction handling</li>
                    <li>Payment tracking dashboard</li>
                  </ul>
                </div>

                <div className="feature-table floating delay-2">
                  <div className="table-header">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                    <h3>Financial Reports</h3>
                  </div>
                  <ul className="feature-list">
                    <li>Real-time financial insights</li>
                    <li>Customizable report templates</li>
                    <li>Tax calculation & reporting</li>
                    <li>Export to multiple formats</li>
                  </ul>
                </div>
              </div>

              <div className="animated-circle"></div>
              <div className="animated-square"></div>
              <div className="animated-triangle"></div>
            </div>
          </div>

          <div className="register-right">
            <div className="register-form-container">
              <div className="logo-container">
                <img src={logo} alt="logoofbellary" style={{width:'50px',height:'50px'}}/>
                <h1>MECH BILLING APP</h1>
              </div>

              <div className="divider"></div>

              <h2>Register</h2>

              <button className="google-btn" onClick={handleGoogleSignIn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {showGooglePopup && (
                <div className="popup-message">
                  <p>Coming Soon!</p>
                </div>
              )}

              <div className="divider-text">
                <span>or register with email</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullname">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="Full Name"
                    value={user.fullname}
                    onChange={handleChange}
                    className={errors.fullName ? "error" : ""}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange}
                    className={errors.username ? "error" : ""}
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                  />
                  <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                {isStrongPassword && user.password && <div className="strong-password-message">Strong password</div>}

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={user.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>

                <button type="submit" className="submit-btn">
                  Register
                </button>
              </form>

              <div className="footer-text">
                <p>
                  Already have an account? <Link to="/loginbilling">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage;

