import axios from "axios";
import { validateCookie } from "../../utils/cookies";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/config.jsx";
import { GetUserName } from "../../utils/helper.jsx";
import loader from "../../assets/loader.gif";
import { SideBar } from "./sidebar/sidebar.jsx";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { ShowCourses } from "./Courses/Show/showCourses.jsx";


export const Dashboard = (props) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [header_title, setHeaderTitle] = useState("Dashboard");

  // if (!validateCookieStatus(props.cToken)) {
  //   props.setNavigateToDashboard(false);
  //   console.log("Session expired. Please login again");
  //   <Link to="/" />;
  // }

  useEffect(() => {
    document.title = "Dashboard";

    GetUserName(props.c_account_id, props.cToken).then(() => {
      setUsername(localStorage.getItem("username"));
    });
  }, []);

  const logOut = () => {
    axios
      .get(API_URL + `/logout?token=${props.cToken}`)
      .then((res) => {
        props.setNavigateToDashboard(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(setLoading(false));
  };

  return (
    <>
      <div className="dashboard">
        <SideBar />
        <div className="dashboard_header">
          <div className="dashboard_header_title">
            <h1 className="dashboard_header_wording">{header_title}</h1>
          </div>
          <div
            className="dashboard_header_logout"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
            }}
          >
            <p className="profile_icon">{username.charAt(0)}</p>
            <p className="profile_name">{username}</p>
            {showProfileDropdown && (
              <div className="profile_dropdown">
                <Link to="/profile" className="profile_dropdown_p">
                  Profile
                </Link>

                <p
                  className="profile_dropdown_p"
                  onClick={() => {
                    logOut();
                  }}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            Component={() => {
              setHeaderTitle("Dashboard");
            }}
          />
          <Route
            path="/courses"
            element={<ShowCourses setHeaderTitle={setHeaderTitle} />}
          />
        </Routes>
      </div>
    </>
  );
};
