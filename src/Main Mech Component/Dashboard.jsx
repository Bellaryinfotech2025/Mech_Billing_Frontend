import { useState } from "react";
import {
  LayoutDashboard,
  BarChart,
  Truck,
  CreditCard,
  TrendingUp,
  Sliders,
  Users,
  FileText,
  Download,
  FileQuestion,
  History,
  Bell,
  Settings,
  LogOut,
  Plus,
  User,
  Menu,
  X,
} from "lucide-react";
import "../Design Component/Dashboard.css";
import SettingsPopup from "../Main Mech Component/Settings";
import logo from "../assets/blogo.jpg";

const MainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Prevent default on link clicks to avoid page refresh
  const handleLinkClick = (e) => {
    e.preventDefault()
    // You would normally handle navigation here
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-container">
          {/* Company Logo */}
          <div className="company-logo">
            <img src={logo} alt="source logo" style={{ width: "30px", height: "30px" }} />
          </div>

          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav-menu">
          <ul>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <LayoutDashboard size={20} />
                <span>Home</span>
              </a>
            </li>

            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <BarChart size={20} />
                <span>Orders</span>
              </a>
            </li>

            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
              <History size={20} />
                <span>Lines</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <CreditCard size={20} />
                <span>Fabrication</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
              <TrendingUp size={20} />
                <span>Erection</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <Sliders size={20} />
                <span>Alingnment</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
              <CreditCard size={20} />
                <span>Billing</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <FileText size={20} />
                <span>Reports</span>
              </a>
            </li>
            
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <FileQuestion size={20} />
                <span>Requests</span>
              </a>
            </li>
             
          </ul>
        </nav>

        <div className="bottom-menu">
          <ul>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <Bell size={20} />
                <span>Notifications</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
                <Settings size={20} />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={handleLinkClick}>
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
            <h1 style={{fontSize:'1rem'}}>Dashboard</h1>

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
          <div className="empty-state">
            <p>You have no orders.</p>
            <button className="add-order-btn">
              <Plus size={20} />
              <span>Add Order</span>
            </button>
          </div>
        </main>
      </div>

      {/* Settings Popup */}
      <SettingsPopup isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default MainDashboard;

