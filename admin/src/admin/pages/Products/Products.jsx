import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTable/DataTable";
import { FiEdit2, FiTrash2, FiPlus, FiAlertTriangle } from "react-icons/fi";
import "./Products.scss";
import {
  createProductApi,
  getAllProductsApi,
  deleteProductApi,
} from "../../api/Product";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    // API call to fetch products
    const response = await getAllProductsApi();
    console.log("all products", response);
    setProducts(response);
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProductApi(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value) => `P${value.toString().padStart(3, "0")}`,
    },
    {
      key: "imageUrl",
      label: "Image",
      render: (value, row) => {
        const imgSrc =
          Array.isArray(row.imageUrl) && row.imageUrl.length > 0
            ? row.imageUrl[0]
            : "https://via.placeholder.com/100x100?text=No+Image";
        return <img src={imgSrc} alt={row.name} className="product-image" />;
      },
    },
    { key: "name", label: "Name" },
    {
      key: "price",
      label: "Price",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="actions">
          <Link to={`/admin/products/edit/${row.id}`} className="edit-btn">
            <FiEdit2 />
          </Link>
          <button className="delete-btn" onClick={() => handleDeleteClick(row)}>
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/admin/products/add" className="add-product-btn">
          <FiPlus /> Add Product
        </Link>
      </div>
      <DataTable data={products} columns={columns} />

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <FiAlertTriangle className="warning-icon" />
              <h3>Delete Product</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              <div className="product-info">
                <strong>{productToDelete?.name}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn"
                onClick={handleDeleteConfirm}
              >
                <FiTrash2 /> Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
