import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.scss";
import { getProductByIdApi } from "../../api/Product";
import { addToCartApi, getCartCountApi } from "../../api/Cart";
import { toast } from "react-toastify";


const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const navigate = useNavigate();

  const getProductById = async (id) => {
    const response = await getProductByIdApi(parseInt(id));
    console.log("product by id", response);
    setProduct(response);
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
            {/* <span className="product-details__category">{product.category}</span> */}
            <span className="product-details__price">₹{product.price}</span>

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

            <button className="btn btn--primary" onClick={async ()=> {await handleAddToCart(product); navigate('/cart')}}>Add to Cart</button>

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
