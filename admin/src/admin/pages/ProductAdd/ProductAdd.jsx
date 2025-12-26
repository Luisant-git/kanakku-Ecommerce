import { useState } from "react";
import uploadImageApi from "../../api/Upload";
import { createProductApi, getAllProductsApi } from '../../api/Product';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiSave, FiUpload, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "./ProductAdd.scss";

const ProductAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    taxPercentage: "18",
    singleUserPrice: "",
    singleUserRenewalPrice: "",
    singleUserPaymentRenewal: "ONE_TIME",
    multiUserPrice: "",
    multiUserRenewalPrice: "",
    multiUserPaymentRenewal: "ONE_TIME",
    imageUrl: [],
    productSource: "",
    productSourceFile: null,
    productSourceType: "url",

  });
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`Image "${file.name}" exceeds 5MB limit. Please select a smaller image.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    const imageData = new FormData();
    validFiles.forEach((file) => imageData.append("files", file));
    
    const uploadRes = await uploadImageApi(imageData);
    setUploading(false);
    
    if (uploadRes?.error) {
      if (uploadRes.error === 413) {
        toast.error('413 Request Entity Too Large');
      } else {
        toast.error(uploadRes.message || 'Upload failed');
      }
      return;
    }
    
    if (uploadRes && uploadRes.urls) {
      setUploadedImageUrls((prev) => [...prev, ...uploadRes.urls]);
      setImagePreview((prev) => [...prev, ...uploadRes.urls]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let productSourceUrl = formData.productSource;
    
    if (formData.productSourceType === 'file' && formData.productSourceFile) {
      const fileData = new FormData();
      fileData.append("files", formData.productSourceFile);
      const uploadRes = await uploadImageApi(fileData);
      if (uploadRes?.error) {
        if (uploadRes.error === 413) {
          toast.error('413 Request Entity Too Large');
        } else {
          toast.error(uploadRes.message || 'Upload failed');
        }
        setLoading(false);
        return;
      }
      if (uploadRes && uploadRes.urls && uploadRes.urls.length > 0) {
        productSourceUrl = uploadRes.urls[0].split('/').pop();
      }
    } else if (formData.productSourceType === 'url') {
      productSourceUrl = formData.productSource;
    }
    

    const productPayload = {
      name: formData.name,
      description: formData.description,
      taxPercentage: parseFloat(formData.taxPercentage),
      imageUrl: uploadedImageUrls,
      productSource: productSourceUrl || null,
      productSourceType: formData.productSourceType,

      versions: [
        {
          version: "SINGLE_USER",
          price: formData.singleUserPrice ? parseFloat(formData.singleUserPrice) : null,
          renewalPrice: formData.singleUserRenewalPrice ? parseFloat(formData.singleUserRenewalPrice) : null,
          paymentRenewal: formData.singleUserPaymentRenewal,
          isDefault: false
        },
        {
          version: "MULTI_USER",
          price: formData.multiUserPrice ? parseFloat(formData.multiUserPrice) : null,
          renewalPrice: formData.multiUserRenewalPrice ? parseFloat(formData.multiUserRenewalPrice) : null,
          paymentRenewal: formData.multiUserPaymentRenewal,
          isDefault: true
        }
      ]
    };
    const res = await createProductApi(productPayload);
    setLoading(false);
    if (res && res.id) {
      toast.success('Product created successfully');
      navigate("/admin/products");
    } else {
      console.error('Product creation error:', res);
      toast.error(res?.message || "Error creating product");
    }
  };

  return (
    <div className="product-add-page">
      <div className="page-header">
        <Link to="/admin/products" className="back-btn">
          <FiArrowLeft /> Back to Products
        </Link>
        <h1>Add Product</h1>
        <p>Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>

          <div className="form-group">
            <label>
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Tax Percentage (%)</label>
            <input
              type="text"
              name="taxPercentage"
              placeholder="18"
              value={formData.taxPercentage}
              onChange={handleChange}
            />
          </div>



          <div className="form-group">
            <label>Product Source</label>
            <div className="source-type-toggle">
              <label>
                <input
                  type="radio"
                  name="productSourceType"
                  value="url"
                  checked={formData.productSourceType === "url"}
                  onChange={handleChange}
                />
                URL
              </label>
              <label>
                <input
                  type="radio"
                  name="productSourceType"
                  value="file"
                  checked={formData.productSourceType === "file"}
                  onChange={handleChange}
                />
                File Upload
              </label>
            </div>
            
            {formData.productSourceType === "url" ? (
              <input
                type="url"
                name="productSource"
                placeholder="https://example.com/product"
                value={formData.productSource}
                onChange={handleChange}
              />
            ) : (
              <input
                type="file"
                name="productSourceFile"
                onChange={(e) => setFormData(prev => ({ ...prev, productSourceFile: e.target.files[0] }))}
                accept=".pdf,.doc,.docx,.zip,.rar"
              />
            )}
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="software">Software</option>
                <option value="ebook">E-book</option>
                <option value="service">Service</option>
                <option value="course">Course</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Sub Category</label>
              <select name="subCategory">
                <option value="">Select Sub Category</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Brand</label>
            <select name="brand">
              <option value="">Select Brand</option>
            </select>
          </div> */}
        </div>

        <div className="form-section image-section">
          <h2 className="section-title">Product Images</h2>

          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
              disabled={uploading}
            />
            <FiUpload className="upload-icon" />
            <div className="upload-text">{uploading ? 'Uploading...' : 'Click to upload images'}</div>
            <div className="upload-subtext">PNG, JPG, GIF up to 5MB</div>

            {imagePreview.length > 0 && (
              <div className="image-preview-list">
                {imagePreview.map((preview, idx) => (
                  <div className="image-preview" key={idx}>
                    <img src={preview} alt={`Preview ${idx + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setImagePreview((prev) => prev.filter((_, i) => i !== idx));
                        setUploadedImageUrls((prev) => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Pricing & Inventory</h2>

          <div className="pricing-versions">
            {/* <h3>Single User Version</h3> */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Single User Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="singleUserPrice"
                  placeholder="0.00"
                  value={formData.singleUserPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Single User Renewal Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="singleUserRenewalPrice"
                  placeholder="0.00"
                  value={formData.singleUserRenewalPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Payment Renewal</label>
                <select
                  name="singleUserPaymentRenewal"
                  value={formData.singleUserPaymentRenewal}
                  onChange={handleChange}
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pricing-versions">
            {/* <h3>Multi User Version</h3> */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  Multi User Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="multiUserPrice"
                  placeholder="0.00"
                  value={formData.multiUserPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Multi User Renewal Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="multiUserRenewalPrice"
                  placeholder="0.00"
                  value={formData.multiUserRenewalPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Payment Renewal</label>
                <select
                  name="multiUserPaymentRenewal"
                  value={formData.multiUserPaymentRenewal}
                  onChange={handleChange}
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>
          </div>



          {/* <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div> */}
        </div>

        <div className="form-actions">
          <Link to="/admin/products" className="cancel-btn">
            Cancel
          </Link>
          <button type="submit" className="save-btn" disabled={loading}>
            <FiSave /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
