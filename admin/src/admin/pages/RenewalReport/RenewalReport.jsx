import { useState, useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";
import DataTable from "../../components/DataTable/DataTable";
import StatsCard from "../../components/StatsCard/StatsCard";
import { getPendingRenewalReport } from "../../api/renewalReport";
import { getAllProductsApi } from "../../api/Product";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RenewalReport.scss";

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
    setProductSearch("");
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

          <button onClick={applyFilters} className="apply-btn">Apply</button>
          <button onClick={clearFilters} className="clear-btn">Clear</button>
        </div>
      </div>

      <div className="table-section">
        <DataTable data={reportData.expiredItems || []} columns={columns} />
      </div>
    </div>
  );
};

export default RenewalReport;