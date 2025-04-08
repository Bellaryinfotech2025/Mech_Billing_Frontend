import { useState } from "react"
import { Save, X, Plus, FileText, Edit3 } from "lucide-react"
import "../Design Component/Alignment.css";

const Alignment = () => {
  const [alignmentData, setAlignmentData] = useState({
    orderNumber: "",
    service: "",
    drawingNumber: "",
    markNo: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setAlignmentData({
      ...alignmentData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Alignment data submitted:", alignmentData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="alignment-container">
      <div className="alignment-header">
        <h1>Alignments</h1>
        <div className="alignment-actions">
          <button className="btn btn-cancel">
            <X size={18} />
            <span>Cancel</span>
          </button>
          <button className="btn btn-save" onClick={handleSubmit}>
            <Save size={18} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="alignment-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="orderNumber">Order Number</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={alignmentData.orderNumber}
                  onChange={handleChange}
                  placeholder="Enter order number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service">Service</label>
              <div className="input-with-icon">
                <Edit3 size={16} className="input-icon" />
                <select id="service" name="service" value={alignmentData.service} onChange={handleChange}>
                  <option value="">Select service</option>
                  <option value="installation">Installation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="drawingNumber">Drawing Number</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  type="text"
                  id="drawingNumber"
                  name="drawingNumber"
                  value={alignmentData.drawingNumber}
                  onChange={handleChange}
                  placeholder="Enter drawing number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="markNo">Mark No</label>
              <div className="input-with-icon">
                <Edit3 size={16} className="input-icon" />
                <input
                  type="text"
                  id="markNo"
                  name="markNo"
                  value={alignmentData.markNo}
                  onChange={handleChange}
                  placeholder="Enter mark number"
                />
              </div>
            </div>
          </div>

          <div className="alignment-footer">
            <button type="button" className="btn btn-add">
              <Plus size={18} />
              <span>Add Alignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Alignment;

