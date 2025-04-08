"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Plus, Save, X } from "lucide-react"
import "../Design Component/OrderDetails.css";

const OrderDetails = () => {
  const [activeTab, setActiveTab] = useState("order-details")
  const [showDatePicker, setShowDatePicker] = useState(null)
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
    serviceStartDate: "",
    serviceEndDate: "",
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
          <button className="save-btn">
            <Save size={16} />
            <span>Save</span>
          </button>
          <button className="cancel-btn">
            <X size={16} />
            <span>Cancel</span>
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
          className={`tab ${activeTab === "additional-info" ? "active" : ""}`}
          onClick={() => handleTabClick("additional-info")}
        >
          Additional Info
        </div>
        <div
          className={`tab ${activeTab === "service-details" ? "active" : ""}`}
          onClick={() => handleTabClick("service-details")}
        >
          Service Details
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

             

            <div className="form-row">
               

              
              
            </div>
            <div className="form-field-container">
            <label> LD Applicable </label>
            <input type="checkbox"/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label> Order Categories </label>
            <input type="checkbox"/>
            </div>

          </div>
          
        </div>
      )}

      {/* Customer Details Tab */}
      {activeTab === "customer-details" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">Vendor Details</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Vendor Name</label>
                <div className="input-wrapper select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Vendor
                    </option>
                    <option value="vendor1">Acme Corporation</option>
                    <option value="vendor2">Globex Industries</option>
                    <option value="vendor3">Initech LLC</option>
                  </select>
                </div>
              </div>

              <div className="form-field-container">
                <label>Vendor ID</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter vendor ID" />
                </div>
              </div>

              <div className="form-field-container">
                <label>Vendor Contact</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter contact name" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Vendor Email</label>
                <div className="input-wrapper">
                  <input type="email" placeholder="Enter email address" />
                </div>
              </div>

              <div className="form-field-container">
                <label>Vendor Phone</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter phone number" />
                </div>
              </div>

              <div className="form-field-container">
                <label>Vendor Address</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter address" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Bill to Customer</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Customer Name</label>
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
                <label>Customer ID</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter customer ID" />
                </div>
              </div>

              <div className="form-field-container">
                <label>Customer Type</label>
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
                <label>Billing Address</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter billing address" />
                </div>
              </div>

              <div className="form-field-container">
                <label>Shipping Address</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter shipping address" />
                </div>
              </div>

              <div className="form-field-container checkbox-container">
                <label>Same as Billing</label>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="same-address" />
                  <label htmlFor="same-address" className="checkbox-label"></label>
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
            </div>

            <div className="form-row">
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

              <div className="form-field-container checkbox-container">
                <label>PO Required</label>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="po-required" />
                  <label htmlFor="po-required" className="checkbox-label"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info Tab */}
      {activeTab === "additional-info" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">Additional Attributes</h2>

            <div className="form-row">
              <div className="form-field-container">
                <label>Attribute 1</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter attribute value" />
                </div>
              </div>

              <div className="form-field-container">
                <label>Attribute 2</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Enter attribute value" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-container">
                <label>Notes</label>
                <div className="input-wrapper">
                  <textarea rows="3" placeholder="Enter any additional notes here..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Tab */}
      {activeTab === "service-details" && (
        <div className="order-form">
          <div className="form-section">
            <h2 className="section-title">Service Information</h2>
            <div className="service-header">
              <h3>Service Line Items</h3>
              <button className="add-service-btn">
                <Plus size={14} />
                <span>Add Service</span>
              </button>
            </div>

            <div className="service-item">
              <div className="form-row">
                <div className="form-field-container">
                  <label>Line Number</label>
                  <div className="input-wrapper">
                    <input type="text" value="1" readOnly />
                  </div>
                </div>

                <div className="form-field-container">
                  <label>Service Name</label>
                  <div className="input-wrapper select-wrapper">
                    <select defaultValue="">
                      <option value="" disabled>
                        Select Service
                      </option>
                      <option value="service1">Cloud Storage</option>
                      <option value="service2">Data Processing</option>
                      <option value="service3">API Access</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-container">
                  <label>Service Code</label>
                  <div className="input-wrapper">
                    <input type="text" placeholder="Enter service code" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field-container">
                  <label>Quantity</label>
                  <div className="input-wrapper">
                    <input type="number" placeholder="Enter quantity" min="1" />
                  </div>
                </div>

                <div className="form-field-container">
                  <label>UP (Unit Price)</label>
                  <div className="input-wrapper">
                    <input type="number" placeholder="Enter unit price" min="0" step="0.01" />
                  </div>
                </div>

                <div className="form-field-container">
                  <label>TM (Term Multiplier)</label>
                  <div className="input-wrapper">
                    <input type="number" placeholder="Enter term multiplier" min="1" />
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
                      value={dates.serviceStartDate}
                      readOnly
                      onClick={() =>
                        setShowDatePicker(showDatePicker === "serviceStartDate" ? null : "serviceStartDate")
                      }
                    />
                    <button
                      className="calendar-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDatePicker(showDatePicker === "serviceStartDate" ? null : "serviceStartDate")
                      }}
                    >
                      <Calendar size={14} />
                    </button>
                    {showDatePicker === "serviceStartDate" && (
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
                          {generateCalendar("serviceStartDate")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field-container">
                  <label>End Date</label>
                  <div className="input-wrapper date-input-wrapper">
                    <input
                      type="text"
                      placeholder="Select date"
                      value={dates.serviceEndDate}
                      readOnly
                      onClick={() => setShowDatePicker(showDatePicker === "serviceEndDate" ? null : "serviceEndDate")}
                    />
                    <button
                      className="calendar-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDatePicker(showDatePicker === "serviceEndDate" ? null : "serviceEndDate")
                      }}
                    >
                      <Calendar size={14} />
                    </button>
                    {showDatePicker === "serviceEndDate" && (
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
                          {generateCalendar("serviceEndDate")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                 
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails;
