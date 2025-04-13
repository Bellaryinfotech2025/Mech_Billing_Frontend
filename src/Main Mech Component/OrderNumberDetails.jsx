"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Search } from "lucide-react"

const OrderNumberDetails = ({ order, onCancel, getLookupMeaning, formatDate }) => {
  const [activeTab, setActiveTab] = useState("order-details")

  if (!order) return null

  return (
    <div className="order-details-view-container">
      <header className="order-details-view-header">
        <div className="header-left">
          <button className="back-button" onClick={onCancel}>
            <ArrowLeft size={18} />
            <span>Back to Orders</span>
          </button>
          <h1>Order: {order.orderNumber || "soheil_21"}</h1>
        </div>
        <div className="header-right">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
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
                  <select className="form-select" disabled>
                    <option>{getLookupMeaning("ORDER_TYPE", order.orderType) || "Draft"}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Category</label>
                <div className="form-field">
                  <select className="form-select" disabled>
                    <option>{getLookupMeaning("ORDER_CATEGORY", order.orderCategory) || "Draft_Order"}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">LD Applicable</label>
                <div className="form-field">
                  <input type="checkbox" className="form-checkbox" checked={order.ldApplicable === "Y"} disabled />
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
                      readOnly
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
                      readOnly
                    />
                    <div className="date-input-icon">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Business Unit</label>
                <div className="form-field">
                  <select className="form-select" disabled>
                    <option>{order.businessUnit || "Please select"}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Status</label>
                <div className="form-field">
                  <select className="form-select" disabled>
                    <option>{order.status || "Draft"}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Currency</label>
                <div className="form-field">
                  <select className="form-select" disabled>
                    <option>{order.currency || "Please Select"}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Total Value</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.totalValue || ""} readOnly />
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
                  <input type="text" className="form-input" value={order.billToCustomerId || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Bill To Site</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.billToSiteId || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Bill To Contact</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.billToContactId || ""} readOnly />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Deliver To Customer</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.deliverToCustomerId || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Sales Representative</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.salesrep || ""} readOnly />
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
                  <select className="form-select" disabled>
                    <option>{getLookupMeaning("BILLING_FREQUENCY", order.billingFrequency) || "Please Select"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Billing Cycle</label>
                <div className="form-field">
                  <select className="form-select" disabled>
                    <option>{getLookupMeaning("BILLING_CYCLE", order.billingCycle) || "Please Select"}</option>
                  </select>
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
                  <input type="text" className="form-input" value={order.attribute1V || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Attribute 2</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.attribute2V || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Attribute 3</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.attribute3V || ""} readOnly />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-row">
                <label className="form-label">Numeric Attribute 1</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.attribute1N || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Numeric Attribute 2</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.attribute2N || ""} readOnly />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Numeric Attribute 3</label>
                <div className="form-field">
                  <input type="text" className="form-input" value={order.attribute3N || ""} readOnly />
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
