import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.scss";
import { getProductByIdApi, checkDownloadAccessApi } from "../../api/Product";
import { addToCartApi, getCartCountApi } from "../../api/Cart";
import { toast } from "react-toastify";


const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [downloadAccess, setDownloadAccess] = useState({ hasAccess: false });
  const navigate = useNavigate();

  const getProductById = async (id) => {
    const response = await getProductByIdApi(parseInt(id));
    console.log("product by id", response);
    setProduct(response);
    
    // Check download access if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // Decode JWT to get real user ID
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId;
        console.log('Real user ID from token:', userId);
        
        const accessResponse = await checkDownloadAccessApi(id, userId);
        setDownloadAccess(accessResponse);
        console.log('Download access response:', accessResponse);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  const handleAddToCart = async (product) => {
    const data = {
      productId: product.id,
      quantity: quantity,
    };
    const response = await addToCartApi(data);
    if (response) {
     toast.success("Product added to cart");
    }
  };

  const checkRenewalStatus = async () => {
    // This would be called from a new API endpoint
    // For now, we'll show renewal info if priceRenewal exists
    return product.priceRenewal ? true : false;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    getProductById(id);
  }, []);

  return (
    <div className="product-details">
      <div className="container">
        <div className="product-details__content">
          <div className="product-details__image">
            <img
              src={
                Array.isArray(product?.imageUrl) && product.imageUrl.length > 0
                  ? product.imageUrl[0]
                  : "example.jpg"
              }
              alt={product.name}
            />
          </div>

          <div className="product-details__info">
            <h1>{product.name}</h1>
            <div className="product-details__badges">
              {product.paymentRenewal && (
                <span className={`badge badge--${product.paymentRenewal.toLowerCase()}`}>
                  {product.paymentRenewal.replace('_', ' ')}
                </span>
              )}
            </div>
            <div className="product-details__pricing">
              <span className="product-details__price">₹{product.price}</span>
              {product.priceRenewal && (
                <div className="renewal-info">
                  <span className="product-details__renewal-price">
                    Renewal Price: ₹{product.priceRenewal}
                  </span>
                  <small className="renewal-note">
                    * Renewal price applies for repeat purchases
                  </small>
                </div>
              )}
            </div>

            {/* <div className="product-details__quantity">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                disabled
              />
            </div> */}

            <div className="product-details__actions">
              <button className="btn btn--primary" onClick={async ()=> {await handleAddToCart(product); navigate('/cart')}}>Add to Cart</button>
              
              {downloadAccess.hasAccess && downloadAccess.productSource && (
                <a 
                  href={downloadAccess.productSourceType === 'url' ? downloadAccess.productSource : `http://localhost:4010/uploads/${downloadAccess.productSource}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  download={downloadAccess.productSourceType === 'file' ? downloadAccess.productSource : undefined}
                >
                  {downloadAccess.productSourceType === 'url' ? 'Visit Product' : 'Download'}
                </a>
              )}
              
              {product.productSource && !downloadAccess.hasAccess && localStorage.getItem('token') && (
                <div className="access-message">
                  <small>Download available after purchase completion</small>
                </div>
              )}
            </div>

            <div className="product-details__description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* <div className="product-details__features">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
