import { useEffect, useState } from "react";
import "./landingPage.css";
import axios from "axios";
import { API_URL } from "../../config/config.jsx";
const LandingPage = ({ setToken, setAccount_id, setNavigateToDashboard }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();

    if (hour >= 0 && hour < 12) {
      setGreeting("Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Afternoon");
    } else {
      setGreeting("Evening");
    }
  });

  const handleLogin = () => {
    if (email === "" || password === "") {
      alert("Please enter email and password");
    } else {
      axios({
        method: "POST",
        url: API_URL + "/v1/login",
        data: {
          email_id: email,
          password: password,
        },
      })
        .then((res) => {
          setToken(res.headers["token"]);
          setAccount_id(res.headers["account_id"]);
          document.cookie = `token=${res.headers["token"]}`;
          document.cookie = `account_id=${res.headers["account_id"]}`;
          setNavigateToDashboard(true);
        })
        .catch((err) => {
          console.log(err);

          if (err.status !== 200) {
            alert(err.response.data);
            return;
          }

          alert("Something went wrong");
        });
    }
  };

  const handleShowPassword = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };

  return (
    <>
      <div className="landing_page">
        <div className="landing_page_window">
          <div className="landing_page_window_title">
            <h1>Good {greeting}</h1>
            <h2>Please Login</h2>
          </div>

          <div className="landing_page_window_form">
            <div className="form_email">
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form_password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="form_checkbox_password">
              <input type="checkbox" onClick={handleShowPassword} />
              <label>Show Password</label>
            </div>
            <div className="form_submit">
              <button onClick={handleLogin}>Login</button>
              <button>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
