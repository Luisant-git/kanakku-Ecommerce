import { useState, useEffect } from "react";
import { Select, InputNumber, Button, Space } from "antd";
import DataTable from "../../components/DataTable/DataTable";
import StatsCard from "../../components/StatsCard/StatsCard";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import { getAllSalesReport } from "../../api/salesReport";
import { getAllProductsApi } from "../../api/Product";
import "./SalesReport.scss";

const { Option } = Select;

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
          <Space wrap>
            <Select
              placeholder="All Status"
              style={{ width: 120 }}
              value={filters.status || undefined}
              onChange={(value) => handleFilterChange("status", value || "")}
              allowClear
            >
              <Option value="PENDING">Pending</Option>
              <Option value="COMPLETED">Completed</Option>
              <Option value="CANCELLED">Cancelled</Option>
            </Select>

            <Select
              showSearch
              placeholder="Select Product"
              style={{ minWidth: 200 }}
              value={selectedProduct?.id}
              onSearch={setProductSearch}
              onChange={(value) => {
                const product = products.find(p => p.id === value);
                if (product) handleProductSelect(product);
              }}
              allowClear
              onClear={clearProductSelection}
              filterOption={false}
            >
              {filteredProducts.slice(0, 20).map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>

            <InputNumber
              placeholder="Year"
              style={{ width: 100 }}
              value={filters.year || undefined}
              onChange={(value) => handleFilterChange("year", value || "")}
            />

            <InputNumber
              placeholder="Month"
              style={{ width: 100 }}
              min={1}
              max={12}
              value={filters.month || undefined}
              onChange={(value) => handleFilterChange("month", value || "")}
            />

            <Button type="primary" onClick={applyFilters}>
              Apply
            </Button>
            <Button onClick={clearFilters}>
              Clear
            </Button>
          </Space>
        </div>
      </div>

      <div className="table-section">
        <DataTable data={reportData.orders || []} columns={columns} />
      </div>
    </div>
  );
};

export default SalesReport;