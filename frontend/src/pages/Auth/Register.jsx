import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Auth.scss";
import { userRegisterApi, sendOtpApi } from "../../api/Auth";

const Register = () => {
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
    pincode: "",
  });
  const [otpStep, setOtpStep] = useState("phone"); // 'phone', 'otp', 'complete'
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill phone if coming from login with verification
  useEffect(() => {
    if (location.state?.phone && location.state?.verified) {
      setFormData((prev) => ({ ...prev, phone: location.state.phone }));
      setOtpStep("complete");
    }
  }, [location.state]);

  // ... states and cities arrays remain the same

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: "" }), // Reset city when state changes
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await sendOtpApi({ phone: formData.phone });
      if (response && response.message) {
        setMessage("OTP sent to your WhatsApp");
        setOtpStep("otp");
      } else {
        setError(response?.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If not verified, send OTP first
    if (otpStep === "phone") {
      await handleSendOtp(e);
      return;
    }

    // If OTP sent but not verified, show error
    if (otpStep === "otp") {
      setError("Please verify OTP first");
      return;
    }

    // Complete registration
    setLoading(true);
    setError("");
    try {
      const response = await userRegisterApi(formData);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setMessage("Registration successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(response?.message || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Register</h1>

          {error && <div className="message error">{error}</div>}
          {message && <div className="message success">{message}</div>}

          {otpStep === "phone" && (
            <div className="otp-verification-step">
              <h3>Verify Your Phone</h3>
              <p>
                We'll send an OTP to your WhatsApp to verify your phone number.
              </p>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number with country code"
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP via WhatsApp"}
              </button>
            </div>
          )}

          {otpStep === "otp" && (
            <div className="otp-verification-step">
              <h3>Enter OTP</h3>
              <p>Enter the OTP sent to your WhatsApp {formData.phone}</p>
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
              </div>
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => setOtpStep("complete")}
              >
                Verify OTP & Continue
              </button>
            </div>
          )}

          {otpStep === "complete" && (
            <form onSubmit={handleSubmit}>
              {/* Registration form fields remain the same */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gstin">GSTIN</label>
                  <input
                    type="text"
                    id="gstin"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
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
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--block"
                disabled={loading}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </form>
          )}

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
