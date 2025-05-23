import axios from "axios";
import { useState } from "react";
import { API_URL, FRONTEND_URL } from "../../config/config";
import { useParams } from "react-router-dom";
import "./reset_password_form.css";

const resetPasswordForm = () => {
  const { token, account_id, email_id } = useParams();
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password_confirm) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 8 || password_confirm.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (loading) {
      return;
    }
    setLoading(true);
    setSuccess(false);
    axios
      .post(`${API_URL}/reset-password`, {
        password: password,
        token: token,
        account_id: account_id,
        email_id: email_id,
      })
      .then((response) => {
        console.log("Password reset successfully");
        setSuccess(true);
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        if (error.response.data === "token is invalid or expired") {
          alert("Link expired");
        } else {
          alert("Error resetting password. Please try again.");
        }
        setSuccess(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="reset-password">
      <div className="reset-password-form">
        <div className="reset-password-form-header">
          <h1>Reset Password</h1>
        </div>
        <form onSubmit={handleSubmit} className="reset-password-form-body">
          <input
            type="password"
            id="new-password"
            name="new-password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="New Password"
          />

          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={password_confirm}
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || success}
            className={`submit-button${success ? " success" : ""}`}
          >
            {loading ? "Loading..." : success ? "Success" : "Reset Password"}
          </button>
          {success && (
            <div className="form_reset_password">
              <a href={`${FRONTEND_URL}`}>Back to Login</a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default resetPasswordForm;
