import { Link } from "react-router-dom";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card__image">
          <img
            src={
              Array.isArray(product?.imageUrl) && product.imageUrl.length > 0
                ? product.imageUrl[0]
                : "example.jpg"
            }
            alt={product.name}
          />
        </div>
        <div className="product-card__info">
          <h3>{product.name}</h3>
          <div className="product-card__badges">
            {product.paymentRenewal && (
              <span className={`badge badge--${product.paymentRenewal.toLowerCase()}`}>
                {product.paymentRenewal.replace('_', ' ')}
              </span>
            )}
          </div>
          <div className="product-card__pricing">
            <span className="product-card__price">
              ₹{product.price.toLocaleString()}
            </span>
            {product.priceRenewal && (
              <span className="product-card__renewal-price">
                Renewal: ₹{product.priceRenewal.toLocaleString()}
              </span>
            )}
          </div>
          <button className="btn btn--small">View Detail</button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
