"use client"

import { useState, useEffect, useRef } from "react"
import "../Design Component/order-database-search.css"
import "../Design Component/ordernumberdetails.css"

import axios from "axios"
import { CheckCircle, Download, Search, AlertCircle } from 'lucide-react'
import { CgImport } from "react-icons/cg"
import { IoIosAddCircle } from "react-icons/io"
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
  // Add this ref to track if we've already fetched lookup values
  const lookupValuesFetchedRef = useRef(false)
  
  // Customer data for displaying names instead of IDs
  const [customers, setCustomers] = useState([])
  const [customerSites, setCustomerSites] = useState([])
  const [customerContacts, setCustomerContacts] = useState([])
  const [loadingCustomerData, setLoadingCustomerData] = useState(false)
  
  // Track which customer IDs we've already fetched sites and contacts for
  const [fetchedCustomerIds, setFetchedCustomerIds] = useState([])

  // API base URL calling
  const API_URL = "http://195.35.45.56:5522/api/V2.0"

  useEffect(() => {
    const fetchLookupValues = async () => {
      // Only fetch if we haven't already fetched
      if (lookupValuesFetchedRef.current) return

      try {
        lookupValuesFetchedRef.current = true // Mark as fetched before the API call
        const response = await axios.get(`${API_URL}/order-lookup-values`)
        if (response.data) {
          setLookupValues(response.data)
        }
      } catch (error) {
        console.error("Error fetching lookup values:", error)
        // Reset the flag if there was an error, so we can try again
        lookupValuesFetchedRef.current = false
      }
    }

    fetchLookupValues()
  }, [])
  
  // Fetch customer data for displaying names
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomerData(true)
        const response = await axios.get(`${API_URL}/getallcustomeraccount/details`)
        
        if (response.data) {
          setCustomers(response.data)
        }
      } catch (error) {
        console.error("Error fetching customer accounts:", error)
      } finally {
        setLoadingCustomerData(false)
      }
    }

    fetchCustomers()
  }, [])
  
  // Fetch sites and contacts for customers in orders
  useEffect(() => {
    const fetchSitesAndContacts = async () => {
      if (!orders.length || loadingCustomerData) return;
      
      // Get unique customer IDs from orders that we haven't fetched yet
      const customerIds = [...new Set(
        orders
          .filter(order => order.billToCustomerId)
          .map(order => order.billToCustomerId)
      )].filter(id => !fetchedCustomerIds.includes(id));
      
      if (!customerIds.length) return;
      
      try {
        setLoadingCustomerData(true);
        
        // Track new sites and contacts
        let newSites = [...customerSites];
        let newContacts = [...customerContacts];
        
        // Fetch sites and contacts for each customer
        for (const customerId of customerIds) {
          // Fetch sites
          try {
            const sitesResponse = await axios.get(`${API_URL}/getallaccountsitesall/details`, {
              params: { customerId }
            });
            
            if (sitesResponse.data && sitesResponse.data.length > 0) {
              newSites = [...newSites, ...sitesResponse.data];
            }
          } catch (error) {
            console.error(`Error fetching sites for customer ${customerId}:`, error);
          }
          
          // Fetch contacts
          try {
            const contactsResponse = await axios.get(`${API_URL}/getallcustomercontacts/details`, {
              params: { customerId }
            });
            
            if (contactsResponse.data && contactsResponse.data.length > 0) {
              newContacts = [...newContacts, ...contactsResponse.data];
            }
          } catch (error) {
            console.error(`Error fetching contacts for customer ${customerId}:`, error);
          }
        }
        
        // Update state with new data
        setCustomerSites(newSites);
        setCustomerContacts(newContacts);
        setFetchedCustomerIds(prev => [...prev, ...customerIds]);
        
      } catch (error) {
        console.error("Error fetching sites and contacts:", error);
      } finally {
        setLoadingCustomerData(false);
      }
    };
    
    fetchSitesAndContacts();
  }, [orders, loadingCustomerData, fetchedCustomerIds, customerSites, customerContacts]);

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
      }, 500)
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
  
  // Function to get customer name from ID
  const getCustomerName = (customerId) => {
    if (!customerId) return "N/A"
    
    const customer = customers.find(c => c.custAccountId === customerId)
    return customer ? customer.accountName : "N/A"
  }
  
  // Function to get site name from ID
  const getSiteName = (siteId) => {
    if (!siteId) return "N/A"
    
    const site = customerSites.find(s => s.custAcctSiteId === siteId)
    return site ? (site.siteName || `Site ${siteId}`) : "N/A"
  }
  
  // Function to get contact name from ID
  const getContactName = (contactId) => {
    if (!contactId) return "N/A"
    
    const contact = customerContacts.find(c => c.contactId === contactId)
    return contact ? (contact.roleType || `Contact ${contactId}`) : "N/A"
  }

  // Updated formatDate function to display dates as "DD Month, YYYY"
  const formatDate = (dateString) => {
    if (!dateString) return "-"

    const date = new Date(dateString)

    // Array of month names
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // Get day, month name, and full year
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    // Format as "29 April, 2025"
    return `${day} ${month}, ${year}`
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
          {/* <button className="add-order-btn" onClick={onAddOrderClick}>
            <CgDetailsMore size={14} />
            Line Details
          </button> */}
          {/* <button className="add-order-btn" onClick={onAddOrderClick}>
            <FaCloudUploadAlt size={14} />
            Upload
          </button> */}
          <button className="add-order-btn" onClick={handleImportExport}>
            <CgImport size={14} />
            Import / Export
          </button>
          <button className="add-order-btn" onClick={onAddOrderClick}>
            <IoIosAddCircle size={14} />
            Add Order
          </button>
        </div>
      </header>

      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Your Order Here ..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <button className="search-button" onClick={handleLoadOrders}>
            <Search size={25} />
          </button>
        </div>

        <div className="table-actions">
          <button className="table-action-btn">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-container compact">
          <table className="orders-table">
            <thead>
              <tr>
                {/* Removed the Actions column */}
                <th>Order Number</th>
                <th>Order Type</th>
                <th>Business Unit</th>
                <th>Category</th>
                <th>Bill To Customer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Value</th>
                {/* Additional columns as requested - will be visible only when scrolling */}
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
                  <td colSpan={17} style={{ textAlign: "center", padding: "16px" }}>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={17} style={{ textAlign: "center", padding: "16px", color: "#e53e3e" }}>
                    {error}
                  </td>
                </tr>
              ) : !dataFetched ? (
                <tr className="no-records-row">
                  <td colSpan={17}>
                    <div className="load-orders-toast">
                      <AlertCircle size={16} />
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
                              borderRadius: "6px",
                              fontWeight: "bold",
                            }
                          : {}
                      }
                    >
                      {/* Removed the Actions cell */}
                      <td
                        className="order-number-cell"
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
                        {getCustomerName(order.billToCustomerId)}
                      </td>
                      <td style={{ fontWeight: "normal", color: isHighlighted ? "white" : "inherit" }}>
                        {formatDate(order.effectiveStartDate)}
                      </td>
                      <td>{formatDate(order.effectiveEndDate)}</td>
                      <td>{order.totalValue || "-"}</td>
                      <td>{order.status || "-"}</td>
                      <td>{getSiteName(order.billToSiteId)}</td>
                      <td>{getContactName(order.billToContactId)}</td>
                      <td>{getLookupMeaning("BILLING_FREQUENCY", order.billingFrequency)}</td>
                      <td>{getLookupMeaning("BILLING_CYCLE", order.billingCycle)}</td>
                      <td>{order.ldApplicable === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  )
                })
              ) : (
                <tr className="no-records-row">
                  <td colSpan={17}>
                    <div className="no-records-toast">
                      <CheckCircle size={16} />
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