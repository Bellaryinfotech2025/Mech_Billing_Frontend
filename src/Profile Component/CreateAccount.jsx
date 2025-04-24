import React, { useState, useRef } from 'react';
import '../Profile Design/AccountCreation.css';

const AccountCreation = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    panNumber: '',
    gstNumber: '',
    gender: 'male',
    profileImage: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prevData => ({
          ...prevData,
          profileImage: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    if (isEditing) {
      setToastMessage('Profile updated successfully!');
    } else {
      setToastMessage('Account created successfully!');
    }
    
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    
    if (!isEditing) {
      setIsEditing(true);
    }
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="account-creation-container">
      <div className="form-card">
        <div className="card-header">
          <h1>{isEditing ? 'Edit Profile' : 'Create Account'}</h1>
          <p className="subtitle">
            {isEditing 
              ? 'Update your profile information below' 
              : 'Join our platform by creating your account'}
          </p>
        </div>
        
        <div className="profile-image-container">
          <div 
            className="profile-image" 
            onClick={handleImageClick}
            style={{ 
              backgroundImage: formData.profileImage 
                ? `url(${formData.profileImage})` 
                : 'none' 
            }}
          >
            {!formData.profileImage && (
              <div className="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m16 16-4-4-4 4"></path>
                </svg>
                <span>Upload Image</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                required
                placeholder="Enter vendor name"
              />
            </div>
            
            <div className="form-group">
              
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group full-width">
              
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your complete address"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group">
              
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="form-group">
              
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
            
            <div className="form-group">
              
              <input
                type="text"
                id="panNumber"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                required
                placeholder="Enter PAN number"
              />
            </div>
            
            <div className="form-group">
              
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                required
                placeholder="Enter GST number"
              />
            </div>
            
             
          </div>
          
          <div className="button-group">
            {isEditing && (
              <button 
                type="button" 
                className="secondary-button"
                onClick={toggleEditMode}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="primary-button">
              {isEditing ? 'Update Profile' : 'Create Account'}
            </button>
          </div>
        </form>
        
        {!isEditing && (
          <div className="login-link">
            Already have an account? <a href="#">Log in</a>
          </div>
        )}
      </div>
      
      {showToast && (
        <div className="toast-container">
          <div className="toast success">
            <div className="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="toast-content">
              <p>{toastMessage}</p>
            </div>
            <button 
              className="toast-close" 
              onClick={() => setShowToast(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {isEditing && (
        <div className="edit-mode-indicator">
          <div className="indicator-dot"></div>
          <span>Edit Mode</span>
        </div>
      )}
    </div>
  );
};

export default AccountCreation;