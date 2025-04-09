import { useState, useRef, useEffect } from "react"
import { Calendar, Save, X, ChevronDown } from "lucide-react"
import "../Design Component/OrderDetails.css";

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

  const categoryOptions = [
    {
      value: "",
      label: "Select Category",
      disabled: true,
    },
    {
      value: "a",
      label:
        "Category A - This is an extremely long option text that will definitely exceed the width of the dropdown and require horizontal scrolling to view completely. It contains detailed information about this specific category that users might need to reference.",
    },
    {
      value: "b",
      label:
        "Category B - Another very long description that extends beyond the visible area and requires horizontal scrolling. This text includes specifications, requirements, and other important details about Category B that are necessary for proper selection.",
    },
    {
      value: "c",
      label:
        "Category C - This option contains extensive information about Category C including its applications, limitations, and compatibility with other systems. The text is intentionally long to demonstrate horizontal scrolling functionality.",
    },
    {
      value: "d",
      label:
        "Category D - Extended information about this category with multiple sections including usage guidelines, pricing tiers, and implementation notes. This text is designed to test the horizontal scrolling capabilities of the dropdown.",
    },
    {
      value: "e",
      label:
        "Category E - This option includes a comprehensive description of Category E with technical specifications, compatibility information, and usage scenarios. The text extends well beyond the visible area to demonstrate scrolling.",
    },
    {
      value: "f",
      label:
        "Category F - Detailed information about Category F including historical context, development timeline, and future roadmap. This extensive text requires horizontal scrolling to view in its entirety.",
    },
  ]

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleDateSelect = (field, date) => {
    const formattedDate = formatDate(date)
    setDates({ ...dates, [field]: formattedDate })
    setShowDatePicker(null)
  }

  const formatDate = (date) => {
    const day = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear().toString().substr(-2)
    return `${day < 10 ? "0" + day : day}-${month}-${year}`
  }

  const generateCalendar = (field) => {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i)
      const isToday = i === today.getDate()
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

  const handleCategorySelect = (option) => {
    if (!option.disabled) {
      setSelectedCategory(option.label)
      setShowCategoryDropdown(false)
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
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [datePickerRef, categoryDropdownRef])

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Add Order</h1>
        <div className="order-actions">
          <button className="save-btn">
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
                <label>PO Number</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter PO number" />
                </div>
              </div>

              <div className="form-field-container">
                <label>PO Type</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select PO Type
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
                <label>Start Date</label>
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
                <label>End Date</label>
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
                    onChange={() => setLdApplicable(!ldApplicable)}
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
                <label>Bill To</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Customer
                    </option>
                    <option value="customer1">Wayne Enterprises</option>
                    <option value="customer2">Stark Industries</option>
                    <option value="customer3">Umbrella Corporation</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Location</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter customer ID" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Bill to Contact</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="corporate">Corporate</option>
                    <option value="individual">Individual</option>
                    <option value="government">Government</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Sales Representrative</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter billing address" />
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
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Frequency
                    </option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semiannual">Semi-Annual</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Billing Cycle</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Cycle
                    </option>
                    <option value="start">Start of Month</option>
                    <option value="mid">Mid-Month</option>
                    <option value="end">End of Month</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Payment Terms</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Terms
                    </option>
                    <option value="net15">Net 15</option>
                    <option value="net30">Net 30</option>
                    <option value="net45">Net 45</option>
                    <option value="net60">Net 60</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Payment Method</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Method
                    </option>
                    <option value="creditcard">Credit Card</option>
                    <option value="ach">ACH</option>
                    <option value="wire">Wire Transfer</option>
                    <option value="check">Check</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Invoice Template</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Template
                    </option>
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                    <option value="custom">Custom</option>
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
            <h2 className="section-title">Additional Attributes</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 1</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 2</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 3</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 4</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 5</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 6</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 7</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 8</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 9</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 10</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Value
                    </option>
                    <option value="value1">Value 1</option>
                    <option value="value2">Value 2</option>
                    <option value="value3">Value 3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Centered Date Picker Popup */}
      {showDatePicker && (
        <div className="date-picker-overlay">
          <div className="date-picker-modal" ref={datePickerRef}>
            <div className="calendar-header">
              <span>{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</span>
            </div>
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
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails;
