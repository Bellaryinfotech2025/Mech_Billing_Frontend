"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import "../Mech Lines Design/select-parent-popup.css"

const SelectParentPopup = ({ parentLines, onSelect, onCancel }) => {
  const [selectedParent, setSelectedParent] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

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
              <div className="dropdown-trigger-popupchild--c" onClick={() => setShowDropdown(!showDropdown)}>
                <span>
                  {selectedParent
                    ? `Line ${selectedParent.lineNumber} - ${selectedParent.serviceName}`
                    : "Select a parent line"}
                </span>
                <ChevronDown size={16} />
              </div>

              {showDropdown && (
                <div className="dropdown-menu-popupchild--c">
                  {parentLines.map((parent) => (
                    <div
                      key={parent.lineId}
                      className="dropdown-item-popupchild--c"
                      onClick={() => handleSelect(parent)}
                    >
                      Line {parent.lineNumber} - {parent.serviceName}
                    </div>
                  ))}
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
