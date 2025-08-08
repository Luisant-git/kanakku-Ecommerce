import { Link, useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import OrderStatusBadge from '../../components/OrderStatusBadge/OrderStatusBadge'
import { FiEye, FiTruck, FiPlus } from 'react-icons/fi'
import './Orders.scss'

const Orders = () => {
  const orders = [
    { id: 1001, customer: 'John Doe', date: '2023-05-15', amount: 5998, status: 'completed' },
    { id: 1002, customer: 'Jane Smith', date: '2023-05-16', amount: 19900, status: 'processing' },
    { id: 1003, customer: 'Robert Johnson', date: '2023-05-17', amount: 9900, status: 'shipped' },
    { id: 1004, customer: 'Emily Davis', date: '2023-05-18', amount: 29900, status: 'pending' },
    { id: 1005, customer: 'Michael Wilson', date: '2023-05-19', amount: 4999, status: 'cancelled' },
  ]

  const columns = [
    { key: 'id', label: 'Order ID', render: (value) => `#${value}` },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'amount', label: 'Amount', render: (value) => `₹${value.toLocaleString()}` },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <OrderStatusBadge status={value} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="actions">
          <Link to={`/admin/orders/${row.id}`} className="view-btn">
            <FiEye />
          </Link>
          {row.status === 'processing' && (
            <button className="ship-btn">
              <FiTruck />
            </button>
          )}
        </div>
      )
    }
  ]

  const navigate = useNavigate();

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="add-order-btn" onClick={() => navigate('/admin/orders/add')}>
          <FiPlus /> New Order
        </button>
      </div>
      <DataTable data={orders} columns={columns} />
    </div>
  )
}

export default Orders