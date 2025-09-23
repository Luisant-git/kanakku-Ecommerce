import { useState, useEffect } from "react";
import { Select, Input, Button, Space } from "antd";
import DataTable from "../../components/DataTable/DataTable";
import StatsCard from "../../components/StatsCard/StatsCard";
import { getPendingRenewalReport } from "../../api/renewalReport";
import { getAllProductsApi } from "../../api/Product";
import "./RenewalReport.scss";

const { Option } = Select;

const RenewalReport = () => {
  const [reportData, setReportData] = useState({ summary: {}, expiredItems: [] });
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ productId: "" });

  const fetchRenewalReport = async () => {
    try {
      const data = await getPendingRenewalReport(filters);
      setReportData(data || { summary: {}, expiredItems: [] });
    } catch (error) {
      console.error("Error fetching renewal report:", error);
      setReportData({ summary: {}, expiredItems: [] });
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
    fetchRenewalReport();
    fetchProducts();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchRenewalReport();
  };

  const clearFilters = () => {
    setFilters({ productId: "" });
    setProductSearch("");
    setSelectedProduct(null);
    setTimeout(() => fetchRenewalReport(), 100);
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
    { key: "productName", label: "Product" },
    { key: "version", label: "Version" },
    { key: "customer", label: "Customer", render: (value) => value?.name || value?.email || 'N/A' },
    { key: "customer", label: "Phone", render: (value) => value?.phone || 'N/A' },
    { key: "quantity", label: "Qty" },
    { key: "renewalPrice", label: "Renewal Price", render: (value) => `₹${value?.toLocaleString() || 0}` },
    { key: "expiryDate", label: "Expired On", render: (value) => new Date(value).toLocaleDateString() },
    { key: "daysSinceExpiry", label: "Days Expired", render: (value) => `${value} days` },
  ];

  return (
    <div className="renewal-report-page">
      <div className="page-header">
        <h1>Pending Renewal Report</h1>
      </div>

      <div className="stats-section">
        <StatsCard
          title="Expired Items"
          value={reportData.summary.totalExpiredItems || 0}
          icon="clock"
        />
        <StatsCard
          title="Potential Revenue"
          value={`₹${(reportData.summary.totalPotentialRevenue || 0).toLocaleString()}`}
          icon="rupee"
        />
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <Space>
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
        <DataTable data={reportData.expiredItems || []} columns={columns} />
      </div>
    </div>
  );
};

export default RenewalReport;