import { Link, useNavigate } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import OrderStatusBadge from '../../components/OrderStatusBadge/OrderStatusBadge'
import { FiEye, FiTruck, FiPlus } from 'react-icons/fi'
import './Orders.scss'
import { getAllOrderApi } from '../../api/Order'
import { useEffect } from 'react'
import { useState } from 'react'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  
  // Transform API data to match component expectations
  const transformOrderData = (apiOrders) => {
    return apiOrders.map(order => ({
      id: order.id,
      customer: order.user?.name || order.user?.email || 'Unknown Customer',
      email: order.user?.email || '',
      date: order.createdAt,
      amount: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      status: order.status.toLowerCase() === 'pending' ? 'pending' : 
               order.status.toLowerCase() === 'completed' ? 'completed' : 
               order.status.toLowerCase() === 'cancelled' ? 'cancelled' : 'pending',
      items: order.items,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
  };

  const getOrders = async () => {
    try {
      const response = await getAllOrderApi();
      const transformedOrders = transformOrderData(response);
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  const columns = [
    { key: 'id', label: 'Order ID', render: (value) => `#${value}` },
    // { key: 'customer', label: 'Customer' },
    { key: 'email', label: 'Email' },
    { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'amount', label: 'Total', render: (value) => `₹${value?.toLocaleString() || 0}` },
    { key: 'subtotal', label: 'Subtotal', render: (value) => `₹${value?.toLocaleString() || 0}` },
    { key: 'tax', label: 'Tax', render: (value) => `₹${value?.toLocaleString() || 0}` },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <OrderStatusBadge status={value} />
    },
    {
      key: 'items',
      label: 'Items',
      render: (_, row) => (
        <div className="items-count">
          {row.items?.length || 0} items
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="actions">
          <Link to={`/admin/orders/${row.id}`} className="view-btn" title="View Order">
            <FiEye />
          </Link>
          {row.status === 'pending' && (
            <button className="ship-btn" title="Mark as Shipped">
              <FiTruck />
            </button>
          )}
        </div>
      )
    }
  ]

  const navigate = useNavigate();

  useEffect(() => {
    getOrders();
  }, [])

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
