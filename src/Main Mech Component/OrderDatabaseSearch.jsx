"use client"

import { useState, useEffect, useRef } from "react"
import "../Design Component/order-database-search.css"
import "../Design Component/ordernumberdetails.css"

import axios from "axios"
import { CheckCircle, Download, Search, AlertCircle, Edit } from "lucide-react"
import { FaCloudUploadAlt } from "react-icons/fa"
import { CgImport } from "react-icons/cg"
import { IoIosAddCircle } from "react-icons/io"
import { CgDetailsMore } from "react-icons/cg"
import OrderDetails from "../Main Mech Component/OrderDetails"

const OrderDatabaseSearch = ({ onAddOrderClick, onOrderNumberClick, selectedOrder }) => {
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
  const [showOrderNumberDetails, setShowOrderNumberDetails] = useState(false)
  const [highlightedOrders, setHighlightedOrders] = useState([])
  const highlightTimerRef = useRef(null)

  // API base URL calling
  const API_URL = "http://195.35.45.56:5522/api"

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

  // Update highlighted orders when search query changes
  useEffect(() => {
    // Clear any existing highlight timer
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current)
    }

    if (searchQuery.trim().length >= 3 && orders.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase().trim()

      // Find all orders that match the search query
      const matchingOrders = orders
        .filter((order) => order.orderNumber && order.orderNumber.toLowerCase().includes(lowerCaseQuery))
        .map((order) => order.orderNumber)

      setHighlightedOrders(matchingOrders)

      // Clear the highlight after 3 seconds
      highlightTimerRef.current = setTimeout(() => {
        setHighlightedOrders([])
      }, 3000)
    } else {
      setHighlightedOrders([])
    }
  }, [searchQuery, orders])

  // Function to sort orders based on search query
  const getSortedOrders = () => {
    if (!searchQuery.trim() || !orders.length) {
      return orders
    }

    const lowerCaseQuery = searchQuery.toLowerCase().trim()

    // Create a copy of orders to sort
    return [...orders].sort((a, b) => {
      const aOrderNumber = (a.orderNumber || "").toLowerCase()
      const bOrderNumber = (b.orderNumber || "").toLowerCase()

      // If order number exactly matches search query, it comes first
      if (aOrderNumber === lowerCaseQuery && bOrderNumber !== lowerCaseQuery) {
        return -1
      }
      if (bOrderNumber === lowerCaseQuery && aOrderNumber !== lowerCaseQuery) {
        return 1
      }

      // If order number starts with search query, it comes next
      if (aOrderNumber.startsWith(lowerCaseQuery) && !bOrderNumber.startsWith(lowerCaseQuery)) {
        return -1
      }
      if (bOrderNumber.startsWith(lowerCaseQuery) && !aOrderNumber.startsWith(lowerCaseQuery)) {
        return 1
      }

      // If order number contains search query, it comes next
      if (aOrderNumber.includes(lowerCaseQuery) && !bOrderNumber.includes(lowerCaseQuery)) {
        return -1
      }
      if (bOrderNumber.includes(lowerCaseQuery) && !aOrderNumber.includes(lowerCaseQuery)) {
        return 1
      }

      // Otherwise, maintain original order
      return 0
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
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
    if (onOrderNumberClick) {
      onOrderNumberClick(order)
    } else {
      setShowOrderNumberDetails(true)
    }
  }

  // Handle back to order search
  const handleBackToOrderSearch = () => {
    setShowOrderNumberDetails(false)
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

  // Get sorted orders based on search query
  const sortedOrders = getSortedOrders()

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
        </div>
      </header>

      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Orders # Customer Number . Category . Type . Billing Details Search Here ..."
            value={searchQuery}
            onChange={handleSearchInputChange}
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
              ) : sortedOrders.length > 0 ? (
                sortedOrders.map((order, index) => {
                  const isHighlighted = highlightedOrders.includes(order.orderNumber)
                  return (
                    <tr
                      key={index}
                      className={`${selectedOrder && selectedOrder.orderNumber === order.orderNumber ? "selected-row" : ""} clickable-row`}
                      style={
                        isHighlighted
                          ? {
                              background: "#808080",
                              color: "white",
                              transition: "all 0.3s ease",
                              boxShadow: "inset 0 0 0 4px rgba(0, 0, 0, 0.3)",
                              fontWeight: "bold",
                            }
                          : {}
                      }
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button className="action-btn">
                            <Edit
                              size={14}
                              style={{ marginRight: "4px", color: isHighlighted ? "white" : "#94a3b8" }}
                            />
                          </button>
                        </div>
                      </td>
                      <td
                        style={{
                         
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontWeight: isHighlighted ? "bold" : "normal",
                          color: isHighlighted ? "white" : "#0066cc",
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOrderNumberClick(order)
                        }}
                      >
                        {order.orderNumber || "-"}
                      </td>
                      <td>{getLookupMeaning("ORDER_TYPE", order.orderType)}</td>
                      <td>{order.businessUnit || "-"}</td>
                      <td>{getLookupMeaning("ORDER_CATEGORY", order.orderCategory)}</td>
                      <td style={{ fontWeight: "normal", color: isHighlighted ? "white" : "inherit" }}>
                        {order.billToCustomerId || "-"}
                      </td>

                      <td style={{ fontWeight: "normal", color: isHighlighted ? "white" : "inherit" }}>
                        {formatDate(order.effectiveStartDate)}
                      </td>
                      <td>{formatDate(order.effectiveEndDate)}</td>
                      <td>{order.totalValue || "-"}</td>
                      <td>{order.status || "-"}</td>
                      <td>{order.billToSiteId || "-"}</td>
                      <td>{order.billToContactId || "-"}</td>
                      <td>{getLookupMeaning("BILLING_FREQUENCY", order.billingFrequency)}</td>
                      <td>{getLookupMeaning("BILLING_CYCLE", order.billingCycle)}</td>
                      <td>{order.ldApplicable === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  )
                })
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
