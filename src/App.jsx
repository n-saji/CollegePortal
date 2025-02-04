import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";
import axios from "axios";

import LandingPage from "./components/landingPage/landingPage.jsx";
import { Dashboard } from "./components/dashboard/dashboard.jsx";

import { API_URL } from "./config/config.jsx";
import Cookie from "./utils/cookies.jsx";

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

    axios({
      method: "GET",
      url: API_URL + "/get-instructor-name-by-id/" + c_account_id,
      headers: {
        Token: c_Token,
      },
    })
      .then((res) => {
        setNavigateToDashboard(true);
      })
      .catch((err) => {
        console.log(err);
        alert("Session expired. Please login again");
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
        />
      )}
    </>
  );
}

export default App;
