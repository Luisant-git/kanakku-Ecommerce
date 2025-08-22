import { useState, useEffect } from "react";
import { getUserProfileApi, updateUserProfileApi } from "../../api/Profile";
import { toast } from "react-toastify";
import "./AccountDetails.scss";
import { useNavigate } from "react-router-dom";

const AccountDetails = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await getUserProfileApi();
      if (res.status === 401) {
        toast.error("Please login to continue");
        return;
      } else if (res?.id) {
        setUser(res);
        setFormData({
          name: res.name || "",
          phone: res.phone || "",
          address: res.address || "",
          city: res.city || "",
          state: res.state || "",
          pincode: res.pincode || ""
        });
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== (user[key] || "")) {
          updateData[key] = formData[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const res = await updateUserProfileApi(updateData);
      
      if (res.status === 401) {
        toast.error("Please login to continue");
        return;
      } else if (res?.id) {
        setUser(res);
        toast.success("Profile updated successfully!");
        navigate("/account");
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || ""
    });
  };

  if (loading) {
    return (
      <div className="account-section">
        <h2>Edit Profile</h2>
        <div className="loading">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="account-section">
      <h2>Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="10-digit phone number"
            maxLength={10}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter your address"
            maxLength={500}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              maxLength={50}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="6-digit pincode"
            maxLength={6}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn--primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button 
            type="button" 
            className="btn btn--outline"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
