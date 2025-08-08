import { useState } from 'react'
import { FiSave } from 'react-icons/fi'
import './Settings.scss'

const Settings = () => {
  const [formData, setFormData] = useState({
    storeName: 'Kanakku E-commerce',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    emailNotifications: true,
    maintenanceMode: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Settings saved:', formData)
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>General Settings</h2>
          
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
                <option value="America/New_York">New York (America/New_York)</option>
                <option value="Europe/London">London (Europe/London)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Notification Settings</h2>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            <label htmlFor="emailNotifications">Enable Email Notifications</label>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Maintenance Mode</h2>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
            />
            <label htmlFor="maintenanceMode">Enable Maintenance Mode</label>
          </div>
          
          {formData.maintenanceMode && (
            <div className="form-group">
              <label>Maintenance Message</label>
              <textarea
                placeholder="We'll be back soon!"
                rows="3"
              />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FiSave /> Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings