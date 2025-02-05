import "./App.css";
import { useState, useEffect } from "react";
// import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";

import LandingPage from "./components/landingPage/landingPage.jsx";
import { Dashboard } from "./components/dashboard/dashboard.jsx";

import { GetUserName } from "./utils/helper.jsx";
import { getCookie, validateCookie } from "./utils/cookies.jsx";

function App() {
  const [token, setToken] = useState("");
  const [account_id, setAccount_id] = useState(""); //TODO - remove this if not required
  const [navigateToDashboard, setNavigateToDashboard] = useState(false);
  useEffect(() => {
    document.title = "University Portal";
  }, []);

  useEffect(() => {
    if (getCookie("token") === "") {
      return;
    }
    const c_Token = getCookie("token");
    const c_account_id = getCookie("account_id");

    setToken(c_Token);
    setAccount_id(c_account_id);

    if (c_Token === "") {
      setNavigateToDashboard(false);
    }
    validateCookie(c_Token)
      .then((res) => {
        if (!res) setNavigateToDashboard(false);
        else setNavigateToDashboard(true);
      })
      .catch((err) => {
        console.error(err);
        setNavigateToDashboard(false);
      });
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
