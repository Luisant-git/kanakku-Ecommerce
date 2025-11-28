import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Checkout.scss'
import { createDirectOrderApi } from '../../api/Order';
import { getUserProfileApi } from '../../api/Profile';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, selectedVersion } = location.state || {};
  
  const [formData, setFormData] = useState({
    // firstName: '',
    // lastName: '',
    // email: '',
    // phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'credit_card'
  })

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderError, setOrderError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const calculateOrderTotals = () => {
    if (selectedVersion) {
      const itemSubtotal = selectedVersion.price;
      const itemTax = itemSubtotal * 0.1;
      const itemTotal = itemSubtotal + itemTax;
      
      setSubtotal(itemSubtotal);
      setTax(itemTax);
      setTotal(itemTotal);
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await getUserProfileApi();
      if (response?.id) {
        setFormData(prev => ({
          ...prev,
          address: response.address || '',
          city: response.city || '',
          state: response.state || '',
          zip: response.pincode || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (!product || !selectedVersion) {
      toast.error('Invalid product selection');
      navigate('/products');
      return;
    }
    calculateOrderTotals();
    getUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {};
    
    // if (!formData.firstName.trim()) {
    //   newErrors.firstName = 'First name is required';
    //   toast.error('First name is required');
    // }
    // if (!formData.lastName.trim()) {
    //   newErrors.lastName = 'Last name is required';
    //   toast.error('Last name is required');
    // }
    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email is required';
    //   toast.error('Email is required');
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Email is invalid';
    //   toast.error('Email is invalid');
    // }
    // if (!formData.phone.trim()) {
    //   newErrors.phone = 'Phone is required';
    //   toast.error('Phone is required');
    // } else if (!/^\d{10}$/.test(formData.phone)) {
    //   newErrors.phone = 'Phone must be 10 digits';
    //   toast.error('Phone must be 10 digits');
    // }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      toast.error('Address is required');
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      toast.error('City is required');
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      toast.error('State is required');
    }
    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
      toast.error('ZIP code is required');
    } else if (!/^\d{5,6}$/.test(formData.zip)) {
      newErrors.zip = 'ZIP code must be 5-6 digits';
      toast.error('ZIP code must be 5-6 digits');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');
    
    if (!validateForm()) {
      return;
    }

    if (!product || !selectedVersion) {
      setOrderError('Invalid product selection');
      toast.error('Invalid product selection');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        productId: product.id,
        versionId: selectedVersion.id,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        paymentMethod: formData.paymentMethod
      };
      const response = await createDirectOrderApi(orderData);
      
      if (response) {
        // Redirect to order confirmation page
        // navigate('/order-confirmation', { state: { orderId: response.order.id } });
        navigate('/order-confirmation');
      } else {
        setOrderError(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Shipping Information</h2>
            {/* <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div> */}

            {/* <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div> */}

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Pin Code</label>
                <input 
                  type="text" 
                  id="zip" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="credit-card" 
                  checked={formData.paymentMethod === 'credit-card'} 
                  onChange={handleChange} 
                />
                <span>Credit Card</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="debit-card" 
                  checked={formData.paymentMethod === 'debit-card'} 
                  onChange={handleChange} 
                />
                <span>Debit Card</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="net-banking" 
                  checked={formData.paymentMethod === 'net-banking'} 
                  onChange={handleChange} 
                />
                <span>Net Banking</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi" 
                  checked={formData.paymentMethod === 'upi'} 
                  onChange={handleChange} 
                />
                <span>UPI</span>
              </label>
              <label className="payment-method">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'} 
                  onChange={handleChange} 
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button type="submit" className="btn btn--primary btn--block">Place Order</button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              <div className="summary-item">
                <div className="item-details">
                  <span>{product?.name}</span>
                  <small>{selectedVersion?.version.replace("_", " ")}</small>
                </div>
                <span>₹{selectedVersion?.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>GST (10%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout