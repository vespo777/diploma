import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginRegister.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push("At least 8 characters");
    if (!hasUpperCase) errors.push("One uppercase letter");
    if (!hasLowerCase) errors.push("One lowercase letter");
    if (!hasNumbers) errors.push("One number");
    if (!hasSpecialChar) errors.push("One special character");

    return errors;
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(`Password requirements: ${passwordErrors.join(", ")}`);
      return;
    }
    const requestData = {
      name: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      rawPassword: formData.password
    }

    try {
      await register(requestData);
      console.log("Сохранённый токен:", localStorage.getItem("token"));
      setSuccess("Registration successful! Redirecting to home page...");
      setTimeout(() => {
        navigate("/anceta-page");
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to create an account");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              className="auth-input"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="lastName"
              className="auth-input"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-divider"></div>

          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="auth-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-requirements">
              Password must contain:
              <ul>
                <li className={formData.password.length >= 8 ? "met" : ""}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? "met" : ""}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? "met" : ""}>
                  One lowercase letter
                </li>
                <li className={/\d/.test(formData.password) ? "met" : ""}>
                  One number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "met" : ""}>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="auth-input"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="auth-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </form>
        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
