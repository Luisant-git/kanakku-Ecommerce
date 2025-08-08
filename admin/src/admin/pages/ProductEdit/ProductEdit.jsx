import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiTrash2, FiUpload, FiX, FiPackage, FiDollarSign, FiBarChart, FiTag, FiCalendar, FiAlertTriangle } from 'react-icons/fi'
import './ProductEdit.scss'

const ProductEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: 'Premium Accounting Software Pro',
    description: 'Professional accounting software designed for small to medium businesses with advanced reporting features',
    shortDescription: 'Professional accounting software for businesses',
    price: '299.99',
    comparePrice: '399.99',
    costPrice: '150.00',
    category: 'software',
    subCategory: 'accounting',
    brand: 'kanakku',
    sku: 'KNK-ACC-PRO-001',
    barcode: '1234567890123',
    stock: '45',
    minStock: '10',
    maxStock: '100',
    status: 'active',
    visibility: 'visible',
    featured: true,
    weight: '0',
    dimensions: {
      length: '0',
      width: '0',
      height: '0'
    },
    seo: {
      title: 'Premium Accounting Software Pro - Kanakku',
      description: 'Professional accounting software with advanced features',
      keywords: 'accounting, software, business, finance'
    },
    tags: ['accounting', 'software', 'business', 'finance'],
    images: [],
    variants: [],
    createdAt: '2024-01-15',
    updatedAt: new Date().toISOString().split('T')[0]
  })
  
  const [imagePreview, setImagePreview] = useState([
    '/src/assets/product-sample.jpg'
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showImageDeleteModal, setShowImageDeleteModal] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [newTag, setNewTag] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    console.log('Loading product:', id)
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }
  
  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index))
    setShowImageDeleteModal(false)
    setImageToDelete(null)
  }
  
  const handleImageDeleteClick = (index) => {
    setImageToDelete(index)
    setShowImageDeleteModal(true)
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
    console.log('Product updated:', formData)
  }

  const handleDelete = () => {
    console.log('Product deleted:', id)
    navigate('/admin/products')
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiPackage },
    { id: 'pricing', label: 'Pricing', icon: FiDollarSign },
    { id: 'inventory', label: 'Inventory', icon: FiBarChart },
    { id: 'seo', label: 'SEO', icon: FiTag },
    { id: 'media', label: 'Media', icon: FiUpload }
  ]



  return (
    <div className="product-edit-page">
      <div className="page-header">
        <div className="header-left">
          <Link to="/admin/products" className="back-btn">
            <FiArrowLeft /> Back to Products
          </Link>
          <div className="header-content">
            <h1>Edit Product</h1>
            <div className="product-meta">
              <span className="product-id">ID: #{id}</span>
              <span className="status-badge">
                {formData.status}
              </span>
            </div>
          </div>
        </div>
        <button 
          type="button" 
          className="delete-btn"
          onClick={() => setShowDeleteModal(true)}
        >
          <FiTrash2 /> Delete
        </button>
      </div>
      
      <div className="product-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon /> {tab.label}
            </button>
          )
        })}
      </div>
      
      <form onSubmit={handleSubmit} className="product-form">
        {activeTab === 'basic' && (
          <div className="form-section">
            <h2 className="section-title">
              <FiPackage className="section-icon" />
              Basic Information
            </h2>
            
            <div className="form-group">
              <label>Product Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Short Description</label>
              <input
                type="text"
                name="shortDescription"
                placeholder="Brief product description"
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Detailed product description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="software">Software</option>
                  <option value="ebook">E-book</option>
                  <option value="service">Service</option>
                  <option value="course">Course</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange}>
                  <option value="">Select Brand</option>
                  <option value="kanakku">Kanakku</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="adobe">Adobe</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>SKU</label>
                <input
                  type="text"
                  name="sku"
                  placeholder="Product SKU"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <label>Featured Product</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="form-section">
            <h2 className="section-title">
              <FiDollarSign className="section-icon" />
              Pricing Information
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Price <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Compare Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="comparePrice"
                  placeholder="0.00"
                  value={formData.comparePrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Cost Price</label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={handleChange}
              />
            </div>
            
            <div className="pricing-summary">
              <div className="summary-row profit">
                <span>Profit Margin:</span>
                <span>${(parseFloat(formData.price || 0) - parseFloat(formData.costPrice || 0)).toFixed(2)}</span>
              </div>
              <div className="summary-row percentage">
                <span>Profit %:</span>
                <span>
                  {formData.costPrice > 0 ? 
                    (((parseFloat(formData.price || 0) - parseFloat(formData.costPrice || 0)) / parseFloat(formData.costPrice)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="form-section">
            <h2 className="section-title">
              <FiBarChart className="section-icon" />
              Inventory Management
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Current Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Minimum Stock</label>
                <input
                  type="number"
                  name="minStock"
                  placeholder="0"
                  value={formData.minStock}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Maximum Stock</label>
              <input
                type="number"
                name="maxStock"
                placeholder="0"
                value={formData.maxStock}
                onChange={handleChange}
              />
            </div>
            
            <div className={`stock-status ${
              parseInt(formData.stock) <= parseInt(formData.minStock) ? 'low-stock' :
              parseInt(formData.stock) >= parseInt(formData.maxStock) ? 'overstock' : 'normal'
            }`}>
              {parseInt(formData.stock) <= parseInt(formData.minStock) && (
                <><FiAlertTriangle /> Low Stock Warning</>
              )}
              {parseInt(formData.stock) >= parseInt(formData.maxStock) && (
                <><FiAlertTriangle /> Overstock Warning</>
              )}
              {parseInt(formData.stock) > parseInt(formData.minStock) && parseInt(formData.stock) < parseInt(formData.maxStock) && (
                <>Stock Level Normal</>
              )}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="form-section">
            <h2 className="section-title">
              <FiTag className="section-icon" />
              SEO Optimization
            </h2>
            
            <div className="form-group">
              <label>SEO Title</label>
              <input
                type="text"
                name="seo.title"
                placeholder="SEO optimized title"
                value={formData.seo.title}
                onChange={handleChange}
                maxLength="60"
              />
              <small className="character-count">{formData.seo.title.length}/60 characters</small>
            </div>
            
            <div className="form-group">
              <label>Meta Description</label>
              <textarea
                name="seo.description"
                placeholder="SEO meta description"
                value={formData.seo.description}
                onChange={handleChange}
                rows="3"
                maxLength="160"
              />
              <small className="character-count">{formData.seo.description.length}/160 characters</small>
            </div>
            
            <div className="form-group">
              <label>Keywords</label>
              <input
                type="text"
                name="seo.keywords"
                placeholder="Comma separated keywords"
                value={formData.seo.keywords}
                onChange={handleChange}
              />
            </div>
            
            <div className="seo-preview">
              <h3>Search Preview</h3>
              <div className="preview-card">
                <div className="preview-title">{formData.seo.title || formData.name}</div>
                <div className="preview-url">https://kanakku.com/products/{formData.name.toLowerCase().replace(/\s+/g, '-')}</div>
                <div className="preview-description">{formData.seo.description || formData.shortDescription}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="form-section">
            <h2 className="section-title">
              <FiUpload className="section-icon" />
              Product Images
            </h2>
            
            <div className="image-upload">
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <FiUpload className="upload-icon" />
                <div className="upload-text">Click to upload images</div>
                <div className="upload-hint">PNG, JPG, GIF up to 10MB each</div>
              </div>
              
              {imagePreview.length > 0 && (
                <div className="image-preview">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(index)}
                      >
                        <FiX />
                      </button>
                      {index === 0 && <span className="primary-badge">Primary</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <Link to="/admin/products" className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="save-btn">
            <FiSave /> Update Product
          </button>
        </div>
      </form>
      
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <FiAlertTriangle className="warning-icon" />
              <h3>Delete Product</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="product-info">
                Product: <strong>{formData.name}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="confirm-btn"
                onClick={handleDelete}
              >
                <FiTrash2 /> Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductEdit