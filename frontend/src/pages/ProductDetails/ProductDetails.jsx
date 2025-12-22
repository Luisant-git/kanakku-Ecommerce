import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.scss";
import {
  getProductByIdApi,
  checkDownloadAccessApi,
  getUserRenewalDateApi,
} from "../../api/Product";
import { toast } from "react-toastify";


const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [downloadAccess, setDownloadAccess] = useState({ hasAccess: false });
  const [renewalDate, setRenewalDate] = useState(null);
  const [purchasedVersionType, setPurchasedVersionType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("token");

  const getProductById = async (id) => {
    setLoading(true);
    const response = await getProductByIdApi(parseInt(id));
    console.log("product by id", response);
    setProduct(response);

    // Set default selected version
    if (response.versions?.length > 0) {
      const defaultVersion =
        response.versions.find((v) => v.isDefault) || response.versions[0];
      setSelectedVersion(defaultVersion);
    }

    // Check download access if user is logged in
    const token = localStorage.getItem("token");

    if (token) {
      // Decode JWT to get real user ID
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId;
        console.log("Real user ID from token:", userId);

        const accessResponse = await checkDownloadAccessApi(id, userId);
        setDownloadAccess(accessResponse);
        setPurchasedVersionType(accessResponse.purchasedVersionType || null);
        console.log("Download access response:", accessResponse);

        // Get renewal date if user has access
        if (accessResponse.hasAccess) {
          const renewalResponse = await getUserRenewalDateApi(id);
          setRenewalDate(renewalResponse.nextRenewalDate);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    setLoading(false);
  };





  useEffect(() => {
    getProductById(id);
  }, []);

  if (loading) {
    return (
      <div className="product-details">
        <div className="container">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="container">
        <div className="product-details__content">
          <div className="product-details__image">
            <img
              src={
                Array.isArray(product?.imageUrl) && product.imageUrl.length > 0
                  ? product.imageUrl[0]
                  : "example.jpg"
              }
              alt={product.name}
            />
          </div>

          <div className="product-details__info">
            <h1>{product.name}</h1>

            {/* Product Version Selection */}
            {product.versions?.filter(v => v.price !== null).length > 0 && (
              <div className="product-versions">
                <h3>Choose Your Plan</h3>
                <div className="version-options">
                  {product.versions.filter(v => v.price !== null).map((version) => (
                    <div
                      key={version.id}
                      className={`version-card ${
                        selectedVersion?.id === version.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <div className="version-header">
                        <h4>{version.version.replace("_", " ")}</h4>
                        {version.isDefault && (
                          <span className="default-badge">Recommended</span>
                        )}
                      </div>
                      <div className="version-pricing">
                        <span className="version-price">
                          {version.price ? `₹${version.price.toLocaleString()}` : 'Price not set'}
                        </span>
                        {version.renewalPrice &&
                          !(
                            purchasedVersionType === "MULTI_USER" &&
                            version.version === "SINGLE_USER"
                          ) && (
                            <span className="version-renewal">
                              Renewal: ₹{version.renewalPrice.toLocaleString()}
                            </span>
                          )}
                      </div>
                      <div className="version-type">
                        <span
                          className={`badge badge--${version.paymentRenewal.toLowerCase()}`}
                        >
                          {version.paymentRenewal.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-details__pricing">
              {selectedVersion && (
                <>
                  <span className="product-details__price">
                    {selectedVersion.price ? `₹${selectedVersion.price.toLocaleString()}` : 'Price not set'}
                  </span>
                  {renewalDate &&
                    selectedVersion.renewalPrice &&
                    !(
                      purchasedVersionType === "MULTI_USER" &&
                      selectedVersion.version === "SINGLE_USER"
                    ) && (
                      <div className="renewal-info">
                        <span className="product-details__renewal-price">
                          Renewal Price: ₹
                          {selectedVersion.renewalPrice.toLocaleString()}
                        </span>
                        <small className="renewal-note">
                          * Renewal price applies for repeat purchases
                        </small>
                      </div>
                    )}
                </>
              )}
              {downloadAccess.hasAccess && (
                <div className="license-info">
                  <h4>License Information</h4>
                  <div className="license-details">
                    <p>
                      <strong>License No:</strong>{" "}
                      {downloadAccess.licenseNo || "N/A"}
                    </p>
                    {renewalDate && (
                      <p>
                        <strong>Next Renewal:</strong>{" "}
                        {new Date(renewalDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>



            <div className="product-details__actions">
              <button
                className="btn btn--primary"
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    toast.error("Please login to continue...");
                    navigate("/login");
                    return;
                  }
                  
                  if (!selectedVersion) {
                    toast.error("Please select a version");
                    return;
                  }
                  
                  // Navigate directly to checkout with product data
                  navigate("/checkout", {
                    state: {
                      product: product,
                      selectedVersion: selectedVersion
                    }
                  });
                }}
                disabled={
                  downloadAccess.hasAccess &&
                  downloadAccess.purchasedVersionType === selectedVersion?.version &&
                  selectedVersion?.paymentRenewal === "ONE_TIME"
                }
              >
                {(() => {
                  if (
                    downloadAccess.hasAccess &&
                    downloadAccess.purchasedVersionType === selectedVersion?.version &&
                    selectedVersion?.paymentRenewal === "ONE_TIME"
                  ) {
                    return "Already Purchased";
                  }
                  if (
                    downloadAccess.hasAccess &&
                    downloadAccess.purchasedVersionType === selectedVersion?.version &&
                    selectedVersion?.paymentRenewal !== "ONE_TIME"
                  ) {
                    return "Buy Renewal Now";
                  }
                  return "Buy Now";
                })()}
              </button>

              {product.productSource && (
                <button
                  className="btn btn--outline"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      toast.error("Please login to download");
                      navigate("/login");
                      return;
                    }
                    
                    const downloadUrl = product.productSourceType === "url"
                      ? product.productSource
                      : `http://localhost:4010/uploads/${product.productSource}`;
                    
                    if (product.productSourceType === "url") {
                      window.open(downloadUrl, "_blank");
                    } else {
                      const link = document.createElement("a");
                      link.href = downloadUrl;
                      link.download = product.productSource;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  Download
                </button>
              )}


            </div>



            <div className="product-details__description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* <div className="product-details__features">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
