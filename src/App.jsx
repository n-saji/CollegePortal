import "./App.css";
import { useState, useEffect } from "react";
// import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";

import LandingPage from "./components/landingPage/landingPage.jsx";
import { Dashboard } from "./components/dashboard/dashboard.jsx";

// import { API_URL } from "./config/config.jsx";
import Cookie from "./utils/cookies.jsx";
import { GetUserName } from "./utils/helper.jsx";
import { validateCookie } from "./utils/cookies.jsx";

function App() {
  const [token, setToken] = useState("");
  const [account_id, setAccount_id] = useState(""); //TODO - remove this if not required
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);

  useEffect(() => {
    if (Cookie("token") === "") {
      return;
    }
    const c_Token = Cookie("token");
    const c_account_id = Cookie("account_id");

    setToken(c_Token);
    setAccount_id(c_account_id);

    if (c_Token === "") {
      setNavigateToDashboard(false);
    }
    if (!validateCookie(c_Token)) {
      setNavigateToDashboard(false);
    } else {
      setNavigateToDashboard(true);
      GetUserName(c_account_id, c_Token);
    }
  }, []);

  return (
    <>
      {!navigateToDashboard && (
        <LandingPage
          setToken={setToken}
          setAccount_id={setAccount_id}
          setNavigateToDashboard={setNavigateToDashboard}
        />
      )}
      {navigateToDashboard && (
        <Dashboard
          cToken={token}
          setNavigateToDashboard={setNavigateToDashboard}
          c_account_id={account_id}
        />
      )}
    </>
  );
}

export default App;
