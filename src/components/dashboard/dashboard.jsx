import axios from "axios";
import { validateCookie } from "../../utils/cookies";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/config.jsx";
import { GetUserName } from "../../utils/helper.jsx";

const validateCookieStatus = (cToken) => {
  if (cToken === "") {
    return false;
  }

  validateCookie(cToken).then((res) => {
    if (res === false) {
      return false;
    }
  });
  return true;
};

export const Dashboard = (props) => {
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [username, setUsername] = useState("");
  useState(() => {
    setUsername(localStorage.getItem("username"));
  }, [localStorage.getItem("username")]);

  if (!validateCookieStatus(props.cToken)) {
    props.setNavigateToDashboard(false);
  }
  GetUserName(props.c_account_id, props.cToken);

  const logOut = () => {
    axios
      .get(API_URL + `/logout?token=${props.cToken}`)
      .then((res) => {
        props.setNavigateToDashboard(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="dashboard">
        <div
          className="dashboard_side_panel"
          style={{ translate: showSidePanel ? "0" : "-18rem" }}
        >
          <div className="dashboard_side_panel_content">
            <p onClick={() => setShowSidePanel(false)}>Home</p>
            <p>Course</p>
            <p>Students</p>
            <p>Instructors</p>
          </div>
          <button
            className="dashboard_side_panel_toggle_button"
            onClick={() => setShowSidePanel(!showSidePanel)}
          >
            {showSidePanel ? "<" : ">"}
          </button>
        </div>
        <div className="dashboard_header">
          <div className="dashboard_header_title">Dashboard</div>
          <div className="dashboard_header_logout">
            <p
              className="profile_name"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
              }}
            >
              {username}
            </p>
            {showProfileDropdown && (
              <div className="profile_dropdown">
                <p className="profile_dropdown_p">Profile</p>
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
      </div>
    </>
  );
};
