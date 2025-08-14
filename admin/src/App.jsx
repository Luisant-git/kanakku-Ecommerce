import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, createContext } from "react";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard/Dashboard";
import Products from "./admin/pages/Products/Products";
import ProductAdd from "./admin/pages/ProductAdd/ProductAdd";
import ProductEdit from "./admin/pages/ProductEdit/ProductEdit";
import Orders from "./admin/pages/Orders/Orders";
import OrderDetails from "./admin/pages/OrderDetails/OrderDetails";
import OrderAdd from "./admin/pages/OrderAdd/OrderAdd";
import Customers from "./admin/pages/Customers/Customers";
import CustomerDetails from "./admin/pages/CustomerDetails/CustomerDetails";
import CustomerAdd from "./admin/pages/CustomerAdd/CustomerAdd";
import Analytics from "./admin/pages/Analytics/Analytics";
import Settings from "./admin/pages/Settings/Settings";
import Login from "./admin/pages/Login/Login";
import "./styles/admin.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/add" element={<OrderAdd />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<CustomerAdd />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </Router>
  );
}

export default App;
