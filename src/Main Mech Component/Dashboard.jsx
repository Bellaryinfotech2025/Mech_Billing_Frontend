import { useState } from "react";
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
  Plus,
  User,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import "../Design Component/Dashboard.css"
import SettingsPopup from "../Main Mech Component/Settings"
import OrderDetails from "../Main Mech Component/OrderDetails"
import Alignment from "../Main Mech Component/Alingment"
import Erection from "../Main Mech Component/Erection"
import logo from "../assets/blogo.jpg";
import "../Design Component/logout-popup.css";

const MainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("home")
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)

  // Prevent default on link clicks to avoid page refresh
  const handleLinkClick = (e, menu) => {
    e.preventDefault()

    if (menu === "logout") {
      setShowLogoutPopup(true)
    } else {
      setActiveMenu(menu)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  const handleStay = () => {
    setShowLogoutPopup(false)
  }

  const handleLogout = () => {
    // Redirect to landing page
    window.location.href = "/" // Change this to your landing page URL
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-container">
          {/* Company Logo */}
          <div className="company-logo">
            <img src={logo || "/placeholder.svg"} alt="source logo" style={{ width: "30px", height: "30px" }} />
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
              <a href="#" className="nav-link" onClick={(e) => handleLinkClick(e, "settings")}>
                <Settings size={20} />
                <span>Settings</span>
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
              {activeMenu === "orders" && "Orders"}
              {activeMenu === "lines" && "Lines"}
              {activeMenu === "fabrication" && "Fabrication"}
              {activeMenu === "erection" && "Erection"}
              {activeMenu === "alignment" && "Alignment"}
              {activeMenu === "billing" && "Billing"}
              {activeMenu === "reports" && "Reports"}
              {activeMenu === "requests" && "Requests"}
            </h1>
          </div>
          <div className="header-right">
            <button className="header-btn" onClick={toggleSettings}>
              <Settings size={20} />
            </button>
            <button className="header-btn profile-btn">
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {activeMenu === "home" && (
            <div className="empty-state">
              <p>You have no orders.</p>
              <button className="add-order-btn">
                <Plus size={20} />
                <span>Add Order</span>
              </button>
            </div>
          )}

          {activeMenu === "orders" && <OrderDetails />}

          {activeMenu === "alignment" && <Alignment />}

          {activeMenu === "erection" && <Erection />}

          {/* Other menu content would go here */}
        </main>
      </div>

      {/* Settings Popup */}
      <SettingsPopup isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

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

