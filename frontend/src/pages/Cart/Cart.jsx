import { Link } from "react-router-dom";
import "./Cart.scss";
import { useEffect, useState } from "react";
import { getCartApi, removeFromCartApi } from "../../api/Cart";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const getCartItems = async () => {
    // API call to fetch cart items
    const response = await getCartApi();
    setCartItems(response?.items);
    setSubtotal(response?.subtotal)
    setTax(response?.tax)
    setTotal(response?.total)
    console.log(response);
  };

  const handleRemoveFromCart = async (productId) => {
    // API call to remove item from cart
    const response = await removeFromCartApi(productId);
    console.log(response);
    toast.success('Item removed from cart');
    getCartItems();
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn--primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item__image">
                    <img
                      src={
                        Array.isArray(item?.product.imageUrl) &&
                        item.product.imageUrl.length > 0
                          ? item.product.imageUrl[0]
                          : "example.jpg"
                      }
                      alt={item.product.name}
                    />
                  </div>
                  <div className="cart-item__info">
                    <h3>{item.product.name}</h3>
                    <span className="cart-item__price">₹{item.product.price}</span>
                  </div>
                  <div className="cart-item__quantity">
                    <input
                      type="number"
                      min="1"
                      value={1}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="cart-item__total">
                    ₹{item.product.price}
                  </div>
                  <button className="cart-item__remove" onClick={()=>handleRemoveFromCart(item?.product?.id)}>×</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
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
              <Link to="/checkout" className="btn btn--primary btn--block">
                Proceed to Checkout
              </Link>
              <Link to="/products" className="btn btn--outline btn--block">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
