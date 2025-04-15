"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Download, Plus, Edit } from "lucide-react"
import "../Mech Lines Design/linesdatabasedesign.css"
import axios from "axios"

const LinesDatabaseSearch = ({ onAddParentClick, onAddChildClick }) => {
  // State for orders
  const [orderLines, setOrderLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataFetched, setDataFetched] = useState(false)

  // Default order ID
  const orderId = 1

  // API base URL
  const API_URL = "http://localhost:5525/api"

  // Fetch order lines from the backend
  useEffect(() => {
    const fetchOrderLines = async () => {
      try {
        setLoading(true)
        console.log("Fetching lines from:", `${API_URL}/lines/fetchLinesByOrder/${orderId}`)
        const response = await axios.get(`${API_URL}/lines/fetchLinesByOrder/${orderId}`)

        if (response.data && response.data.status === "success") {
          console.log("Lines fetched successfully:", response.data)
          setOrderLines(response.data.lines || [])
          setDataFetched(true)
        } else {
          console.error("Error in response:", response.data)
          throw new Error(response.data.message || "Failed to fetch lines")
        }
      } catch (err) {
        console.error("Error fetching order lines:", err)
        setError(`Failed to load order lines: ${err.message || "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderLines()
  }, [])

  // Handle Add Parent button click
  const handleAddParent = () => {
    console.log("Add Parent clicked")
    if (onAddParentClick) {
      onAddParentClick()
    }
  }

  // Handle Add Child button click
  const handleAddChild = () => {
    console.log("Add Child clicked")
    if (onAddChildClick) {
      onAddChildClick()
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="order-search-containerlineskh">
      <header className="order-search-headerlineskh">
        <h1 className="header-titlelineskh">Order Search</h1>
        <div className="header-actionslineskh">
          <button className="add-parent-btnlineskh" onClick={handleAddParent}>
            <Plus size={16} />
            Add Parent
          </button>
          <button className="add-child-btnlineskh" onClick={handleAddChild}>
            <Plus size={16} />
            Add Child
          </button>
        </div>
      </header>

      <div className="order-number-sectionlineskh">
        <div className="order-number-displaylineskh">
          <span>Order Number: soheil_21</span>
          <span className="active-statuslineskh">
            <CheckCircle size={14} />
            Active
          </span>
        </div>
        <div className="table-actionslineskh">
          <button className="table-action-btnlineskh">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="table-wrapperlineskh">
        <div className="table-containerlineskh">
          <table className="orders-tablelineskh">
            <thead>
              <tr>
                <th>ACTIONS</th>
                <th>SERVICE NUMBER</th>
                <th>SERVICE DESCRIPTION</th>
                <th>UOM</th>
                <th>QTY</th>
                <th>TOTAL</th>
                <th>COMPLETION DATE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="loading-celllineskh">
                    Loading data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="error-celllineskh">
                    {error}
                  </td>
                </tr>
              ) : orderLines.length > 0 ? (
                orderLines.map((line, index) => (
                  <tr key={line.lineId} className={index % 2 === 0 ? "table-row-evenlineskh" : ""}>
                    <td>
                      <div className="action-buttonslineskh">
                        <button className="action-btnlineskh">
                          <Edit size={14} className="edit-iconlineskh" />
                        </button>
                      </div>
                    </td>
                    <td>SRV-{line.lineNumber}</td>
                    <td className="service-description-celllineskh">
                      {line.serviceName || "No description available"}
                    </td>
                    <td>{line.uom || "-"}</td>
                    <td>{line.orderedQuantity || "-"}</td>
                    <td>&#8377;{line.totalPrice ? Number.parseFloat(line.totalPrice).toFixed(2) : "-"}</td>
                    <td>{formatDate(line.effectiveEndDate)}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-records-rowlineskh">
                  <td colSpan={7}>
                    <div className="no-records-toastlineskh">
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

      <div className="table-paginationlineskh">
        <div className="pagination-sliderlineskh"></div>
      </div>
    </div>
  )
}

export default LinesDatabaseSearch;
