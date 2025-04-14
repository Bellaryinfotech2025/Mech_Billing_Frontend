"use client"

import { useState } from "react"
import { CheckCircle, Download, Plus, Edit } from "lucide-react"
import "../Mech Lines Design/linesdatabasedesign.css"

const LinesDatabaseSearch = ({ onAddOrderClick, onAddParentClick, onAddChildClick }) => {
  // State for orders (simplified, no backend data)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataFetched, setDataFetched] = useState(false)

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
              ) : !dataFetched ? (
                <tr className="no-records-rowlineskh">
                  <td colSpan={7}>
                    <div className="active-toastlineskh">
                      <CheckCircle size={18} />
                      <span>Order Number soheil_21 is active</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index} className={index % 2 === 0 ? "table-row-evenlineskh" : ""}>
                    <td>
                      <div className="action-buttonslineskh">
                        <button className="action-btnlineskh">
                          <Edit size={14} className="edit-iconlineskh" />
                        </button>
                      </div>
                    </td>
                    <td>SRV-{index + 1001}</td>
                    <td className="service-description-celllineskh">
                      Service description with extended width to accommodate longer text and descriptions for better
                      readability
                    </td>
                    <td>EA</td>
                    <td>{Math.floor(Math.random() * 10) + 1}</td>
                    <td>${(Math.random() * 1000).toFixed(2)}</td>
                    <td>
                      {formatDate(new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1))}
                    </td>
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
