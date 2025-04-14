"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Save, X, ChevronDown, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import "../Mech Lines Design/linesaddparent.css"

// Update the component to accept onAddChildClick prop
const LinesAddParent = ({ onCancel }) => {
  const [activeTab, setActiveTab] = useState("product-details")
  const [showDatePicker, setShowDatePicker] = useState(null)
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  })
  const [isParent, setIsParent] = useState(false)
  const [showBillingFrequencyDropdown, setShowBillingFrequencyDropdown] = useState(false)
  const [showBillingChannelDropdown, setShowBillingChannelDropdown] = useState(false)
  const [selectedBillingFrequency, setSelectedBillingFrequency] = useState("")
  const [selectedBillingChannel, setSelectedBillingChannel] = useState("")
  const datePickerRef = useRef(null)
  const billingFrequencyDropdownRef = useRef(null)
  const billingChannelDropdownRef = useRef(null)

  // Toast notification state
  const [showToast, setShowToast] = useState(false)

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState("date") // "date", "month", "year"

  // Billing calculation state
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [total, setTotal] = useState("")

  // Customer details dropdown states
  const [showBillToCustomerDropdown, setShowBillToCustomerDropdown] = useState(false)
  const [showBillToSiteDropdown, setShowBillToSiteDropdown] = useState(false)
  const [showBillToContactDropdown, setShowBillToContactDropdown] = useState(false)
  const billToCustomerRef = useRef(null)
  const billToSiteRef = useRef(null)
  const billToContactRef = useRef(null)

  // Initial line state
  const [line, setLine] = useState({
    lineNumber: "",
    serviceName: "",
    startDate: null,
    endDate: null,
    isParent: false,
    billToCustomerId: "",
    billToSiteId: "",
    billToContactId: "",
    salesrep: "",
    quantity: "",
    unitPrice: "",
    uom: "",
    total: "",
    billingFrequency: "",
    billingChannel: "",
  })

  // Customer details options
  const billToCustomerOptions = [
    { value: "001", label: "001" },
    { value: "002", label: "002" },
    { value: "003", label: "003" },
    { value: "004", label: "004" },
    { value: "CUST005", label: "005" },
  ]

  const billToSiteOptions = [
    { value: "001", label: "001" },
    { value: "002", label: "002" },
    { value: "003", label: "003" },
    { value: "004", label: "004" },
    { value: "005", label: "005" },
  ]

  const billToContactOptions = [
    { value: "001", label: " 001" },
    { value: "002", label: " 002" },
    { value: "003", label: " 003" },
    { value: "004", label: " 004" },
    { value: "005", label: "005" },
  ]

  // Billing frequency options
  const billingFrequencyOptions = [
    { value: "MONTHLY", label: "Monthly" },
    { value: "QUARTERLY", label: "Quarterly" },
    { value: "HALF_YEARLY", label: "Half Yearly" },
    { value: "YEARLY", label: "Yearly" },
    { value: "ONE_TIME", label: "One Time" },
  ]

  // Billing channel options
  const billingChannelOptions = [
    { value: "EMAIL", label: "Email" },
    { value: "MAIL", label: "Mail" },
    { value: "PORTAL", label: "Portal" },
    { value: "IN_PERSON", label: "In Person" },
  ]

  // UOM options
  const uomOptions = [
    { value: "EA", label: "Each (EA)" },
    { value: "HR", label: "Hour (HR)" },
    { value: "DAY", label: "Day (DAY)" },
    { value: "MTH", label: "Month (MTH)" },
    { value: "YR", label: "Year (YR)" },
  ]

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    let toastTimer
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false)
      }, 2000)
    }
    return () => {
      clearTimeout(toastTimer)
    }
  }, [showToast])

  // Calculate total when quantity or unit price changes
  useEffect(() => {
    if (quantity && unitPrice) {
      const calculatedTotal = Number.parseFloat(quantity) * Number.parseFloat(unitPrice)
      setTotal(calculatedTotal.toFixed(2))
      setLine((prev) => ({ ...prev, total: calculatedTotal.toFixed(2) }))
    } else {
      setTotal("")
      setLine((prev) => ({ ...prev, total: "" }))
    }
  }, [quantity, unitPrice])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleDateSelect = (field, date) => {
    const formattedDate = formatDate(date)
    setDates({ ...dates, [field]: formattedDate })

    // Update the line state
    if (field === "startDate") {
      setLine({ ...line, startDate: date.toISOString().split("T")[0] })
    } else if (field === "endDate") {
      setLine({ ...line, endDate: date.toISOString().split("T")[0] })
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
      days.push(<div key={`empty-${i}`} className="calendar-day-kh-addparent empty-kh-addparent"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day-kh-addparent ${isToday ? "today-kh-addparent" : ""}`}
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
      <div className="calendar-months-kh-addparent">
        {months.map((month, index) => (
          <div key={month} className="calendar-month-kh-addparent" onClick={() => handleMonthSelect(index)}>
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
        <div key={year} className="calendar-year-kh-addparent" onClick={() => handleYearSelect(year)}>
          {year}
        </div>,
      )
    }

    return <div className="calendar-years-kh-addparent">{years}</div>
  }

  // Handle dropdown selection for Billing Frequency
  const handleBillingFrequencySelect = (option) => {
    setSelectedBillingFrequency(option.label)
    setLine({ ...line, billingFrequency: option.value })
    setShowBillingFrequencyDropdown(false)
  }

  // Handle dropdown selection for Billing Channel
  const handleBillingChannelSelect = (option) => {
    setSelectedBillingChannel(option.label)
    setLine({ ...line, billingChannel: option.value })
    setShowBillingChannelDropdown(false)
  }

  // Handle UOM selection
  const [showUOMDropdown, setShowUOMDropdown] = useState(false)
  const uomDropdownRef = useRef(null)
  const [selectedUOM, setSelectedUOM] = useState("")

  const handleUOMSelect = (option) => {
    setSelectedUOM(option.label)
    setLine({ ...line, uom: option.value })
    setShowUOMDropdown(false)
  }

  // Handle input changes for line state
  const handleChange = (field, value) => {
    setLine({ ...line, [field]: value })

    // Update quantity and unitPrice state for calculation
    if (field === "quantity") {
      setQuantity(value)
    } else if (field === "unitPrice") {
      setUnitPrice(value)
    }
  }

  // Handle checkbox change for Parent
  const handleParentChange = (checked) => {
    setIsParent(checked)
    setLine({ ...line, isParent: checked })
  }

  // Handle customer details dropdown selections
  const handleBillToCustomerSelect = (option) => {
    setLine({ ...line, billToCustomerId: option.value })
    setShowBillToCustomerDropdown(false)
  }

  const handleBillToSiteSelect = (option) => {
    setLine({ ...line, billToSiteId: option.value })
    setShowBillToSiteDropdown(false)
  }

  const handleBillToContactSelect = (option) => {
    setLine({ ...line, billToContactId: option.value })
    setShowBillToContactDropdown(false)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting line data:", line)
    setShowToast(true)

    // After showing success toast, you might want to return to the LinesDatabaseSearch view
    // Uncomment the following line if you want to automatically go back after saving
    // setTimeout(() => onCancel(), 2000);
  }

  // Handle cancel button click
  const handleCancelClick = () => {
    if (onCancel) {
      onCancel()
    }
  }

  // Close date picker and dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(null)
      }
      if (billingFrequencyDropdownRef.current && !billingFrequencyDropdownRef.current.contains(event.target)) {
        setShowBillingFrequencyDropdown(false)
      }
      if (billingChannelDropdownRef.current && !billingChannelDropdownRef.current.contains(event.target)) {
        setShowBillingChannelDropdown(false)
      }
      if (uomDropdownRef.current && !uomDropdownRef.current.contains(event.target)) {
        setShowUOMDropdown(false)
      }
      if (billToCustomerRef.current && !billToCustomerRef.current.contains(event.target)) {
        setShowBillToCustomerDropdown(false)
      }
      if (billToSiteRef.current && !billToSiteRef.current.contains(event.target)) {
        setShowBillToSiteDropdown(false)
      }
      if (billToContactRef.current && !billToContactRef.current.contains(event.target)) {
        setShowBillToContactDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [
    datePickerRef,
    billingFrequencyDropdownRef,
    billingChannelDropdownRef,
    uomDropdownRef,
    billToCustomerRef,
    billToSiteRef,
    billToContactRef,
  ])

  return (
    <div className="bodyoflines">
    <div className="order-details-container-kh-addparent">
      {/* Success Toast */}
      {showToast && (
        <div className="toast-container-kh-addparent">
          <div className="toast-kh-addparent success-toast-kh-addparent">
            <CheckCircle size={20} />
            <span>Line created successfully</span>
          </div>
        </div>
      )}

      {/* Find the order-header-kh-addparent div and add an Add Child button */}
      <div className="order-header-kh-addparent">
        <h1>Add Parent</h1>
        <div className="order-actions-kh-addparent">
          <button className="save-btn-kh-addparent" onClick={handleSubmit}>
            <Save size={16} />
            <span>Save</span>
          </button>
          <button className="cancel-btn-kh-addparent" onClick={handleCancelClick}>
            <X size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <div className="order-tabs-kh-addparent">
        <div
          className={`tab-kh-addparent ${activeTab === "product-details" ? "active-kh-addparent" : ""}`}
          onClick={() => handleTabClick("product-details")}
        >
          Product Details
        </div>
        <div
          className={`tab-kh-addparent ${activeTab === "customer-details" ? "active-kh-addparent" : ""}`}
          onClick={() => handleTabClick("customer-details")}
        >
          Customer Details
        </div>
        <div
          className={`tab-kh-addparent ${activeTab === "billing" ? "active-kh-addparent" : ""}`}
          onClick={() => handleTabClick("billing")}
        >
          Billing
        </div>
      </div>

      {/* Product Details Tab */}
      {activeTab === "product-details" && (
        <div className="order-form-kh-addparent">
          <div className="form-section-kh-addparent">
            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Line Number</label>
                <div className="input-wrapper-kh-addparent">
                  <input
                    type="text"
                    placeholder="Enter line number"
                    value={line.lineNumber}
                    onChange={(e) => handleChange("lineNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>Service Name</label>
                <div className="input-wrapper-kh-addparent">
                  <input
                    type="text"
                    placeholder="Enter service name"
                    value={line.serviceName}
                    onChange={(e) => handleChange("serviceName", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Start Date</label>
                <div className="input-wrapper-kh-addparent date-input-wrapper-kh-addparent">
                  <input
                    type="text"
                    placeholder="Select date"
                    value={dates.startDate}
                    readOnly
                    onClick={() => setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")}
                  />
                  <button
                    className="calendar-btn-kh-addparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")
                    }}
                  >
                    <Calendar size={14} />
                  </button>
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>End Date</label>
                <div className="input-wrapper-kh-addparent date-input-wrapper-kh-addparent">
                  <input
                    type="text"
                    placeholder="Select date"
                    value={dates.endDate}
                    readOnly
                    onClick={() => setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")}
                  />
                  <button
                    className="calendar-btn-kh-addparent"
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

            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Parent</label>
                <div className="checkbox-wrapper-kh-addparent">
                  <input
                    type="checkbox"
                    id="isParent"
                    checked={isParent}
                    onChange={(e) => handleParentChange(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Tab */}
      {activeTab === "customer-details" && (
        <div className="order-form-kh-addparent">
          <div className="form-section-kh-addparent">
            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Customer details</label>
                <div className="custom-dropdown-wrapper-kh-addparent" ref={billToCustomerRef}>
                  <div
                    className="custom-dropdown-trigger-kh-addparent"
                    onClick={() => setShowBillToCustomerDropdown(!showBillToCustomerDropdown)}
                  >
                    <span>{line.billToCustomerId || "Select Customer"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showBillToCustomerDropdown && (
                    <div className="custom-dropdown-menu-kh-addparent">
                      <div className="custom-dropdown-content-kh-addparent">
                        {billToCustomerOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item-kh-addparent"
                            onClick={() => handleBillToCustomerSelect(option)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>Bill to Site</label>
                <div className="custom-dropdown-wrapper-kh-addparent" ref={billToSiteRef}>
                  <div
                    className="custom-dropdown-trigger-kh-addparent"
                    onClick={() => setShowBillToSiteDropdown(!showBillToSiteDropdown)}
                  >
                    <span>{line.billToSiteId || "Select Site"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showBillToSiteDropdown && (
                    <div className="custom-dropdown-menu-kh-addparent">
                      <div className="custom-dropdown-content-kh-addparent">
                        {billToSiteOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item-kh-addparent"
                            onClick={() => handleBillToSiteSelect(option)}
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

            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Bill to Contact</label>
                <div className="custom-dropdown-wrapper-kh-addparent" ref={billToContactRef}>
                  <div
                    className="custom-dropdown-trigger-kh-addparent"
                    onClick={() => setShowBillToContactDropdown(!showBillToContactDropdown)}
                  >
                    <span>{line.billToContactId || "Select Contact"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showBillToContactDropdown && (
                    <div className="custom-dropdown-menu-kh-addparent">
                      <div className="custom-dropdown-content-kh-addparent">
                        {billToContactOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item-kh-addparent"
                            onClick={() => handleBillToContactSelect(option)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>Sales Representative</label>
                <div className="input-wrapper-kh-addparent">
                  <input
                    type="text"
                    placeholder="Enter sales rep name"
                    value={line.salesrep}
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
        <div className="order-form-kh-addparent">
          <div className="form-section-kh-addparent">
            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Quantity</label>
                <div className="input-wrapper-kh-addparent">
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>Unit Price</label>
                <div className="input-wrapper-kh-addparent">
                  <input
                    type="number"
                    placeholder="Enter unit price"
                    value={unitPrice}
                    onChange={(e) => handleChange("unitPrice", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>UOM</label>
                <div className="custom-dropdown-wrapper-kh-addparent" ref={uomDropdownRef}>
                  <div
                    className="custom-dropdown-trigger-kh-addparent"
                    onClick={() => setShowUOMDropdown(!showUOMDropdown)}
                  >
                    <span>{selectedUOM || "Select UOM"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showUOMDropdown && (
                    <div className="custom-dropdown-menu-kh-addparent">
                      <div className="custom-dropdown-content-kh-addparent">
                        {uomOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item-kh-addparent"
                            onClick={() => handleUOMSelect(option)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>Total</label>
                <div className="input-wrapper-kh-addparent">
                  <input type="text" placeholder="Calculated total" value={total} readOnly />
                </div>
              </div>
            </div>

            <div className="form-row-kh-addparent">
              <div className="form-field-container-kh-addparent">
                <label>Billing Frequency</label>
                <div className="custom-dropdown-wrapper-kh-addparent" ref={billingFrequencyDropdownRef}>
                  <div
                    className="custom-dropdown-trigger-kh-addparent"
                    onClick={() => setShowBillingFrequencyDropdown(!showBillingFrequencyDropdown)}
                  >
                    <span>{selectedBillingFrequency || "Select Billing Frequency"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showBillingFrequencyDropdown && (
                    <div className="custom-dropdown-menu-kh-addparent">
                      <div className="custom-dropdown-content-kh-addparent">
                        {billingFrequencyOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item-kh-addparent"
                            onClick={() => handleBillingFrequencySelect(option)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field-container-kh-addparent">
                <label>Billing Channel</label>
                <div className="custom-dropdown-wrapper-kh-addparent" ref={billingChannelDropdownRef}>
                  <div
                    className="custom-dropdown-trigger-kh-addparent"
                    onClick={() => setShowBillingChannelDropdown(!showBillingChannelDropdown)}
                  >
                    <span>{selectedBillingChannel || "Select Billing Channel"}</span>
                    <ChevronDown size={16} />
                  </div>

                  {showBillingChannelDropdown && (
                    <div className="custom-dropdown-menu-kh-addparent">
                      <div className="custom-dropdown-content-kh-addparent">
                        {billingChannelOptions.map((option, index) => (
                          <div
                            key={index}
                            className="custom-dropdown-item-kh-addparent"
                            onClick={() => handleBillingChannelSelect(option)}
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
          </div>
        </div>
      )}

      {/* Enhanced Date Picker Popup */}
      {showDatePicker && (
        <div className="date-picker-overlay-kh-addparent">
          <div className="date-picker-modal-kh-addparent" ref={datePickerRef}>
            <div className="calendar-header-kh-addparent">
              {calendarView === "date" && (
                <>
                  <button className="calendar-nav-btn-kh-addparent" onClick={handlePrevMonth}>
                    <ChevronLeft size={16} />
                  </button>
                  <span onClick={handleMonthClick}>{calendarDate.toLocaleString("default", { month: "long" })}</span>
                  <span onClick={handleYearClick}>{calendarDate.getFullYear()}</span>
                  <button className="calendar-nav-btn-kh-addparent" onClick={handleNextMonth}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {calendarView === "month" && (
                <>
                  <button className="calendar-nav-btn-kh-addparent" onClick={handlePrevYear}>
                    <ChevronLeft size={16} />
                  </button>
                  <span onClick={handleYearClick}>{calendarDate.getFullYear()}</span>
                  <button className="calendar-nav-btn-kh-addparent" onClick={handleNextYear}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {calendarView === "year" && (
                <>
                  <button
                    className="calendar-nav-btn-kh-addparent"
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
                    className="calendar-nav-btn-kh-addparent"
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
              <div className="calendar-days-kh-addparent">
                <div className="weekday-kh-addparent">Su</div>
                <div className="weekday-kh-addparent">Mo</div>
                <div className="weekday-kh-addparent">Tu</div>
                <div className="weekday-kh-addparent">We</div>
                <div className="weekday-kh-addparent">Th</div>
                <div className="weekday-kh-addparent">Fr</div>
                <div className="weekday-kh-addparent">Sa</div>
                {generateCalendar(showDatePicker)}
              </div>
            )}

            {(calendarView === "month" || calendarView === "year") && (
              <div className="calendar-grid-kh-addparent">{generateCalendar(showDatePicker)}</div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default LinesAddParent;
