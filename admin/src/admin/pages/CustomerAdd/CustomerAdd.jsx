import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiCalendar } from 'react-icons/fi'
import './CustomerAdd.scss'

const CustomerAdd = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    company: '',
    jobTitle: '',
    website: '',
    status: 'active',
    customerType: 'individual',
    preferredLanguage: 'english',
    marketingConsent: false,
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      sameAsBilling: true
    },
    paymentInfo: {
      preferredMethod: 'credit_card',
      creditLimit: 0,
      paymentTerms: '30'
    },
    notes: '',
    tags: []
  })
  
  const [newTag, setNewTag] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }
  
  const handleSameAsBilling = (e) => {
    const isChecked = e.target.checked
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        sameAsBilling: isChecked,
        ...(isChecked ? {
          street: prev.billingAddress.street,
          city: prev.billingAddress.city,
          state: prev.billingAddress.state,
          zipCode: prev.billingAddress.zipCode,
          country: prev.billingAddress.country
        } : {})
      }
    }))
  }
  
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }
  
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Customer created:', formData)
  }

  return (
    <div className="customer-add-page">
      <div className="page-header">
        <Link to="/admin/customers" className="back-btn">
          <FiArrowLeft /> Back to Customers
        </Link>
        <h1>Add New Customer</h1>
        <p>Create a new customer profile</p>
      </div>
      
      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-section">
          <h2 className="section-title">
            <FiUser className="section-icon" />
            Personal Information
          </h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name <span className="required">*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name <span className="required">*</span></label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Customer Type</label>
              <select name="customerType" value={formData.customerType} onChange={handleChange}>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
        
        {formData.customerType === 'business' && (
          <div className="form-section">
            <h2 className="section-title">
              <FiCreditCard className="section-icon" />
              Business Information
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Enter job title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        
        <div className="form-section">
          <h2 className="section-title">
            <FiMapPin className="section-icon" />
            Billing Address
          </h2>
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="billingAddress.street"
              placeholder="Enter street address"
              value={formData.billingAddress.street}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="billingAddress.city"
                placeholder="Enter city"
                value={formData.billingAddress.city}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>State/Province</label>
              <input
                type="text"
                name="billingAddress.state"
                placeholder="Enter state"
                value={formData.billingAddress.state}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>ZIP/Postal Code</label>
              <input
                type="text"
                name="billingAddress.zipCode"
                placeholder="Enter ZIP code"
                value={formData.billingAddress.zipCode}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Country</label>
              <select name="billingAddress.country" value={formData.billingAddress.country} onChange={handleChange}>
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IN">India</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2 className="section-title">
            <FiMapPin className="section-icon" />
            Shipping Address
          </h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.shippingAddress.sameAsBilling}
                onChange={handleSameAsBilling}
              />
              <span className="checkmark"></span>
              Same as billing address
            </label>
          </div>
          
          {!formData.shippingAddress.sameAsBilling && (
            <>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="shippingAddress.street"
                  placeholder="Enter street address"
                  value={formData.shippingAddress.street}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="shippingAddress.city"
                    placeholder="Enter city"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>State/Province</label>
                  <input
                    type="text"
                    name="shippingAddress.state"
                    placeholder="Enter state"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="shippingAddress.zipCode"
                    placeholder="Enter ZIP code"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Country</label>
                  <select name="shippingAddress.country" value={formData.shippingAddress.country} onChange={handleChange}>
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="form-section">
          <h2 className="section-title">
            <FiCreditCard className="section-icon" />
            Payment Information
          </h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Preferred Payment Method</label>
              <select name="paymentInfo.preferredMethod" value={formData.paymentInfo.preferredMethod} onChange={handleChange}>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Payment Terms (Days)</label>
              <select name="paymentInfo.paymentTerms" value={formData.paymentInfo.paymentTerms} onChange={handleChange}>
                <option value="0">Immediate</option>
                <option value="15">Net 15</option>
                <option value="30">Net 30</option>
                <option value="60">Net 60</option>
                <option value="90">Net 90</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Credit Limit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="paymentInfo.creditLimit"
              placeholder="0.00"
              value={formData.paymentInfo.creditLimit}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2 className="section-title">Additional Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Preferred Language</label>
              <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange}>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Marketing consent
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              <div className="add-tag">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag}>Add</button>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Additional notes about the customer"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <Link to="/admin/customers" className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="save-btn">
            <FiSave /> Create Customer
          </button>
        </div>
      </form>
    </div>
  )
}

export default CustomerAdd