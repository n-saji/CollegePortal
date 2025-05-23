import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../config/config";
import "./send_reset_email.css";

const ResetMail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API_URL}/send-reset-password-mail`, {
        email_id: email,
      })
      .then((response) => {
        console.log(response.data);
        setSuccess(true);
      })
      .catch((error) => {
        console.error(
          "There was an error sending the reset password request!",
          error
        );
        if (error.response.data === "email does not exist") {
          alert("Email does not exist");
          return;
        } else {
          alert("Error sending reset password request. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="reset-mail">
      <div className="form-email">
        <div className="form-email-header">
          <h1>Reset Password</h1>
          <p>Enter your email address to reset your password.</p>
        </div>
        <form onSubmit={handleSubmit} className="form-email-body">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || success}
            className={`submit-button${loading || success ? " success" : ""}`}
          >
            {loading
              ? "Sending..."
              : success
              ? "Email Sent ✔️"
              : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetMail;
