"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, Search, Check } from "lucide-react"
import "../Mech Lines Design/select-parent-popup.css"

const SelectParentPopup = ({ parentLines, onSelect, onCancel }) => {
  const [selectedParent, setSelectedParent] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredParentLines, setFilteredParentLines] = useState(parentLines || [])

  useEffect(() => {
    if (parentLines) {
      setFilteredParentLines(
        parentLines.filter(
          (parent) =>
            parent.lineNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (parent.serviceName && parent.serviceName.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
      )
    }
  }, [searchTerm, parentLines])

  const handleSelect = (parent) => {
    setSelectedParent(parent)
    setShowDropdown(false)
  }

  const handleAddChild = () => {
    if (selectedParent) {
      onSelect(selectedParent)
    }
  }

  return (
    <div className="popup-overlay-popupchild--c">
      <div className="popup-container-popupchild--c">
        <div className="popup-header-popupchild--c">
          <h2>Select Parent Line</h2>
          <button className="close-button-popupchild--c" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="popup-content-popupchild--c">
          <div className="form-field-popupchild--c">
            <label>Select Parent Line</label>
            <div className="dropdown-container-popupchild--c">
              <div
                className="dropdown-trigger-popupchild--c"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ borderColor: showDropdown ? "#4f46e5" : "#d1d5db" }}
              >
                <span>
                  {selectedParent
                    ? `Line ${selectedParent.lineNumber} - ${selectedParent.serviceName || "No description"}`
                    : "Select a parent line"}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>

              {showDropdown && (
                <div className="dropdown-menu-popupchild--c">
                  <div style={{ padding: "8px", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search lines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 8px 8px 32px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      />
                      <Search
                        size={14}
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9ca3af",
                        }}
                      />
                    </div>
                  </div>

                  {filteredParentLines.length > 0 ? (
                    filteredParentLines.map((parent) => (
                      <div
                        key={parent.lineId}
                        className="dropdown-item-popupchild--c"
                        onClick={() => handleSelect(parent)}
                        style={{
                          backgroundColor:
                            selectedParent && selectedParent.lineId === parent.lineId ? "#f5f7ff" : "transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>{`Line ${parent.lineNumber} - ${parent.serviceName || "No description"}`}</span>
                          {selectedParent && selectedParent.lineId === parent.lineId && (
                            <Check size={16} style={{ color: "#4f46e5" }} />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "12px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
                      No matching parent lines found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="popup-footer-popupchild--c">
          <button className="cancel-button-popupchild--c" onClick={onCancel}>
            Cancel
          </button>
          <button className="add-button-popupchild--c" onClick={handleAddChild} disabled={!selectedParent}>
            Add Child
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectParentPopup;
