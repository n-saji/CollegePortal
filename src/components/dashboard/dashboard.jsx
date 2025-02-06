import axios from "axios";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../config/config.jsx";

import { SideBar } from "./sidebar/sidebar.jsx";
import { Routes, Route, Link, Navigate,useNavigate } from "react-router-dom";
import { ShowCourses } from "./Courses/Show/showCourses.jsx";
import { AddCourse } from "./Courses/Add/AddCourse.jsx";
import DigitalClock from "../Clock/digitalClock.jsx";
import { getCookie } from "../../utils/cookies.jsx";

export const Dashboard = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [header_title, setHeaderTitle] = useState("Dashboard");

  useEffect(() => {
    document.title = "Dashboard";
    setUsername(localStorage.getItem("username"));
  }, []);

  const logOut = () => {
    axios
      .get(API_URL + `/logout?token=${getCookie("token")}`)
      .then(() => {
        console.log("Logged out");
        localStorage.clear();
        window.location.href = BASE_URL; 
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(setLoading(false));
  };

  const Clock = () => {
    setHeaderTitle("Dashboard");
    return (
      <div className="clock_div">
        <DigitalClock />
      </div>
    );
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
          <Route path={`*`} element={<Clock />} />
          <Route
            path={`courses`}
            element={<ShowCourses setHeaderTitle={setHeaderTitle} />}
          />
          <Route
            path={`courses/add`}
            element={<AddCourse setHeaderTitle={setHeaderTitle} />}
          />
        </Routes>
      </div>
    </>
  );
};
