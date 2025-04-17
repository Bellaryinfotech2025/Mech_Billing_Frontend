"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Download, Plus, Edit } from "lucide-react"
import { IoIosAddCircle } from "react-icons/io";
import "../Mech Lines Design/linesdatabasedesign.css"
import axios from "axios"
import SelectParentPopup from "../Mech Lines Component/selectpopup"

const LinesDatabaseSearch = ({ onAddParentClick, onAddChildClick }) => {
  // State for orders
  const [orderLines, setOrderLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataFetched, setDataFetched] = useState(false)
  const [showSelectParentPopup, setShowSelectParentPopup] = useState(false)
  const [selectedParentLine, setSelectedParentLine] = useState(null)

  // Default order ID
  const orderId = 1

  // API base URL
  const API_URL = "http://195.35.45.56:5522/api"

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

  // Check if there are any parent lines
  const hasParentLines = orderLines.some((line) => line.isParent === true)

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
    if (hasParentLines) {
      setShowSelectParentPopup(true)
    } else {
      console.log("Cannot add child: No parent lines available")
    }
  }

  // Handle parent selection from popup
  const handleParentSelected = (parentLine) => {
    setSelectedParentLine(parentLine)
    setShowSelectParentPopup(false)
    if (onAddChildClick) {
      // Pass the selected parent line to the parent component
      onAddChildClick(parentLine)
    }
  }

  // Handle popup close
  const handleClosePopup = () => {
    setShowSelectParentPopup(false)
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
        <h1 className="header-titlelineskh">Lines Search</h1>
        <div className="header-actionslineskh">
          <button className="add-parent-btnlineskh" onClick={handleAddParent}>
            <IoIosAddCircle/>
            Add Parent
          </button>
          <button
            className="add-child-btnlineskh"
            onClick={handleAddChild}
            disabled={!hasParentLines}
            style={{ opacity: hasParentLines ? 1 : 0.5, cursor: hasParentLines ? "pointer" : "not-allowed" }}
          >
            <IoIosAddCircle/>
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
                <th>LINE NUMBER</th>
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
                  <td colSpan={8} className="loading-celllineskh">
                    Loading data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="error-celllineskh">
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
                    <td>{line.lineNumber}</td>
                    <td>
                      <a href="#" className="service-number-linklineskh">
                        SRV-{line.lineNumber}
                      </a>
                    </td>
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
                  <td colSpan={8}>
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

      {/* Parent Selection Popup */}
      {showSelectParentPopup && (
        <SelectParentPopup
          parentLines={orderLines.filter((line) => line.isParent === true)}
          onSelect={handleParentSelected}
          onCancel={handleClosePopup}
        />
      )}
    </div>
  )
}

export default LinesDatabaseSearch;
