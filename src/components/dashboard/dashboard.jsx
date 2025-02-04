import axios from "axios";
import { validateCookie } from "../../utils/cookies";
import "./dashboard.css";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/config.jsx";
import { GetUserName } from "../../utils/helper.jsx";
import loader from "../../assets/loader.gif";

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
  const [loading, setLoading] = useState(true);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  useEffect(() => {
    const favicon = document.getElementById("favicon");

    if (loading) {
      favicon.href = loader; // Set rotating GIF
    } else {
      favicon.href = "/vite.svg"; // Restore static icon
    }
  }, [loading]);

  useEffect(() => {
    document.title = "Dashboard";

    GetUserName(props.c_account_id, props.cToken).then(() => {
      setUsername(localStorage.getItem("username"));
    });
  }, []);

  if (!validateCookieStatus(props.cToken)) {
    props.setNavigateToDashboard(false);
  }

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
        <div
          className="dashboard_side_panel"
          style={{ translate: showSidePanel ? "0" : "-18rem" }}
        >
          <div className="dashboard_side_panel_content">
            <p onClick={() => setShowSidePanel(false)}>Home</p>
            <div>
              <p
                onClick={() => {
                  setShowCourseDropdown(!showCourseDropdown);
                }}
              >
                Course {showCourseDropdown ? <span>-</span> : <span>+</span>}
              </p>
              {showCourseDropdown && (
                <div className="dashboard_side_panel_course_dropdown">
                  <p>Add</p>
                  <p>Display</p>
                </div>
              )}
            </div>

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
          <div
            className="dashboard_header_logout"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
            }}
          >
            <p className="profile_icon">{ username.charAt(0)}</p>
            <p className="profile_name">{username}</p>
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
