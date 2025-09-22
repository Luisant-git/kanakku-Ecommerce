import { useState, useEffect } from "react";
import { getUserProfileApi, updateUserProfileApi } from "../../api/Profile";
import { toast } from "react-toastify";
import "./AccountDetails.scss";
import { useNavigate } from "react-router-dom";

const AccountDetails = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    gstin: "",
    address: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    country: "India",
    pincode: ""
  });

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  const cities = {
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer']
  }
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
          company: res.company || "",
          gstin: res.gstin || "",
          address: res.address || "",
          email: res.email || "",
          phone: res.phone || "",
          state: res.state || "",
          city: res.city || "",
          country: res.country || "India",
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
      [name]: value,
      ...(name === 'state' && { city: '' }) // Reset city when state changes
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
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
        window.location.reload();
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
      company: user?.company || "",
      gstin: user?.gstin || "",
      address: user?.address || "",
      email: user?.email || "",
      phone: user?.phone || "",
      state: user?.state || "",
      city: user?.city || "",
      country: user?.country || "India",
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
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name <span className="required">*</span></label>
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
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              maxLength={100}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Mobile No</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength={15}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="gstin">GSTIN</label>
          <input
            type="text"
            id="gstin"
            name="gstin"
            value={formData.gstin}
            onChange={handleInputChange}
            placeholder="Enter GSTIN number"
            maxLength={15}
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
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {formData.state && cities[formData.state]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              readOnly
            />
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
              pattern="[0-9]{6}"
              maxLength={6}
            />
          </div>
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
