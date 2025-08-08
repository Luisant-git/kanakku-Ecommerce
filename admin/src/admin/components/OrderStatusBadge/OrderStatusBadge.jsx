import './OrderStatusBadge.scss'

const OrderStatusBadge = ({ status }) => {
  const statusText = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }

  return (
    <span className={`status-badge ${status}`}>
      {statusText[status]}
    </span>
  )
}

export default OrderStatusBadge