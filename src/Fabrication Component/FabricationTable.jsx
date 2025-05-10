"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Save, Upload, Edit, Trash2, Plus, CheckCircle, FileText, AlertCircle, Search, RefreshCw, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { FaJediOrder } from "react-icons/fa6"
import { AiFillBank } from "react-icons/ai"
import { CgBmw } from "react-icons/cg"

import "../Fabrication Design/FabricationTable.css"
import "../Fabrication Design/importfile.css"
import "../Fabrication Design/confirmation.css"

// Updated API base URLs to match the controller
const API_BASE_URL = "http://195.35.45.56:5522/api/V3.0"
const API_BASE_URL_V2 = "http://195.35.45.56:5522/api/V2.0"

// Key for storing data in localStorage
const STORAGE_KEY = "fabricationTableData"

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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [rowToDelete, setRowToDelete] = useState(null)
  const [rowIndexToDelete, setRowIndexToDelete] = useState(null) // Store the index of the row to delete
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
  const [importedData, setImportedData] = useState([]) // This will store only the newly imported data
  const [searchTerm, setSearchTerm] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [localDataCache, setLocalDataCache] = useState({}) // Cache for preserving local data
  const [importStats, setImportStats] = useState({
    successCount: 0,
    failureCount: 0,
    pendingCount: 0,
    totalCount: 0,
  })
  const [showImportStats, setShowImportStats] = useState(false)
  const [columnsLoading, setColumnsLoading] = useState(true) // Loading state for columns
  const [dataExists, setDataExists] = useState(false) // Track if data exists for this child line
  const [apiError, setApiError] = useState(null) // Track API errors

  // IMPORTANT: Define columns directly in the component state
  // This ensures the columns are always available and correctly defined
  const [columns, setColumns] = useState([
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
    {
      id: "lineNo",
      label: "Line No",
      width: "100px",
      placeholder: "Enter line ",
    },
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
    { id: "remarks", label: "Remarks", width: "150px", placeholder: "Enter remarks" },
    {
      id: "status",
      label: "Status",
      width: "120px",
      placeholder: "Status",
      renderCell: (row) => (
        <div className={`status-cell ${row.ifaceStatus === "SUCCESS" ? "status-completed" : "status-not-completed"}`}>
          {row.ifaceStatus === "SUCCESS" ? "Completed" : "Not Completed"}
        </div>
      ),
    },
  ])

  const fileInputRef = useRef(null)
  const toastTimeoutRef = useRef(null)

  // Fetch columns from API when component mounts
  useEffect(() => {
    setColumnsLoading(false) // We're using hardcoded columns now
  }, [])

  // Fetch import statistics when component mounts
  useEffect(() => {
    fetchImportStats()
  }, [])

  // Cleanup toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  // Check for order number in props or localStorage when component mounts
  useEffect(() => {
    // First check if we have an order number from props
    if (selectedOrder?.orderNumber) {
      setOrderNumber(selectedOrder.orderNumber)
    }
    // Then check localStorage as fallback
    else {
      const storedOrderNumber = localStorage.getItem("selectedOrderNumber")
      if (storedOrderNumber) {
        setOrderNumber(storedOrderNumber)
      }
    }
  }, [selectedOrder])

  // Load data when selectedChildLine changes
  useEffect(() => {
    if (selectedChildLine) {
      loadFabricationData()
    }
  }, [selectedChildLine])

  // Store data in localStorage whenever rows change
  useEffect(() => {
    if (rows.length > 0 && selectedChildLine) {
      const dataToStore = {
        rows: rows,
        lineNumber: selectedChildLine.lineNumber,
        timestamp: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    }
  }, [rows, selectedChildLine])

  // Function to load fabrication data - first from localStorage, then from API if needed
  const loadFabricationData = () => {
    if (!selectedChildLine) return

    try {
      // Try to get data from localStorage first
      const storedDataString = localStorage.getItem(STORAGE_KEY)

      if (storedDataString) {
        const storedData = JSON.parse(storedDataString)

        // Check if the stored data is for the current line number and is less than 30 minutes old
        const isCurrentLine = storedData.lineNumber === selectedChildLine.lineNumber
        const isFresh = Date.now() - storedData.timestamp < 30 * 60 * 1000 // 30 minutes

        if (isCurrentLine && isFresh && storedData.rows && storedData.rows.length > 0) {
          console.log("Using cached data from localStorage")
          setRows(storedData.rows)
          setImportedData(storedData.rows)
          setDataExists(true)
          setTotalItems(storedData.rows.length)
          setTotalPages(Math.ceil(storedData.rows.length / pageSize))
          setSavedRows(storedData.rows.map((row, index) => index)) // Use index as fallback ID
          return // Skip API call if we have valid cached data
        }
      }

      // If we don't have valid cached data, fetch from API
      fetchFabricationDataForChildLine()
    } catch (error) {
      console.error("Error loading fabrication data:", error)
      // If there's an error with localStorage, fetch from API
      fetchFabricationDataForChildLine()
    }
  }

  // Function to fetch import statistics
  const fetchImportStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL_V2}/import-status`)
      setImportStats({
        successCount: response.data.successCount || 0,
        failureCount: response.data.failureCount || 0,
        pendingCount: response.data.pendingCount || 0,
        totalCount: response.data.totalCount || 0,
      })
    } catch (error) {
      console.error("Error fetching import statistics:", error)
    }
  }

  // Function to fetch fabrication data specifically for the selected child line
  const fetchFabricationDataForChildLine = async () => {
    if (!selectedChildLine || !selectedChildLine.lineNumber) {
      setRows([])
      setImportedData([])
      setDataExists(false)
      setApiError(null)
      // Clear localStorage when there's no child line
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    try {
      setIsLoading(true)
      setApiError(null)
      console.log("Fetching fabrication data for child line:", selectedChildLine.lineNumber)

      // First try to get data from the V3.0 API (OrderFabricationDetails)
      let response
      try {
        // Try to get data from the V3.0 API with filters
        response = await axios.get(`${API_BASE_URL}/getfabrication`, {
          params: {
            orderNumber: selectedOrder?.orderNumber,
            lineNo: selectedChildLine.lineNumber,
          },
        })
        console.log("V3.0 API response:", response.data)
      } catch (error) {
        console.error("Error fetching from V3.0 API:", error)

        // If V3.0 API fails, try the V2.0 API
        try {
          response = await axios.get(`${API_BASE_URL_V2}/fabrication-by-line`, {
            params: { lineNumber: selectedChildLine.lineNumber },
          })
          console.log("V2.0 API response:", response.data)
        } catch (v2Error) {
          if (v2Error.response && v2Error.response.status === 404) {
            // If 404, try the latest-imported endpoint as fallback
            console.log("Specific endpoint not found, trying latest-imported as fallback")
            response = await axios.get(`${API_BASE_URL_V2}/latest-imported`)

            // Filter the results to only include records for this line number
            if (response.data && response.data.data) {
              response.data.data = response.data.data.filter(
                (item) => String(item.lineNumber) === String(selectedChildLine.lineNumber),
              )
            }
          } else {
            throw v2Error // Re-throw if it's not a 404
          }
        }
      }

      console.log("Fabrication data response:", response.data)

      // Check if we have data
      if (
        !response.data ||
        !response.data.data ||
        !Array.isArray(response.data.data) ||
        response.data.data.length === 0
      ) {
        console.log("No fabrication data found for this child line")
        setRows([])
        setImportedData([])
        setTotalItems(0)
        setTotalPages(0)
        setDataExists(false)
        setIsLoading(false)
        return
      }

      // Log the first item to see its structure
      if (response.data.data.length > 0) {
        console.log("First item from backend:", JSON.stringify(response.data.data[0], null, 2))
      }

      // Map the backend data to match our frontend structure
      const mappedData = response.data.data.map((item, index) => {
        // Try to find any field that could be used as an ID
        let id = null

        // Check all possible ID field names
        if (item.id !== undefined) id = item.id
        else if (item.ifaceId !== undefined) id = item.ifaceId
        else if (item.iface_id !== undefined) id = item.iface_id
        else if (item._id !== undefined) id = item._id

        // If no ID found, use index as fallback
        if (id === null) {
          console.warn("No ID field found in item, using index as fallback:", index)
          id = `index-${index}`
        }

        // Log the raw item to see what fields are available
        console.log("Raw item from backend:", item)

        // Get the line number from the item or use the selected child line
        const lineNumber = item.lineNumber || selectedChildLine.lineNumber || "1.2"

        // Get the original line number from the item or use "1" as default
        const origLineNumber = item.origLineNumber || item.orig_line_number || item.ORIG_LINE_NO || "1"

        // Check all possible field names for description
        const description =
          item.drawingDescription || item.description || item.DESCRIPTION || item.drawing_description || ""

        // IMPORTANT: Provide default values for all numeric fields to prevent null display
        return {
          _rowIndex: index, // Store the index for fallback deletion
          id: id, // Store the ID from the backend
          ifaceId: id, // Use the found ID or index
          orderNumber: item.orderNumber || "",
          origLineNo: origLineNumber || "1", // Default to "1" if null
          lineNo: lineNumber || "1.2", // Default to "1.2" if null
          drawingNo: item.drawingNo || "",
          description: description || "", // Default to empty string if null
          erectionMkd: item.erectionMkd || "",
          itemNo: item.itemNo || "",
          section: item.section || "",
          // IMPORTANT: Provide default values for all numeric fields
          length: item.length !== undefined && item.length !== null ? String(item.length) : "0",
          qty: item.quantity !== undefined && item.quantity !== null ? String(item.quantity) : "0",
          unit: item.unitPrice !== undefined && item.unitPrice !== null ? String(item.unitPrice) : "0",
          totalWt: item.totalQuantity !== undefined && item.totalQuantity !== null ? String(item.totalQuantity) : "0",
          qtyReqd: item.originalQuantity !== undefined && item.originalQuantity !== null ? String(item.originalQuantity) : "0",
          erecMkdWt: "", // This field doesn't exist in the backend model
          remarks: item.remark || "",
          ifaceStatus: item.ifaceStatus || "PENDING",
          isNew: false,
          _originalData: item, // Store the original data for debugging
        }
      })

      console.log("Mapped fabrication data:", mappedData.length, "rows")

      // Set the data
      setImportedData(mappedData)
      setRows(mappedData)
      setDataExists(mappedData.length > 0)

      // Update total items and pages for pagination
      setTotalItems(mappedData.length)
      setTotalPages(Math.ceil(mappedData.length / pageSize))

      // Mark all fetched rows as saved - use index if no ID
      setSavedRows(mappedData.map((row, index) => row.ifaceId || `index-${index}`))

      if (mappedData.length > 0) {
        showToastNotification(`Loaded ${mappedData.length} records for line ${selectedChildLine.lineNumber}`)
      }
    } catch (error) {
      console.error("Error fetching fabrication data for child line:", error)
      setApiError(error.message || "Failed to fetch data")
      showToastNotification(
        `Failed to fetch fabrication data: ${error.response?.data?.message || error.message}`,
        "Error",
        "error",
      )

      // Try to load from localStorage as a last resort
      const storedDataString = localStorage.getItem(STORAGE_KEY)
      if (storedDataString) {
        try {
          const storedData = JSON.parse(storedDataString)
          if (storedData.lineNumber === selectedChildLine.lineNumber && storedData.rows) {
            console.log("API failed, using cached data from localStorage")
            setRows(storedData.rows)
            setImportedData(storedData.rows)
            setDataExists(storedData.rows.length > 0)
            setTotalItems(storedData.rows.length)
            setTotalPages(Math.ceil(storedData.rows.length / pageSize))
            setSavedRows(storedData.rows.map((row, index) => row.ifaceId || `index-${index}`))
            showToastNotification("Using cached data due to API error", "Warning", "warning")
          } else {
            // Set empty data if cached data is for a different line
            setRows([])
            setImportedData([])
            setTotalItems(0)
            setTotalPages(0)
            setDataExists(false)
          }
        } catch (e) {
          console.error("Error parsing stored data:", e)
          // Set empty data on error
          setRows([])
          setImportedData([])
          setTotalItems(0)
          setTotalPages(0)
          setDataExists(false)
        }
      } else {
        // Set empty data if no cached data
        setRows([])
        setImportedData([])
        setTotalItems(0)
        setTotalPages(0)
        setDataExists(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchFabricationDataForChildLine()
      .then(() => {
        fetchImportStats()
        showToastNotification("Data refreshed successfully!")
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  // Modified addNewRow function to add the new row at the beginning and show on first page
  const addNewRow = () => {
    const newRow = {
      _rowIndex: -1, // Special index for new rows
      ifaceId: `temp-${Date.now()}`, // Temporary ID until saved to backend
      orderNumber: orderNumber || selectedOrder?.orderNumber || "", // Use the current order number
      // Use the parent line number if available, otherwise default to "1"
      origLineNo: selectedChildLine?.parentLineNumber || "1",
      // Always use the selected child line number if available
      lineNo: selectedChildLine ? selectedChildLine.lineNumber : "1.2",
      drawingNo: "",
      description: "",
      erectionMkd: "",
      itemNo: "",
      section: "",
      // IMPORTANT: Initialize numeric fields with "0" instead of empty string
      length: "0",
      qty: "0",
      unit: "0",
      totalWt: "0",
      qtyReqd: "0",
      erecMkdWt: "0",
      remarks: "",
      ifaceStatus: "PENDING", // Default status for new rows
      isNew: true,
    }

    // Add the new row at the beginning of the array instead of the end
    setRows([newRow, ...rows])
    setEditingRow(newRow.ifaceId)
    setDataExists(true) // We now have data

    // Set to first page to ensure the new row is visible
    setCurrentPage(0)
  }

  // Convert frontend row to backend DTO format
  const convertRowToBackendFormat = (row) => {
    // Cache the row data locally to preserve fields that might not be in the backend model
    setLocalDataCache((prev) => ({
      ...prev,
      [row.ifaceId]: { ...row },
    }))

    // Log the row being converted
    console.log("Converting row to backend format:", row)
    console.log("Description value being sent:", row.description)

    // IMPORTANT: Ensure all numeric values are properly converted and never null
    const length = row.length ? parseFloat(row.length) : 0
    const quantity = row.qty ? parseInt(row.qty, 10) : 0
    const unitPrice = row.unit ? parseFloat(row.unit) : 0
    const totalQuantity = row.totalWt ? parseFloat(row.totalWt) : 0
    const originalQuantity = row.qtyReqd ? parseInt(row.qtyReqd, 10) : 0

    console.log("Numeric values being sent:", {
      length,
      quantity,
      unitPrice,
      totalQuantity,
      originalQuantity
    })

    // Create a proper backend DTO object that matches the OrderFabricationDetailsDTO
    // IMPORTANT: Use the exact field names expected by the backend
    return {
      id:
        row.ifaceId && !row.ifaceId.toString().startsWith("temp-") && !row.ifaceId.toString().startsWith("index-")
          ? row.ifaceId
          : null,
      orderNumber: row.orderNumber || "",
      // Ensure origLineNumber is never null by using multiple fallbacks
      origLineNumber: row.origLineNo || selectedChildLine?.parentLineNumber || "1",
      orig_line_number: row.origLineNo || selectedChildLine?.parentLineNumber || "1", // Add alternate field name
      ORIG_LINE_NO: row.origLineNo || selectedChildLine?.parentLineNumber || "1", // Add alternate field name
      // Ensure lineNumber is never null by using multiple fallbacks
      lineNumber: row.lineNo || selectedChildLine?.lineNumber || "1.2",
      line_number: row.lineNo || selectedChildLine?.lineNumber || "1.2", // Add alternate field name
      LINE_NO: row.lineNo || selectedChildLine?.lineNumber || "1.2", // Add alternate field name
      drawingNo: row.drawingNo || "",
      drawingDescription: row.description || "", // Ensure this is properly mapped
      description: row.description || "", // Add this as a fallback field name
      DESCRIPTION: row.description || "", // Add this as another fallback field name
      drawing_description: row.description || "", // Add this as another fallback field name
      erectionMkd: row.erectionMkd || "",
      itemNo: row.itemNo || "",
      section: row.section || "",
      // IMPORTANT: Use the converted numeric values
      length: length,
      quantity: quantity,
      unitPrice: unitPrice,
      totalQuantity: totalQuantity,
      originalQuantity: originalQuantity,
      remark: row.remarks || "",
      // Include these fields to ensure they're not null in the database
      buildingName: "Default Building",
      lengthUom: "mm",
      unitPriceUom: "INR",
      totalQuantityUom: "kg",
      createdBy: 1,
      lastUpdatedBy: 1,
      tenantId: 1,
      orgId: 1,
      // Add ifaceStatus if it exists
      ifaceStatus: row.ifaceStatus || "PENDING",
    }
  }

  const handleSave = async () => {
    try {
      if (editingRow !== null) {
        const rowToSave = rows.find((row) => row.ifaceId === editingRow)

        if (rowToSave) {
          // Cache the current row data before sending to backend
          setLocalDataCache((prev) => ({
            ...prev,
            [rowToSave.ifaceId]: { ...rowToSave },
          }))

          const backendData = convertRowToBackendFormat(rowToSave)
          console.log("Sending data to backend:", backendData)
          console.log("Line number value:", backendData.lineNumber)
          console.log("Original line number value:", backendData.origLineNumber)

          let response
          if (rowToSave.isNew) {
            // Create new record using the V3.0 API endpoint
            response = await axios.post(`${API_BASE_URL}/getfabrication`, backendData)
            console.log("Create response:", response.data)

            // Update the row with the ID from the backend
            // IMPORTANT: Check the structure of the response to get the correct ID
            const newId = response.data.data ? response.data.data.id : response.data.id || response.data
            console.log("New record ID:", newId)

            // Update local cache with the new ID
            const cachedData = { ...localDataCache[rowToSave.ifaceId] }
            delete localDataCache[rowToSave.ifaceId]
            setLocalDataCache((prev) => ({
              ...prev,
              [newId]: cachedData,
            }))

            setRows(
              rows.map((row) =>
                row.ifaceId === editingRow
                  ? {
                      ...row,
                      ifaceId: newId,
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
            // Update existing record using the V3.0 API endpoint
            response = await axios.put(`${API_BASE_URL}/getfabrication/${rowToSave.ifaceId}`, backendData)
            console.log("Update response:", response.data)

            // Update the row with data from the backend
            setRows(rows.map((row) => (row.ifaceId === editingRow ? { ...row, isNew: false } : row)))

            // Make sure this row is marked as saved
            if (!savedRows.includes(rowToSave.ifaceId)) {
              setSavedRows((prev) => [...prev, rowToSave.ifaceId])
            }

            showToastNotification("Record updated successfully!")
          }
        }

        setEditingRow(null)
      } else {
        // If no specific row is being edited, save all unsaved rows
        const unsavedRows = rows.filter((row) => !savedRows.includes(row.ifaceId))

        if (unsavedRows.length > 0) {
          // Cache all unsaved rows
          const newCache = { ...localDataCache }
          unsavedRows.forEach((row) => {
            newCache[row.ifaceId] = { ...row }
          })
          setLocalDataCache(newCache)

          // Create a batch save request for multiple rows using the V3.0 API endpoint
          const batchData = unsavedRows.map(convertRowToBackendFormat)
          console.log("Sending batch data to backend:", batchData)

          const response = await axios.post(`${API_BASE_URL}/getfabrication/batch`, batchData)
          console.log("Batch save response:", response.data)

          // Update rows with IDs from backend
          const savedIds = response.data.data.map((item) => item.id)

          // Update the local cache with new IDs
          const updatedCache = { ...localDataCache }
          unsavedRows.forEach((row, index) => {
            if (row.ifaceId.toString().startsWith("temp-") && savedIds[index]) {
              updatedCache[savedIds[index]] = { ...updatedCache[row.ifaceId] }
              delete updatedCache[row.ifaceId]
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
        fetchFabricationDataForChildLine()
      }, 1000)
    } catch (error) {
      console.error("Error saving data:", error)
      showToastNotification(`Failed to save: ${error.response?.data?.message || error.message}`, "Error", "error")
    }
  }

  const handleEdit = (ifaceId) => {
    setEditingRow(ifaceId)
    showToastNotification("Editing row", "Edit Mode", "info")
  }

  // Show delete confirmation dialog
  const confirmDelete = (row, rowIndex) => {
    console.log("Confirming delete for row:", row, "at index:", rowIndex)

    if (!row) {
      showToastNotification("Cannot delete: Row is undefined", "Error", "error")
      return
    }

    // Store both the row and its index
    setRowToDelete(row)
    setRowIndexToDelete(rowIndex)
    setShowDeleteConfirmation(true)
  }

  // Handle actual deletion after confirmation
  const handleDelete = async () => {
    if (!rowToDelete) {
      showToastNotification("Cannot delete: Row is undefined", "Error", "error")
      setShowDeleteConfirmation(false)
      return
    }

    console.log("Deleting row:", rowToDelete, "at index:", rowIndexToDelete)

    try {
      setIsLoading(true)

      // Try to delete from backend if we have an ID
      if (
        rowToDelete.ifaceId &&
        !rowToDelete.ifaceId.toString().startsWith("temp-") &&
        !rowToDelete.ifaceId.toString().startsWith("index-")
      ) {
        try {
          console.log(`Attempting to delete record with ID ${rowToDelete.ifaceId} from database`)

          // Try to delete using the V3.0 API first
          await axios.delete(`${API_BASE_URL}/getfabrication/${rowToDelete.ifaceId}`)
          console.log(`Successfully deleted record with ID ${rowToDelete.ifaceId} from database using V3.0 API`)
        } catch (v3Error) {
          console.error(`Error deleting from V3.0 API:`, v3Error)

          // If V3.0 API fails, try the V2.0 API
          try {
            await axios.delete(`${API_BASE_URL_V2}/fabrication/${rowToDelete.ifaceId}`)
            console.log(`Successfully deleted record with ID ${rowToDelete.ifaceId} from database using V2.0 API`)
          } catch (v2Error) {
            console.error(`Error deleting from V2.0 API:`, v2Error)
            // Continue with local deletion even if both backend deletes fail
            console.log("Continuing with local deletion despite backend errors")
          }
        }
      } else {
        console.log("Skipping backend delete - using local deletion only")
      }

      // Remove from local state using index if available, otherwise filter by ID
      let updatedRows
      if (rowIndexToDelete !== null && rowIndexToDelete >= 0 && rowIndexToDelete < rows.length) {
        // Delete by index
        updatedRows = [...rows]
        updatedRows.splice(rowIndexToDelete, 1)
        console.log(`Deleted row at index ${rowIndexToDelete}`)
      } else {
        // Fallback to filtering by ID or any other property
        updatedRows = rows.filter((row, index) => {
          // Try to match by ifaceId first
          if (row.ifaceId && rowToDelete.ifaceId) {
            return row.ifaceId !== rowToDelete.ifaceId
          }

          // If no ifaceId, try to match by _rowIndex
          if (row._rowIndex !== undefined && rowToDelete._rowIndex !== undefined) {
            return row._rowIndex !== rowToDelete._rowIndex
          }

          // Last resort: match by multiple properties to ensure we get the right row
          return !(
            row.orderNumber === rowToDelete.orderNumber &&
            row.drawingNo === rowToDelete.drawingNo &&
            row.lineNo === rowToDelete.lineNo
          )
        })
        console.log(`Deleted row by matching properties`)
      }

      // Update imported data to keep it in sync
      let updatedImportedData
      if (rowIndexToDelete !== null && rowIndexToDelete >= 0 && rowIndexToDelete < importedData.length) {
        updatedImportedData = [...importedData]
        updatedImportedData.splice(rowIndexToDelete, 1)
      } else {
        updatedImportedData = importedData.filter((row) => {
          if (row.ifaceId && rowToDelete.ifaceId) {
            return row.ifaceId !== rowToDelete.ifaceId
          }
          if (row._rowIndex !== undefined && rowToDelete._rowIndex !== undefined) {
            return row._rowIndex !== rowToDelete._rowIndex
          }
          return !(
            row.orderNumber === rowToDelete.orderNumber &&
            row.drawingNo === rowToDelete.drawingNo &&
            row.lineNo === rowToDelete.lineNo
          )
        })
      }
      setImportedData(updatedImportedData)

      // Update rows state
      setRows(updatedRows)

      // Remove from savedRows if applicable
      if (rowToDelete.ifaceId) {
        setSavedRows((prevSavedRows) => prevSavedRows.filter((savedId) => savedId !== rowToDelete.ifaceId))
      }

      // Remove from local cache if applicable
      if (rowToDelete.ifaceId) {
        setLocalDataCache((prev) => {
          const updated = { ...prev }
          delete updated[rowToDelete.ifaceId]
          return updated
        })
      }

      // Update dataExists flag if we've deleted all rows
      if (updatedRows.length === 0) {
        setDataExists(false)
      }

      // Update localStorage with the new data
      if (selectedChildLine) {
        const dataToStore = {
          rows: updatedRows,
          lineNumber: selectedChildLine.lineNumber,
          timestamp: Date.now(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
      }

      showToastNotification("Row deleted successfully!")
    } catch (error) {
      console.error("Error deleting row:", error)
      showToastNotification(`Failed to delete: ${error.message}`, "Error", "error")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirmation(false)
      setRowToDelete(null)
      setRowIndexToDelete(null)
    }
  }

  const handleInputChange = (ifaceId, field, value) => {
    // Update the rows state
    setRows(
      rows.map((row) => {
        if (row.ifaceId === ifaceId) {
          return { ...row, [field]: value }
        }
        return row
      }),
    )

    // Also update the local cache to preserve the data
    setLocalDataCache((prev) => ({
      ...prev,
      [ifaceId]: {
        ...(prev[ifaceId] || {}),
        [field]: value,
      },
    }))
  }

  // Updated toast notification function to center the toast
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

  const toggleSelectRow = (ifaceId) => {
    if (selectedRows.includes(ifaceId)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== ifaceId))
    } else {
      setSelectedRows([...selectedRows, ifaceId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(rows.map((row) => row.ifaceId))
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

      // Add child line information to the form data
      if (selectedChildLine) {
        formData.append("lineNumber", selectedChildLine.lineNumber)
        if (selectedChildLine.parentLineNumber) {
          formData.append("parentLineNumber", selectedChildLine.parentLineNumber)
        }
      }

      if (selectedOrder && selectedOrder.orderNumber) {
        formData.append("orderNumber", selectedOrder.orderNumber)
      }

      // Show loading for at least 3 seconds
      const loadingPromise = new Promise((resolve) => setTimeout(resolve, 3000))

      // Send the file to the backend using axios with the correct endpoint
      const importPromise = axios.post(`${API_BASE_URL_V2}/imports`, formData)

      // Wait for both the loading time and the API call to complete
      const [_, importResponse] = await Promise.all([loadingPromise, importPromise])

      // Get the number of records imported from the response
      const recordsImported = importResponse.data.recordsImported || 0
      const successCount = importResponse.data.successCount || 0
      const failureCount = importResponse.data.failureCount || 0

      // Set the newly imported data directly from the response
      const newlyImportedData = importResponse.data.data || []

      // Map the newly imported data to match our frontend structure
      const mappedData = newlyImportedData.map((item, index) => {
        // Try to find any field that could be used as an ID
        let id = null

        // Check all possible ID field names
        if (item.ifaceId !== undefined) id = item.ifaceId
        else if (item.iface_id !== undefined) id = item.iface_id
        else if (item.id !== undefined) id = item.id
        else if (item._id !== undefined) id = item._id

        // If no ID found, use index as fallback
        if (id === null) {
          console.warn("No ID field found in item, using index as fallback:", index)
          id = `index-${index}`
        }

        return {
          _rowIndex: index, // Store the index for fallback deletion
          ifaceId: id, // Use the found ID or index
          id: id, // Store the ID separately
          orderNumber: item.orderNumber || "",
          origLineNo: "1", // Force original line number to be "1"
          lineNo: selectedChildLine ? selectedChildLine.lineNumber : "1.2", // Force line number to be "1.2"
          drawingNo: item.drawingNo || "",
          description: item.drawingDescription || "",
          erectionMkd: item.erectionMkd || "",
          itemNo: item.itemNo || "",
          section: item.section || "",
          // IMPORTANT: Provide default values for all numeric fields
          length: item.length !== undefined && item.length !== null ? String(item.length) : "0",
          qty: item.quantity !== undefined && item.quantity !== null ? String(item.quantity) : "0",
          unit: item.unitPrice !== undefined && item.unitPrice !== null ? String(item.unitPrice) : "0",
          totalWt: item.totalQuantity !== undefined && item.totalQuantity !== null ? String(item.totalQuantity) : "0",
          qtyReqd: item.originalQuantity !== undefined && item.originalQuantity !== null ? String(item.originalQuantity) : "0",
          erecMkdWt: "0", // This field doesn't exist in the backend model
          remarks: item.remark || "",
          ifaceStatus: item.ifaceStatus || "PENDING",
          isNew: false,
          _originalData: item, // Store the original data for debugging
        }
      })

      // Update the imported data and rows
      setImportedData(mappedData)
      setRows(mappedData)
      setDataExists(mappedData.length > 0)

      // Update pagination info
      setTotalItems(mappedData.length)
      setTotalPages(Math.ceil(mappedData.length / pageSize))
      setCurrentPage(0) // Reset to first page

      // Mark all imported rows as saved
      setSavedRows(mappedData.map((row, index) => row.ifaceId || `index-${index}`))

      setImportedRecords(recordsImported)
      setImportStats({
        ...importStats,
        successCount: successCount,
        failureCount: failureCount,
        totalCount: recordsImported,
      })

      // Show success message for at least 3 seconds
      setShowSuccessMessage(true)

      // Wait for 3 seconds before closing the popup
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setShowConfirmationPopup(false)
      setSelectedFile(null)
      setShowSuccessMessage(false)

      // Show toast notification with success/failure counts
      showToastNotification(
        `${recordsImported} records were added to the database for line ${selectedChildLine?.lineNumber}. (${successCount} success / ${failureCount} failure)`,
        "Excel data imported successfully!",
        "success",
      )

      // Update import statistics
      fetchImportStats()
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

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page)
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

    // Filter the imported data based on search term
    if (e.target.value) {
      const filteredRows = importedData.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      )
      setRows(filteredRows)
      setTotalItems(filteredRows.length)
      setTotalPages(Math.ceil(filteredRows.length / pageSize))
    } else {
      // If search is cleared, show all imported data
      setRows(importedData)
      setTotalItems(importedData.length)
      setTotalPages(Math.ceil(importedData.length / pageSize))
    }
  }

  const toggleImportStats = () => {
    setShowImportStats(!showImportStats)
  }

  // Get the current page of rows for pagination
  const getCurrentPageRows = () => {
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize
    return rows.slice(startIndex, endIndex)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPageButtons = 5 // Maximum number of page buttons to show

    // Calculate start and end page numbers to display
    let startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(0, endPage - maxPageButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  // Add this right before the return statement in the component
  useEffect(() => {
    // Debug log to check columns and data
    console.log("Current columns:", columns)
    console.log("Sample row data:", rows.length > 0 ? rows[0] : "No rows")
  }, [columns, rows])

  // Render loading state while columns are being fetched
  if (columnsLoading) {
    return (
      <div className="table-container">
        <div className="table-loading-container">
          <div className="loading-spinner"></div>
          <p>Loading table structure...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title" style={{ color: "white" }}>
          Fabrication for Line {selectedChildLine?.lineNumber}
        </div>
        <div className="table-actions">
          <button className="btn btn-stats" onClick={toggleImportStats}>
            <FileCheck size={16} />
            {importStats.successCount} success / {importStats.failureCount} failure
          </button>

          <button className="btn btn-add-service" onClick={addNewRow}>
            <Plus size={16} />
            Add Service
          </button>

          <button className="btn btn-import" onClick={handleImportClick}>
            <Upload size={16} />
            Import
          </button>

          <button className="btn btn-refresh" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? "spin" : ""} />
            Refresh
          </button>

          <button className="btn btn-save" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Import Statistics Popup */}
      {showImportStats && (
        <div className="import-stats-popup">
          <div className="import-stats-header">
            <h3>Import Statistics</h3>
            <button className="close-btn" onClick={toggleImportStats}>
              ×
            </button>
          </div>
          <div className="import-stats-content">
            <div className="stats-item">
              <div className="stats-label">Success:</div>
              <div className="stats-value success">{importStats.successCount}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Failure:</div>
              <div className="stats-value failure">{importStats.failureCount}</div>
            </div>
            <div className="stats-item">
              <div className="stats-label">Pending:</div>
              <div className="stats-value pending">{importStats.pendingCount}</div>
            </div>
            <div className="stats-item total">
              <div className="stats-label">Total:</div>
              <div className="stats-value">{importStats.totalCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* API Error Message */}
      {apiError && (
        <div className="api-error-message">
          <AlertCircle size={20} className="error-icon" />
          <span>API Error: {apiError}</span>
          <button className="retry-button" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* Added Order Number section similar to LinesDatabaseSearch */}
      <div className="order-number-section">
        <div className="order-number-display">
          <span>Order Number: {selectedOrder ? selectedOrder.orderNumber : orderNumber || "No order selected"}</span>
          {selectedChildLine && <span className="child-line-info">Line Number: {selectedChildLine.lineNumber}</span>}
          {selectedChildLine?.parentLineNumber && (
            <span className="parent-line-info">Original Line Number: {selectedChildLine.parentLineNumber}</span>
          )}
        </div>
        <div className="table-actions-secondary">
          <div className="import-status">
            <span>Showing {rows.length} imported records</span>
          </div>
        </div>
      </div>

      <div className="table-controls">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search imported records..."
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
            ) : !dataExists ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-table">
                  <div className="no-data-message">
                    <AlertCircle size={24} className="no-data-icon" />
                    <p>No fabrication data exists for line {selectedChildLine?.lineNumber}.</p>
                    <p>Please import data or add a new service to get started.</p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-table">
                  {selectedOrder || selectedChildLine
                    ? 'No imported data exists for your order number or child line number. Click "Import" to import data.'
                    : 'No imported records found. Click "Import" to import data from Excel.'}
                </td>
              </tr>
            ) : (
              getCurrentPageRows().map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}-${row.ifaceId || row._rowIndex || "unknown"}`}
                  className={row.isNew ? "editing-row" : ""}
                >
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.id}`} style={{ width: column.width }}>
                      {editingRow === row.ifaceId ? (
                        <div className="input-field-container">
                          {column.id === "status" ? (
                            <div
                              className={`status-cell ${row.ifaceStatus === "SUCCESS" ? "status-completed" : "status-not-completed"}`}
                            >
                              {row.ifaceStatus === "SUCCESS" ? "Completed" : "Not Completed"}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={row[column.id] || ""}
                              onChange={(e) => handleInputChange(row.ifaceId, column.id, e.target.value)}
                              className="edit-input"
                              placeholder={column.placeholder}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="cell-content">
                          {column.icon && savedRows.includes(row.ifaceId) && (
                            <span className="cell-icon">{column.icon}</span>
                          )}
                          {column.renderCell ? (
                            column.renderCell(row)
                          ) : (
                            <span className="cell-text">{row[column.id] || "0"}</span>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="actions-column">
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(row.ifaceId)}>
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Delete button clicked for row:", row, "at index:", rowIndex)
                          confirmDelete(row, rowIndex)
                        }}
                        disabled={isLoading}
                      >
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

      {/* Numbered Pagination with Arrows */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button className="pagination-arrow" onClick={handlePrevPage} disabled={currentPage === 0 || isLoading}>
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                onClick={() => handlePageChange(pageNum)}
                disabled={isLoading}
              >
                {pageNum + 1}
              </button>
            ))}

            <button
              className="pagination-arrow"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1 || isLoading}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="confirmation-popup-overlay">
          <div className="confirmation-popup">
            <div className="confirmation-popup-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="confirmation-popup-content">
              <p>Are you sure you want to delete this record?</p>
              {rowToDelete && (
                <div className="delete-record-info">
                  <p>
                    <strong>Order Number:</strong> {rowToDelete.orderNumber}
                  </p>
                  <p>
                    <strong>Drawing No:</strong> {rowToDelete.drawingNo}
                  </p>
                  <p>
                    <strong>Line Number:</strong> {rowToDelete.lineNo}
                  </p>
                </div>
              )}
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="confirmation-popup-actions">
              <button
                className="confirmation-no-btn"
                onClick={() => {
                  setShowDeleteConfirmation(false)
                  setRowToDelete(null)
                  setRowIndexToDelete(null)
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button className="confirmation-yes-btn delete-confirm-btn" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification - Centered in the middle of the screen */}
      {showToast && (
        <div className="toast-notification-overlay">
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
                    <br />
                    <span className="import-stats">
                      {importStats.successCount} success / {importStats.failureCount} failure
                    </span>
                  </p>
                </div>
              ) : (
                <>
                  <p>Do you want to import your data in fabrication for line {selectedChildLine?.lineNumber}?</p>
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
