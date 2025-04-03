"use client"

import { useState, useRef, useEffect } from "react"
import "../Design Component/OrderDetails.css"
import { Calendar } from "lucide-react"

const OrderDetails = () => {
  const [activeTab, setActiveTab] = useState("order-details")
  const [showDatePicker, setShowDatePicker] = useState(null)
  const [dates, setDates] = useState({
    bookedDate: "",
    startDate: "05-Mar-15",
    endDate: "04-Mar-20",
  })
  const datePickerRef = useRef(null)

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

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [datePickerRef])

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Add Order</h1>
        <div className="order-actions">
          <button className="save-btn">Save</button>
          <button className="cancel-btn">Cancel</button>
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
          className={`tab ${activeTab === "customer-contacts" ? "active" : ""}`}
          onClick={() => handleTabClick("customer-contacts")}
        >
          Customer and Contacts
        </div>
        <div
          className={`tab ${activeTab === "billing-details" ? "active" : ""}`}
          onClick={() => handleTabClick("billing-details")}
        >
          Billing Details
        </div>
        <div
          className={`tab ${activeTab === "fulfillment-renewal" ? "active" : ""}`}
          onClick={() => handleTabClick("fulfillment-renewal")}
        >
          Service Details
        </div>
        
        <div
          className={`tab ${activeTab === "additional-info" ? "active" : ""}`}
          onClick={() => handleTabClick("additional-info")}
        >
          Additional Info
        </div>
      </div>

      {/* Order Details Tab */}
      {activeTab === "order-details" && (
        <div className="order-form">
          <div className="form-grid">
            <div className="form-label">PO Number</div>
            <div className="form-field">
              <input type="text" value="NN-A" readOnly />
            </div>

            <div className="form-label">PO Type</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="US1 Business Unit">
                  <option>US1 Business Unit</option>
                  <option>US2 Business Unit</option>
                  <option>EU Business Unit</option>
                </select>
              </div>
            </div>

            

             

             

             

            <div className="form-label">Evergreen</div>
            <div className="form-field">
              <div className="checkbox-wrapper">
                <input type="checkbox" id="evergreen" />
                <label htmlFor="evergreen" className="checkbox-label"></label>
              </div>
            </div>

            <div className="form-label">Booked Date</div>
            <div className="form-field">
              <div className="date-input-wrapper">
                <input
                  type="text"
                  placeholder="Select date"
                  value={dates.bookedDate}
                  readOnly
                  onClick={() => setShowDatePicker(showDatePicker === "bookedDate" ? null : "bookedDate")}
                />
                <button
                  className="calendar-btn"
                  onClick={() => setShowDatePicker(showDatePicker === "bookedDate" ? null : "bookedDate")}
                >
                  <Calendar size={16} />
                </button>
                {showDatePicker === "bookedDate" && (
                  <div className="date-picker" ref={datePickerRef}>
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
                      {generateCalendar("bookedDate")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-label">Start Date</div>
            <div className="form-field">
              <div className="date-input-wrapper">
                <input
                  type="text"
                  value={dates.startDate}
                  readOnly
                  onClick={() => setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")}
                />
                <button
                  className="calendar-btn"
                  onClick={() => setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")}
                >
                  <Calendar size={16} />
                </button>
                {showDatePicker === "startDate" && (
                  <div className="date-picker" ref={datePickerRef}>
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
                      {generateCalendar("startDate")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-label">Price List</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>

            <div className="form-label">End Date</div>
            <div className="form-field">
              <div className="date-input-wrapper">
                <input
                  type="text"
                  value={dates.endDate}
                  readOnly
                  onClick={() => setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")}
                />
                <button
                  className="calendar-btn"
                  onClick={() => setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")}
                >
                  <Calendar size={16} />
                </button>
                {showDatePicker === "endDate" && (
                  <div className="date-picker" ref={datePickerRef}>
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
                      {generateCalendar("endDate")}
                    </div>
                  </div>
                )}
              </div>
            </div>

             

            

            

             

            <div className="form-label">Source</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="Manual">
                  <option>Manual</option>
                  <option>Import</option>
                  <option>API</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer and Contacts Tab */}
      {activeTab === "customer-contacts" && (
        <div className="order-form">
          <div className="form-grid">
            <div className="form-label">Customer Name</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Acme Corporation</option>
                  <option>Globex Industries</option>
                  <option>Wayne Enterprises</option>
                </select>
              </div>
            </div>

            <div className="form-label">Customer Type</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Corporate</option>
                  <option>Individual</option>
                  <option>Government</option>
                </select>
              </div>
            </div>

            <div className="form-label">Primary Contact</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>John Smith</option>
                  <option>Jane Doe</option>
                  <option>Robert Johnson</option>
                </select>
              </div>
            </div>

            <div className="form-label">Contact Email</div>
            <div className="form-field">
              <input type="email" placeholder="email@example.com" />
            </div>

            <div className="form-label">Contact Phone</div>
            <div className="form-field">
              <input type="text" placeholder="+1 (555) 123-4567" />
            </div>

            <div className="form-label">Customer ID</div>
            <div className="form-field">
              <input type="text" value="CUST-10045" readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Billing Details Tab */}
      {activeTab === "billing-details" && (
        <div className="order-form">
          <div className="form-grid">
            <div className="form-label">Billing Frequency</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Semi-Annual</option>
                  <option>Annual</option>
                </select>
              </div>
            </div>

            <div className="form-label">Billing Cycle</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Start of Month</option>
                  <option>End of Month</option>
                  <option>Anniversary</option>
                </select>
              </div>
            </div>

            <div className="form-label">Payment Terms</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Net 15</option>
                  <option>Net 30</option>
                  <option>Net 45</option>
                  <option>Net 60</option>
                </select>
              </div>
            </div>

            <div className="form-label">Payment Method</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Credit Card</option>
                  <option>ACH</option>
                  <option>Wire Transfer</option>
                  <option>Check</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fulfillment and Renewal Tab */}
      {activeTab === "fulfillment-renewal" && (
        <div className="order-form">
          <div className="form-grid">
            <div className="form-label">Line NUmber</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Digital</option>
                  <option>Physical</option>
                  <option>Service</option>
                </select>
              </div>
            </div>

            <div className="form-label">Service Code</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="form-label">Service Name </div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="form-label">QTY</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="form-label">UP</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="form-label">TM</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="form-label">Start Date</div>
            <div className="form-field">
              <div className="date-input-wrapper">
                <input
                  type="text"
                  value={dates.startDate}
                  readOnly
                  onClick={() => setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")}
                />
                <button
                  className="calendar-btn"
                  onClick={() => setShowDatePicker(showDatePicker === "startDate" ? null : "startDate")}
                >
                  <Calendar size={16} />
                </button>
                {showDatePicker === "startDate" && (
                  <div className="date-picker" ref={datePickerRef}>
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
                      {generateCalendar("startDate")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-label">End Date</div>
            <div className="form-field">
              <div className="date-input-wrapper">
                <input
                  type="text"
                  value={dates.endDate}
                  readOnly
                  onClick={() => setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")}
                />
                <button
                  className="calendar-btn"
                  onClick={() => setShowDatePicker(showDatePicker === "endDate" ? null : "endDate")}
                >
                  <Calendar size={16} />
                </button>
                {showDatePicker === "endDate" && (
                  <div className="date-picker" ref={datePickerRef}>
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
                      {generateCalendar("endDate")}
                    </div>
                  </div>
                )}
              </div>
            </div>

             

            

             
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="order-form">
          <div className="form-grid">
            <div className="form-label">Pricing Model</div>
            <div className="form-field">
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option>Fixed</option>
                  <option>Usage-based</option>
                  <option>Tiered</option>
                </select>
              </div>
            </div>

            <div className="form-label">Discount (%)</div>
            <div className="form-field">
              <input type="number" placeholder="0" />
            </div>

            <div className="form-label">Tax Rate (%)</div>
            <div className="form-field">
              <input type="number" placeholder="0" />
            </div>

            <div className="form-label">Tax Exempt</div>
            <div className="form-field">
              <div className="checkbox-wrapper">
                <input type="checkbox" id="tax-exempt" />
                <label htmlFor="tax-exempt" className="checkbox-label"></label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info Tab */}
      {activeTab === "additional-info" && (
        <div className="order-form">
          <div className="form-grid">
            <div className="form-label">Notes</div>
            <div className="form-field">
              <textarea rows="3" placeholder="Enter any additional notes here..."></textarea>
            </div>

            <div className="form-label">Reference Number</div>
            <div className="form-field">
              <input type="text" placeholder="Enter reference number" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails;

