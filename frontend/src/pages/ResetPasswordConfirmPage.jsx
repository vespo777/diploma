import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LoginRegister.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordConfirmPage = () => {
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetPasswordEmail');

    if (!email || email !== savedEmail) {
      console.log("Email mismatch or not found", {
        stateEmail: email,
        savedEmail: savedEmail
      });
      navigate('/reset-password');
      return;
    }

    console.log("Resetting password for email:", email);
  }, [email, navigate]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const savedEmail = localStorage.getItem('resetPasswordEmail');
    if (!email || email !== savedEmail) {
      setError("Email verification failed. Please try again from the reset password page.");
      navigate('/reset-password');
      return;
    }

    // Проверка совпадения паролей
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Валидация пароля
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setError(`Password requirements: ${passwordErrors.join(", ")}`);
      return;
    }

    try {
      console.log("Sending reset request for email:", email);
      const response = await fetch('http://localhost:8080/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json().catch(() => null);
      console.log("Reset password response:", data);

      if (response.ok) {
        // Очищаем сохраненный email после успешного сброса
        localStorage.removeItem('resetPasswordEmail');
        navigate('/login', {
          state: { message: "Password has been successfully reset. Please login with your new password." }
        });
      } else {
        setError(data?.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <AnimatePresence mode="wait">
        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Reset Password</h2>
          <p className="auth-subtitle">
            Enter the verification code sent to:
            <br />
            <strong>{email}</strong>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="code"
                className="auth-input"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={handleChange}
                required
                maxLength="6"
                pattern="\d{6}"
              />
            </div>

            <div className="input-group">
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  className="auth-input"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="password-requirements">
                Password must contain:
                <ul>
                  <li className={formData.newPassword.length >= 8 ? "met" : ""}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? "met" : ""}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) ? "met" : ""}>
                    One lowercase letter
                  </li>
                  <li className={/\d/.test(formData.newPassword) ? "met" : ""}>
                    One number
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? "met" : ""}>
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
                  placeholder="Confirm new password"
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
              Reset Password
            </motion.button>
          </form>

          <div className="auth-footer">
            <motion.button
              onClick={() => navigate('/reset-password')}
              className="auth-link"
              whileHover={{ scale: 1.02 }}
            >
              Resend Code
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResetPasswordConfirmPage;
