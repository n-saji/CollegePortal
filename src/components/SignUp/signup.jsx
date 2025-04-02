import React, { useEffect, useState } from "react";
import "./signup.css";
import { BASE_URL, API_URL } from "../../config/config";
import axios from "axios";
import BB from "../../assets/back_button.png";
import { getCookie } from "../../utils/cookies";

export const Signup = (redirectToOTPVerification) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [OTPVerificationPage, setOTPVerificationPage] = useState(
    redirectToOTPVerification.redirect
  );
  const [length, setLength] = useState(6);
  const [otp, setOtp] = useState(Array(length).fill("")); //default 6 digits
  console.log(redirectToOTPVerification);

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const handleSignup = async () => {
    if (email !== confirmEmail) {
      alert("Emails do not match");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (name === "" || email === "" || password === "") {
      alert("Please fill all the fields");
      return;
    }
    const data = {
      name: name,
      info: {
        credentials: {
          email_id: email,
          password: password,
        },
      },
    };
    try {
      setLoading(true);
      const response = await axios({
        method: "post",
        url: `${API_URL}/create-account`,
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      if (response.status === 200) {
        alert("Account created successfully! Verify your email to login.");
        setOTPVerificationPage(true);
        // window.location.href = "/";
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error: " + err.response.data);
      console.error(err);
    }
    setLoading(false);
  };

  const SignUpComponent = () => {
    return (
      <div className="sign_up_page_div">
        <div className="sign_up_page_window">
          <div className="sign_up_page_window_title">
            <h1>It's simple to create an Account!</h1>
          </div>
          <div className="sign_up_page_window_form">
            <div className="return_to_login">
              <a href="/">
                <img src={BB} />
              </a>
            </div>
            <h2>Create Account</h2>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="Confirm your email"
              onChange={(e) => {
                setConfirmEmail(e.target.value);
              }}
            />
            <div className="password_div">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="checkbox"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="password_div">
              <input
                type={showPassword1 ? "text" : "password"}
                placeholder="Confirm your password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              <input
                type="checkbox"
                onClick={() => setShowPassword1(!showPassword1)}
              />
            </div>
            <div className="sign_up_page_window_buttons">
              <button
                disabled={loading}
                onClick={() => {
                  handleSignup();
                }}
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleOTPVerification = async () => {
    let otpjoined = otp.join("");
    if (otpjoined === "") {
      alert("Please enter the OTP");
      return;
    }
    if (otpjoined.length !== length) {
      alert("Please enter a valid OTP");
      return;
    }
    if (email === "") {
      if (getCookie("email_id") !== null) {
        setEmail(getCookie("email_id"));
      } else {
        alert("Please enter your email");
        return;
      }
    }

    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: `${API_URL}/verify-otp?email_id=${email}&otp=${otpjoined}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      if (response.status === 200) {
        alert("OTP verified successfully! You can now login.");
        window.location.href = "/";
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error: " + err.response.data);
      console.error(err);
    }
    setLoading(false);
  };

  const OTPVerificationComponent = () => {
    const handleChange = (index, event) => {
      const value = event.target.value.replace(/\D/, ""); // Allow only numbers
      if (!value) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input field
      if (index < length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    };

    const handleKeyDown = (index, event) => {
      if (event.key === "Backspace") {
        const newOtp = [...otp];
        if (!otp[index] && index > 0) {
          document.getElementById(`otp-${index - 1}`).focus();
        }
        newOtp[index] = "";
        setOtp(newOtp);
      }
    };

    return (
      <div className="otp_page_div">
        <div className="otp-form">
          <div className="otp-form-header">
            <h1>OTP Verification</h1>
            <h3>Please check your email for the OTP.</h3>
          </div>
          <div className="otp_page_div_form">
            <p>Enter the OTP below to verify your email.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {otp.map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{
                    width: "40px",
                    height: "50px",
                    textAlign: "center",
                    fontSize: "18px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    outline: "none",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="otp_buttons">
            <button
              onClick={() => {
                handleOTPVerification();
              }}
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>{OTPVerificationPage ? OTPVerificationComponent() : SignUpComponent()}</>
  );
};
