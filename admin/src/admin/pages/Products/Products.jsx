import { useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import { FiEdit2, FiTrash2, FiPlus, FiAlertTriangle } from 'react-icons/fi'
import './Products.scss'

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Accounting Software Pro', price: 4999, category: 'Software', stock: 45, status: 'active', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center' },
    { id: 2, name: 'Business Tax Guide', price: 999, category: 'E-book', stock: 120, status: 'active', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop&crop=center' },
    { id: 3, name: 'Financial Consultation', price: 19900, category: 'Service', stock: null, status: 'active', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop&crop=center' },
    { id: 4, name: 'GST Filing Service', price: 9900, category: 'Service', stock: null, status: 'inactive', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center' },
    { id: 5, name: 'Company Registration', price: 29900, category: 'Service', stock: null, status: 'active', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center' },
  ])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id))
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const columns = [
    { key: 'id', label: 'ID', render: (value) => `P${value.toString().padStart(3, '0')}` },
    { 
      key: 'image', 
      label: 'Image',
      render: (value, row) => (
        <img src={value} alt={row.name} className="product-image" />
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', render: (value) => `₹${value.toLocaleString()}` },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock', render: (value) => value || 'N/A' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="actions">
          <Link to={`/admin/products/edit/${row.id}`} className="edit-btn">
            <FiEdit2 />
          </Link>
          <button className="delete-btn" onClick={() => handleDeleteClick(row)}>
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/admin/products/add" className="add-product-btn">
          <FiPlus /> Add Product
        </Link>
      </div>
      <DataTable data={products} columns={columns} />
      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <FiAlertTriangle className="warning-icon" />
              <h3>Delete Product</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="product-info">
                <strong>{productToDelete?.name}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn" 
                onClick={handleDeleteConfirm}
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

export default Products