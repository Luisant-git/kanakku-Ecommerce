import { useParams } from 'react-router-dom'
import { useState } from 'react'
import './ProductDetails.scss'

// Temporary data - replace with API call
const product = {
  id: 1,
  name: 'Premium Accounting Software',
  price: 4999,
  image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  category: 'Software',
  description: 'Our premium accounting software provides comprehensive financial management solutions for businesses of all sizes. With intuitive interfaces and powerful features, streamline your accounting processes and gain valuable insights into your financial health.',
  features: [
    'Automated invoicing and billing',
    'Real-time financial reporting',
    'GST compliance and filing',
    'Multi-user access with role-based permissions',
    'Cloud synchronization for remote access'
  ]
}

const ProductDetails = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)

  // In a real app, you would fetch the product data based on the id
  // useEffect(() => {
  //   fetchProduct(id)
  // }, [id])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  return (
    <div className="product-details">
      <div className="container">
        <div className="product-details__content">
          <div className="product-details__image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details__info">
            <h1>{product.name}</h1>
            <span className="product-details__category">{product.category}</span>
            <span className="product-details__price">₹{product.price.toLocaleString()}</span>

            <div className="product-details__quantity">
              <label htmlFor="quantity">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange}
              />
            </div>

            <button className="btn btn--primary">Add to Cart</button>

            <div className="product-details__description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-details__features">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails