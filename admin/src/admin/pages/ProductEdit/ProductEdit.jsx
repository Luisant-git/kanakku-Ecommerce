import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiTrash2, FiUpload, FiX, FiPackage, FiDollarSign, FiBarChart, FiTag, FiCalendar, FiAlertTriangle } from 'react-icons/fi'

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

  const pageStyle = {
    padding: '2rem',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  }

  const tabsStyle = {
    display: 'flex',
    background: 'white',
    borderRadius: '12px',
    padding: '0.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    overflowX: 'auto'
  }

  const tabBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'transparent',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#718096',
    whiteSpace: 'nowrap',
    fontSize: '0.9rem'
  }

  const tabBtnActiveStyle = {
    ...tabBtnStyle,
    background: '#0180b5',
    color: 'white'
  }

  const formSectionStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    marginBottom: '2rem'
  }

  const sectionTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '2rem'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    backgroundColor: '#ffffff'
  }

  const labelStyle = {
    display: 'block',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '0.5rem',
    fontSize: '0.9rem'
  }

  const formGroupStyle = {
    marginBottom: '1.5rem'
  }

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <Link to="/admin/products" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0180b5', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem'}}>
          <FiArrowLeft /> Back to Products
        </Link>
        <div style={{flex: 1, marginLeft: '2rem'}}>
          <h1 style={{margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700', color: '#1a202c'}}>Edit Product</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{color: '#718096', fontSize: '0.9rem'}}>ID: #{id}</span>
            <span style={{padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
              {formData.status}
            </span>
          </div>
        </div>
        <button 
          type="button" 
          style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '0.9rem'}}
          onClick={() => setShowDeleteModal(true)}
        >
          <FiTrash2 /> Delete
        </button>
      </div>
      
      <div style={tabsStyle}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              style={activeTab === tab.id ? tabBtnActiveStyle : tabBtnStyle}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon /> {tab.label}
            </button>
          )
        })}
      </div>
      
      <form onSubmit={handleSubmit}>
        {activeTab === 'basic' && (
          <div style={formSectionStyle}>
            <h2 style={sectionTitleStyle}>
              <FiPackage style={{color: '#0180b5', fontSize: '1.1rem'}} />
              Basic Information
            </h2>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Product Name <span style={{color: '#e53e3e'}}>*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Short Description</label>
              <input
                type="text"
                name="shortDescription"
                placeholder="Brief product description"
                value={formData.shortDescription}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                placeholder="Detailed product description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                style={{...inputStyle, resize: 'vertical', minHeight: '100px'}}
              />
            </div>
            
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Category <span style={{color: '#e53e3e'}}>*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{...inputStyle, cursor: 'pointer'}}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="software">Software</option>
                  <option value="ebook">E-book</option>
                  <option value="service">Service</option>
                  <option value="course">Course</option>
                  <option value="template">Template</option>
                </select>
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Sub Category</label>
                <select name="subCategory" value={formData.subCategory} onChange={handleChange} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="">Select Sub Category</option>
                  <option value="accounting">Accounting</option>
                  <option value="crm">CRM</option>
                  <option value="inventory">Inventory</option>
                  <option value="hr">Human Resources</option>
                </select>
              </div>
            </div>
            
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="">Select Brand</option>
                  <option value="kanakku">Kanakku</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="adobe">Adobe</option>
                  <option value="google">Google</option>
                </select>
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>SKU</label>
                <input
                  type="text"
                  name="sku"
                  placeholder="Product SKU"
                  value={formData.sku}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  placeholder="Product barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '500', color: '#4a5568', marginBottom: '0'}}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{accentColor: '#0180b5'}}
                />
                Featured Product
              </label>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Tags</label>
              <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', backgroundColor: '#ffffff', minHeight: '60px'}}>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem'}}>
                  {formData.tags.map((tag, index) => (
                    <span key={index} style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(1, 128, 181, 0.1)', color: '#0180b5', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '500'}}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} style={{background: 'none', border: 'none', color: '#0180b5', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1', padding: '0', marginLeft: '0.25rem'}}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <input
                    type="text"
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    style={{flex: 1, border: 'none', padding: '0.5rem', fontSize: '0.875rem', background: 'transparent'}}
                  />
                  <button type="button" onClick={addTag} style={{background: '#0180b5', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer'}}>Add</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'pricing' && (
          <div style={formSectionStyle}>
            <h2 style={sectionTitleStyle}>
              <FiDollarSign style={{color: '#0180b5', fontSize: '1.1rem'}} />
              Pricing Information
            </h2>
            
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Price <span style={{color: '#e53e3e'}}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Compare Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="comparePrice"
                  placeholder="0.00"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Cost Price</label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            
            <div style={{background: '#f7fafc', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', fontWeight: '500'}}>
                <span>Profit Margin:</span>
                <span style={{color: '#10b981', fontWeight: '600'}}>
                  ${(parseFloat(formData.price || 0) - parseFloat(formData.costPrice || 0)).toFixed(2)}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', fontWeight: '500'}}>
                <span>Profit %:</span>
                <span style={{color: '#0180b5', fontWeight: '600'}}>
                  {formData.costPrice > 0 ? 
                    (((parseFloat(formData.price || 0) - parseFloat(formData.costPrice || 0)) / parseFloat(formData.costPrice)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div style={formSectionStyle}>
            <h2 style={sectionTitleStyle}>
              <FiBarChart style={{color: '#0180b5', fontSize: '1.1rem'}} />
              Inventory Management
            </h2>
            
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Current Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Minimum Stock</label>
                <input
                  type="number"
                  name="minStock"
                  placeholder="0"
                  value={formData.minStock}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Maximum Stock</label>
              <input
                type="number"
                name="maxStock"
                placeholder="0"
                value={formData.maxStock}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            
            <div style={{margin: '1.5rem 0'}}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                ...(parseInt(formData.stock) <= parseInt(formData.minStock) ? 
                  {background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'} :
                  parseInt(formData.stock) >= parseInt(formData.maxStock) ?
                  {background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'} :
                  {background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'})
              }}>
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
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                name="weight"
                placeholder="0.00"
                value={formData.weight}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Dimensions (cm)</label>
              <div style={{...formRowStyle, marginTop: '0.5rem'}}>
                <div style={formGroupStyle}>
                  <input
                    type="number"
                    step="0.01"
                    name="dimensions.length"
                    placeholder="Length"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <input
                    type="number"
                    step="0.01"
                    name="dimensions.width"
                    placeholder="Width"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <input
                    type="number"
                    step="0.01"
                    name="dimensions.height"
                    placeholder="Height"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'seo' && (
          <div style={formSectionStyle}>
            <h2 style={sectionTitleStyle}>
              <FiTag style={{color: '#0180b5', fontSize: '1.1rem'}} />
              SEO Optimization
            </h2>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>SEO Title</label>
              <input
                type="text"
                name="seo.title"
                placeholder="SEO optimized title"
                value={formData.seo.title}
                onChange={handleChange}
                maxLength="60"
                style={inputStyle}
              />
              <small style={{color: '#718096', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block'}}>{formData.seo.title.length}/60 characters</small>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Meta Description</label>
              <textarea
                name="seo.description"
                placeholder="SEO meta description"
                value={formData.seo.description}
                onChange={handleChange}
                rows="3"
                maxLength="160"
                style={{...inputStyle, resize: 'vertical', minHeight: '80px'}}
              />
              <small style={{color: '#718096', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block'}}>{formData.seo.description.length}/160 characters</small>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Keywords</label>
              <input
                type="text"
                name="seo.keywords"
                placeholder="Comma separated keywords"
                value={formData.seo.keywords}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            
            <div style={{marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0'}}>
              <h3 style={{marginBottom: '1rem', color: '#2d3748', fontSize: '1.1rem'}}>Search Preview</h3>
              <div style={{background: '#f7fafc', borderRadius: '8px', padding: '1.5rem'}}>
                <div style={{color: '#1a0dab', fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem'}}>{formData.seo.title || formData.name}</div>
                <div style={{color: '#006621', fontSize: '0.9rem', marginBottom: '0.5rem'}}>https://kanakku.com/products/{formData.name.toLowerCase().replace(/\s+/g, '-')}</div>
                <div style={{color: '#545454', fontSize: '0.9rem', lineHeight: '1.4'}}>{formData.seo.description || formData.shortDescription}</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'media' && (
          <div style={formSectionStyle}>
            <h2 style={sectionTitleStyle}>
              <FiUpload style={{color: '#0180b5', fontSize: '1.1rem'}} />
              Product Images
            </h2>
            
            <div style={{border: '2px dashed #cbd5e0', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#f7fafc', cursor: 'pointer', position: 'relative', marginBottom: '2rem'}}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{position: 'absolute', inset: '0', opacity: '0', cursor: 'pointer'}}
              />
              <FiUpload style={{width: '48px', height: '48px', margin: '0 auto 1rem', color: '#a0aec0'}} />
              <div style={{fontWeight: '500', color: '#4a5568', marginBottom: '0.5rem'}}>Click to upload images</div>
              <div style={{fontSize: '0.875rem', color: '#718096'}}>PNG, JPG, GIF up to 10MB each</div>
            </div>
            
            {imagePreview.length > 0 && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem'}}>
                {imagePreview.map((image, index) => (
                  <div key={index} style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0'}}>
                    <img src={image} alt={`Product ${index + 1}`} style={{width: '100%', height: '150px', objectFit: 'cover'}} />
                    {/* Remove (cross) icon overlay */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 2,
                        fontSize: '1.2rem',
                        padding: 0
                      }}
                      aria-label="Remove image"
                    >
                      <FiX />
                    </button>
                    {index === 0 && <span style={{position: 'absolute', bottom: '8px', left: '8px', background: '#0180b5', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500'}}>Primary</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.9rem'}}>
            <FiCalendar /> Last updated: {formData.updatedAt}
          </span>
          <div style={{display: 'flex', gap: '1rem'}}>
            <Link to="/admin/products" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: '#718096', border: '1px solid #e2e8f0', padding: '0.875rem 2rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', fontSize: '0.95rem'}}>
              Cancel
            </Link>
            <button type="submit" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0180b5', color: 'white', border: 'none', padding: '0.875rem 2rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '0.95rem'}}>
              <FiSave /> Update Product
            </button>
          </div>
        </div>
      </form>
      
      {showDeleteModal && (
        <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000'}}>
          <div style={{background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
              <FiAlertTriangle style={{color: '#ef4444', fontSize: '1.5rem'}} />
              <h3 style={{margin: '0', color: '#2d3748', fontSize: '1.25rem'}}>Delete Product</h3>
            </div>
            <div style={{marginBottom: '2rem'}}>
              <p style={{color: '#4a5568', marginBottom: '1rem', lineHeight: '1.5'}}>Are you sure you want to delete this product? This action cannot be undone.</p>
              <p style={{background: '#f7fafc', padding: '0.75rem', borderRadius: '6px', margin: '0'}}>Product: <strong>{formData.name}</strong></p>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
              <button 
                type="button" 
                style={{background: 'transparent', color: '#718096', border: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer'}}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500', cursor: 'pointer'}}
                onClick={handleDelete}
              >
                <FiTrash2 /> Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image delete modal removed: images are now deleted instantly without confirmation */}
    </div>
  )
}

export default ProductEdit