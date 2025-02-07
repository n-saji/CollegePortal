import React, { useEffect, useState } from "react";
import "./signup.css";
import { BASE_URL, API_URL } from "../../config/config";
import axios from "axios";
import BB from "../../assets/back_button.png";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [loading, setLoading] = useState(false);
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
        alert("Account created successfully");
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
  return (
    <>
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
              <button disabled={loading}
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
    </>
  );
};
