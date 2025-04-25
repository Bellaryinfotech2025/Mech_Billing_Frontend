"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Calendar, Search, Edit, Save, CheckCircle, ChevronDown } from 'lucide-react'
import axios from "axios"

const OrderNumberDetails = ({ order: initialOrder, onCancel, getLookupMeaning, formatDate }) => {
  const [activeTab, setActiveTab] = useState("order-details")
  const [isEditing, setIsEditing] = useState(false)
  const [order, setOrder] = useState(initialOrder || {})
  const [showToast, setShowToast] = useState(false)

  // Lookup values state
  const [lookupValues, setLookupValues] = useState({
    orderTypes: [],
    orderCategories: [],
    billingFrequencies: [],
    billingCycles: [],
  })
  const [loadingLookupValues, setLoadingLookupValues] = useState(true)

  // Selected dropdown values for display
  const [selectedOrderType, setSelectedOrderType] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBillingFrequency, setSelectedBillingFrequency] = useState("")
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("")

  // Dropdown visibility states
  const [showOrderTypeDropdown, setShowOrderTypeDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showBillingFrequencyDropdown, setShowBillingFrequencyDropdown] = useState(false)
  const [showBillingCycleDropdown, setShowBillingCycleDropdown] = useState(false)

  // Refs for dropdown click outside detection
  const orderTypeDropdownRef = useRef(null)
  const categoryDropdownRef = useRef(null)
  const billingFrequencyDropdownRef = useRef(null)
  const billingCycleDropdownRef = useRef(null)

  // API base URL - Using the correct base URL
  // const API_URL = "http://localhost:9955/api/V2.0"
  const API_URL = "http://195.35.45.56:5522/api/V2.0"
 
  useEffect(() => {
    setOrder(initialOrder || {})

    // Set selected values based on initialOrder and lookup meanings
    if (initialOrder) {
      setSelectedOrderType(getLookupMeaning("ORDER_TYPE", initialOrder.orderType) || "")
      setSelectedCategory(getLookupMeaning("ORDER_CATEGORY", initialOrder.orderCategory) || "")
      setSelectedBillingFrequency(getLookupMeaning("BILLING_FREQUENCY", initialOrder.billingFrequency) || "")
      setSelectedBillingCycle(getLookupMeaning("BILLING_CYCLE", initialOrder.billingCycle) || "")
    }
  }, [initialOrder, getLookupMeaning])

  // Fetch lookup values from the backend
  useEffect(() => {
    const fetchLookupValues = async () => {
      try {
        setLoadingLookupValues(true)
        const response = await axios.get(`${API_URL}/order-lookup-values`)

        if (response.data) {
          setLookupValues(response.data)
        }
      } catch (error) {
        console.error("Error fetching lookup values:", error)
      } finally {
        setLoadingLookupValues(false)
      }
    }

    fetchLookupValues()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (orderTypeDropdownRef.current && !orderTypeDropdownRef.current.contains(event.target)) {
        setShowOrderTypeDropdown(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
      if (billingFrequencyDropdownRef.current && !billingFrequencyDropdownRef.current.contains(event.target)) {
        setShowBillingFrequencyDropdown(false)
      }
      if (billingCycleDropdownRef.current && !billingCycleDropdownRef.current.contains(event.target)) {
        setShowBillingCycleDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [orderTypeDropdownRef, categoryDropdownRef, billingFrequencyDropdownRef, billingCycleDropdownRef])

  if (!order) return null

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    // Reset changes and exit edit mode
    setOrder(initialOrder)
    setSelectedOrderType(getLookupMeaning("ORDER_TYPE", initialOrder.orderType) || "")
    setSelectedCategory(getLookupMeaning("ORDER_CATEGORY", initialOrder.orderCategory) || "")
    setSelectedBillingFrequency(getLookupMeaning("BILLING_FREQUENCY", initialOrder.billingFrequency) || "")
    setSelectedBillingCycle(getLookupMeaning("BILLING_CYCLE", initialOrder.billingCycle) || "")
    setIsEditing(false)
    onCancel()
  }

  const handleInputChange = (field, value) => {
    setOrder({ ...order, [field]: value })
  }

  const handleCheckboxChange = (field, checked) => {
    setOrder({ ...order, [field]: checked ? "Y" : "N" })
  }

  // Handle dropdown selection for Order Type
  const handleOrderTypeSelect = (option) => {
    setSelectedOrderType(option.meaning)
    setOrder({ ...order, orderType: option.lookupCode })
    setShowOrderTypeDropdown(false)
  }

  // Handle dropdown selection for Order Category
  const handleCategorySelect = (option) => {
    setSelectedCategory(option.meaning)
    setOrder({ ...order, orderCategory: option.lookupCode })
    setShowCategoryDropdown(false)
  }

  // Handle dropdown selection for Billing Frequency
  const handleBillingFrequencySelect = (option) => {
    setSelectedBillingFrequency(option.meaning)
    setOrder({ ...order, billingFrequency: option.lookupCode })
    setShowBillingFrequencyDropdown(false)
  }

  // Handle dropdown selection for Billing Cycle
  const handleBillingCycleSelect = (option) => {
    setSelectedBillingCycle(option.meaning)
    setOrder({ ...order, billingCycle: option.lookupCode })
    setShowBillingCycleDropdown(false)
  }

  const handleSaveClick = async () => {
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

        // Convert string values to numbers for numeric attributes
        if (key.endsWith("N") && orderData[key] !== null && orderData[key] !== "") {
          // Try to convert to number
          const numValue = Number.parseFloat(orderData[key])
          if (!isNaN(numValue)) {
            orderData[key] = numValue
          } else {
            // If conversion fails, set to null
            orderData[key] = null
          }
        }
      })

      console.log("Submitting updated order data:", orderData)

      // Send the updated data to the backend - FIXED URL to match controller endpoint
      const response = await axios.put(`${API_URL}/update-order`, orderData)

      console.log("Server response:", response.data)

      if (response.data.status === "success") {
        // Show success toast
        setShowToast(true)

        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false)
        }, 3000)

        // Exit edit mode
        setIsEditing(false)
      } else {
        alert(response.data.message || "Failed to update order")
      }
    } catch (error) {
      console.error("Error updating order:", error)

      // Show more detailed error information
      let errorMessage = "Failed to update order"

      if (error.response) {
        console.error("Server error data:", error.response.data)
        errorMessage += `: ${error.response.status} ${error.response.statusText}`

        if (error.response.data && error.response.data.message) {
          errorMessage += ` - ${error.response.data.message}`
        }
      } else if (error.request) {
        errorMessage += ": No response from server"
      } else {
        errorMessage += `: ${error.message}`
      }

      alert(errorMessage)
    }
  }

  return (
    <div className="order-details-view-container">
      {/* Success Toast */}
      {showToast && (
        <div className="toast-container">
          <div className="toast success-toast">
            <CheckCircle size={20} />
            <span>Order updated successfully</span>
          </div>
        </div>
      )}

      <header className="order-details-view-header">
        <div className="header-left">
          <button className="back-button" onClick={onCancel}>
            <ArrowLeft size={18} />
            <span>Back to Orders</span>
          </button>
          <h1>Order: {order.orderNumber || "soheil_21"}</h1>
          {!isEditing && (
            <button className="edit-button" onClick={handleEditClick}>
              <Edit size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>
        <div className="header-right">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSaveClick}>
                <Save size={16} />
                <span>Save</span>
              </button>
              <button className="cancel-button" onClick={handleCancelClick}>
                Cancel
              </button>
            </>
          ) : (
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </header>

      <div className="order-details-tabs">
        <div
          className={`order-details-tab ${activeTab === "order-details" ? "active" : ""}`}
          onClick={() => setActiveTab("order-details")}
        >
          Order Details
        </div>
        <div
          className={`order-details-tab ${activeTab === "customer" ? "active" : ""}`}
          onClick={() => setActiveTab("customer")}
        >
          Customer and Contacts
        </div>
        <div
          className={`order-details-tab ${activeTab === "billing" ? "active" : ""}`}
          onClick={() => setActiveTab("billing")}
        >
          Billing Details
        </div>
        <div
          className={`order-details-tab ${activeTab === "additional" ? "active" : ""}`}
          onClick={() => setActiveTab("additional")}
        >
          Additional Info
        </div>
      </div>

      <div className="order-details-view-content">
        {activeTab === "order-details" && (
          <div className="order-details-form">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Order Number</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.orderNumber || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Order Type</label>
                <div className="form-field">
                  {isEditing ? (
                    <div className="custom-dropdown-wrapper" ref={orderTypeDropdownRef}>
                      <div
                        className="custom-dropdown-trigger form-select"
                        onClick={() => setShowOrderTypeDropdown(!showOrderTypeDropdown)}
                      >
                        <span>{selectedOrderType || "Select Order Type"}</span>
                        <ChevronDown size={16} className="dropdown-icon" />
                      </div>
                      {showOrderTypeDropdown && (
                        <div className="custom-dropdown-menu">
                          <div className="custom-dropdown-content">
                            {lookupValues.orderTypes &&
                              lookupValues.orderTypes.map((option, index) => (
                                <div
                                  key={index}
                                  className="custom-dropdown-item"
                                  onClick={() => handleOrderTypeSelect(option)}
                                >
                                  {option.meaning}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <select className="form-select" disabled>
                      <option>{getLookupMeaning("ORDER_TYPE", order.orderType) || "Draft"}</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Category</label>
                <div className="form-field">
                  {isEditing ? (
                    <div className="custom-dropdown-wrapper" ref={categoryDropdownRef}>
                      <div
                        className="custom-dropdown-trigger form-select"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        <span>{selectedCategory || "Select Category"}</span>
                        <ChevronDown size={16} className="dropdown-icon" />
                      </div>
                      {showCategoryDropdown && (
                        <div className="custom-dropdown-menu">
                          <div className="custom-dropdown-content">
                            {lookupValues.orderCategories &&
                              lookupValues.orderCategories.map((option, index) => (
                                <div
                                  key={index}
                                  className="custom-dropdown-item"
                                  onClick={() => handleCategorySelect(option)}
                                >
                                  {option.meaning}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <select className="form-select" disabled>
                      <option>{getLookupMeaning("ORDER_CATEGORY", order.orderCategory) || "Draft_Order"}</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">LD Applicable</label>
                <div className="form-field form-field-checkbox">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={order.ldApplicable === "Y"}
                    disabled={!isEditing}
                    onChange={(e) => handleCheckboxChange("ldApplicable", e.target.checked)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Start Date</label>
                <div className="form-field">
                  <div className="date-input">
                    <input
                      type="text"
                      className="form-input"
                      value={formatDate(order.effectiveStartDate) || "4/21/2025"}
                      readOnly={!isEditing}
                      onChange={(e) => handleInputChange("effectiveStartDate", e.target.value)}
                    />
                    <div className="date-input-icon">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">End Date</label>
                <div className="form-field">
                  <div className="date-input">
                    <input
                      type="text"
                      className="form-input"
                      value={formatDate(order.effectiveEndDate) || "6/18/2025"}
                      readOnly={!isEditing}
                      onChange={(e) => handleInputChange("effectiveEndDate", e.target.value)}
                    />
                    <div className="date-input-icon">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Description</label>
                <div className="form-field">
                  <textarea
                    className="form-textarea"
                    value={order.description || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Business Unit</label>
                <div className="form-field">
                  <select
                    className="form-select"
                    disabled={!isEditing}
                    value={order.businessUnit || ""}
                    onChange={(e) => handleInputChange("businessUnit", e.target.value)}
                  >
                    <option value="">{order.businessUnit || "Please select"}</option>
                    {/* Add more options if needed */}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Status</label>
                <div className="form-field">
                  <select
                    className="form-select"
                    disabled={!isEditing}
                    value={order.status || ""}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="">{order.status || "Draft"}</option>
                    {/* Add more options if needed */}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Currency</label>
                <div className="form-field">
                  <select
                    className="form-select"
                    disabled={!isEditing}
                    value={order.currency || ""}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                  >
                    <option value="">{order.currency || "Please Select"}</option>
                    {/* Add more options if needed */}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Total Value</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.totalValue || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("totalValue", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Reference Number</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.referenceNumber || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Price List</label>
                <div className="form-field">
                  <div className="search-input">
                    <input
                      type="text"
                      className="form-input"
                      value={order.priceList || ""}
                      readOnly={!isEditing}
                      onChange={(e) => handleInputChange("priceList", e.target.value)}
                    />
                    <div className="search-input-icon">
                      <Search size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customer" && (
          <div className="order-details-form">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Bill To Customer</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.billToCustomerId || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("billToCustomerId", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Bill To Site</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.billToSiteId || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("billToSiteId", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Bill To Contact</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.billToContactId || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("billToContactId", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Deliver To Customer</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.deliverToCustomerId || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("deliverToCustomerId", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Sales Representative</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.salesrep || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("salesrep", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="order-details-form">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Billing Frequency</label>
                <div className="form-field">
                  {isEditing ? (
                    <div className="custom-dropdown-wrapper" ref={billingFrequencyDropdownRef}>
                      <div
                        className="custom-dropdown-trigger form-select"
                        onClick={() => setShowBillingFrequencyDropdown(!showBillingFrequencyDropdown)}
                      >
                        <span>{selectedBillingFrequency || "Select Billing Frequency"}</span>
                        <ChevronDown size={16} className="dropdown-icon" />
                      </div>
                      {showBillingFrequencyDropdown && (
                        <div className="custom-dropdown-menu">
                          <div className="custom-dropdown-content">
                            {lookupValues.billingFrequencies &&
                              lookupValues.billingFrequencies.map((option, index) => (
                                <div
                                  key={index}
                                  className="custom-dropdown-item"
                                  onClick={() => handleBillingFrequencySelect(option)}
                                >
                                  {option.meaning}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <select className="form-select" disabled>
                      <option>
                        {getLookupMeaning("BILLING_FREQUENCY", order.billingFrequency) || "Please Select"}
                      </option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Billing Cycle</label>
                <div className="form-field">
                  {isEditing ? (
                    <div className="custom-dropdown-wrapper" ref={billingCycleDropdownRef}>
                      <div
                        className="custom-dropdown-trigger form-select"
                        onClick={() => setShowBillingCycleDropdown(!showBillingCycleDropdown)}
                      >
                        <span>{selectedBillingCycle || "Select Billing Cycle"}</span>
                        <ChevronDown size={16} className="dropdown-icon" />
                      </div>
                      {showBillingCycleDropdown && (
                        <div className="custom-dropdown-menu">
                          <div className="custom-dropdown-content">
                            {lookupValues.billingCycles &&
                              lookupValues.billingCycles.map((option, index) => (
                                <div
                                  key={index}
                                  className="custom-dropdown-item"
                                  onClick={() => handleBillingCycleSelect(option)}
                                >
                                  {option.meaning}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <select className="form-select" disabled>
                      <option>{getLookupMeaning("BILLING_CYCLE", order.billingCycle) || "Please Select"}</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "additional" && (
          <div className="order-details-form">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Attribute 1</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.attribute1V || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("attribute1V", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Attribute 2</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.attribute2V || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("attribute2V", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Attribute 3</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.attribute3V || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("attribute3V", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Numeric Attribute 1</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.attribute1N || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("attribute1N", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Numeric Attribute 2</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.attribute2N || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("attribute2N", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Numeric Attribute 3</label>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    value={order.attribute3N || ""}
                    readOnly={!isEditing}
                    onChange={(e) => handleInputChange("attribute3N", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderNumberDetails;