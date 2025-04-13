import { useState } from "react"
import "../Design Component/order-database-search.css";
 
import { CheckCircle, ChevronLeft, ChevronRight, Download, Filter, Grid, Plus, Search, Table } from "lucide-react"

const OrderDatabaseSearch = ({ onAddOrderClick }) => {
  // Sample data for the table (empty for now as shown in the screenshot)
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // Implement search functionality here
  }

  return (
    <div className="order-search-container">
      <header className="order-search-header">
        <h1>Order Search</h1>
        <div className="header-actions">
          <button className="add-order-btn" onClick={onAddOrderClick}>
            <Plus size={16} />
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
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <button className="search-button" onClick={handleSearch}>
            <Search size={16} />
          </button>
        </div>

        <div className="table-actions">
          <button className="table-action-btn">
            <Download size={16} />
          </button>
          <button className="table-action-btn">
            <Table size={16} />
          </button>
          <button className="table-action-btn">
            <Grid size={16} />
          </button>
          <button className="table-action-btn">
            <Filter size={16} />
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
              {orders.length > 0 ? (
                orders.map((order, index) => <tr key={index}>{/* Order data would go here */}</tr>)
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
        <button className="pagination-btn">
          <ChevronLeft size={16} />
        </button>
        <div className="pagination-slider">
          <div className="slider-track"></div>
          <div className="slider-thumb"></div>
        </div>
        <button className="pagination-btn">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default OrderDatabaseSearch;
