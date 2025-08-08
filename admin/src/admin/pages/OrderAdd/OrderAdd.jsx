import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiSearch, FiUser, FiShoppingBag, FiCalendar, FiDollarSign } from 'react-icons/fi'
import './OrderAdd.scss'

const OrderAdd = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    paymentMethod: 'credit_card',
    paymentStatus: 'pending',
    shippingAddress: '',
    billingAddress: '',
    notes: '',
    discount: 0,
    tax: 0,
    shippingCost: 0
  })
  
  const [orderItems, setOrderItems] = useState([
    { id: 1, productId: '', productName: '', quantity: 1, price: 0, total: 0 }
  ])
  
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [customers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
  ])
  
  const [products] = useState([
    { id: 1, name: 'Premium Software License', price: 299.99 },
    { id: 2, name: 'E-book Collection', price: 49.99 },
    { id: 3, name: 'Online Course Access', price: 199.99 }
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email
    }))
    setShowCustomerSearch(false)
  }
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems]
    updatedItems[index][field] = value
    
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value))
      if (product) {
        updatedItems[index].productName = product.name
        updatedItems[index].price = product.price
      }
    }
    
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price
    setOrderItems(updatedItems)
  }
  
  const addOrderItem = () => {
    setOrderItems([...orderItems, {
      id: Date.now(),
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      total: 0
    }])
  }
  
  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index))
    }
  }
  
  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = (subtotal * formData.discount) / 100
    const taxAmount = ((subtotal - discountAmount) * formData.tax) / 100
    return subtotal - discountAmount + taxAmount + parseFloat(formData.shippingCost || 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      items: orderItems,
      subtotal: calculateSubtotal(),
      total: calculateTotal()
    }
    console.log('Order created:', orderData)
  }

  return (
    <div className="order-add-page">
      <div className="page-header">
        <Link to="/admin/orders" className="back-btn">
          <FiArrowLeft /> Back to Orders
        </Link>
        <h1>Create New Order</h1>
        <p>Add a new order to your system</p>
      </div>
      
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-section">
          <h2 className="section-title">
            <FiUser className="section-icon" />
            Customer Information
          </h2>
          
          <div className="customer-search">
            <div className="form-group">
              <label>Customer <span className="required">*</span></label>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search or enter customer name"
                  value={formData.customerName}
                  onChange={(e) => {
                    handleChange(e)
                    setShowCustomerSearch(e.target.value.length > 0)
                  }}
                  name="customerName"
                  required
                />
                <FiSearch className="search-icon" />
              </div>
              
              {showCustomerSearch && (
                <div className="customer-dropdown">
                  {customers
                    .filter(c => c.name.toLowerCase().includes(formData.customerName.toLowerCase()))
                    .map(customer => (
                      <div
                        key={customer.id}
                        className="customer-option"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="customer-name">{customer.name}</div>
                        <div className="customer-email">{customer.email}</div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Order Date <span className="required">*</span></label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiShoppingBag className="section-icon" />
              Order Items
            </h2>
            <button type="button" className="add-item-btn" onClick={addOrderItem}>
              <FiPlus /> Add Item
            </button>
          </div>
          
          <div className="order-items">
            {orderItems.map((item, index) => (
              <div key={item.id} className="order-item">
                <div className="item-row">
                  <div className="form-group flex-2">
                    <label>Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Total</label>
                    <input
                      type="text"
                      value={`$${item.total.toFixed(2)}`}
                      readOnly
                      className="readonly"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeOrderItem(index)}
                    disabled={orderItems.length === 1}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h2 className="section-title">
            <FiDollarSign className="section-icon" />
            Payment & Shipping
          </h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Payment Status</label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              name="shippingAddress"
              placeholder="Enter shipping address"
              value={formData.shippingAddress}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Order notes or special instructions"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-section order-summary">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="summary-row">
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Tax (%)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Shipping Cost</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="total-section">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Discount:</span>
              <span>-${((calculateSubtotal() * formData.discount) / 100).toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${(((calculateSubtotal() - (calculateSubtotal() * formData.discount) / 100) * formData.tax) / 100).toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${parseFloat(formData.shippingCost || 0).toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <Link to="/admin/orders" className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="save-btn">
            <FiSave /> Create Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderAdd
