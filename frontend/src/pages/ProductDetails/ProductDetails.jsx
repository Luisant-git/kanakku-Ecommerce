import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.scss";
import { getProductByIdApi, checkDownloadAccessApi, getUserRenewalDateApi } from "../../api/Product";
import { addToCartApi, getCartCountApi } from "../../api/Cart";
import { toast } from "react-toastify";


const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [downloadAccess, setDownloadAccess] = useState({ hasAccess: false });
  const [renewalDate, setRenewalDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProductById = async (id) => {
    setLoading(true);
    const response = await getProductByIdApi(parseInt(id));
    console.log("product by id", response);
    setProduct(response);
    
    // Set default selected version
    if (response.versions?.length > 0) {
      const defaultVersion = response.versions.find(v => v.isDefault) || response.versions[0];
      setSelectedVersion(defaultVersion);
    }
    
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
        
        // Get renewal date if user has access
        if (accessResponse.hasAccess) {
          const renewalResponse = await getUserRenewalDateApi(id);
          setRenewalDate(renewalResponse.nextRenewalDate);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    setLoading(false);
  };

  const handleAddToCart = async (product) => {
    setLoading(true);
    try {
      const data = {
        productId: product.id,
        versionId: selectedVersion?.id,
        quantity: quantity,
      };
      const response = await addToCartApi(data);
      if (response) {
        toast.success(downloadAccess.hasAccess && selectedVersion?.paymentRenewal !== 'ONE_TIME' ? "Renewal added to cart" : "Product added to cart");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
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

  if (loading) {
    return (
      <div className="product-details">
        <div className="container">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

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
            
            {/* Product Version Selection */}
            {product.versions?.length > 0 && (
              <div className="product-versions">
                <h3>Choose Your Plan</h3>
                <div className="version-options">
                  {product.versions.map((version) => (
                    <div 
                      key={version.id} 
                      className={`version-card ${selectedVersion?.id === version.id ? 'selected' : ''}`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <div className="version-header">
                        <h4>{version.version.replace('_', ' ')}</h4>
                        {version.isDefault && <span className="default-badge">Recommended</span>}
                      </div>
                      <div className="version-pricing">
                        <span className="version-price">₹{version.price.toLocaleString()}</span>
                        {version.renewalPrice && (
                          <span className="version-renewal">Renewal: ₹{version.renewalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="version-type">
                        <span className={`badge badge--${version.paymentRenewal.toLowerCase()}`}>
                          {version.paymentRenewal.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="product-details__pricing">
              {selectedVersion && (
                <>
                  <span className="product-details__price">₹{selectedVersion.price.toLocaleString()}</span>
                  {renewalDate && selectedVersion.renewalPrice && (
                    <div className="renewal-info">
                      <span className="product-details__renewal-price">
                        Renewal Price: ₹{selectedVersion.renewalPrice.toLocaleString()}
                      </span>
                      <small className="renewal-note">
                        * Renewal price applies for repeat purchases
                      </small>
                    </div>
                  )}
                </>
              )}
              {downloadAccess.hasAccess && (
                <div className="license-info">
                  <h4>License Information</h4>
                  <div className="license-details">
                    <p><strong>License No:</strong> {downloadAccess.licenseNo || 'N/A'}</p>
                    {renewalDate && (
                      <p><strong>Next Renewal:</strong> {new Date(renewalDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    )}
                  </div>
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
              <button 
                className="btn btn--primary" 
                onClick={async ()=> {await handleAddToCart(product); navigate('/cart')}}
                disabled={downloadAccess.hasAccess && selectedVersion?.paymentRenewal === 'ONE_TIME'}
              >
                {(() => {
                  if (downloadAccess.hasAccess && selectedVersion?.paymentRenewal === 'ONE_TIME') {
                    return 'Already Purchased';
                  }
                  if (downloadAccess.hasAccess && selectedVersion?.paymentRenewal !== 'ONE_TIME') {
                    return 'Add Renewal to Cart';
                  }
                  return 'Add to Cart';
                })()}
              </button>
              
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
