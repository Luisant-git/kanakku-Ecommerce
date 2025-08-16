import { Link, useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import { FiEye, FiUserPlus } from 'react-icons/fi'
import './Customers.scss'

const Customers = () => {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', orders: 5, joined: '2023-01-15', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', orders: 2, joined: '2023-02-20', status: 'active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '+91 9876543212', orders: 8, joined: '2023-03-10', status: 'active' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+91 9876543213', orders: 1, joined: '2023-04-05', status: 'inactive' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', phone: '+91 9876543214', orders: 3, joined: '2023-05-12', status: 'active' },
  ]

  const columns = [
    { key: 'id', label: 'ID', render: (value) => `C${value.toString().padStart(3, '0')}` },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'orders', label: 'Orders' },
    { key: 'joined', label: 'Joined', render: (value) => new Date(value).toLocaleDateString() },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="actions">
          <Link to={`/admin/customers/${row.id}`} className="view-btn">
            <FiEye />
          </Link>
        </div>
      )
    }
  ]

  const navigate = useNavigate();

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        {/* <button className="add-customer-btn" onClick={() => navigate('/admin/customers/add')}>
          <FiUserPlus /> Add Customer
        </button> */}
      </div>
      <DataTable data={customers} columns={columns} />
    </div>
  )
}

export default Customers