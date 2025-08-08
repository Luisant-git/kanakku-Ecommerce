import { NavLink } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiUsers, FiPieChart, FiSettings, FiDollarSign, FiX } from 'react-icons/fi'
import './Sidebar.scss'

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <img src="/src/assets/kanakku.png" alt="Kanakku" className="logo" />
        <button className="sidebar-close" onClick={onClose}>
          <FiX />
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" end>
              <FiHome />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products">
              <FiShoppingBag />
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders">
              <FiDollarSign />
              <span>Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/customers">
              <FiUsers />
              <span>Customers</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/analytics">
              <FiPieChart />
              <span>Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings">
              <FiSettings />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
    </>
  )
}

export default Sidebar