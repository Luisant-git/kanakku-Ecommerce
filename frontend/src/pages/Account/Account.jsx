import { Link, useLocation } from "react-router-dom";
import "./Account.scss";
import { useEffect, useState } from "react";
import { getUserProfileApi, updateUserProfileApi } from "../../api/Profile";
import { toast } from "react-toastify";
import AccountDetails from "./AccountDetails";
import MyOrders from "./MyOrders";
import { getOrdersByUserApi } from "../../api/Order";

const Account = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  console.log(orders);

  const getUserProfile = async () => {
    const res = await getUserProfileApi();
    if (res.status === 401) {
      toast.error("Please login to continue");
      return;
    } else if (res?.id) {
      setUser(res);
    } else {
      toast.error("Something went wrong!");
    }
  };

  const getOrdersByUser = async () => {
    const res = await getOrdersByUserApi();
    if (res.status === 401) {
      toast.error("Please login to continue");
      return;
    } else if (res) {
      setOrders(res);
    }
  };

  useEffect(() => {
    getUserProfile();
    getOrdersByUser();
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const renderContent = () => {
    const path = location.pathname;

    if (path === "/account" || path === "/account/") {
      return (
        <div className="account-section">
          <h2>Account Dashboard</h2>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Recent Orders</h3>
              <div className="order-items">
                {orders.length > 0 ? (
                  orders[orders.length-1].items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        <img
                          src={
                            item.product.imageUrl[0] || "/placeholder-image.jpg"
                          }
                          alt={item.product.name}
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h4>{item.product.name}</h4>
                        <p className="item-price">₹{item.price}</p>
                      </div>
                    </div>
                  ))):(<p>No orders yet</p>)}
              </div>
               {/* <Link to="/products" className="btn btn--primary">
                Shop Now
              </Link> */}
            </div>

            <div className="dashboard-card">
              <h3>Account Information</h3>
              <p>
                <strong>Name:</strong> {user?.name || ""}
                <br />
                <strong>Email:</strong> {user?.email || ""}
                <br />
                <strong>Phone:</strong> {user?.phone || ""}
              </p>
              <Link to="/account/details" className="btn btn--outline">
                Edit Details
              </Link>
            </div>
          </div>
        </div>
      );
    } else if (path === "/account/details") {
      return <AccountDetails />;
    } else if (path === "/account/orders") {
      return <MyOrders orders={orders} />;
    } else if (path === "/account/addresses") {
      return (
        <div className="account-section">
          <h2>Address Information</h2>
          <div className="dashboard-card">
            <div className="address-details">
              <h3>Default Address</h3>
              <p>
                <strong>Address:</strong> {user?.address || "Not provided"}
                <br />
                <strong>City:</strong> {user?.city || "Not provided"}
                <br />
                <strong>State:</strong> {user?.state || "Not provided"}
                <br />
                <strong>Pincode:</strong> {user?.pincode || "Not provided"}
              </p>
              <Link to="/account/details" className="btn btn--outline">
                Edit Details
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="account-page">
      <div className="container">
        <h1 className="page-title">My Account</h1>

        <div className="account-content">
          <div className="account-sidebar">
            <div className="account-welcome">
              <h3>Welcome, {user?.name || "User"}!</h3>
              <p>Manage your account information and orders</p>
            </div>

            <nav className="account-nav">
              <ul>
                <li>
                  <Link to="/account" className={isActive("/account")}>
                    Dashboard
                  </Link>
                </li>
                {/* <li>
                  <Link to="/account/details" className={isActive("/account/details")}>
                    Profile Details
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/account/orders"
                    className={isActive("/account/orders")}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/addresses"
                    className={isActive("/account/addresses")}
                  >
                    Addresses
                  </Link>
                </li>
                {/* <li>
                  <button>Logout</button>
                </li> */}
              </ul>
            </nav>
          </div>

          <div className="account-main">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Account;
