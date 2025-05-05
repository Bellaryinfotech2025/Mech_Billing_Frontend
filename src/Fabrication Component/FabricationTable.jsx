"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Save, Upload, Edit, Trash2, Plus, CheckCircle, FileText, AlertCircle, Search } from "lucide-react"
import { FaJediOrder } from "react-icons/fa6"
import { AiFillBank } from "react-icons/ai"
import { CgBmw } from "react-icons/cg"

import "../Fabrication Design/FabricationTable.css"
import "../Fabrication Design/importfile.css"
import "../Fabrication Design/confirmation.css"

// Updated API base URLs to match the controller
const API_BASE_URL = "http://localhost:8855/api/V3.0"
const API_BASE_URL_V2 = "http://localhost:8855/api/V2.0"

const FabricationTable = ({ selectedOrder, selectedChildLine, onBack }) => {
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [importedData, setImportedData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [localDataCache, setLocalDataCache] = useState({}) // Cache for preserving local data

  const fileInputRef = useRef(null)
  const toastTimeoutRef = useRef(null)

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
      label: "Original Line No",
      width: "120px",
      placeholder: "Enter original line ",
      icon: <CgBmw size={16} className="column-icon" />,
    },
    { id: "lineNo", label: "Line No", width: "100px", placeholder: "Enter line " },
    {
      id: "drawingNo",
      label: "Drawing No",
      width: "180px",
      placeholder: "Enter drawing No ",
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

  // Fetch data from API when component mounts or when page/search changes
  useEffect(() => {
    fetchFabricationData()
  }, [currentPage, pageSize, searchTerm])

  // Check for order number in props or sessionStorage when component mounts
  useEffect(() => {
    // First check if we have an order number from props
    if (selectedOrder?.orderNumber) {
      setOrderNumber(selectedOrder.orderNumber)
    }
    // Then check sessionStorage as fallback
    else {
      const storedOrderNumber = sessionStorage.getItem("selectedOrderNumber")
      if (storedOrderNumber) {
        setOrderNumber(storedOrderNumber)
      }
    }
  }, [selectedOrder])

  // Cleanup toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  // Function to fetch data from the backend API using the correct endpoint
  const fetchFabricationData = async () => {
    try {
      setIsLoading(true)

      // Build query parameters based on available filters
      const params = {
        page: currentPage,
        size: pageSize,
        search: searchTerm || undefined,
      }

      // Add order number filter if available
      if (selectedOrder && selectedOrder.orderNumber) {
        params.orderNumber = selectedOrder.orderNumber
      } else if (orderNumber) {
        params.orderNumber = orderNumber
      }

      // Add line number filter if available
      if (selectedChildLine && selectedChildLine.lineNumber) {
        params.lineNumber = selectedChildLine.lineNumber
      }

      console.log("Fetching fabrication data with params:", params)
      // Use the correct API endpoint from the controller
      const response = await axios.get(`${API_BASE_URL}/getfabrication`, { params })

      // Map the backend data to match our frontend structure
      const mappedData = response.data.data.map((item) => {
        // Check if we have local cached data for this item
        const cachedData = localDataCache[item.id] || {}

        return {
          id: item.id,
          orderNumber: item.orderNumber || cachedData.orderNumber || "",
          origLineNo: item.origLineNumber || cachedData.origLineNo || "",
          lineNo: item.lineNumber || cachedData.lineNo || "",
          drawingNo: item.drawingNo || cachedData.drawingNo || "",
          description: item.drawingDescription || cachedData.description || "",
          erectionMkd: item.erectionMkd || cachedData.erectionMkd || "",
          itemNo: item.itemNo || cachedData.itemNo || "",
          section: item.section || cachedData.section || "",
          length: item.length ? item.length.toString() : cachedData.length || "",
          qty: item.quantity ? item.quantity.toString() : cachedData.qty || "",
          unit: item.unitPrice ? item.unitPrice.toString() : cachedData.unit || "",
          totalWt: item.totalQuantity ? item.totalQuantity.toString() : cachedData.totalWt || "",
          qtyReqd: item.originalQuantity ? item.originalQuantity.toString() : cachedData.qtyReqd || "",
          erecMkdWt: cachedData.erecMkdWt || "", // This field doesn't exist in the backend model
          remarks: item.remark || cachedData.remarks || "",
          isNew: false,
        }
      })

      setRows(mappedData)
      setTotalItems(response.data.totalItems || 0)
      setTotalPages(response.data.totalPages || 1)

      // Mark all fetched rows as saved
      setSavedRows(mappedData.map((row) => row.id))

      // Update order number if available in the response and not already set
      if (mappedData.length > 0 && mappedData[0].orderNumber && !orderNumber) {
        setOrderNumber(mappedData[0].orderNumber)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      showToastNotification(`Failed to fetch data: ${error.response?.data?.message || error.message}`, "Error", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch imported data using V2.0 endpoint
  const fetchImportedData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE_URL}/getfabrication/latest`)

      // Process the imported data if needed
      setImportedData(response.data.data)

      showToastNotification("Imported data fetched successfully!")
    } catch (error) {
      console.error("Error fetching imported data:", error)
      showToastNotification(
        `Failed to fetch imported data: ${error.response?.data?.message || error.message}`,
        "Error",
        "error",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchFabricationData()
      .then(() => {
        showToastNotification("Data refreshed successfully!")
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  const addNewRow = () => {
    const newRow = {
      id: `temp-${Date.now()}`, // Temporary ID until saved to backend
      orderNumber: orderNumber, // Use the current order number
      origLineNo: "",
      lineNo: selectedChildLine ? selectedChildLine.lineNumber : "", // Use the selected child line number if available
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

  // Convert frontend row to backend DTO format
  const convertRowToBackendFormat = (row) => {
    // Cache the row data locally to preserve fields that might not be in the backend model
    setLocalDataCache((prev) => ({
      ...prev,
      [row.id]: { ...row },
    }))

    return {
      id: row.id && !row.id.toString().startsWith("temp-") ? row.id : null,
      orderNumber: row.orderNumber,
      origLineNumber: row.origLineNo,
      lineNumber: row.lineNo,
      drawingNo: row.drawingNo,
      drawingDescription: row.description,
      erectionMkd: row.erectionMkd,
      itemNo: row.itemNo,
      section: row.section,
      length: Number.parseFloat(row.length) || 0,
      quantity: Number.parseInt(row.qty) || 0,
      unitPrice: Number.parseFloat(row.unit) || 0,
      totalQuantity: Number.parseFloat(row.totalWt) || 0,
      originalQuantity: Number.parseInt(row.qtyReqd) || 0,
      remark: row.remarks,
      // Add any additional fields that might be needed by the backend
    }
  }

  const handleSave = async () => {
    try {
      if (editingRow !== null) {
        const rowToSave = rows.find((row) => row.id === editingRow)

        if (rowToSave) {
          // Cache the current row data before sending to backend
          setLocalDataCache((prev) => ({
            ...prev,
            [rowToSave.id]: { ...rowToSave },
          }))

          const backendData = convertRowToBackendFormat(rowToSave)

          let response
          if (rowToSave.isNew) {
            // Create new record using the correct endpoint from the controller
            response = await axios.post(`${API_BASE_URL}/getfabrication`, backendData)

            // Update the row with the ID from the backend
            const newId = response.data.id

            // Update local cache with the new ID
            const cachedData = { ...localDataCache[rowToSave.id] }
            delete localDataCache[rowToSave.id]
            setLocalDataCache((prev) => ({
              ...prev,
              [newId]: cachedData,
            }))

            setRows(
              rows.map((row) =>
                row.id === editingRow
                  ? {
                      ...row,
                      id: newId,
                      isNew: false,
                    }
                  : row,
              ),
            )

            // Add to savedRows
            setSavedRows((prev) => [...prev, newId])

            showToastNotification("Record created successfully!")
          } else {
            // Update existing record using the correct endpoint from the controller
            response = await axios.put(`${API_BASE_URL}/getfabrication/${rowToSave.id}`, backendData)

            // Update the row with data from the backend
            setRows(rows.map((row) => (row.id === editingRow ? { ...row, isNew: false } : row)))

            // Make sure this row is marked as saved
            if (!savedRows.includes(rowToSave.id)) {
              setSavedRows((prev) => [...prev, rowToSave.id])
            }

            showToastNotification("Record updated successfully!")
          }
        }

        setEditingRow(null)
      } else {
        // If no specific row is being edited, save all unsaved rows
        const unsavedRows = rows.filter((row) => !savedRows.includes(row.id))

        if (unsavedRows.length > 0) {
          // Cache all unsaved rows
          const newCache = { ...localDataCache }
          unsavedRows.forEach((row) => {
            newCache[row.id] = { ...row }
          })
          setLocalDataCache(newCache)

          // Create a batch save request for multiple rows using the correct endpoint from the controller
          const batchData = unsavedRows.map(convertRowToBackendFormat)

          const response = await axios.post(`${API_BASE_URL}/getfabrication/batch`, batchData)

          // Update rows with IDs from backend
          const savedIds = response.data.map((item) => item.id)

          // Update the local cache with new IDs
          const updatedCache = { ...localDataCache }
          unsavedRows.forEach((row, index) => {
            if (row.id.toString().startsWith("temp-") && savedIds[index]) {
              updatedCache[savedIds[index]] = { ...updatedCache[row.id] }
              delete updatedCache[row.id]
            }
          })
          setLocalDataCache(updatedCache)

          setSavedRows([...savedRows, ...savedIds])

          // Update the rows to mark them as not new
          setRows(rows.map((row) => ({ ...row, isNew: false })))

          showToastNotification(`${unsavedRows.length} records saved successfully!`)
        } else {
          showToastNotification("No changes to save!")
        }
      }

      // Refresh data after saving to ensure we have the latest from the server
      // Add a small delay to allow the backend to process the save
      setTimeout(() => {
        fetchFabricationData()
      }, 500)
    } catch (error) {
      console.error("Error saving data:", error)
      showToastNotification(`Failed to save: ${error.response?.data?.message || error.message}`, "Error", "error")
    }
  }

  const handleEdit = (id) => {
    setEditingRow(id)
    showToastNotification("Editing row", "Edit Mode", "info")
  }

  const handleDelete = async (id) => {
    try {
      // Check if the row exists in the backend (has a non-temporary ID)
      if (!id.toString().startsWith("temp-")) {
        // Delete from backend using the correct endpoint from the controller
        await axios.delete(`${API_BASE_URL}/getfabrication/${id}`)

        // Remove from local cache
        const updatedCache = { ...localDataCache }
        delete updatedCache[id]
        setLocalDataCache(updatedCache)
      }

      // Remove from local state
      setRows(rows.filter((row) => row.id !== id))
      setSavedRows(savedRows.filter((rowId) => rowId !== id))

      showToastNotification("Row deleted successfully!")
    } catch (error) {
      console.error("Error deleting row:", error)
      showToastNotification(`Failed to delete: ${error.response?.data?.message || error.message}`, "Error", "error")
    }
  }

  const handleInputChange = (id, field, value) => {
    // Update the rows state
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value }
        }
        return row
      }),
    )

    // Also update the local cache to preserve the data
    setLocalDataCache((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }))
  }

  const showToastNotification = (message, title = "Success", type = "success") => {
    // Clear any existing timeout to prevent duplicate toasts
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
      setShowToast(false)
    }

    // Set a small delay before showing the new toast to ensure state is updated
    setTimeout(() => {
      setToastMessage(message)
      setToastTitle(title)
      setToastType(type)
      setShowToast(true)

      // Set timeout to hide toast after exactly 3 seconds
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }, 10)
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

  // Import functionality using V2.0 endpoint
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
      setShowSuccessMessage(false)

      // Create FormData to send the file
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Show loading for at least 3 seconds
      const loadingPromise = new Promise((resolve) => setTimeout(resolve, 3000))

      // Send the file to the backend using axios with the correct endpoint
      const importPromise = axios.post(`${API_BASE_URL_V2}/imports`, formData)

      // Wait for both the loading time and the API call to complete
      const [_, importResponse] = await Promise.all([loadingPromise, importPromise])

      // Get the number of records imported from the response
      const recordsImported = importResponse.data.recordsImported || 0
      setImportedRecords(recordsImported)

      // Show success message for at least 3 seconds
      setShowSuccessMessage(true)

      // Wait for 3 seconds before closing the popup
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setShowConfirmationPopup(false)
      setSelectedFile(null)
      setShowSuccessMessage(false)

      // Show toast notification
      showToastNotification(
        `${recordsImported} records were added to the database.`,
        "Excel data imported successfully!",
        "success",
      )

      // Refresh the table to show the imported data
      fetchFabricationData()
    } catch (error) {
      console.error("Import error:", error)
      showToastNotification(`${error.response?.data?.message || error.message}`, "Import failed", "error")
      setIsImporting(false)
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

  const handleDownloadTemplate = async () => {
    try {
      // Get template information from the correct endpoint
      const response = await axios.get(`${API_BASE_URL_V2}/template`)
      showToastNotification("Template information retrieved successfully!")

      // In a real application, this would download a template Excel file
      // For now, just show the template info in console
      console.log("Template Info:", response.data)
    } catch (error) {
      console.error("Error getting template:", error)
      showToastNotification(
        `Failed to get template: ${error.response?.data?.message || error.message}`,
        "Error",
        "error",
      )
    }
  }

  const handlePrevPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(0) // Reset to first page when searching
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title" style={{color:'white'}}>Fabrication</div>
        <div className="table-actions">
          <button className="btn btn-add-service" onClick={addNewRow}>
            <Plus size={16} />
            Add Service
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

      {/* Added Order Number section similar to LinesDatabaseSearch */}
      <div className="order-number-section">
        <div className="order-number-display">
          <span>Order Number: {selectedOrder ? selectedOrder.orderNumber : orderNumber || "No order selected"}</span>
          {selectedChildLine && <span className="child-line-info">Line Number: {selectedChildLine.lineNumber}</span>}
        </div>
        <div className="table-actions-secondary"></div>
      </div>

      <div className="table-controls">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="table-info">
          <span>Total: {totalItems} records</span>
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
                  <div className="table-loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-table">
                  {selectedOrder || selectedChildLine
                    ? 'No data exists in your fabrication table as per your order number or child line number. Click "Add Service" to create a new row.'
                    : 'No records found. Click "Add Service" to create a new row.'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className={row.isNew ? "editing-row" : ""}>
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.id}`} style={{ width: column.width }}>
                      {editingRow === row.id ? (
                        <div className="input-field-container">
                          <input
                            type="text"
                            value={row[column.id] || ""}
                            onChange={(e) => handleInputChange(row.id, column.id, e.target.value)}
                            className="edit-input"
                            placeholder={column.placeholder}
                          />
                        </div>
                      ) : (
                        <div className="cell-content">
                          {column.icon && savedRows.includes(row.id) && (
                            <span className="cell-icon">{column.icon}</span>
                          )}
                          <span className="cell-text">{row[column.id] || ""}</span>
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
          <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 0 || isLoading}>
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1 || isLoading}
          >
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
          <div className="toast-progress"></div>
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
                  <p className="loading-subtext">Your file is uploading in our platform please wait</p>
                </div>
              ) : showSuccessMessage ? (
                <div className="success-container">
                  <div className="success-icon">
                    <CheckCircle size={32} />
                  </div>
                  <p className="success-text">All done!</p>
                  <p className="success-subtext">
                    Excel data imported successfully! {importedRecords} records were added to the database.
                  </p>
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
              <button
                className="confirmation-no-btn"
                onClick={handleConfirmationNo}
                disabled={isImporting || showSuccessMessage}
              >
                No
              </button>
              <button
                className="confirmation-yes-btn"
                onClick={handleConfirmationYes}
                disabled={isImporting || showSuccessMessage}
              >
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
