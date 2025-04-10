"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../orderpractice/BillingFrequencyForm.css"

const BillingFrequencyForm = () => {
  const [billingFrequencies, setBillingFrequencies] = useState([])
  const [selectedFrequency, setSelectedFrequency] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  // API base URL - replace with your Spring Boot API URL
  const API_URL = "http://localhost:9922/api"

  // Fetch billing frequencies from the backend
  useEffect(() => {
    const fetchBillingFrequencies = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/billing-frequencies`)

        if (response.data && Array.isArray(response.data)) {
          setBillingFrequencies(response.data)
          if (response.data.length === 0) {
            setMessage({
              text: "No billing frequencies found in the database.",
              type: "warning",
            })
          } else {
            setMessage({ text: "", type: "" })
          }
        } else {
          setMessage({
            text: "Invalid response format from server.",
            type: "error",
          })
        }
      } catch (error) {
        console.error("Error fetching billing frequencies:", error)
        setMessage({
          text: `Failed to load billing frequencies: ${error.message}`,
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBillingFrequencies()
  }, [])

  // Handle dropdown change
  const handleChange = (e) => {
    setSelectedFrequency(e.target.value)
  }

  // Handle save button click
  const handleSave = async () => {
    if (!selectedFrequency) {
      setMessage({
        text: "Please select a billing frequency",
        type: "error",
      })
      return
    }

    try {
      setSaving(true)
      setMessage({ text: "", type: "" })

      // Send the lookup code to the backend
      const response = await axios.post(`${API_URL}/billing-frequency`, selectedFrequency, {
        headers: {
          "Content-Type": "text/plain",
        },
      })

      if (response.data.status === "error") {
        throw new Error(response.data.message || "Failed to save billing frequency")
      }

      setMessage({
        text: "Billing frequency saved successfully!",
        type: "success",
      })
    } catch (error) {
      console.error("Error saving billing frequency:", error)
      setMessage({
        text: `Failed to save: ${error.message}`,
        type: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="billing-form">
      <h2>Billing Frequency</h2>

      <div className="form-group">
        <label htmlFor="billingFrequency">Select Billing Frequency:</label>
        <select
          id="billingFrequency"
          value={selectedFrequency}
          onChange={handleChange}
          disabled={loading || saving}
          className="form-control"
        >
          <option value="">-- Select Frequency --</option>
          {billingFrequencies.map((frequency) => (
            <option key={frequency.lookupCode} value={frequency.lookupCode}>
              {frequency.meaning}
            </option>
          ))}
        </select>
      </div>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="form-actions">
        <button onClick={handleSave} disabled={loading || saving || !selectedFrequency} className="save-button">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  )
}

export default BillingFrequencyForm;
