import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiUpload, FiX } from 'react-icons/fi'
import './ProductAdd.scss'

const ProductAdd = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'software',
    stock: '',
    status: 'active',
    image: null
  })
  
  const [imagePreview, setImagePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit logic here
    console.log('Product added:', formData)
  }

  return (
    <div className="product-add-page">
      <div className="page-header">
        <Link to="/admin/products" className="back-btn">
          <FiArrowLeft /> Back to Products
        </Link>
        <h1>Add Product</h1>
        <p>Create a new product for your store</p>
      </div>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          
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
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="software">Software</option>
                <option value="ebook">E-book</option>
                <option value="service">Service</option>
                <option value="course">Course</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Sub Category</label>
              <select name="subCategory">
                <option value="">Select Sub Category</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Brand</label>
            <select name="brand">
              <option value="">Select Brand</option>
            </select>
          </div>
        </div>
        
        <div className="form-section image-section">
          <h2 className="section-title">Product Images</h2>
          
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <FiUpload className="upload-icon" />
            <div className="upload-text">Click to upload images</div>
            <div className="upload-subtext">PNG, JPG, GIF up to 10MB</div>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => {
                    setImagePreview(null)
                    setFormData(prev => ({ ...prev, image: null }))
                  }}
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h2 className="section-title">Pricing & Inventory</h2>
          
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
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <Link to="/admin/products" className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="save-btn">
            <FiSave /> Save Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductAdd