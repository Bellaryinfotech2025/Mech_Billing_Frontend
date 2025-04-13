"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import '../lookuppractice/kkk.css'
 

// IMPORTANT: Update the API base URL to match your Spring Boot server port
const API_BASE_URL = "http://localhost:9190"

const LookupTablePractice = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [apiStatus, setApiStatus] = useState({
    tested: false,
    working: false,
    endpoint: null,
    message: null,
  })
  const [allLookupTypes, setAllLookupTypes] = useState([])
  const [selectedLookupType, setSelectedLookupType] = useState("ALL") // Default to ALL

  // Fetch data when component mounts
  useEffect(() => {
    fetchAllData()
  }, [])

  // Function to fetch all lookup types first
  const fetchAllLookupTypes = async () => {
    try {
      // Try to get all lookup types from the database
      const response = await axios.get(`${API_BASE_URL}/v2.0/lookups/types`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.data && Array.isArray(response.data)) {
        setAllLookupTypes(response.data)
        return response.data
      }

      return []
    } catch (err) {
      console.error("Error fetching lookup types:", err)
      return []
    }
  }

  // Function to fetch all data by making multiple requests if needed
  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    setData([])

    try {
      // First try the direct approach - fetch all data at once
      try {
        const url = `${API_BASE_URL}/v2.0/lookups/ALL`
        console.log(`Trying to fetch all data from: ${url}`)

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })

        if (response.data && Object.keys(response.data).length > 0) {
          processAndSetData(response.data, url)
          return
        }
      } catch (err) {
        console.log("Direct approach failed, trying alternative methods")
      }

      // If that fails, try to get all lookup types first
      const lookupTypes = await fetchAllLookupTypes()

      // If we couldn't get lookup types, try with known types
      const typesToTry =
        lookupTypes.length > 0 ? lookupTypes : ["BILLING_FREQUENCY", "COUNTRY", "CURRENCY", "STATUS", "PAYMENT_METHOD"]

      // Add a special case for your specific database
      typesToTry.push("BILLING_FREQUENCY")

      // Remove duplicates
      const uniqueTypes = [...new Set(typesToTry)]

      console.log("Fetching data for these lookup types:", uniqueTypes)

      // Fetch data for each lookup type
      let allData = []

      for (const type of uniqueTypes) {
        try {
          const url = `${API_BASE_URL}/v2.0/lookups/${type}`
          console.log(`Fetching data from: ${url}`)

          const response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })

          if (response.data) {
            const processedData = processResponseData(response.data, type)
            allData = [...allData, ...processedData]
          }
        } catch (err) {
          console.log(`Error fetching data for type ${type}:`, err.message)
        }
      }

      // If we got data from any of the lookup types
      if (allData.length > 0) {
        setData(allData)
        setApiStatus({
          tested: true,
          working: true,
          endpoint: "Multiple endpoints",
          message: `Found ${allData.length} total records across all lookup types`,
        })
      } else {
        // Last resort - try a direct SQL query approach if your backend supports it
        try {
          const url = `${API_BASE_URL}/v2.0/lookups/query/all`
          console.log(`Trying direct query endpoint: ${url}`)

          const response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })

          if (response.data && Array.isArray(response.data)) {
            setData(response.data)
            setApiStatus({
              tested: true,
              working: true,
              endpoint: url,
              message: `Found ${response.data.length} records using direct query`,
            })
          } else {
            throw new Error("No data returned from direct query")
          }
        } catch (err) {
          setError("Could not fetch data from any endpoint. Please check your backend API.")
          setApiStatus({
            tested: true,
            working: false,
            endpoint: null,
            message: "Failed to fetch data from all known endpoints",
          })
        }
      }
    } catch (err) {
      console.error("Error fetching all data:", err)
      setError(`Failed to fetch data: ${err.message}`)
      setApiStatus({
        tested: true,
        working: false,
        endpoint: null,
        message: `API error: ${err.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Process response data based on its structure
  const processResponseData = (responseData, defaultType = "") => {
    let processedData = []

    if (typeof responseData === "object" && !Array.isArray(responseData)) {
      // If response is an object with lookup types as keys
      Object.keys(responseData).forEach((type) => {
        if (Array.isArray(responseData[type])) {
          const items = responseData[type].map((item) => ({
            ...item,
            lookupType: item.lookupType || type,
          }))
          processedData = [...processedData, ...items]
        }
      })
    } else if (Array.isArray(responseData)) {
      // If response is already an array
      processedData = responseData.map((item) => ({
        ...item,
        lookupType: item.lookupType || defaultType,
      }))
    }

    return processedData
  }

  // Process and set data
  const processAndSetData = (responseData, url) => {
    const processedData = processResponseData(responseData)

    if (processedData.length > 0) {
      setData(processedData)
      setApiStatus({
        tested: true,
        working: true,
        endpoint: url,
        message: `Connected to ${url} - Found ${processedData.length} records`,
      })
    } else {
      setApiStatus({
        tested: true,
        working: true,
        endpoint: url,
        message: `API is working but no data found. The response format might be unexpected.`,
      })
    }
  }

  // Filter data based on search term and selected lookup type
  const filteredData = data.filter((item) => {
    // First filter by lookup type if not "ALL"
    if (selectedLookupType !== "ALL" && item.lookupType !== selectedLookupType) {
      return false
    }

    // Then filter by search term
    return (
      !searchTerm ||
      (item.lookupType && item.lookupType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.lookupCode && item.lookupCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.meaning && item.meaning.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Calculate pagination
  const pageCount = Math.ceil(filteredData.length / pageSize)
  const displayData = filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  // Get unique lookup types from the data
  const uniqueLookupTypes = ["ALL", ...new Set(data.map((item) => item.lookupType))]

  return (
    <div className="lookup-container">
      <h1>Lookup Values</h1>

      <div className="controls-container">
        <div className="lookup-type-selector">
          <label htmlFor="lookup-type">Filter by Lookup Type:</label>
          <select
            id="lookup-type"
            value={selectedLookupType}
            onChange={(e) => {
              setSelectedLookupType(e.target.value)
              setCurrentPage(0) // Reset to first page when changing lookup type
            }}
            className="lookup-type-select"
          >
            {uniqueLookupTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by code or meaning..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(0) // Reset to first page when searching
            }}
            className="search-input"
          />
          <button onClick={fetchAllData} className="refresh-button">
            Refresh Data
          </button>
        </div>
      </div>

      {apiStatus.tested && (
        <div className={apiStatus.working ? "api-status success" : "api-status error"}>
          <p>{apiStatus.message}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="data-summary">
        {filteredData.length > 0 && (
          <p>
            Showing {filteredData.length} of {data.length} total records
            {selectedLookupType !== "ALL" ? ` (filtered to type: ${selectedLookupType})` : ""}
          </p>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="lookup-table">
              <thead>
                <tr>
                  <th>Lookup Type</th>
                  <th>Lookup Code</th>
                  <th>Meaning</th>
                  <th>Description</th>
                  <th>Editable</th>
                  <th>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {displayData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No data found. Try changing your lookup type or search criteria.
                    </td>
                  </tr>
                ) : (
                  displayData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.lookupType}</td>
                      <td>{item.lookupCode}</td>
                      <td>{item.meaning}</td>
                      <td>{item.description}</td>
                      <td className="center">{item.editableFlag === "Y" ? "✓" : "✕"}</td>
                      <td className="center">{item.enabledFlag === "Y" ? "✓" : "✕"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredData.length > 0 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0} className="page-button">
                First
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="page-button"
              >
                Previous
              </button>

              <span className="page-info">
                Page {currentPage + 1} of {pageCount || 1}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(pageCount - 1, currentPage + 1))}
                disabled={currentPage >= pageCount - 1}
                className="page-button"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(0, pageCount - 1))}
                disabled={currentPage >= pageCount - 1}
                className="page-button"
              >
                Last
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LookupTablePractice;
