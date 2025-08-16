import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable/DataTable";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import { FiEye, FiTruck, FiPlus } from "react-icons/fi";
import "./Orders.scss";
import { getAllOrderApi, updateOrderApi } from "../../api/Order";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [openMenuId, setOpenMenuId] = useState(null)
  // Transform API data to match component expectations
  const transformOrderData = (apiOrders) => {
    return apiOrders.map((order) => ({
      id: order.id,
      customer: order.user?.name || order.user?.email || "Unknown Customer",
      email: order.user?.email || "",
      date: order.createdAt,
      amount: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      status:
        order.status.toLowerCase() === "pending"
          ? "pending"
          : order.status.toLowerCase() === "completed"
          ? "completed"
          : order.status.toLowerCase() === "cancelled"
          ? "cancelled"
          : "pending",
      items: order.items,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
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
  };

// REPLACE orderStatusUpdate with this version
const orderStatusUpdate = async (id, status) => {
  try {
    const updatedOrder = { status: status.toUpperCase() };
    const response = await updateOrderApi(parseInt(id), updatedOrder);
    if (response) {
      toast.success("Order updated successfully");
      setOpenMenuId(null);
      await getOrders(); // refresh table
    } else {
      toast.error("Error updating order");
    }
  } catch (err) {
    toast.error("Error updating order");
    console.error(err);
  }
};


  useEffect(() => {
  const onDocClick = (e) => {
    if (!e.target.closest('.status-menu') && !e.target.closest('.ship-btn')) {
      setOpenMenuId(null);
    }
  };
  document.addEventListener('click', onDocClick);
  return () => document.removeEventListener('click', onDocClick);
}, []);

  const columns = [
    { key: "id", label: "Order ID", render: (value) => `#${value}` },
    { key: "email", label: "Email" },
    {
      key: "date",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "amount",
      label: "Total",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      key: "subtotal",
      label: "Subtotal",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      key: "tax",
      label: "Tax",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <OrderStatusBadge status={value} />,
    },
    {
      key: "items",
      label: "Items",
      render: (_, row) => (
        <div className="items-count">{row.items?.length || 0} items</div>
      ),
    },
    // REPLACE the actions render block inside `columns` with this
{
  key: "actions",
  label: "Actions",
  render: (_, row) => (
    <div className="actions">
      <Link
        to={`/admin/orders/${row.id}`}
        className="view-btn"
        title="View Order"
      >
        <FiEye />
      </Link>

      {row.status === "pending" && (
        <div className="status-wrapper">
          <button
            className="ship-btn"
            title="Change Status"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
          >
            <FiTruck />
          </button>

          {openMenuId === row.id && (
            <div className="status-menu">
              <button onClick={() => orderStatusUpdate(row.id, "pending")}>
                Pending
              </button>
              <button onClick={() => orderStatusUpdate(row.id, "completed")}>
                Completed
              </button>
              <button onClick={() => orderStatusUpdate(row.id, "cancelled")}>
                Cancelled
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  ),
}
  ];

  const navigate = useNavigate();

  useEffect(() => {
    getOrders();
  }, []);

  // Filter orders by status
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  );

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "pending":
        return pendingOrders;
      case "completed":
        return completedOrders;
      case "cancelled":
        return cancelledOrders;
      default:
        return pendingOrders;
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
      </div>

      <div className="tabs-container">
        <div className="tab-headers">
          <button
            className={`${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({pendingOrders.length})
          </button>
          <button
            className={`${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedOrders.length})
          </button>
          <button
            className={`${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({cancelledOrders.length})
          </button>
        </div>

        <div className="tab-content">
          <DataTable data={getFilteredOrders()} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Orders;
