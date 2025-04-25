import axios from "axios"

// API base URL - make sure this matches your backend port
const API_URL = "http://localhost:9933/api"

// Fetch customer accounts
export const fetchCustomerAccounts = async () => {
  try {
    console.log("Fetching customer accounts from:", `${API_URL}/custorderdetails`)
    const response = await axios.get(`${API_URL}/custorderdetails`)
    console.log("Customer data response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching customer accounts:", error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message)
    }
    return { customers: [], sites: [], contacts: [] }
  }
}

// Fetch customer sites by customer ID
export const fetchCustomerSites = async (customerId) => {
  try {
    console.log("Fetching sites for customer ID:", customerId)
    const response = await axios.get(`${API_URL}/custorderdetails?orderId=${customerId}`)
    console.log("Sites response:", response.data)
    return response.data.sites || []
  } catch (error) {
    console.error("Error fetching customer sites:", error)
    if (error.response) {
      console.error("Error response data:", error.response.data)
    }
    return []
  }
}

// Fetch customer contacts by site ID
export const fetchCustomerContacts = async (siteId) => {
  try {
    console.log("Fetching contacts for site ID:", siteId)
    const response = await axios.get(`${API_URL}/custorderdetails?orderId=${siteId}`)
    console.log("Contacts response:", response.data)
    return response.data.contacts || []
  } catch (error) {
    console.error("Error fetching customer contacts:", error)
    if (error.response) {
      console.error("Error response data:", error.response.data)
    }
    return []
  }
}

// Check API health
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`)
    return response.data
  } catch (error) {
    console.error("API health check failed:", error)
    return { status: "DOWN", error: error.message }
  }
}