"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Save, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import "../Design Component/OrderDetails.css"
import axios from "axios"

const OrderDetails = () => {
  const [activeTab, setActiveTab] = useState("order-details")
  const [showDatePicker, setShowDatePicker] = useState(null)
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  })
  const [ldApplicable, setLdApplicable] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const datePickerRef = useRef(null)
  const categoryDropdownRef = useRef(null)

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState("date") // "date", "month", "year"

  // Add order state for backend submission
  const [order, setOrder] = useState({
    orderId: "",
    orderNumber: "",
    orderType: "",
    orderCategory: "",
    effectiveStartDate: null,
    effectiveEndDate: null,
    ldApplicabel: "N",
    billToCustomerId: "",
    billToSiteId: "",
    billToContactId: "",
    salesrep: "",
    billingFrequency: "",
    billingCycle: "",
    attribute1D: null,
    attribute2D: null,
    attribute3D: null,
    attribute4D: null,
    attribute5D: null,
    attribute1V: "",
    attribute2V: "",
    attribute3V: "",
    attribute4V: "",
    attribute5V: "",
    attribute1N: "",
    attribute2N: "",
    attribute3N: "",
    attribute4N: "",
    attribute5N: "",
    // Required fields for the backend
    orderVersion: 1,
    status: "Draft",
    version: 1,
    source: 1,
  })

  // Order ID and Order Number options
  const orderIdOptions = [
    { value: "1001", label: "1001" },
    { value: "1002", label: "1002" },
    { value: "1003", label: "1003" },
    { value: "1004", label: "1004" },
    { value: "1005", label: "1005" },
  ]

  const orderNumberOptions = [
    { value: "ORD-2023-001", label: "ORD-2023-001" },
    { value: "ORD-2023-002", label: "ORD-2023-002" },
    { value: "ORD-2023-003", label: "ORD-2023-003" },
    { value: "ORD-2023-004", label: "ORD-2023-004" },
    { value: "ORD-2023-005", label: "ORD-2023-005" },
  ]

  const categoryOptions = [
    {
      value: "",
      label: "Select Category",
      disabled: true,
    },
    {
      value: "a",
      label: "Category A",
    },
    {
      value: "b",
      label: "Category B",
    },
    {
      value: "c",
      label: "Category C",
    },
    {
      value: "d",
      label: "Category D",
    },
    {
      value: "e",
      label: "Category E",
    },
    {
      value: "f",
      label: "Category F",
    },
  ]

  // Options for attribute dropdowns
  const stringAttributeOptions = [
    "Customer Reference",
    "Project Code",
    "Department",
    "Cost Center",
    "Region",
    "Product Line",
    "Contract Type",
    "Promotion Code",
    "Vendor ID",
    "Account Manager",
  ]

  const numericAttributeOptions = [
    "Discount Percentage",
    "Tax Rate",
    "Quantity",
    "Unit Price",
    "Total Amount",
    "Service Level",
    "Priority",
    "Duration (Months)",
    "Renewal Count",
    "Version Number",
  ]

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleDateSelect = (field, date) => {
    const formattedDate = formatDate(date)
    setDates({ ...dates, [field]: formattedDate })

    // Update the order state with ISO date format for backend
    const isoDate = date.toISOString().split("T")[0]
    if (field === "startDate") {
      setOrder({ ...order, effectiveStartDate: isoDate })
    } else if (field === "endDate") {
      setOrder({ ...order, effectiveEndDate: isoDate })
    }

    setShowDatePicker(null)
  }

  const formatDate = (date) => {
    const day = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear().toString()
    return `${day < 10 ? "0" + day : day}-${month}-${year}`
  }

  // Enhanced calendar functions
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  const handlePrevYear = () => {
    setCalendarDate(new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1))
  }

  const handleNextYear = () => {
    setCalendarDate(new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1))
  }

  const handleMonthClick = () => {
    setCalendarView("month")
  }

  const handleYearClick = () => {
    setCalendarView("year")
  }

  const handleMonthSelect = (month) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), month, 1))
    setCalendarView("date")
  }

  const handleYearSelect = (year) => {
    setCalendarDate(new Date(year, calendarDate.getMonth(), 1))
    setCalendarView("month")
  }

  const generateCalendar = (field) => {
    if (calendarView === "date") {
      return generateDateView(field)
    } else if (calendarView === "month") {
      return generateMonthView()
    } else if (calendarView === "year") {
      return generateYearView()
    }
  }

  const generateDateView = (field) => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isToday ? "today" : ""}`}
          onClick={() => handleDateSelect(field, date)}
        >
          {i}
        </div>,
      )
    }

    return days
  }

  const generateMonthView = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return (
      <div className="calendar-months">
        {months.map((month, index) => (
          <div key={month} className="calendar-month" onClick={() => handleMonthSelect(index)}>
            {month}
          </div>
        ))}
      </div>
    )
  }

  const generateYearView = () => {
    const currentYear = calendarDate.getFullYear()
    const startYear = currentYear - 6
    const years = []

    for (let i = 0; i < 12; i++) {
      const year = startYear + i
      years.push(
        <div key={year} className="calendar-year" onClick={() => handleYearSelect(year)}>
          {year}
        </div>,
      )
    }

    return <div className="calendar-years">{years}</div>
  }

  const handleCategorySelect = (option) => {
    if (!option.disabled) {
      setSelectedCategory(option.label)
      setOrder({ ...order, orderCategory: option.value })
      setShowCategoryDropdown(false)
    }
  }

  // Handle input changes for order state
  const handleChange = (field, value) => {
    setOrder({ ...order, [field]: value })
  }

  // Handle checkbox change for LD Applicable
  const handleLdApplicableChange = (checked) => {
    setLdApplicable(checked)
    setOrder({ ...order, ldApplicabel: checked ? "Y" : "N" })
  }

  // Handle dropdown selection for Order ID and Order Number
  const [showOrderIdDropdown, setShowOrderIdDropdown] = useState(false)
  const [showOrderNumberDropdown, setShowOrderNumberDropdown] = useState(false)
  const orderIdDropdownRef = useRef(null)
  const orderNumberDropdownRef = useRef(null)

  const handleOrderIdSelect = (option) => {
    setOrder({ ...order, orderId: option.value })
    setShowOrderIdDropdown(false)
  }

  const handleOrderNumberSelect = (option) => {
    setOrder({ ...order, orderNumber: option.value })
    setShowOrderNumberDropdown(false)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Create a copy of the order data for submission
      const orderData = { ...order }

      // Convert empty strings to null for numeric fields
      Object.keys(orderData).forEach((key) => {
        // If it's a numeric field and empty string, set to null
        if (
          (key.endsWith("Id") || key.includes("Amount") || key.includes("Price") || key.endsWith("N")) &&
          orderData[key] === ""
        ) {
          orderData[key] = null
        }
      })

      // Ensure orderId is provided and is a number
      if (!orderData.orderId) {
        alert("Order ID is required")
        return
      }

      // Convert orderId to number
      orderData.orderId = Number(orderData.orderId)

      console.log("Submitting order data:", orderData)

      const response = await axios.post("http://localhost:5577/api/orders", orderData)
      console.log("Server response:", response.data)
      alert("Order saved successfully")
    } catch (error) {
      console.error("Error saving order:", error)

      // Show more detailed error information
      let errorMessage = "Failed to save order"

      if (error.response) {
        // The server responded with an error status
        console.error("Server error data:", error.response.data)
        errorMessage += `: ${error.response.status} ${error.response.statusText}`

        if (error.response.data && error.response.data.message) {
          errorMessage += ` - ${error.response.data.message}`
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += ": No response from server"
      } else {
        // Something else caused the error
        errorMessage += `: ${error.message}`
      }

      alert(errorMessage)
    }
  }

  // Close date picker and dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(null)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
      if (orderIdDropdownRef.current && !orderIdDropdownRef.current.contains(event.target)) {
        setShowOrderIdDropdown(false)
      }
      if (orderNumberDropdownRef.current && !orderNumberDropdownRef.current.contains(event.target)) {
        setShowOrderNumberDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [datePickerRef, categoryDropdownRef, orderIdDropdownRef, orderNumberDropdownRef])

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Add Order</h1>
        <div className="order-actions">
          <button className="save-btn" onClick={handleSubmit}>
            <Save size={16} style={{ color: "black" }} />
            <span style={{ color: "black" }}>Save</span>
          </button>
          <button className="cancel-btn">
            <X size={16} style={{ color: "black" }} />
            <span style={{ color: "black" }}>Cancel</span>
          </button>
        </div>
      </div>

      <div className="order-tabs">
        <div
          className={`tab ${activeTab === "order-details" ? "active" : ""}`}
          onClick={() => handleTabClick("order-details")}
        >
          Order Details
        </div>
        <div
          className={`tab ${activeTab === "customer-details" ? "active" : ""}`}
          onClick={() => handleTabClick("customer-details")}
        >
          Customer Details
        </div>
        <div className={`tab ${activeTab === "billing" ? "active" : ""}`} onClick={() => handleTabClick("billing")}>
          Billing
        </div>
        <div
          className={`tab ${activeTab === "additional-attributes" ? "active" : ""}`}
          onClick={() => handleTabClick("additional-attributes")}
        >
          Additional Attributes
        </div>
      </div>

      {/* Order Details Tab */}
      {activeTab === "order-details" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">Order Information</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Order ID</label>
                <div className="custom-dropdown-wrapper" ref={orderIdDropdownRef}>
                  <div className="custom-dropdown-trigger" onClick={() => setShowOrderIdDropdown(!showOrderIdDropdown)}>
                    <span>{order.orderId || "Select Order ID"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showOrderIdDropdown && (
                    <div className="custom-dropdown-menu">
                      <div className="custom-dropdown-content">
                        {orderIdOptions.map((option, index) => (
                          <div key={index} className="custom-dropdown-item" onClick={() => handleOrderIdSelect(option)}>
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field-container">
                <label>Order Number</label>
                <div className="custom-dropdown-wrapper" ref={orderNumberDropdownRef}>
                  <div
                    className="custom-dropdown-trigger"
                    onClick={() => setShowOrderNumberDropdown(!showOrderNumberDropdown)}
                  >
                    <span>{order.orderNumber || "Select Order Number"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showOrderNumberDropdown && (
                    <div className="custom-dropdown-menu">
                      <div className="custom-dropdown-content">
                        {orderNumberOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item"
                            onClick={() => handleOrderNumberSelect(option)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Order Type</label>
                <div className="input-wrapper select-wrapper">
                  <select value={order.orderType} onChange={(e) => handleChange("orderType", e.target.value)}>
                    <option value="" disabled>
                      Select Order Type
                    </option>
                    <option value="standard">Standard</option>
                    <option value="blanket">Blanket</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container wide-field">
                <label>Order Categories</label>
                <div className="custom-dropdown-wrapper" ref={categoryDropdownRef}>
                  <div
                    className="custom-dropdown-trigger"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <span>{selectedCategory || "Select Category"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showCategoryDropdown && (
                    <div className="custom-dropdown-menu">
                      <div className="custom-dropdown-content">
                        {categoryOptions.map((option, index) => (
                          <div
                            key={index}
                            className={`custom-dropdown-item ${option.disabled ? "disabled" : ""}`}
                            onClick={() => handleCategorySelect(option)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label> Effective Start Date</label>
                <div className="input-wrapper date-input-wrapper">
                  <input
                    type="text"
                    placeholder="Select date"
                    value={dates.startDate}
                    readOnly
                    onClick={() => setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")}
                  />
                  <button
                    className="calendar-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")
                    }}
                  >
                    <Calendar size={14} />
                  </button>
                </div>
              </div>

              <div className="form-field-container">
                <label>Effective End Date</label>
                <div className="input-wrapper date-input-wrapper">
                  <input
                    type="text"
                    placeholder="Select date"
                    value={dates.endDate}
                    readOnly
                    onClick={() => setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")}
                  />
                  <button
                    className="calendar-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")
                    }}
                  >
                    <Calendar size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container checkbox-container">
                <label>LD Applicable</label>
                <div className="simple-checkbox">
                  <input
                    type="checkbox"
                    id="ld-applicable"
                    checked={ldApplicable}
                    onChange={(e) => handleLdApplicableChange(e.target.checked)}
                  />
                  <label htmlFor="ld-applicable"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Tab */}
      {activeTab === "customer-details" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">Bill to Customer</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Bill To Customer</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter customer ID"
                    value={order.billToCustomerId}
                    onChange={(e) => handleChange("billToCustomerId", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-container">
                <label>Bill to Site</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter site ID"
                    value={order.billToSiteId}
                    onChange={(e) => handleChange("billToSiteId", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Bill to Contact</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter contact ID"
                    value={order.billToContactId}
                    onChange={(e) => handleChange("billToContactId", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Sales Representative</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter sales rep name"
                    value={order.salesrep}
                    onChange={(e) => handleChange("salesrep", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">Billing Information</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Billing Frequency</label>
                <div className="input-wrapper select-wrapper">
                  <select
                    value={order.billingFrequency}
                    onChange={(e) => handleChange("billingFrequency", e.target.value)}
                  >
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Billing Cycle</label>
                <div className="input-wrapper select-wrapper">
                  <select value={order.billingCycle} onChange={(e) => handleChange("billingCycle", e.target.value)}>
                    <option value="" disabled>
                      Select Cycle
                    </option>
                    <option value="Start of Month">Start of Month</option>
                    <option value="Mid-Month">Mid-Month</option>
                    <option value="End of Month">End of Month</option>
                    <option value="Anniversary">Anniversary</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Attributes Tab */}
      {activeTab === "additional-attributes" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">String Attributes</h2>
            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 1 (String)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute1VName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {stringAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 2 (String)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute2VName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {stringAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 3 (String)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute3VName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {stringAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 4 (String)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute4VName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {stringAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 5 (String)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute5VName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {stringAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <h2 className="section-title">Numeric Attributes</h2>
            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 1 (Numeric)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute1NName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {numericAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 2 (Numeric)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute2NName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {numericAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 3 (Numeric)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute3NName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {numericAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 4 (Numeric)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute4NName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {numericAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 5 (Numeric)</label>
                <div className="input-wrapper select-wrapper">
                  <select onChange={(e) => handleChange("attribute5NName", e.target.value)}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {numericAttributeOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Date Picker Popup */}
      {showDatePicker && (
        <div className="date-picker-overlay">
          <div className="date-picker-modal" ref={datePickerRef}>
            <div className="calendar-header">
              {calendarView === "date" && (
                <>
                  <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                    <ChevronLeft size={16} />
                  </button>
                  <span onClick={handleMonthClick}>{calendarDate.toLocaleString("default", { month: "long" })}</span>
                  <span onClick={handleYearClick}>{calendarDate.getFullYear()}</span>
                  <button className="calendar-nav-btn" onClick={handleNextMonth}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {calendarView === "month" && (
                <>
                  <button className="calendar-nav-btn" onClick={handlePrevYear}>
                    <ChevronLeft size={16} />
                  </button>
                  <span onClick={handleYearClick}>{calendarDate.getFullYear()}</span>
                  <button className="calendar-nav-btn" onClick={handleNextYear}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {calendarView === "year" && (
                <>
                  <button
                    className="calendar-nav-btn"
                    onClick={() => {
                      setCalendarDate(new Date(calendarDate.getFullYear() - 12, calendarDate.getMonth(), 1))
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span>
                    {calendarDate.getFullYear() - 6} - {calendarDate.getFullYear() + 5}
                  </span>
                  <button
                    className="calendar-nav-btn"
                    onClick={() => {
                      setCalendarDate(new Date(calendarDate.getFullYear() + 12, calendarDate.getMonth(), 1))
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {calendarView === "date" && (
              <div className="calendar-days">
                <div className="weekday">Su</div>
                <div className="weekday">Mo</div>
                <div className="weekday">Tu</div>
                <div className="weekday">We</div>
                <div className="weekday">Th</div>
                <div className="weekday">Fr</div>
                <div className="weekday">Sa</div>
                {generateCalendar(showDatePicker)}
              </div>
            )}

            {(calendarView === "month" || calendarView === "year") && (
              <div className="calendar-grid">{generateCalendar(showDatePicker)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails;
