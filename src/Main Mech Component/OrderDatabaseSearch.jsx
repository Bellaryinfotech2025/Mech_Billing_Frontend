"use client"

import { useState, useEffect } from "react"
import "../Design Component/order-database-search.css"
import "../Design Component/ordernumberdetails.css"

import axios from "axios"
import { CheckCircle, Download, Search, AlertCircle, Edit } from "lucide-react"
import { FaCloudUploadAlt } from "react-icons/fa"
import { CgImport } from "react-icons/cg"
import { IoIosAddCircle } from "react-icons/io"
import { CgDetailsMore } from "react-icons/cg"
import OrderDetails from "../Main Mech Component/OrderDetails"
import OrderNumberDetails from "../Main Mech Component/OrderNumberDetails"

const OrderDatabaseSearch = ({ onAddOrderClick }) => {
  // State for orders and lookup values
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lookupValues, setLookupValues] = useState({
    orderTypes: [],
    orderCategories: [],
    billingFrequencies: [],
    billingCycles: [],
  })
  const [dataFetched, setDataFetched] = useState(false)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderNumberDetails, setShowOrderNumberDetails] = useState(false)

  // API base URL

  const API_URL = "http://localhost:9988/api"

  // Fetch lookup values on component mount
  useEffect(() => {
    const fetchLookupValues = async () => {
      try {
        const response = await axios.get(`${API_URL}/order-lookup-values`)
        if (response.data) {
          setLookupValues(response.data)
        }
      } catch (error) {
        console.error("Error fetching lookup values:", error)
      }
    }

    fetchLookupValues()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // Implement search functionality here
  }

  // Function to get meaning from lookup code
  const getLookupMeaning = (lookupType, lookupCode) => {
    if (!lookupCode) return "-"

    let lookupArray = []

    switch (lookupType) {
      case "ORDER_TYPE":
        lookupArray = lookupValues.orderTypes
        break
      case "ORDER_CATEGORY":
        lookupArray = lookupValues.orderCategories
        break
      case "BILLING_FREQUENCY":
        lookupArray = lookupValues.billingFrequencies
        break
      case "BILLING_CYCLE":
        lookupArray = lookupValues.billingCycles
        break
      default:
        return lookupCode
    }

    const lookup = lookupArray.find((item) => item.lookupCode === lookupCode)
    return lookup ? lookup.meaning : lookupCode
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Handle load orders button click
  const handleLoadOrders = () => {
    setLoading(true)
    setError(null)

    axios
      .get(`${API_URL}/fetchorderdata`)
      .then((response) => {
        setOrders(response.data)
        setLoading(false)
        setDataFetched(true)
      })
      .catch((err) => {
        console.error("Error loading orders:", err)
        setError("Failed to load orders. Please try again.")
        setLoading(false)
      })
  }

  // Handle Add New Order button click
  const handleAddNewOrder = () => {
    setShowOrderDetails(true)
  }

  // Handle cancel from OrderDetails
  const handleCancelOrderDetails = () => {
    setShowOrderDetails(false)
  }

  // Handle order number click
  const handleOrderNumberClick = (order) => {
    setSelectedOrder(order)
    setShowOrderNumberDetails(true)
  }

  // Handle back to order search
  const handleBackToOrderSearch = () => {
    setShowOrderNumberDetails(false)
    setSelectedOrder(null)
  }

  // Handle Import/Export button click
  const handleImportExport = () => {
    // Create a link element
    const link = document.createElement("a")

    // Set the href to the Excel file URL
    link.href = "/Orders_Export.xlsx"

    // Set the download attribute with the filename
    link.download = "Orders_Export.xlsx"

    // Append the link to the body
    document.body.appendChild(link)

    // Trigger the click event
    link.click()

    // Remove the link from the body
    document.body.removeChild(link)
  }

  // If showing OrderDetails, render it instead of the table
  if (showOrderDetails) {
    return <OrderDetails onCancel={handleCancelOrderDetails} />
  }

  // If showing OrderNumberDetails, render it instead of the table
  if (showOrderNumberDetails && selectedOrder) {
    return (
      <OrderNumberDetails
        order={selectedOrder}
        onCancel={handleBackToOrderSearch}
        getLookupMeaning={getLookupMeaning}
        formatDate={formatDate}
      />
    )
  }

  return (
    <div className="order-search-container">
      <header className="order-search-header">
        <h1>Order Search</h1>
        <div className="header-actions">
          <button className="add-order-btn" onClick={onAddOrderClick}>
            <CgDetailsMore />
            Line Details
          </button>
          <button className="add-order-btn" onClick={onAddOrderClick}>
            <FaCloudUploadAlt />
            Upload
          </button>
          <button className="add-order-btn" onClick={handleImportExport}>
            <CgImport />
            Import / Export
          </button>
          <button className="add-order-btn" onClick={onAddOrderClick}>
            <IoIosAddCircle />
            Add Order
          </button>
          {/* <button className="add-new-order-btn" onClick={handleAddNewOrder}>
            <FileText size={16} />
            Add New Order
          </button> */}
        </div>
      </header>

      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Orders # Customer Number . Category . Type . Billing Details Search Here ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <button className="search-button" onClick={handleLoadOrders}>
            <Search size={16} />
          </button>
        </div>

        <div className="table-actions">
          <button className="table-action-btn">
            <Download size={16} />
          </button>
          {/* <button className="table-action-btn">
            <Table size={16} />
          </button>
          <button className="table-action-btn">
            <Grid size={16} />
          </button>
          <button className="table-action-btn">
            <Filter size={16} />
          </button> */}
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="column-actions">Actions</th>
                <th>Order Number</th>
                <th>Order Type</th>
                <th>Business Unit</th>
                <th>Category</th>
                <th>Bill To Customer</th>
                <th>Deliver To Customer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Value</th>
                {/* Additional 8 columns as requested - will be visible only when scrolling */}
                <th>Status</th>
                <th>Bill to Site</th>
                <th>Bill to Contact</th>
                <th>Billing Frequency</th>
                <th>Billing Cycle</th>
                <th>LD Applicable</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={18} style={{ textAlign: "center", padding: "20px" }}>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={18} style={{ textAlign: "center", padding: "20px", color: "#e53e3e" }}>
                    {error}
                  </td>
                </tr>
              ) : !dataFetched ? (
                <tr className="no-records-row">
                  <td colSpan={18}>
                    <div className="load-orders-toast">
                      <AlertCircle size={18} />
                      <span>No Orders</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="action-btn">
                          <Edit size={14} style={{ marginRight: "4px", color: "#94a3b8" }} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="order-number-link"
                        onClick={(e) => {
                          e.preventDefault()
                          handleOrderNumberClick(order)
                        }}
                      >
                        {order.orderNumber || "-"}
                      </a>
                    </td>
                    <td>{getLookupMeaning("ORDER_TYPE", order.orderType)}</td>
                    <td>{order.businessUnit || "-"}</td>
                    <td>{getLookupMeaning("ORDER_CATEGORY", order.orderCategory)}</td>
                    <td>{order.billToCustomerId || "-"}</td>
                    <td>{order.deliverToCustomerId || "-"}</td>
                    <td>{formatDate(order.effectiveStartDate)}</td>
                    <td>{formatDate(order.effectiveEndDate)}</td>
                    <td>{order.totalValue || "-"}</td>
                    <td>{order.status || "-"}</td>
                    <td>{order.billToSiteId || "-"}</td>
                    <td>{order.billToContactId || "-"}</td>
                    <td>{getLookupMeaning("BILLING_FREQUENCY", order.billingFrequency)}</td>
                    <td>{getLookupMeaning("BILLING_CYCLE", order.billingCycle)}</td>
                    <td>{order.ldApplicable === "Y" ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-records-row">
                  <td colSpan={18}>
                    <div className="no-records-toast">
                      <CheckCircle size={18} />
                      <span>No records found.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-pagination">
        <div className="pagination-slider"></div>
      </div>
    </div>
  )
}

export default OrderDatabaseSearch;
