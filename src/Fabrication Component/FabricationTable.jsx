import { useState, useRef, useEffect } from "react"
import axios from "axios" // Import axios
import {
  Save,
  Upload,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  FileText,
  Hash,
  FileBarChart,
  AlertCircle,
  Download,
} from "lucide-react"
import "../Fabrication Design/FabricationTable.css"
import "../Fabrication Design/importfile.css"
import "../Fabrication Design/confirmation.css"
import { FaJediOrder } from "react-icons/fa6";
import { AiFillBank } from "react-icons/ai";
import { CgBmw } from "react-icons/cg";



// API base URL with port 8866
const API_BASE_URL = "http://localhost:8888/api/fabrication"

const FabricationTable = () => {
  const [rows, setRows] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastTitle, setToastTitle] = useState("Success")
  const [toastType, setToastType] = useState("success") // success or error
  const [savedRows, setSavedRows] = useState([])
  const [showImportPopup, setShowImportPopup] = useState(false)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [importedRecords, setImportedRecords] = useState(0)

  const fileInputRef = useRef(null)

  const columns = [
    {
      id: "orderNumber",
      label: "Order Number",
      width: "150px",
      placeholder: "Enter order ",
      icon: <FaJediOrder size={16} className="column-icon" />,
    },
    {
      id: "origLineNo",
      label: "Orig Line No",
      width: "120px",
      placeholder: "Enter original line ",
      icon: <CgBmw size={16} className="column-icon" />,
    },
    { id: "lineNo", label: "Line No", width: "100px", placeholder: "Enter line " },
    {
      id: "drawingNo",
      label: "Drawing No",
      width: "180px",
      placeholder: "Enter drawing ",
      icon: <AiFillBank size={16} className="column-icon" />,
    },
    { id: "description", label: "Description", width: "250px", placeholder: "Enter description" },
    { id: "erectionMkd", label: "Erection Mkd", width: "150px", placeholder: "Enter marked " },
    { id: "itemNo", label: "Item No", width: "100px", placeholder: "Enter item " },
    { id: "section", label: "Section", width: "150px", placeholder: "Enter section" },
    { id: "length", label: "Length", width: "100px", placeholder: "Enter length" },
    { id: "qty", label: "Qty", width: "80px", placeholder: "Enter qty" },
    { id: "unit", label: "Unit", width: "80px", placeholder: "Enter unit" },
    { id: "totalWt", label: "Total Wt", width: "120px", placeholder: "Enter weight" },
    { id: "qtyReqd", label: "Qty Reqd", width: "120px", placeholder: "Enter qty req." },
    { id: "erecMkdWt", label: "Erec Mkd Wt", width: "150px", placeholder: "Enter weight" },
    { id: "remarks", label: "Remarks", width: "150px", placeholder: "Enter remarks" },
  ]

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE_URL}/imported-data`, {
        params: {
          page: currentPage,
          size: pageSize,
        },
      })

      // Map the data to match our row structure
      const mappedRows = response.data.data.map((item) => ({
        id: item.ifaceId,
        orderNumber: item.orderNumber || "",
        origLineNo: item.origLineNumber ? item.origLineNumber.toString() : "",
        lineNo: item.lineNumber ? item.lineNumber.toString() : "",
        drawingNo: item.drawingNo || "",
        description: item.drawingDescription || "",
        erectionMkd: item.erectionMkd || "",
        itemNo: item.itemNo || "",
        section: item.section || "",
        length: item.length || "",
        qty: item.quantity || "",
        unit: item.unitPrice || "",
        totalWt: item.totalQuantity || "",
        qtyReqd: item.originalQuantity || "",
        erecMkdWt: item.repeatedQty || "",
        remarks: item.remark || "",
        isNew: false,
      }))

      setRows(mappedRows)
      setTotalPages(response.data.totalPages)
      setSavedRows(mappedRows.map((row) => row.id))
    } catch (error) {
      console.error("Error fetching data:", error)
      showToastNotification(
        "Failed to fetch data: " + (error.response?.data?.message || error.message),
        "Error",
        "error",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const addNewRow = () => {
    const newRow = {
      id: Date.now(),
      orderNumber: "",
      origLineNo: "",
      lineNo: "",
      drawingNo: "",
      description: "",
      erectionMkd: "",
      itemNo: "",
      section: "",
      length: "",
      qty: "",
      unit: "",
      totalWt: "",
      qtyReqd: "",
      erecMkdWt: "",
      remarks: "",
      isNew: true,
    }
    setRows([...rows, newRow])
    setEditingRow(newRow.id)
  }

  const handleSave = () => {
    if (editingRow !== null) {
      setRows(rows.map((row) => ({ ...row, isNew: false })))
      setEditingRow(null)
      // Add all rows to savedRows
      setSavedRows([...savedRows, ...rows.map((row) => row.id)])
      showToastNotification("Order saved successfully!")
    } else {
      showToastNotification("Changes saved successfully!")
    }
  }

  const handleEdit = (id) => {
    setEditingRow(id)
  }

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id))
    setSavedRows(savedRows.filter((rowId) => rowId !== id))
    showToastNotification("Row deleted successfully!")
  }

  const handleInputChange = (id, field, value) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value }
        }
        return row
      }),
    )
  }

  const showToastNotification = (message, title = "Success", type = "success") => {
    setToastMessage(message)
    setToastTitle(title)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(rows.map((row) => row.id))
    }
  }

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Import functionality
  const handleImportClick = () => {
    setShowImportPopup(true)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file)
    } else {
      showToastNotification("Please select an Excel file (.xlsx)", "Error", "error")
    }
  }

  const handleImportSave = () => {
    if (selectedFile) {
      setShowImportPopup(false)
      setShowConfirmationPopup(true)
    } else {
      showToastNotification("Please select a file to import", "Error", "error")
    }
  }

  const handleImportCancel = () => {
    setShowImportPopup(false)
    setSelectedFile(null)
  }

  const handleConfirmationYes = async () => {
    try {
      setIsImporting(true)

      // Create FormData to send the file
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Show loading for at least 3 seconds
      const loadingPromise = new Promise((resolve) => setTimeout(resolve, 3000))

      // Send the file to the backend using axios
      const importPromise = axios.post(`${API_BASE_URL}/import`, formData, {
        headers: {
          // Let the browser set the correct Content-Type with boundary
          // for multipart/form-data
        },
      })

      // Wait for both the loading time and the API call to complete
      const [_, importResponse] = await Promise.all([loadingPromise, importPromise])

      // Get the number of records imported from the response
      const recordsImported = importResponse.data.recordsImported || 0
      setImportedRecords(recordsImported)

      setShowConfirmationPopup(false)
      setSelectedFile(null)
      showToastNotification(
        `Excel data imported successfully! ${recordsImported} records were added to the database.`,
        "Success",
        "success",
      )

      // Refresh the table data after import
      fetchData()
    } catch (error) {
      console.error("Import error:", error)
      showToastNotification(`Import failed: ${error.response?.data?.message || error.message}`, "Error", "error")
    } finally {
      setIsImporting(false)
    }
  }

  const handleConfirmationNo = () => {
    setShowConfirmationPopup(false)
    setSelectedFile(null)
  }

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  const handleDownloadTemplate = () => {
    // In a real application, this would download a template Excel file
    showToastNotification("Template download functionality would be implemented here")
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">Fabrication Table</div>
        <div className="table-actions">
          <button className="btn btn-add-service" onClick={addNewRow}>
            <Plus size={16} />
            Add Service
          </button>
          <button className="btn btn-template" onClick={handleDownloadTemplate}>
            <Download size={16} />
            Template
          </button>
          <button className="btn btn-import" onClick={handleImportClick}>
            <Upload size={16} />
            Import
          </button>
          <button className="btn btn-save" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="fabrication-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} style={{ width: column.width }}>
                  <div className="column-header">{column.label}</div>
                </th>
              ))}
              <th className="actions-column">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="loading-table">
                  Loading data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-table">
                  No records found. Click "Add Service" to create a new row or import data.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className={row.isNew ? "editing-row" : ""}>
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.id}`} style={{ width: column.width }}>
                      {editingRow === row.id ? (
                        <input
                          type="text"
                          value={row[column.id]}
                          onChange={(e) => handleInputChange(row.id, column.id, e.target.value)}
                          className="edit-input"
                          placeholder={column.placeholder}
                        />
                      ) : (
                        <div className="cell-content">
                          {column.icon && savedRows.includes(row.id) && column.icon}
                          <span>{row[column.id] || "-"}</span>
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="actions-column">
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(row.id)}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(row.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Next
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-notification ${toastType}`}>
          <div className="toast-content">
            <div className="toast-icon-container">
              {toastType === "success" ? (
                <CheckCircle className="toast-icon" />
              ) : (
                <AlertCircle className="toast-icon" />
              )}
            </div>
            <div className="toast-message-container">
              <div className="toast-title">{toastTitle}</div>
              <div className="toast-message">{toastMessage}</div>
            </div>
            <button className="toast-close" onClick={() => setShowToast(false)}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Import Popup */}
      {showImportPopup && (
        <div className="import-popup-overlay">
          <div className="import-popup">
            <div className="import-popup-header">
              <h3>Upload file</h3>
              <p>Click to upload or drag and drop</p>
            </div>

            <div
              className="import-dropzone"
              onClick={handleBrowseClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="file-selected">
                  <FileText size={40} className="file-icon" />
                  <span className="file-name">{selectedFile.name}</span>
                </div>
              ) : (
                <div className="no-file-selected">
                  <Upload size={40} className="upload-icon" />
                  <span>No Files Selected</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx"
                style={{ display: "none" }}
              />
            </div>

            <div className="import-popup-footer">
              <div className="import-popup-info">
                <span>Supported formats: Excel (.xlsx)</span>
                <span>Max file size: 25MB</span>
              </div>

              <div className="import-popup-actions">
                <button className="import-cancel-btn" onClick={handleImportCancel}>
                  Cancel
                </button>
                <button className="import-save-btn" onClick={handleImportSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="confirmation-popup-overlay">
          <div className="confirmation-popup">
            <div className="confirmation-popup-header">
              <h3>Confirm Import</h3>
            </div>

            <div className="confirmation-popup-content">
              {isImporting ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading...</p>
                </div>
              ) : (
                <>
                  <p>Do you want to import your data in fabrication?</p>
                  {selectedFile && (
                    <div className="confirmation-file-info">
                      <FileText size={20} className="confirmation-file-icon" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="confirmation-popup-actions">
              <button className="confirmation-no-btn" onClick={handleConfirmationNo} disabled={isImporting}>
                No
              </button>
              <button className="confirmation-yes-btn" onClick={handleConfirmationYes} disabled={isImporting}>
                {isImporting ? "Importing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FabricationTable;
