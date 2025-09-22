import { useState, useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";
import DataTable from "../../components/DataTable/DataTable";
import StatsCard from "../../components/StatsCard/StatsCard";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import { getAllSalesReport } from "../../api/salesReport";
import { getAllProductsApi } from "../../api/Product";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SalesReport.scss";

const SalesReport = () => {
  const [reportData, setReportData] = useState({ summary: {}, orders: [] });
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    productId: "",
    year: "",
    month: "",
    date: ""
  });

  const fetchSalesReport = async () => {
    try {
      const data = await getAllSalesReport(filters);
      setReportData(data || { summary: {}, orders: [] });
    } catch (error) {
      console.error("Error fetching sales report:", error);
      setReportData({ summary: {}, orders: [] });
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProductsApi();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
    fetchProducts();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSalesReport();
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      productId: "",
      year: "",
      month: "",
      date: ""
    });
    setProductSearch("");
    setSelectedProduct(null);
    setTimeout(() => fetchSalesReport(), 100);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleProductSelect = (product) => {
    setFilters(prev => ({ ...prev, productId: product.id.toString() }));
    setSelectedProduct(product);
    setProductSearch("");
  };

  const clearProductSelection = () => {
    setSelectedProduct(null);
    setFilters(prev => ({ ...prev, productId: "" }));
  };

  const columns = [
    { key: "id", label: "Order ID", render: (value) => `#${value}` },
    {
      key: "orderDate",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "customer", label: "Customer", render: (value) => value?.name || value?.email || 'N/A' },
    {
      key: "status",
      label: "Status",
      render: (value) => <OrderStatusBadge status={value.toLowerCase()} />,
    },
    {
      key: "items",
      label: "Products",
      render: (items) => (
        <div>
          {items?.map((item, idx) => (
            <div key={idx}>{item.productName} ({item.quantity}x)</div>
          )) || 'No items'}
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (value) => `₹${value?.toLocaleString() || 0}`,
    },
  ];

  return (
    <div className="sales-report-page">
      <div className="page-header">
        <h1>Sales Report</h1>
      </div>

      <div className="stats-section">
        <StatsCard
          title="Total Orders"
          value={reportData.summary.totalOrders || 0}
          icon="chart"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(reportData.summary.totalRevenue || 0).toLocaleString()}`}
          icon="rupee"
        />
        <StatsCard
          title="Total Quantity"
          value={reportData.summary.totalQuantity || 0}
          icon="bag"
        />
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <Dropdown className="d-inline-block">
            <Dropdown.Toggle 
              variant="outline-secondary" 
              className="d-flex justify-content-between align-items-center text-start"
              style={{ minWidth: '200px' }}
            >
              <span className="text-truncate">
                {selectedProduct ? selectedProduct.name : 'Select Product'}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100 shadow-sm" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <div className="px-3 py-2 border-bottom">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="border-0 bg-light"
                />
              </div>
              {selectedProduct && (
                <>
                  <Dropdown.Item 
                    className="text-danger fw-bold py-2" 
                    onClick={clearProductSelection}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Clear Selection
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-1" />
                </>
              )}
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 20).map((product) => (
                  <Dropdown.Item
                    key={product.id}
                    active={selectedProduct?.id === product.id}
                    onClick={() => handleProductSelect(product)}
                    className="py-2 px-3"
                  >
                    <span className="text-truncate d-block">{product.name}</span>
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.ItemText className="text-muted fst-italic py-3 text-center">
                  No products found
                </Dropdown.ItemText>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <input
            type="number"
            placeholder="Year"
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
          />

          <input
            type="number"
            placeholder="Month (1-12)"
            min="1"
            max="12"
            value={filters.month}
            onChange={(e) => handleFilterChange("month", e.target.value)}
          />

          {/* <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          /> */}

          <button onClick={applyFilters} className="apply-btn">Apply</button>
          <button onClick={clearFilters} className="clear-btn">Clear</button>
        </div>
      </div>

      <div className="table-section">
        <DataTable data={reportData.orders || []} columns={columns} />
      </div>
    </div>
  );
};

export default SalesReport;