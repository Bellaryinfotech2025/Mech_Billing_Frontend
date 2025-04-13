"use client"

import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard,
  BarChart,
  CreditCard,
  TrendingUp,
  Sliders,
  FileText,
  FileQuestion,
  History,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  AlertTriangle,
  UserCircle,
  Edit,
} from "lucide-react"
import "../Design Component/Dashboard.css"

import SettingsPopup from "../Main Mech Component/Settings"
import OrderDetails from "../Main Mech Component/OrderDetails"
import OrderDatabaseSearch from "../Main Mech Component/OrderDatabaseSearch"
import Alignment from "../Main Mech Component/Alingment"
import Erection from "../Main Mech Component/Erection"
import LookupTable from "../Main Mech Component/LookUpTable"

import logo from "../assets/blogo.jpg"
import "../Design Component/logout-popup.css"
import "../Design Component/user-dropdown.css"
import "../Design Component/order-database-search.css"
import "../Design Component/dashboard-fix.css"

const MainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("home")
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [logoImage, setLogoImage] = useState(logo)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showCoreLookup, setShowCoreLookup] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const fileInputRef = useRef(null)
  const userDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Prevent default on link clicks to avoid page refresh
  const handleLinkClick = (e, menu) => {
    e.preventDefault()

    if (menu === "logout") {
      setShowLogoutPopup(true)
    } else {
      setActiveMenu(menu)
      setShowCoreLookup(false) // Hide lookup table when navigating
      setShowOrderDetails(false) // Hide order details when navigating
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  const handleStay = () => {
    setShowLogoutPopup(false)
  }

  const handleLogout = () => {
    // Redirect to landing page
    window.location.href = "/" // Change this to your landing page URL
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file)
      setLogoImage(imageUrl)
    }
  }

  const handleProfileAction = (action) => {
    if (action === "logout") {
      setShowLogoutPopup(true)
    } else if (action === "edit-profile") {
      console.log("Edit profile clicked")
      // Add your edit profile logic here
    } else if (action === "my-profile") {
      console.log("My profile clicked")
      // Add your my profile logic here
    }
    setShowUserDropdown(false)
  }

  const handleCoreLookupClick = () => {
    setShowCoreLookup(true)
    setSettingsOpen(false) // Close settings popup
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    console.log("Searching for:", query)
    // You can implement search functionality here
  }

  // Handler for Add Order button click
  const handleAddOrderClick = () => {
    console.log("Add Order clicked")
    setShowOrderDetails(true)
  }

  // Handler to go back to order search
  const handleBackToOrderSearch = () => {
    setShowOrderDetails(false)
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-container">
          {/* Company Logo - Clickable and Editable */}
          <div className="company-logo">
            <div className="logo-image-container">
              <img src={logoImage || "/placeholder.svg"} alt="company logo" className="logo-image" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <div className="logo-text">
              <span className="company-name">Mech Billing</span>
              <span className="company-tagline">Smart Solutions</span>
            </div>
          </div>

          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav-menu">
          <ul>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "home" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "home")}
              >
                <LayoutDashboard size={20} />
                <span>Home</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "orders" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "orders")}
              >
                <BarChart size={20} />
                <span>Orders</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "lines" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "lines")}
              >
                <History size={20} />
                <span>Lines</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "fabrication" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "fabrication")}
              >
                <CreditCard size={20} />
                <span>Fabrication</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "erection" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "erection")}
              >
                <TrendingUp size={20} />
                <span>Erection</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "alignment" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "alignment")}
              >
                <Sliders size={20} />
                <span>Alingnment</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "billing" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "billing")}
              >
                <CreditCard size={20} />
                <span>Billing</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "reports" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "reports")}
              >
                <FileText size={20} />
                <span>Reports</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "requests" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "requests")}
              >
                <FileQuestion size={20} />
                <span>Requests</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="bottom-menu">
          <ul>
            <li>
              <a href="#" className="nav-link" onClick={(e) => handleLinkClick(e, "notifications")}>
                <Bell size={20} />
                <span>Notifications</span>
              </a>
            </li>

            <li>
              <a href="#" className="nav-link" onClick={(e) => handleLinkClick(e, "logout")}>
                <LogOut size={20} />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: "1rem" }}>
              {activeMenu === "home" && "Dashboard"}
              {activeMenu === "orders" && !showOrderDetails && "Orders"}
              {activeMenu === "orders" && showOrderDetails && "Add Order"}
              {activeMenu === "lines" && "Lines"}
              {activeMenu === "fabrication" && "Fabrication"}
              {activeMenu === "erection" && "Erection"}
              {activeMenu === "alignment" && "Alignment"}
              {activeMenu === "billing" && "Billing"}
              {activeMenu === "reports" && "Reports"}
              {activeMenu === "requests" && "Requests"}
              {showCoreLookup && "Core Lookup Values"}
            </h1>
          </div>
          <div className="header-right">
            <button className="header-btn" onClick={toggleSettings}>
              <Settings size={20} />
            </button>
            <div className="user-dropdown-container" ref={userDropdownRef}>
              <button className="header-btn profile-btn" onClick={toggleUserDropdown}>
                <User size={20} />
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="user-dropdown-item" onClick={() => handleProfileAction("my-profile")}>
                    <UserCircle size={18} />
                    <span>My Profile</span>
                  </div>
                  <div className="user-dropdown-item" onClick={() => handleProfileAction("edit-profile")}>
                    <Edit size={18} />
                    <span>Edit Profile</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="user-dropdown-item logout-item" onClick={() => handleProfileAction("logout")}>
                    <LogOut size={18} />
                    <span>Log out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Conditional rendering based on active menu */}
          {showCoreLookup && <LookupTable />}

          {/* Render OrderDatabaseSearch when orders menu is active */}
          {activeMenu === "orders" && !showCoreLookup && !showOrderDetails && (
            <OrderDatabaseSearch onAddOrderClick={handleAddOrderClick} />
          )}

          {/* Render OrderDetails when Add Order is clicked */}
          {activeMenu === "orders" && !showCoreLookup && showOrderDetails && (
            <OrderDetails onCancel={handleBackToOrderSearch} />
          )}

          {activeMenu === "alignment" && !showCoreLookup && <Alignment />}

          {activeMenu === "erection" && !showCoreLookup && <Erection />}

          {/* Other menu content would go here */}
        </main>
      </div>

      {/* Settings Popup */}
      <SettingsPopup
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onCoreLookupClick={handleCoreLookupClick}
      />

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <div className="logout-popup-header">
              <AlertTriangle size={28} className="logout-icon" />
              <h3>Sign Out</h3>
            </div>
            <div className="logout-popup-content">
              <p>Are you sure you want to sign out of Mech Billing App?</p>
            </div>
            <div className="logout-popup-actions">
              <button className="stay-btn" onClick={handleStay}>
                No, Stay
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainDashboard;
