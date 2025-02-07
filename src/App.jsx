import "./App.css";
import { useState, useEffect } from "react";
import { Dashboard } from "./components/dashboard/dashboard.jsx";

import { Route, Routes, Link, Navigate } from "react-router-dom";
import { BASE_URL, API_URL } from "./config/config.jsx";
import axios from "axios";
import { getCookie, validateCookie } from "./utils/cookies";
import { GetUserName } from "./utils/helper";

const checkTokenStatus = async () => {
  try {
    if (!getCookie("token")) {
      return;
    }
    await validateCookie(getCookie("token"))
      .then((res) => {
        if (res) {
          setLoginStatus(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
    return;
  }

  const interval = setInterval(() => {
    checkTokenStatus();
  }, 5 * 60 * 1000);

  return () => clearInterval(interval);
};

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [fetechedAllData, setFetchedAllData] = useState(false);

  useEffect(() => {
    document.title = "University Portal";
    checkTokenStatus();
  }, []);

  const updateTitle = async () => {
    const c_Token = getCookie("token");
    const c_account_id = getCookie("account_id");

    if (!c_account_id || !c_Token) {
      return;
    }

    try {
      await GetUserName(c_account_id, c_Token);
      setFetchedAllData(true);
      console.log("updated username");
    } catch (err) {
      console.error(err);
    }
  };

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
          document.cookie = `token=${res.headers["token"]}`;
          document.cookie = `account_id=${res.headers["account_id"]}`;
          setLoginStatus(true);
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

  if (loginStatus) {
    updateTitle();
    console.log("login status is true");
    if (fetechedAllData) {
      return <Navigate to={`${BASE_URL}/dashboard`} />;
    }
  }

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

function App() {
  return (
    <>
      <Routes>
        <Route path={`${BASE_URL}`} element={<LandingPage />} />
        <Route path={`${BASE_URL}/dashboard/*`} element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
