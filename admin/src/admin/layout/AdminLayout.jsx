import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import TopNav from '../components/TopNav/TopNav'
import { useState } from 'react'
import '../../styles/admin.scss'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="admin-container">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="main-content">
        <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout