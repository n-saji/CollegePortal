import "./App.css";
import { useState, useEffect } from "react";
import { Dashboard } from "./components/dashboard/dashboard.jsx";
import { Signup } from "./components/SignUp/signup.jsx";

import { Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import { BASE_URL, API_URL } from "./config/config.jsx";
import axios from "axios";
import { getCookie, validateCookie } from "./utils/cookies";
import { GetUserName } from "./utils/helper";
import { Profile } from "./components/Profile/Profile.jsx";
import { LoaderOverlay } from "./components/Loader/Loader.jsx";

const SendOTP = async (email) => {
  try {
    const res = await axios({
      method: "GET",
      url: API_URL + "/send-otp-email?email_id=" + email,
    });
    if (res.status === 200) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const checkTokenStatus = async (props) => {
  try {
    if (!getCookie("token")) {
      return;
    }
    await validateCookie(getCookie("token"))
      .then((res) => {
        if (res) {
          props.setLoginStatus(true);
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
    checkTokenStatus({ setLoginStatus: props.setLoginStatus });
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "University Portal";
    checkTokenStatus({ setLoginStatus });
  }, []);

  const updateTitle = async () => {
    const c_Token = getCookie("token");
    const c_account_id = getCookie("account_id");

    if (!c_account_id || !c_Token) {
      return;
    }

    try {
      setLoading(true);
      await GetUserName(c_account_id, c_Token).then(() => {
        setLoading(false);
      });
      setFetchedAllData(true);
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
      setLoading(true);
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
          setLoading(false);
          if (err.status !== 200) {
            if (err.status === 406) {
              document.cookie = `email_id=${email}`;
              alert("Account Not Verified");
              SendOTP(email).then(() => {
                alert("OTP sent to your email. Please verify your email");
              });

              navigate(`${BASE_URL}/verify`);
              return;
            }
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

  useEffect(() => {
    if (loginStatus && !fetechedAllData) {
      updateTitle();
    }
  }, [loginStatus, fetechedAllData]);

  if (loginStatus) {
    if (fetechedAllData) {
      () => setLoading(false);
      return <Navigate to={`${BASE_URL}/dashboard`} />;
    }
  }

  addEventListener("keydown", (e) => {
    if (e.key === "Enter" && email && password) {
      handleLogin();
    }
  });

  return (
    <>
      {loading && <LoaderOverlay text={"Redirecting..."} />}
      <div className="mobile_view">
        <h1>Mobile View Not Supported</h1>
      </div>
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
              <div className="form_checkbox_password">
                <input type="checkbox" onClick={handleShowPassword} />
                <label>Show Password</label>
              </div>
            </div>
          </div>
          <div className="form_submit">
            <button
              onClick={() => {
                handleLogin();
              }}
            >
              Login
            </button>
            <Link to={`${BASE_URL}/signup`}>
              <button>Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const LogOut = () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/logout?token=${getCookie("token")}`)
      .then(() => {
        console.log("Logged out");
        localStorage.clear();
        setRedirect(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (redirect) {
    window.location.href = `${BASE_URL}/`;
  }

  return <LoaderOverlay />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path={`${BASE_URL}`} element={<LandingPage />} />
        <Route path={`${BASE_URL}/dashboard/*`} element={<Dashboard />} />
        <Route
          path={`${BASE_URL}/signup`}
          element={<Signup redirect={false} />}
        />
        <Route path={`${BASE_URL}/profile`} element={<Profile />} />
        <Route
          path={`${BASE_URL}/verify`}
          element={<Signup redirect={true} />}
        />
        <Route path={`${BASE_URL}/logout`} element={<LogOut />} />
      </Routes>
    </>
  );
}

export default App;
