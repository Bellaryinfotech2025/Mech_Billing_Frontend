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
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  AlertTriangle,
  UserCircle,
  Edit,
  Package,
  Upload,
} from "lucide-react"
import "../Design Component/Dashboard.css"

import SettingsPopup from "../Main Mech Component/Settings"
import OrderDetails from "../Main Mech Component/OrderDetails"
import OrderDatabaseSearch from "../Main Mech Component/OrderDatabaseSearch"
import LinesDatabaseSearch from "../Mech Lines Component/LinesDatabaseSearch"
import Alignment from "../Main Mech Component/Alingment"
import Erection from "../Main Mech Component/Erection"
import LookupTable from "../Main Mech Component/LookUpTable"
import LinesAddParent from "../Mech Lines Component/LinesAddParent"
import LinesAddChild from "../Mech Lines Component/LineAddChild"
import OrderNumberDetails from "../Main Mech Component/OrderNumberDetails"

import logo from "../assets/blogo.jpg"
import "../Design Component/logout-popup.css"
import "../Design Component/user-dropdown.css"
import "../Design Component/order-database-search.css"
import "../Design Component/dashboard-fix.css"

const MainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("home")
  const [activeSubmenu, setActiveSubmenu] = useState("")
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [logoImage, setLogoImage] = useState(logo)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showCoreLookup, setShowCoreLookup] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const fileInputRef = useRef(null)
  const userDropdownRef = useRef(null)
  const [showLinesAddParent, setShowLinesAddParent] = useState(false)
  const [showLinesAddChild, setShowLinesAddChild] = useState(false)
  const [selectedParentLine, setSelectedParentLine] = useState(null)
  const [username, setUsername] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showSecondSidebar, setShowSecondSidebar] = useState(false)
  const [showOrderNumberDetails, setShowOrderNumberDetails] = useState(false)

  // Submenu definitions for each main menu
  const submenus = {
    home: [],
    orders: ["Orders", "Lines", "Fabrication", "Erection", "Alignment", "Billing"],
    fabrication: ["Overview", "Schedule", "Materials", "Quality"],
    erection: ["Overview", "Schedule", "Resources", "Safety"],
    alignment: ["Overview", "Measurements", "Adjustments", "Reports"],
    billing: ["Invoices", "Payments", "Reports", "Settings"],
    reports: ["Financial", "Operational", "Custom", "Scheduled"],
    requests: ["Pending", "Approved", "Rejected", "Archive"],
    import: ["Upload", "History", "Settings"],
  }

  // Add this useEffect to get the username when the component mounts
  useEffect(() => {
    // Try to get username from localStorage or sessionStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUsername(userData.username || "")
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

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
    } else if (menu === "home") {
      setActiveMenu(menu)
      setSidebarCollapsed(false)
      setActiveSubmenu("")
      setShowContent(true)
      setShowCoreLookup(false)
      setShowOrderDetails(false)
      setShowLinesAddParent(false)
      setShowLinesAddChild(false)
      setSelectedOrder(null)
      setShowSecondSidebar(false)
      setShowOrderNumberDetails(false)
    } else if (menu === "orders") {
      setActiveMenu(menu)
      // For orders, we want to show the OrderDatabaseSearch component directly
      setActiveSubmenu("Orders")
      setShowContent(true)
      setShowCoreLookup(false)
      setShowOrderDetails(false)
      setShowLinesAddParent(false)
      setShowLinesAddChild(false)
      setSelectedOrder(null)
      setShowSecondSidebar(false)
      setShowOrderNumberDetails(false)
    } else {
      setActiveMenu(menu)
      setSidebarCollapsed(true)
      setActiveSubmenu(submenus[menu][0] || "")
      setShowContent(true)
      setShowCoreLookup(false)
      setShowOrderDetails(false)
      setShowLinesAddParent(false)
      setShowLinesAddChild(false)
      setSelectedOrder(null)
      setShowSecondSidebar(true)
      setShowOrderNumberDetails(false)
    }
  }

  const handleSubmenuClick = (e, submenu) => {
    e.preventDefault()
    setActiveSubmenu(submenu)
    setShowContent(true)

    // Reset all content states
    setShowOrderDetails(false)
    setShowLinesAddParent(false)
    setShowLinesAddChild(false)
    setShowCoreLookup(false)
    setShowOrderNumberDetails(false)
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

  const handleAddParentClick = () => {
    setShowLinesAddParent(true)
  }

  const handleLinesAddParentCancel = () => {
    setShowLinesAddParent(false)
  }

  // Updated handler for showing LinesAddChild with parent line info
  const handleAddChildClick = (parentLine) => {
    setSelectedParentLine(parentLine)
    setShowLinesAddChild(true)
  }

  // Handler for canceling from LinesAddChild
  const handleLinesAddChildCancel = () => {
    setShowLinesAddChild(false)
    setSelectedParentLine(null)
  }

  // Handler for order number click
  const handleOrderNumberClick = (order) => {
    setSelectedOrder(order)
    setActiveMenu("orders")
    setActiveSubmenu("Orders")
    setSidebarCollapsed(true)
    setShowSecondSidebar(true)
    setShowOrderNumberDetails(true)
  }

  // Get the icon for a menu item
  const getMenuIcon = (menu) => {
    switch (menu) {
      case "home":
        return <LayoutDashboard size={20} />
      case "orders":
        return <BarChart size={20} />
      case "fabrication":
        return <Package size={20} />
      case "erection":
        return <TrendingUp size={20} />
      case "alignment":
        return <Sliders size={20} />
      case "billing":
        return <CreditCard size={20} />
      case "reports":
        return <FileText size={20} />
      case "requests":
        return <FileQuestion size={20} />
      case "notifications":
        return <Bell size={20} />
      case "settings":
        return <Settings size={20} />
      case "logout":
        return <LogOut size={20} />
      case "import":
        return <Upload size={20} />
      default:
        return <FileText size={20} />
    }
  }

  // Determine which content to render based on active menu and submenu
  const renderContent = () => {
    if (!showContent) return null

    if (showCoreLookup) return <LookupTable />

    // Handle different submenu content
    if (activeSubmenu === "Orders") {
      if (showOrderDetails) {
        return <OrderDetails onCancel={handleBackToOrderSearch} />
      }
      if (showOrderNumberDetails && selectedOrder) {
        return (
          <OrderNumberDetails
            order={selectedOrder}
            onCancel={() => {
              setShowOrderNumberDetails(false)
              setSelectedOrder(null)
            }}
            getLookupMeaning={(lookupType, lookupCode) => {
              // Simple implementation to avoid errors
              return lookupCode || "-"
            }}
            formatDate={(dateString) => {
              if (!dateString) return "-"
              const date = new Date(dateString)
              return date.toLocaleDateString()
            }}
          />
        )
      }
      return (
        <OrderDatabaseSearch
          onAddOrderClick={handleAddOrderClick}
          onOrderNumberClick={handleOrderNumberClick}
          selectedOrder={selectedOrder}
        />
      )
    }

    if (activeSubmenu === "Lines") {
      if (showLinesAddParent) {
        return <LinesAddParent onCancel={handleLinesAddParentCancel} />
      }
      if (showLinesAddChild) {
        return <LinesAddChild onCancel={handleLinesAddChildCancel} parentLine={selectedParentLine} />
      }
      return <LinesDatabaseSearch onAddParentClick={handleAddParentClick} onAddChildClick={handleAddChildClick} />
    }

    if (activeSubmenu === "Erection") {
      return <Erection />
    }

    if (activeSubmenu === "Alignment") {
      return <Alignment />
    }

    if (activeSubmenu === "Fabrication") {
      return (
        <div className="empty-state">
          <p>Fabrication content will be displayed here.</p>
        </div>
      )
    }

    if (activeSubmenu === "Billing") {
      return (
        <div className="empty-state">
          <p>Billing content will be displayed here.</p>
        </div>
      )
    }

    // Default content for other menus/submenus
    return (
      <div className="empty-state">
        <p>Hi Viewers, {activeSubmenu || activeMenu} content will be displayed here.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Main Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
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
            {!sidebarCollapsed && (
              <div className="logo-text">
                <span className="company-name">Mech Billing</span>
                <span className="company-tagline">Smart Solutions</span>
              </div>
            )}
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
                {getMenuIcon("home")}
                {!sidebarCollapsed && <span>Home</span>}
              </a>
            </li>

            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "orders" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "orders")}
              >
                {getMenuIcon("orders")}
                {!sidebarCollapsed && <span>Orders</span>}
              </a>
            </li>

            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "fabrication" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "fabrication")}
              >
                {getMenuIcon("fabrication")}
                {!sidebarCollapsed && <span>Fabrication</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "erection" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "erection")}
              >
                {getMenuIcon("erection")}
                {!sidebarCollapsed && <span>Erection</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "alignment" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "alignment")}
              >
                {getMenuIcon("alignment")}
                {!sidebarCollapsed && <span>Alignment</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "billing" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "billing")}
              >
                {getMenuIcon("billing")}
                {!sidebarCollapsed && <span>Billing</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "reports" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "reports")}
              >
                {getMenuIcon("reports")}
                {!sidebarCollapsed && <span>Reports</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "requests" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "requests")}
              >
                {getMenuIcon("requests")}
                {!sidebarCollapsed && <span>Requests</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "import" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "import")}
              >
                {getMenuIcon("import")}
                {!sidebarCollapsed && <span>Import</span>}
              </a>
            </li>
          </ul>
        </nav>

        <div className="bottom-menu">
          <ul>
            <li>
              <a
                href="#"
                className={`nav-link ${activeMenu === "notifications" ? "active" : ""}`}
                onClick={(e) => handleLinkClick(e, "notifications")}
              >
                {getMenuIcon("notifications")}
                {!sidebarCollapsed && <span>Notifications</span>}
              </a>
            </li>

            <li>
              <a href="#" className="nav-link" onClick={(e) => handleLinkClick(e, "logout")}>
                {getMenuIcon("logout")}
                {!sidebarCollapsed && <span>Logout</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Secondary Sidebar - Shows when a menu item is selected or order number is clicked */}
      {showSecondSidebar && (
        <div className="secondary-sidebar">
          <div className="secondary-sidebar-header">
            <h2>{activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}</h2>
          </div>
          <nav className="secondary-sidebar-menu">
            <ul>
              {submenus[activeMenu] &&
                submenus[activeMenu].map((submenu) => (
                  <li key={submenu}>
                    <a
                      href="#"
                      className={`secondary-nav-link ${activeSubmenu === submenu ? "active" : ""}`}
                      onClick={(e) => handleSubmenuClick(e, submenu)}
                    >
                      <span>{submenu}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Content Area */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1>
              {activeMenu === "home" && (username ? `Hi ${username}` : "Welcome")}
              {activeSubmenu ? activeSubmenu : activeMenu !== "home" ? activeMenu : ""}
              {showOrderDetails && "Add Order"}
              {showLinesAddParent && "Add Parent Line"}
              {showLinesAddChild && "Add Child Line"}
              {showCoreLookup && "Core Lookup Values"}
              {selectedOrder && ` - Order ${selectedOrder.orderNumber}`}
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
        <main className="main-content">{renderContent()}</main>
      </div>

      {/* Settings Popup */}
      {settingsOpen && (
        <SettingsPopup
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onCoreLookupClick={handleCoreLookupClick}
        />
      )}

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
