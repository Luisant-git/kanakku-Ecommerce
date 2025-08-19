import { FiSearch, FiBell, FiUser, FiMenu, FiX } from 'react-icons/fi'
import './TopNav.scss'
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Optionally clear auth tokens here
    navigate('/admin/login');
  };

  return (
    <header className="top-nav">
      <div className="nav-left">
        <button 
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="nav-right">
        {/* <button className="notification-btn">
          <FiBell />
          <span className="badge">3</span>
        </button> */}
        <div className="user-profile" ref={profileRef} onClick={() => setDropdownOpen((open) => !open)}>
          <FiUser />
          <span>Admin User</span>
          {dropdownOpen && (
            <div className="user-dropdown">
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNav