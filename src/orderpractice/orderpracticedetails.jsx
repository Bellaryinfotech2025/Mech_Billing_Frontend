"use client"

import { useState } from "react"
import axios from "axios"

// Simple DatePicker component that uses native HTML date input
function SimpleDatePicker({ date, setDate }) {
  return (
    <input
      type="date"
      className="form-input"
      value={date ? date.substring(0, 10) : ""}
      onChange={(e) => setDate(e.target.value)}
    />
  )
}

// CSS styles to be added to your project
const styles = `
  .order-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .order-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .order-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
  }
  
  .order-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  .order-content {
    padding: 24px;
  }
  
  .order-form {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
  
  @media (min-width: 768px) {
    .order-form {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .order-form {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 4px;
  }
  
  .form-input,
  .form-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: border-color 0.15s ease-in-out;
  }
  
  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-button {
    background-color: #2563eb;
    color: white;
    font-weight: 500;
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }
  
  .form-button:hover {
    background-color: #1d4ed8;
  }
  
  .form-button-full {
    width: 100%;
  }
  
  .section-title {
    grid-column: 1 / -1;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-top: 24px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .col-span-full {
    grid-column: 1 / -1;
  }
`

export default function OrderForm() {
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

  const handleChange = (field, value) => {
    setOrder({ ...order, [field]: value })
  }

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

      const response = await axios.post("http://localhost:5599/api/orders", orderData)
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

  // Options for dropdowns
  const orderTypeOptions = ["Standard", "Renewal", "Upgrade", "Downgrade"]
  const orderCategoryOptions = ["Product", "Service", "Subscription", "Maintenance", "Support"]
  const billingCycleOptions = ["Monthly", "Quarterly", "Annually", "One-time"]
  const billingFrequencyOptions = ["Weekly", "Monthly", "Quarterly", "Annually"]
  const yesNoOptions = ["Y", "N"]

  // Options for attribute dropdowns
  const dateAttributeOptions = [
    "Contract Start Date",
    "Contract End Date",
    "Renewal Date",
    "Payment Due Date",
    "Delivery Date",
  ]

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

  return (
    <>
      <style>{styles}</style>
      <div className="order-container">
        <div className="order-card">
          <div className="order-header">
            <h2 className="order-title">Order Management Form</h2>
          </div>
          <div className="order-content">
            <form onSubmit={handleSubmit} className="order-form">
              {/* Section: Basic Order Information */}
              <h3 className="section-title">Basic Order Information</h3>

              <div className="form-group">
                <label htmlFor="orderId" className="form-label">
                  Order ID
                </label>
                <input
                  id="orderId"
                  className="form-input"
                  value={order.orderId}
                  onChange={(e) => handleChange("orderId", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="orderNumber" className="form-label">
                  Order Number
                </label>
                <input
                  id="orderNumber"
                  className="form-input"
                  value={order.orderNumber}
                  onChange={(e) => handleChange("orderNumber", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="orderType" className="form-label">
                  Order Type
                </label>
                <select
                  id="orderType"
                  className="form-select"
                  value={order.orderType}
                  onChange={(e) => handleChange("orderType", e.target.value)}
                >
                  <option value="">Select order type</option>
                  {orderTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="orderCategory" className="form-label">
                  Order Category
                </label>
                <select
                  id="orderCategory"
                  className="form-select"
                  value={order.orderCategory}
                  onChange={(e) => handleChange("orderCategory", e.target.value)}
                >
                  <option value="">Select order category</option>
                  {orderCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ldApplicabel" className="form-label">
                  LD Applicable
                </label>
                <select
                  id="ldApplicabel"
                  className="form-select"
                  value={order.ldApplicabel}
                  onChange={(e) => handleChange("ldApplicabel", e.target.value)}
                >
                  <option value="">Select option</option>
                  {yesNoOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section: Dates */}
              <h3 className="section-title">Effective Dates</h3>

              <div className="form-group">
                <label htmlFor="effectiveStartDate" className="form-label">
                  Effective Start Date
                </label>
                <SimpleDatePicker
                  date={order.effectiveStartDate}
                  setDate={(date) => handleChange("effectiveStartDate", date)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="effectiveEndDate" className="form-label">
                  Effective End Date
                </label>
                <SimpleDatePicker
                  date={order.effectiveEndDate}
                  setDate={(date) => handleChange("effectiveEndDate", date)}
                />
              </div>

              {/* Section: Customer Information */}
              <h3 className="section-title">Customer Information</h3>

              <div className="form-group">
                <label htmlFor="billToCustomerId" className="form-label">
                  Bill To Customer ID
                </label>
                <input
                  id="billToCustomerId"
                  className="form-input"
                  value={order.billToCustomerId}
                  onChange={(e) => handleChange("billToCustomerId", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="billToSiteId" className="form-label">
                  Bill To Site ID
                </label>
                <input
                  id="billToSiteId"
                  className="form-input"
                  value={order.billToSiteId}
                  onChange={(e) => handleChange("billToSiteId", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="billToContactId" className="form-label">
                  Bill To Contact ID
                </label>
                <input
                  id="billToContactId"
                  className="form-input"
                  value={order.billToContactId}
                  onChange={(e) => handleChange("billToContactId", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salesrep" className="form-label">
                  Sales Rep
                </label>
                <input
                  id="salesrep"
                  className="form-input"
                  value={order.salesrep}
                  onChange={(e) => handleChange("salesrep", e.target.value)}
                />
              </div>

              {/* Section: Billing Information */}
              <h3 className="section-title">Billing Information</h3>

              <div className="form-group">
                <label htmlFor="billingCycle" className="form-label">
                  Billing Cycle
                </label>
                <select
                  id="billingCycle"
                  className="form-select"
                  value={order.billingCycle}
                  onChange={(e) => handleChange("billingCycle", e.target.value)}
                >
                  <option value="">Select billing cycle</option>
                  {billingCycleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="billingFrequency" className="form-label">
                  Billing Frequency
                </label>
                <select
                  id="billingFrequency"
                  className="form-select"
                  value={order.billingFrequency}
                  onChange={(e) => handleChange("billingFrequency", e.target.value)}
                >
                  <option value="">Select billing frequency</option>
                  {billingFrequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section: Date Attributes */}
              <h3 className="section-title">Date Attributes</h3>

              <div className="form-group">
                <label htmlFor="attribute1D" className="form-label">
                  Attribute 1 (Date)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute1DName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {dateAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SimpleDatePicker
                    date={order.attribute1D}
                    setDate={(date) => handleChange("attribute1D", date)}
                    style={{ flex: "1" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute2D" className="form-label">
                  Attribute 2 (Date)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute2DName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {dateAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SimpleDatePicker
                    date={order.attribute2D}
                    setDate={(date) => handleChange("attribute2D", date)}
                    style={{ flex: "1" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute3D" className="form-label">
                  Attribute 3 (Date)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute3DName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {dateAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SimpleDatePicker
                    date={order.attribute3D}
                    setDate={(date) => handleChange("attribute3D", date)}
                    style={{ flex: "1" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute4D" className="form-label">
                  Attribute 4 (Date)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute4DName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {dateAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SimpleDatePicker
                    date={order.attribute4D}
                    setDate={(date) => handleChange("attribute4D", date)}
                    style={{ flex: "1" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute5D" className="form-label">
                  Attribute 5 (Date)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute5DName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {dateAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <SimpleDatePicker
                    date={order.attribute5D}
                    setDate={(date) => handleChange("attribute5D", date)}
                    style={{ flex: "1" }}
                  />
                </div>
              </div>

              {/* Section: String Attributes */}
              <h3 className="section-title">String Attributes</h3>

              <div className="form-group">
                <label htmlFor="attribute1V" className="form-label">
                  Attribute 1 (String)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute1VName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {stringAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute1V}
                    onChange={(e) => handleChange("attribute1V", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute2V" className="form-label">
                  Attribute 2 (String)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute2VName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {stringAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute2V}
                    onChange={(e) => handleChange("attribute2V", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute3V" className="form-label">
                  Attribute 3 (String)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute3VName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {stringAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute3V}
                    onChange={(e) => handleChange("attribute3V", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute4V" className="form-label">
                  Attribute 4 (String)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute4VName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {stringAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute4V}
                    onChange={(e) => handleChange("attribute4V", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute5V" className="form-label">
                  Attribute 5 (String)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute5VName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {stringAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute5V}
                    onChange={(e) => handleChange("attribute5V", e.target.value)}
                  />
                </div>
              </div>

              {/* Section: Numeric Attributes */}
              <h3 className="section-title">Numeric Attributes</h3>

              <div className="form-group">
                <label htmlFor="attribute1N" className="form-label">
                  Attribute 1 (Numeric)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute1NName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {numericAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute1N}
                    onChange={(e) => handleChange("attribute1N", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute2N" className="form-label">
                  Attribute 2 (Numeric)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute2NName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {numericAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute2N}
                    onChange={(e) => handleChange("attribute2N", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute3N" className="form-label">
                  Attribute 3 (Numeric)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute3NName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {numericAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute3N}
                    onChange={(e) => handleChange("attribute3N", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute4N" className="form-label">
                  Attribute 4 (Numeric)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute4NName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {numericAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute4N}
                    onChange={(e) => handleChange("attribute4N", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attribute5N" className="form-label">
                  Attribute 5 (Numeric)
                </label>
                <div className="form-group" style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="form-select"
                    style={{ flex: "1" }}
                    onChange={(e) => handleChange("attribute5NName", e.target.value)}
                  >
                    <option value="">Select attribute type</option>
                    {numericAttributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    style={{ flex: "1" }}
                    value={order.attribute5N}
                    onChange={(e) => handleChange("attribute5N", e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button - Full width at the bottom */}
              <div className="col-span-full mt-6">
                <button type="submit" className="form-button form-button-full">
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
