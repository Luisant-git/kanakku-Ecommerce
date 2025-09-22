import { Link } from "react-router-dom";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const defaultVersion = product.versions?.find(v => v.isDefault) || product.versions?.[0];
  
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
            {defaultVersion?.paymentRenewal && (
              <span className={`badge badge--${defaultVersion.paymentRenewal.toLowerCase()}`}>
                {defaultVersion.paymentRenewal.replace('_', ' ')}
              </span>
            )}
          </div>
          <div className="product-card__pricing">
            {defaultVersion?.price && (
              <span className="product-card__price">
                ₹{defaultVersion.price.toLocaleString()}
              </span>
            )}
            {defaultVersion?.renewalPrice && (
              <span className="product-card__renewal-price">
                Renewal: ₹{defaultVersion.renewalPrice.toLocaleString()}
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
