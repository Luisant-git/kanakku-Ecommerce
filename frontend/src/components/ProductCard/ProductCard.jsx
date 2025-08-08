import { Link } from 'react-router-dom'
import './ProductCard.scss'

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card__image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card__info">
          <h3>{product.name}</h3>
          <span className="product-card__category">{product.category}</span>
          <span className="product-card__price">₹{product.price.toLocaleString()}</span>
          <button className="btn btn--small">Add to Cart</button>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard